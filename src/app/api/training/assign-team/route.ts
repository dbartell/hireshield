import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requirePermission } from '@/lib/permissions-server'
import { TRACK_LABELS, type TrainingTrack } from '@/lib/training-data'

interface Assignment {
  name: string
  email: string
  track: TrainingTrack
}

export async function POST(req: NextRequest) {
  try {
    const { membership, userId } = await requirePermission('manage_team')
    const supabase = await createClient()
    
    const { assignments } = await req.json() as { assignments: Assignment[] }
    
    if (!assignments || assignments.length === 0) {
      return NextResponse.json({ error: 'No assignments provided' }, { status: 400 })
    }

    // Validate assignments
    for (const a of assignments) {
      if (!a.name || !a.email || !a.track) {
        return NextResponse.json({ error: 'Invalid assignment data' }, { status: 400 })
      }
      if (!['recruiter', 'manager', 'admin', 'executive'].includes(a.track)) {
        return NextResponse.json({ error: `Invalid track: ${a.track}` }, { status: 400 })
      }
    }

    // Get org info for emails
    const { data: org } = await supabase
      .from('organizations')
      .select('name')
      .eq('id', membership.organization_id)
      .single()

    const orgName = org?.name || 'Your Company'

    // Insert assignments
    const results = []
    const errors = []

    for (const a of assignments) {
      // Check for existing assignment
      const { data: existing } = await supabase
        .from('training_assignments')
        .select('id, status')
        .eq('org_id', membership.organization_id)
        .eq('user_email', a.email.toLowerCase())
        .eq('track', a.track)
        .single()

      if (existing) {
        // Already assigned, skip
        results.push({ email: a.email, status: 'already_assigned', id: existing.id })
        continue
      }

      // Create assignment
      const { data: assignment, error } = await supabase
        .from('training_assignments')
        .insert({
          org_id: membership.organization_id,
          user_email: a.email.toLowerCase(),
          user_name: a.name,
          track: a.track,
          assigned_by: userId
        })
        .select()
        .single()

      if (error) {
        errors.push({ email: a.email, error: error.message })
        continue
      }

      results.push({ email: a.email, status: 'assigned', id: assignment.id })

      // Send invite email
      const trainingUrl = `${req.nextUrl.origin}/training/start/${assignment.magic_token}`
      await sendTrainingInviteEmail({
        to: a.email,
        name: a.name,
        track: a.track,
        orgName,
        trainingUrl
      })
    }

    return NextResponse.json({
      success: true,
      results,
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (error) {
    console.error('Training assign error:', error)
    const message = error instanceof Error ? error.message : 'Failed to assign training'
    const status = message === 'Unauthorized' || message === 'Insufficient permissions' ? 403 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

async function sendTrainingInviteEmail(params: {
  to: string
  name: string
  track: TrainingTrack
  orgName: string
  trainingUrl: string
}) {
  const resendApiKey = process.env.RESEND_API_KEY
  const trackLabel = TRACK_LABELS[params.track]

  const subject = `You've been assigned AI Hiring Compliance Training`
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background: #f3f4f6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 24px; }
    .content { padding: 24px; }
    .stat-box { background: #f9fafb; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #e5e7eb; }
    .cta { display: inline-block; background: #1e40af; color: white !important; padding: 14px 28px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: 500; }
    .footer { color: #6b7280; font-size: 13px; padding: 24px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <h1 style="margin: 0; font-size: 20px;">🎓 Training Assigned: ${trackLabel}</h1>
      </div>
      <div class="content">
        <p>Hi ${params.name},</p>
        
        <p><strong>${params.orgName}</strong> has assigned you AI Hiring Compliance Training.</p>
        
        <div class="stat-box">
          <strong>Track:</strong> ${trackLabel}<br>
          <strong>Estimated Time:</strong> 30-60 minutes<br>
          <strong>Certificate:</strong> Valid for 12 months
        </div>
        
        <p>This training covers:</p>
        <ul>
          <li>Understanding AI tools in hiring</li>
          <li>Compliance requirements by state</li>
          <li>Your responsibilities and best practices</li>
          <li>Documentation and record-keeping</li>
        </ul>
        
        <a href="${params.trainingUrl}" class="cta">Start Training →</a>
        
        <p style="color: #6b7280; font-size: 14px;">
          This link is unique to you and expires in 30 days. Complete your training before then to earn your certificate.
        </p>
        
        <p>— The ${params.orgName} Compliance Team</p>
      </div>
    </div>
    <div class="footer">
      <p>This training is powered by AIHireLaw.</p>
    </div>
  </div>
</body>
</html>`

  if (!resendApiKey) {
    console.log('[TRAINING] Email would be sent (Resend not configured):')
    console.log(`  To: ${params.to}`)
    console.log(`  Subject: ${subject}`)
    console.log(`  URL: ${params.trainingUrl}`)
    return
  }

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'AIHireLaw Training <training@aihirelaw.com>',
        to: [params.to],
        subject,
        html
      })
    })
  } catch (error) {
    console.error('[TRAINING] Failed to send invite email:', error)
  }
}
