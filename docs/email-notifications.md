# AIHireLaw Email Notifications

## Trigger-Based Emails

---

### 1. Quarterly Audit Reminder

**Trigger:** 90 days since last audit completed
**Subject:** ⚠️ Time for your Q[X] compliance audit

**Body:**
```
Hi {{first_name}},

It's been 90 days since your last AI hiring compliance audit.

Regular audits are required by NYC Local Law 144 and recommended under Colorado's AI Act. More importantly, they catch issues before they become violations.

**Your last audit:** {{last_audit_date}}
**Current risk score:** {{risk_score}}

→ Run your Q{{quarter}} audit now: {{audit_link}}

Takes about 10 minutes. Your previous answers are pre-loaded.

— The AIHireLaw Team

P.S. Companies that audit quarterly catch 3x more compliance gaps before regulators do.
```

---

### 2. Training Certification Expiring

**Trigger:** 30 days before cert expires (annual recertification)
**Subject:** Your {{course_name}} certification expires in 30 days

**Body:**
```
Hi {{first_name}},

Your "{{course_name}}" certification expires on {{expiry_date}}.

Most state regulations require annual compliance training for HR teams handling AI-assisted hiring. Letting your certification lapse could be a liability.

**Quick refresh:** The recertification module takes ~15 minutes and covers any law updates from the past year.

→ Recertify now: {{training_link}}

Your certificate will be updated automatically upon completion.

— The AIHireLaw Team
```

---

### 3. NEW LAW ALERT (Urgent)

**Trigger:** New law passes or takes effect
**Subject:** 🚨 Action Required: {{state}} AI hiring law {{status}}

**Body:**
```
Hi {{first_name}},

{{state}} just {{status_verb}} new AI hiring regulations.

**What changed:**
{{law_summary}}

**Effective date:** {{effective_date}}

**What you need to do:**
{{action_items}}

**Your current status:**
{{compliance_status}}

→ Update your compliance: {{action_link}}

We've updated AIHireLaw's document templates and audit tools to reflect these changes.

— The AIHireLaw Team

---
This alert was sent because you indicated you hire in {{state}}.
```

**Example filled in:**
```
Subject: 🚨 Action Required: California AI hiring law signed by governor

California just signed new AI hiring regulations.

**What changed:**
AB 1234 requires employers to disclose AI use in hiring decisions and provide candidates with an explanation of how AI influenced their application status. Annual impact assessments required for employers with 100+ employees.

**Effective date:** January 1, 2027

**What you need to do:**
1. Update your candidate disclosure to include California-specific language
2. Prepare for annual impact assessments (template available in Documents)
3. Train HR team on new explanation requirements

**Your current status:**
⚠️ Your California disclosure needs updating

→ Update your compliance: [Generate California Disclosure]
```

---

### 4. Zero Consents Warning

**Trigger:** Account active 7+ days, 0 consents tracked
**Subject:** You're flying blind on AI consent tracking

**Body:**
```
Hi {{first_name}},

You've been using AIHireLaw for {{days_active}} days but haven't tracked any candidate consents yet.

**Why this matters:**
- Illinois and Maryland require consent before AI video analysis
- NYC requires proof of candidate notification
- No records = no defense during an audit

**Get started in 2 minutes:**
1. Upload your existing consent records (CSV import)
2. Or add your first consent manually
3. Or integrate with your ATS for automatic tracking

→ Start tracking: {{consent_link}}

— The AIHireLaw Team

P.S. The average audit request gives you 30 days to produce records. Start now, not then.
```

---

### 5. Document Template Outdated

**Trigger:** Law update affects a generated document
**Subject:** Your {{document_type}} needs updating for {{law_name}}

**Body:**
```
Hi {{first_name}},

A recent change to {{law_name}} means your {{document_type}} (generated {{generated_date}}) may no longer be compliant.

**What changed:**
{{change_summary}}

**Your document:** {{document_name}}

→ Regenerate with updated language: {{regenerate_link}}

We've already updated our templates. Just click regenerate to get a compliant version.

— The AIHireLaw Team
```

---

### 6. Weekly Digest (Optional)

**Trigger:** Weekly (if enabled)
**Subject:** Your AIHireLaw Weekly: {{week_summary}}

**Body:**
```
Hi {{first_name}},

Here's your compliance snapshot for the week of {{week_start}}:

**📊 Audit Status**
Risk Score: {{risk_score}} ({{risk_change}} from last week)
Last Audit: {{days_since_audit}} days ago

**📝 Documents**
{{doc_count}} active documents
{{expiring_docs}} expiring soon

**✅ Training**
{{training_progress}}% complete
{{certs_expiring}} certifications expiring in 30 days

**👥 Consents**
{{consent_count}} tracked this week
{{total_consents}} total

{{#if law_updates}}
**⚖️ Law Updates**
{{law_updates}}
{{/if}}

→ View full dashboard: {{dashboard_link}}

— The AIHireLaw Team
```

---

### 7. Inactivity Nudge

**Trigger:** No login for 14 days
**Subject:** Quick check-in from AIHireLaw

**Body:**
```
Hi {{first_name}},

Haven't seen you in a couple weeks. Just a quick reminder:

{{#if pending_items}}
**You have items needing attention:**
{{pending_items}}
{{/if}}

{{#if recent_law_changes}}
**Recent law changes you might have missed:**
{{recent_law_changes}}
{{/if}}

Compliance doesn't pause when you're busy. A 5-minute check-in can prevent expensive surprises.

→ Check your dashboard: {{dashboard_link}}

— The AIHireLaw Team
```

---

### 8. Onboarding Sequence (3 emails)

**Email 1: Welcome (immediate)**
**Subject:** Welcome to AIHireLaw — let's get you compliant

```
Hi {{first_name}},

Thanks for signing up. Let's make sure you're protected.

**Your 3-step quick start:**

1. **Run your first audit** (5 min)
   Find out where you stand right now.
   → {{audit_link}}

2. **Generate your first disclosure** (2 min)
   Get a compliant candidate notice for your state.
   → {{documents_link}}

3. **Start tracking consents** (ongoing)
   Build your audit defense from day one.
   → {{consent_link}}

Most users complete all three in under 15 minutes.

— The AIHireLaw Team
```

**Email 2: Day 2 (if no audit)**
**Subject:** You're one audit away from knowing your risk

```
Hi {{first_name}},

Quick question: do you know your current compliance risk level?

Most companies don't — until they get a complaint or audit request.

Our compliance audit takes 5 minutes and tells you:
- Which states you're exposed in
- What documents you're missing
- Specific fixes to prioritize

→ Run your free audit: {{audit_link}}

No judgment. Just clarity.

— The AIHireLaw Team
```

**Email 3: Day 5 (if no documents generated)**
**Subject:** Your competitors have compliant disclosures. Do you?

```
Hi {{first_name}},

68% of our users generate their first compliant disclosure within 48 hours of signing up.

It's not because they're compliance nerds. It's because they know:
- One violation in NYC = $1,500
- One violation in Illinois = $1,000
- One class action = unlimited headache

**2 minutes to peace of mind:**
→ Generate your disclosure: {{documents_link}}

We'll ask 4 questions about your AI tools and give you state-specific language that actually complies.

— The AIHireLaw Team
```

---

## Technical Implementation Notes

### Required Database Fields
- `last_audit_at` — timestamp
- `training_completions` with `expires_at`
- `user_states[]` — states user hires in
- `consents_count` — denormalized counter
- `documents[]` with `generated_at`, `law_version`
- `last_login_at` — timestamp
- `email_preferences` — digest/alerts on/off

### Email Service
- Recommend: Resend, Postmark, or SendGrid
- Transactional emails (not marketing)
- Unsubscribe link required for digest

### Trigger Logic
```typescript
// Example: Quarterly audit reminder
const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000
if (Date.now() - user.last_audit_at > NINETY_DAYS) {
  await sendEmail('quarterly-audit-reminder', user)
}
```

### Cron Schedule
- Audit reminders: Daily at 9am user timezone
- Training expiry: Daily at 9am
- Law alerts: Immediate (manual trigger)
- Weekly digest: Monday 8am
- Inactivity nudge: Daily check, send at 10am
