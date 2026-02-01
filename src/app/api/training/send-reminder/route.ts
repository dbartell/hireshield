import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requirePermission } from '@/lib/permissions-server'
import { TRACK_LABELS, type TrainingTrack } from '@/lib/training-data'

export async function POST(req: NextRequest) {
  try {
    const { membership } = await requirePermission('manage_team')
    const supabase = await createClient()
    
    const { assignmentId } = await req.json()
    
    if (!assignmentId) {
      return NextResponse.json({ error: 'Assignment ID required' }, { status: 400 })
    }

    // Get assignment
    const { data: assignment } = await supabase
      .from('training_assignments')
      .select('id, org_id, user_email, user_name, track, magic_token, status')
      .eq('id', assignmentId)
      .single()

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    if (assignment.org_id !== membership.organization_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (assignment.status === 'completed') {
      return NextResponse.json({ error: 'Training already completed' }, { status: 400 })
    }

    // Get org name
    const { data: org } = await supabase
      .from('organizations')
      .select('name')
      .eq('id', membership.organization_id)
      .single()

    const orgName = org?.name || 'Your Company'
    const trackLabel = TRACK_LABELS[assignment.track as TrainingTrack]
    const trainingUrl = `${req.nextUrl.origin}/training/start/${assignment.magic_token}`

    // Send reminder email
    const resendApiKey = process.env.RESEND_API_KEY
    const subject = `Reminder: Complete your ${trackLabel} Training`
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background: #f3f4f6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%); color: white; padding: 24px; }
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
        <h1 style="margin: 0; font-size: 20px;">⏰ Reminder: Complete Your Training</h1>
      </div>
      <div class="content">
        <p>Hi ${assignment.user_name},</p>
        
        <p>Just a friendly reminder that you have incomplete AI Hiring Compliance training assigned by <strong>${orgName}</strong>.</p>
        
        <div class="stat-box">
          <strong>Track:</strong> ${trackLabel}<br>
          <strong>Status:</strong> ${assignment.status === 'in_progress' ? 'In Progress' : 'Not Started'}
        </div>
        
        <p>Completing this training ensures our company stays compliant with AI hiring regulations and protects both candidates and our organization.</p>
        
        <a href="${trainingUrl}" class="cta">Continue Training →</a>
        
        <p>— The ${orgName} Compliance Team</p>
      </div>
    </div>
    <div class="footer">
      <p>This training is powered by AIHireLaw.</p>
    </div>
  </div>
</body>
</html>`

    if (!resendApiKey) {
      console.log('[TRAINING] Reminder email would be sent (Resend not configured):')
      console.log(`  To: ${assignment.user_email}`)
      console.log(`  Subject: ${subject}`)
      return NextResponse.json({ success: true, emailSent: false })
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
          to: [assignment.user_email],
          subject,
          html
        })
      })
    } catch (emailError) {
      console.error('[TRAINING] Failed to send reminder email:', emailError)
    }

    return NextResponse.json({ success: true, emailSent: true })
  } catch (error) {
    console.error('Send reminder error:', error)
    const message = error instanceof Error ? error.message : 'Failed to send'
    const status = message === 'Unauthorized' || message === 'Insufficient permissions' ? 403 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
