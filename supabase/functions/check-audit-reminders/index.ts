// supabase/functions/check-audit-reminders/index.ts
// Checks for users needing quarterly audit reminders

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const APP_URL = Deno.env.get('APP_URL') || 'https://app.aihirelaw.com'

const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000

serve(async (req) => {
  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    const ninetyDaysAgo = new Date(Date.now() - NINETY_DAYS_MS).toISOString()

    // Find users whose orgs haven't had an audit in 90 days
    const { data: users, error } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        full_name,
        org_id,
        organizations!inner (
          id,
          name,
          last_audit_at
        )
      `)
      .or(`organizations.last_audit_at.is.null,organizations.last_audit_at.lt.${ninetyDaysAgo}`)

    if (error) throw error

    let queued = 0

    for (const user of users || []) {
      const org = user.organizations as any
      const lastAudit = org?.last_audit_at 
        ? new Date(org.last_audit_at).toLocaleDateString() 
        : 'Never'
      
      // Get latest risk score
      const { data: latestAudit } = await supabase
        .from('audits')
        .select('risk_score')
        .eq('org_id', org.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(1)
        .single()

      const riskScore = latestAudit?.risk_score || 'Unknown'
      const quarter = Math.ceil((new Date().getMonth() + 1) / 3)

      const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1e40af; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
    .stat { background: white; padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid #e5e7eb; }
    .cta { display: inline-block; background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { color: #6b7280; font-size: 14px; padding: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin:0;">⚠️ Time for your Q${quarter} compliance audit</h1>
    </div>
    <div class="content">
      <p>Hi ${user.full_name || 'there'},</p>
      
      <p>It's been 90 days since your last AI hiring compliance audit.</p>
      
      <p>Regular audits are required by NYC Local Law 144 and recommended under Colorado's AI Act. More importantly, they catch issues before they become violations.</p>
      
      <div class="stat">
        <strong>Your last audit:</strong> ${lastAudit}<br>
        <strong>Current risk score:</strong> ${riskScore}
      </div>
      
      <a href="${APP_URL}/audit" class="cta">Run your Q${quarter} audit now →</a>
      
      <p>Takes about 10 minutes. Your previous answers are pre-loaded.</p>
      
      <p>— The AIHireLaw Team</p>
      
      <p style="color: #6b7280; font-size: 14px;">P.S. Companies that audit quarterly catch 3x more compliance gaps before regulators do.</p>
    </div>
    <div class="footer">
      <p>You're receiving this because you have audit reminders enabled in AIHireLaw.</p>
      <p><a href="${APP_URL}/settings/notifications">Manage email preferences</a></p>
    </div>
  </div>
</body>
</html>`

      // Queue the email
      const { error: queueError } = await supabase.rpc('queue_email', {
        p_user_id: user.id,
        p_email_type: 'audit_reminder',
        p_to_email: user.email,
        p_subject: `⚠️ Time for your Q${quarter} compliance audit`,
        p_html_body: html,
        p_metadata: { org_id: org.id, last_audit: org.last_audit_at }
      })

      if (!queueError) {
        queued++
      }
    }

    return new Response(
      JSON.stringify({ checked: users?.length || 0, queued }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
