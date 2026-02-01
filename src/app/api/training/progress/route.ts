import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getTrackData, calculateQuizScore, PASSING_SCORE, type TrainingTrack, type QuizQuestion } from '@/lib/training-data'

// POST /api/training/progress
// Update section progress for a training assignment
export async function POST(req: NextRequest) {
  try {
    const { 
      assignmentId,
      token,
      sectionNumber,
      action,
      videoWatchedSeconds,
      quizAnswers
    } = await req.json() as {
      assignmentId?: string
      token?: string
      sectionNumber: number
      action: 'start' | 'video_progress' | 'complete_video' | 'submit_quiz'
      videoWatchedSeconds?: number
      quizAnswers?: Record<string, number>
    }

    if (!assignmentId && !token) {
      return NextResponse.json({ error: 'Assignment ID or token required' }, { status: 400 })
    }

    if (sectionNumber === undefined) {
      return NextResponse.json({ error: 'Section number required' }, { status: 400 })
    }

    // Use service role for updating progress
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Find assignment
    let assignment
    if (token) {
      const { data } = await supabase
        .from('training_assignments')
        .select('*')
        .eq('magic_token', token)
        .gt('token_expires_at', new Date().toISOString())
        .single()
      assignment = data
    } else {
      const { data } = await supabase
        .from('training_assignments')
        .select('*')
        .eq('id', assignmentId)
        .single()
      assignment = data
    }

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found or expired' }, { status: 404 })
    }

    const track = getTrackData(assignment.track as TrainingTrack)
    const section = track.sections.find(s => s.number === sectionNumber)

    if (!section) {
      return NextResponse.json({ error: 'Invalid section number' }, { status: 400 })
    }

    // Get or create progress record
    const { data: existingProgress } = await supabase
      .from('training_progress')
      .select('*')
      .eq('assignment_id', assignment.id)
      .eq('section_number', sectionNumber)
      .single()

    let progressId = existingProgress?.id

    if (!progressId) {
      const { data: newProgress, error } = await supabase
        .from('training_progress')
        .insert({
          assignment_id: assignment.id,
          section_number: sectionNumber,
          video_total_seconds: section.videoDuration
        })
        .select()
        .single()
      
      if (error) throw error
      progressId = newProgress.id
    }

    // Handle different actions
    switch (action) {
      case 'start':
        // Just ensure progress exists (already done above)
        break

      case 'video_progress':
        if (videoWatchedSeconds !== undefined) {
          await supabase
            .from('training_progress')
            .update({
              video_watched_seconds: Math.max(existingProgress?.video_watched_seconds || 0, videoWatchedSeconds),
              updated_at: new Date().toISOString()
            })
            .eq('id', progressId)
        }
        break

      case 'complete_video':
        await supabase
          .from('training_progress')
          .update({
            video_watched_seconds: section.videoDuration,
            updated_at: new Date().toISOString()
          })
          .eq('id', progressId)
        break

      case 'submit_quiz':
        if (!quizAnswers) {
          return NextResponse.json({ error: 'Quiz answers required' }, { status: 400 })
        }

        const score = calculateQuizScore(quizAnswers, section.quiz)
        const passed = score >= PASSING_SCORE

        // Record quiz attempt
        await supabase
          .from('training_quiz_attempts')
          .insert({
            assignment_id: assignment.id,
            section_number: sectionNumber,
            answers: quizAnswers,
            score,
            passed
          })

        if (passed) {
          // Mark section as complete
          await supabase
            .from('training_progress')
            .update({
              completed_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', progressId)

          // Check if all sections complete
          const { data: allProgress } = await supabase
            .from('training_progress')
            .select('section_number, completed_at')
            .eq('assignment_id', assignment.id)

          const completedSections = allProgress?.filter(p => p.completed_at).length || 0
          const totalSections = track.sections.length

          if (completedSections >= totalSections) {
            // Generate certificate!
            const certificateResult = await generateCertificate(supabase, assignment, track.title)
            
            // Mark assignment complete
            await supabase
              .from('training_assignments')
              .update({
                status: 'completed',
                completed_at: new Date().toISOString(),
                certificate_id: certificateResult.certificateId,
                updated_at: new Date().toISOString()
              })
              .eq('id', assignment.id)

            return NextResponse.json({
              success: true,
              action: 'quiz_passed',
              score,
              passed: true,
              trackComplete: true,
              certificate: certificateResult
            })
          }
        }

        return NextResponse.json({
          success: true,
          action: 'quiz_submitted',
          score,
          passed,
          correctAnswers: passed ? undefined : section.quiz.map(q => ({
            id: q.id,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation
          }))
        })
    }

    return NextResponse.json({ success: true, action })
  } catch (error) {
    console.error('Training progress error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to update progress' 
    }, { status: 500 })
  }
}

async function generateCertificate(
  supabase: ReturnType<typeof createClient>,
  assignment: { id: string; user_name: string; track: string; org_id: string },
  trackTitle: string
) {
  // Generate certificate number
  const prefix = assignment.track === 'recruiter' ? 'REC' :
                 assignment.track === 'manager' ? 'MGR' :
                 assignment.track === 'admin' ? 'ADM' : 'EXC'
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  const certificateNumber = `${prefix}-${year}-${random}`

  // Calculate expiry (12 months)
  const issuedAt = new Date()
  const expiresAt = new Date(issuedAt)
  expiresAt.setFullYear(expiresAt.getFullYear() + 1)

  // Get org name
  const { data: org } = await supabase
    .from('organizations')
    .select('name')
    .eq('id', assignment.org_id)
    .single()

  const { data: certificate, error } = await supabase
    .from('training_certificates')
    .insert({
      assignment_id: assignment.id,
      certificate_number: certificateNumber,
      issued_at: issuedAt.toISOString(),
      expires_at: expiresAt.toISOString()
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create certificate:', error)
    throw error
  }

  return {
    certificateId: certificate.id,
    certificateNumber,
    issuedAt: issuedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    employeeName: assignment.user_name,
    trackTitle,
    companyName: org?.name || 'Your Company'
  }
}
