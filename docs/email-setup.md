# AIHireLaw Email System Setup

## Overview

Email notifications via Supabase Edge Functions + Resend.

**Files created:**
- `supabase/migrations/002_email_notifications.sql` — Database tables
- `supabase/functions/send-email/` — Direct email send
- `supabase/functions/process-email-queue/` — Queue processor (cron)
- `supabase/functions/check-audit-reminders/` — Audit reminder checker
- `supabase/functions/send-law-alert/` — Law update alerter
- `src/lib/email-templates.ts` — Reusable email templates

---

## Setup Steps

### 1. Get Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Create API key
3. Verify your domain (aihirelaw.com) or use their test domain

### 2. Run Database Migration

```bash
# Via Supabase CLI
supabase db push

# Or run SQL directly in Supabase Dashboard → SQL Editor
# Paste contents of supabase/migrations/002_email_notifications.sql
```

### 3. Deploy Edge Functions

```bash
# Set secrets
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxxx
supabase secrets set APP_URL=https://app.aihirelaw.com

# Deploy functions
supabase functions deploy send-email
supabase functions deploy process-email-queue
supabase functions deploy check-audit-reminders
supabase functions deploy send-law-alert
```

### 4. Enable pg_cron

1. Go to Supabase Dashboard → Database → Extensions
2. Enable `pg_cron`
3. Run the cron schedules in the migration file (uncomment them)

```sql
-- Process email queue every 5 minutes
SELECT cron.schedule('process-email-queue', '*/5 * * * *', $$
  SELECT net.http_post(
    'https://YOUR-PROJECT.supabase.co/functions/v1/process-email-queue',
    '{}',
    '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'
  );
$$);

-- Check audit reminders daily at 9am UTC
SELECT cron.schedule('audit-reminders', '0 9 * * *', $$
  SELECT net.http_post(
    'https://YOUR-PROJECT.supabase.co/functions/v1/check-audit-reminders',
    '{}',
    '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'
  );
$$);
```

---

## Usage

### Queue an email from server action

```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()

await supabase.rpc('queue_email', {
  p_user_id: userId,
  p_email_type: 'audit_reminder',
  p_to_email: user.email,
  p_subject: 'Time for your Q1 audit',
  p_html_body: htmlContent,
})
```

### Send a law alert

```typescript
// Call the Edge Function
await fetch(`${SUPABASE_URL}/functions/v1/send-law-alert`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  },
  body: JSON.stringify({ law_update_id: 'uuid-here' }),
})
```

### Add a law update to the database

```sql
INSERT INTO law_updates (state_code, law_name, status, effective_date, summary, action_items)
VALUES (
  'CA',
  'AB 1234',
  'signed',
  '2027-01-01',
  'California now requires employers to disclose AI use in hiring and provide explanations.',
  ARRAY[
    'Update candidate disclosure to include California-specific language',
    'Prepare for annual impact assessments',
    'Train HR team on explanation requirements'
  ]
);

-- Then trigger the alert
SELECT net.http_post(
  'https://YOUR-PROJECT.supabase.co/functions/v1/send-law-alert',
  '{"law_update_id": "the-uuid-from-insert"}',
  '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_KEY"}'
);
```

---

## Email Types

| Type | Trigger | Frequency |
|------|---------|-----------|
| `audit_reminder` | 90 days since last audit | Daily check |
| `training_expiry` | 30 days before cert expires | Daily check |
| `law_alert` | Manual (when law changes) | Immediate |
| `weekly_digest` | User opted in | Mondays 8am |
| `onboarding` | New signup | Days 0, 2, 5 |
| `inactivity` | No login 14 days | Daily check |
| `zero_consents` | Active 7+ days, 0 consents | Once |

---

## Cost Estimate

| Service | Free Tier | Paid |
|---------|-----------|------|
| Resend | 3,000 emails/mo | $20/mo for 50k |
| Supabase Edge Functions | 500k invocations/mo | Included in Pro |

For ~100 active users sending ~10 emails/user/month = 1,000 emails = **Free tier covers it**.

---

## Testing

```bash
# Test send-email directly
curl -X POST 'https://YOUR-PROJECT.supabase.co/functions/v1/send-email' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"to": "test@example.com", "subject": "Test", "html": "<p>Hello</p>"}'

# Test queue processor
curl -X POST 'https://YOUR-PROJECT.supabase.co/functions/v1/process-email-queue' \
  -H 'Authorization: Bearer YOUR_SERVICE_KEY'
```
