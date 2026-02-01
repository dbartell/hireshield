import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { TRACK_LABELS, type TrainingTrack } from '@/lib/training-data'

// Notification tiers for certificate expiry
const NOTIFICATION_TIERS = [
  { days: 30, type: 'day_30' as const },
  { days: 7, type: 'day_7' as const },
  { days: 0, type: 'day_0' as const },
]

interface CertificateWithDetails {
  id: string
  certificate_number: string
  expires_at: string
  training_assignments: {
    id: string
    user_email: string
    user_name: string
    track: TrainingTrack
    org_id: string
    organizations: {
      name: string
    }
  }
}

// Send email via Resend
async function sendEmail(to: string[], subject: string, html: string): Promise<string | null> {
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    console.log('[TRAINING REMINDER] Email would be sent (Resend not configured):')
    console.log(`  To: ${to.join(', ')}`)
    console.log(`  Subject: ${subject}`)
    return 'logged_' + Date.now()
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'AIHireLaw Training <training@aihirelaw.com>',
        to,
        subject,
        html,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[TRAINING REMINDER] Resend API error:', error)
      return null
    }

    const data = await response.json()
    return data.id
  } catch (error) {
    console.error('[TRAINING REMINDER] Failed to send email:', error)
    return null
  }
}

function getDayRange(daysOffset: number): { start: Date; end: Date } {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() + daysOffset)

  const end = new Date(start)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

function generateExpiryEmail(params: {
  name: string
  trackTitle: string
  certificateNumber: string
  expiresAt: string
  daysUntilExpiry: number
  orgName: string
  recertifyUrl: string
}): { subject: string; html: string } {
  let urgency = ''
  let headerColor = '#1e40af'
  
  if (params.daysUntilExpiry <= 0) {
    urgency = '❌ EXPIRED: '
    headerColor = '#dc2626'
  } else if (params.daysUntilExpiry <= 7) {
    urgency = '⏰ URGENT: '
    headerColor = '#ea580c'
  } else {
    urgency = '📜 '
  }

  const subject = `${urgency}Your ${params.trackTitle} certification ${params.daysUntilExpiry <= 0 ? 'has expired' : `expires in ${params.daysUntilExpiry} days`}`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background: #f3f4f6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .header { background: ${headerColor}; color: white; padding: 24px; }
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
        <h1 style="margin: 0; font-size: 20px;">${urgency}Certification ${params.daysUntilExpiry <= 0 ? 'Expired' : 'Expiring Soon'}</h1>
      </div>
      <div class="content">
        <p>Hi ${params.name},</p>
        
        ${params.daysUntilExpiry <= 0 ? `
        <p>Your <strong>${params.trackTitle}</strong> certification has expired. You may be out of compliance with AI hiring regulations.</p>
        ` : `
        <p>Your <strong>${params.trackTitle}</strong> certification expires ${params.daysUntilExpiry === 0 ? 'today' : `in ${params.daysUntilExpiry} days`}.</p>
        `}
        
        <div class="stat-box">
          <strong>Certificate:</strong> #${params.certificateNumber}<br>
          <strong>Track:</strong> ${params.trackTitle}<br>
          <strong>Expires:</strong> ${params.expiresAt}<br>
          <strong>Organization:</strong> ${params.orgName}
        </div>
        
        <p><strong>Why this matters:</strong></p>
        <ul>
          <li>Many regulations require current training certifications</li>
          <li>Lapsed certifications may affect your ability to participate in AI-assisted hiring</li>
          <li>Recertification helps you stay current with law changes</li>
        </ul>
        
        <p>The recertification module takes about 15 minutes and covers any updates from the past year.</p>
        
        <a href="${params.recertifyUrl}" class="cta">Recertify Now →</a>
        
        <p>— The ${params.orgName} Compliance Team</p>
      </div>
    </div>
    <div class="footer">
      <p>This training is powered by AIHireLaw.</p>
    </div>
  </div>
</body>
</html>`

  return { subject, html }
}

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: 'Missing Supabase config' }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.aihirelaw.com'

  const results = {
    processed: 0,
    sent: 0,
    errors: 0,
    details: [] as Array<{ certificate: string; tier: string; status: string }>,
  }

  // Process each notification tier
  for (const tier of NOTIFICATION_TIERS) {
    const { start, end } = getDayRange(tier.days)

    // Find certificates expiring in this window
    const { data: certificates, error: queryError } = await supabase
      .from('training_certificates')
      .select(`
        id,
        certificate_number,
        expires_at,
        training_assignments!inner (
          id,
          user_email,
          user_name,
          track,
          org_id,
          organizations (
            name
          )
        )
      `)
      .gte('expires_at', start.toISOString())
      .lte('expires_at', end.toISOString())

    if (queryError) {
      console.error(`[TRAINING REMINDER] Query error for tier ${tier.type}:`, queryError)
      results.errors++
      continue
    }

    if (!certificates || certificates.length === 0) {
      continue
    }

    for (const cert of certificates as unknown as CertificateWithDetails[]) {
      results.processed++

      // Check if notification already sent
      const { data: existingNotification } = await supabase
        .from('training_cert_notifications')
        .select('id')
        .eq('certificate_id', cert.id)
        .eq('notification_type', tier.type)
        .single()

      if (existingNotification) {
        results.details.push({
          certificate: cert.certificate_number,
          tier: tier.type,
          status: 'already_sent',
        })
        continue
      }

      const assignment = cert.training_assignments
      const trackTitle = TRACK_LABELS[assignment.track] || assignment.track
      const daysUntilExpiry = Math.ceil(
        (new Date(cert.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )

      const email = generateExpiryEmail({
        name: assignment.user_name,
        trackTitle,
        certificateNumber: cert.certificate_number,
        expiresAt: new Date(cert.expires_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        daysUntilExpiry: Math.max(0, daysUntilExpiry),
        orgName: assignment.organizations?.name || 'Your Company',
        recertifyUrl: `${baseUrl}/training`,
      })

      const messageId = await sendEmail([assignment.user_email], email.subject, email.html)

      if (messageId) {
        // Record notification
        await supabase
          .from('training_cert_notifications')
          .insert({
            certificate_id: cert.id,
            notification_type: tier.type,
            email_to: assignment.user_email,
            email_message_id: messageId,
          })

        results.sent++
        results.details.push({
          certificate: cert.certificate_number,
          tier: tier.type,
          status: 'sent',
        })
      } else {
        results.errors++
        results.details.push({
          certificate: cert.certificate_number,
          tier: tier.type,
          status: 'send_failed',
        })
      }
    }
  }

  console.log('[TRAINING REMINDER] Cron completed:', results)

  return NextResponse.json({
    success: true,
    ...results,
    timestamp: new Date().toISOString(),
  })
}

export async function POST(request: NextRequest) {
  return GET(request)
}
