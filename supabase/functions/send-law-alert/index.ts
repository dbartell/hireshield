// supabase/functions/send-law-alert/index.ts
// Sends urgent law update alerts to affected users

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const APP_URL = Deno.env.get('APP_URL') || 'https://app.aihirelaw.com'

interface LawAlert {
  law_update_id: string
}

serve(async (req) => {
  try {
    const { law_update_id }: LawAlert = await req.json()
    
    if (!law_update_id) {
      return new Response(
        JSON.stringify({ error: 'law_update_id required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    // Get the law update
    const { data: lawUpdate, error: lawError } = await supabase
      .from('law_updates')
      .select('*')
      .eq('id', law_update_id)
      .single()

    if (lawError || !lawUpdate) {
      throw new Error('Law update not found')
    }

    // Find all users who hire in this state
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        full_name,
        organizations!inner (
          id,
          states
        )
      `)
      .contains('organizations.states', [lawUpdate.state_code])

    if (usersError) throw usersError

    const statusVerbs: Record<string, string> = {
      'passed': 'passed',
      'signed': 'signed into law',
      'effective': 'went into effect for',
      'amended': 'amended',
    }

    let queued = 0

    for (const user of users || []) {
      const actionItemsList = (lawUpdate.action_items || [])
        .map((item: string, i: number) => `<li>${item}</li>`)
        .join('')

      const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #dc2626; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #fef2f2; padding: 20px; border: 1px solid #fecaca; }
    .section { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border: 1px solid #e5e7eb; }
    .cta { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { color: #6b7280; font-size: 14px; padding: 20px; }
    ul { padding-left: 20px; }
    li { margin: 8px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin:0;">🚨 Action Required: ${lawUpdate.state_code} AI hiring law ${lawUpdate.status}</h1>
    </div>
    <div class="content">
      <p>Hi ${user.full_name || 'there'},</p>
      
      <p><strong>${lawUpdate.state_code}</strong> just ${statusVerbs[lawUpdate.status] || lawUpdate.status} new AI hiring regulations.</p>
      
      <div class="section">
        <h3 style="margin-top:0;">What changed:</h3>
        <p>${lawUpdate.summary}</p>
      </div>
      
      <div class="section">
        <h3 style="margin-top:0;">Effective date:</h3>
        <p><strong>${lawUpdate.effective_date ? new Date(lawUpdate.effective_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'TBD'}</strong></p>
      </div>
      
      ${actionItemsList ? `
      <div class="section">
        <h3 style="margin-top:0;">What you need to do:</h3>
        <ol>${actionItemsList}</ol>
      </div>
      ` : ''}
      
      <a href="${APP_URL}/audit?state=${lawUpdate.state_code}" class="cta">Update your compliance →</a>
      
      <p>We've updated AIHireLaw's document templates and audit tools to reflect these changes.</p>
      
      <p>— The AIHireLaw Team</p>
    </div>
    <div class="footer">
      <p>This alert was sent because you indicated you hire in ${lawUpdate.state_code}.</p>
      <p><a href="${APP_URL}/settings/notifications">Manage email preferences</a></p>
    </div>
  </div>
</body>
</html>`

      // Queue the email
      const { error: queueError } = await supabase.rpc('queue_email', {
        p_user_id: user.id,
        p_email_type: 'law_alert',
        p_to_email: user.email,
        p_subject: `🚨 Action Required: ${lawUpdate.state_code} AI hiring law ${lawUpdate.status}`,
        p_html_body: html,
        p_metadata: { 
          law_update_id: lawUpdate.id,
          state_code: lawUpdate.state_code 
        }
      })

      if (!queueError) {
        queued++
      }
    }

    // Mark the law update as notified
    await supabase
      .from('law_updates')
      .update({ notified_at: new Date().toISOString() })
      .eq('id', law_update_id)

    return new Response(
      JSON.stringify({ 
        law_update: lawUpdate.law_name,
        users_found: users?.length || 0, 
        emails_queued: queued 
      }),
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
