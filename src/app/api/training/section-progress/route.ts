import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const assignmentId = searchParams.get('assignmentId')
    const token = searchParams.get('token')
    const sectionNumber = searchParams.get('section')

    if (!assignmentId && !token) {
      return NextResponse.json({ error: 'Assignment ID or token required' }, { status: 400 })
    }

    if (!sectionNumber) {
      return NextResponse.json({ error: 'Section number required' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Find assignment
    let assignment
    if (token) {
      const { data } = await supabase
        .from('training_assignments')
        .select('id, track')
        .eq('magic_token', token)
        .gt('token_expires_at', new Date().toISOString())
        .single()
      assignment = data
    } else {
      const { data } = await supabase
        .from('training_assignments')
        .select('id, track')
        .eq('id', assignmentId)
        .single()
      assignment = data
    }

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    // Get progress for this section
    const { data: progress } = await supabase
      .from('training_progress')
      .select('*')
      .eq('assignment_id', assignment.id)
      .eq('section_number', parseInt(sectionNumber))
      .single()

    if (!progress) {
      return NextResponse.json({
        completed: false,
        videoComplete: false,
        videoProgress: 0
      })
    }

    const videoComplete = progress.video_watched_seconds >= progress.video_total_seconds * 0.9 // 90%
    
    return NextResponse.json({
      completed: !!progress.completed_at,
      videoComplete,
      videoProgress: progress.video_total_seconds > 0 
        ? Math.round((progress.video_watched_seconds / progress.video_total_seconds) * 100)
        : 0
    })
  } catch (error) {
    console.error('Section progress error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch progress' 
    }, { status: 500 })
  }
}
