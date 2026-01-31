// supabase/functions/process-email-queue/index.ts
// Processes pending emails from the queue

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const BATCH_SIZE = 10
const MAX_ATTEMPTS = 3

serve(async (req) => {
  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    // Get pending emails
    const { data: emails, error: fetchError } = await supabase
      .from('email_queue')
      .select('*')
      .eq('status', 'pending')
      .lt('attempts', MAX_ATTEMPTS)
      .order('created_at', { ascending: true })
      .limit(BATCH_SIZE)

    if (fetchError) {
      throw fetchError
    }

    if (!emails || emails.length === 0) {
      return new Response(JSON.stringify({ processed: 0 }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    let sent = 0
    let failed = 0

    for (const email of emails) {
      try {
        // Send via Resend
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'AIHireLaw <notifications@aihirelaw.com>',
            to: email.to_email,
            subject: email.subject,
            html: email.html_body,
            text: email.text_body,
            reply_to: 'support@aihirelaw.com',
          }),
        })

        const result = await response.json()

        if (response.ok) {
          // Mark as sent
          await supabase
            .from('email_queue')
            .update({
              status: 'sent',
              sent_at: new Date().toISOString(),
              attempts: email.attempts + 1,
              last_attempt_at: new Date().toISOString(),
            })
            .eq('id', email.id)

          // Log the sent email
          await supabase
            .from('email_logs')
            .insert({
              user_id: email.user_id,
              email_type: email.email_type,
              to_email: email.to_email,
              subject: email.subject,
              resend_id: result.id,
              status: 'sent',
            })

          sent++
        } else {
          throw new Error(result.message || 'Resend API error')
        }
      } catch (error) {
        // Mark attempt, potentially mark as failed
        const newAttempts = email.attempts + 1
        await supabase
          .from('email_queue')
          .update({
            status: newAttempts >= MAX_ATTEMPTS ? 'failed' : 'pending',
            attempts: newAttempts,
            last_attempt_at: new Date().toISOString(),
            error: error.message,
          })
          .eq('id', email.id)

        failed++
        console.error(`Failed to send email ${email.id}:`, error)
      }
    }

    return new Response(
      JSON.stringify({ processed: emails.length, sent, failed }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing queue:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
