# Perfect Compliance Experience Plan

## Current Problems

1. **Redundant data entry** - User fills states/tools in scorecard, then again in Audit
2. **Information overload** - Shows ALL document types instead of what's relevant to their states
3. **No personalization** - Generic checklist, not "here's what YOU need for CO + IL"
4. **Confusing training flow** - Admin has to "assign" before anyone can train
5. **Audit page is another wizard** - Should just show results since we have their data
6. **No state-specific guidance** - Each state has different requirements, but app treats them the same

---

## The New Flow

### Phase 1: Assessment (Scorecard) ✅ Already done
- User selects states, tools, usage
- We calculate risk and store everything
- They sign up → Stripe → set password

### Phase 2: Personalized Dashboard (NEW)
When user logs in, dashboard shows **their specific requirements**:

```
Welcome to AI Hire Law!

Based on your hiring in Colorado and Illinois, here's your compliance plan:

YOUR REQUIREMENTS
─────────────────
Colorado (AI Act - Effective Feb 1, 2026)
  ☐ Impact Assessment
  ☐ Candidate Disclosure Notice
  ☐ Public Disclosure Page

Illinois (HB 3773 - Effective Jan 1, 2026)  
  ☐ Candidate Disclosure Notice
  ☐ Video Interview Consent (if using)

General
  ☐ Train hiring team
  ☐ Set up consent tracking
```

**Key changes:**
- Checklist items are STATE-SPECIFIC
- Shows which law requires what
- Shows deadlines/effective dates
- Clicking any item takes you directly to complete it

### Phase 3: Documents (Simplified)

**Before:** Shows 6 document types, user guesses which they need
**After:** Only shows documents required for THEIR states

```
Required Documents for Colorado + Illinois
──────────────────────────────────────────

☐ Colorado Impact Assessment
  Required by: Colorado AI Act
  [Generate Document]

☐ Candidate Disclosure Notice  
  Required by: Illinois HB 3773, Colorado AI Act
  [Generate Document]

✓ Employee Handbook Policy (generated Jan 15)
  [View] [Download] [Edit]
```

**One-click generation:**
1. Click "Generate"
2. Preview with company name pre-filled
3. Make any edits
4. Save → automatically marked complete in checklist

### Phase 4: Disclosures (Public Page)

Dedicated page (not buried in settings):

```
Your Public Disclosure Page
───────────────────────────

This page informs candidates about your AI hiring practices.
Required by: NYC Local Law 144, Illinois HB 3773

Preview: [aihirelaw.com/d/acme-corp]

Status: ○ Draft  ● Published

[Edit Page] [Copy Link] [Embed Code]
```

### Phase 5: Training (Simplified)

**Before:** Complex assignment system
**After:** Simple paths

```
Team Training
─────────────

Who needs training?

○ Just me (I'm the only one hiring)
  → Start 15-min certification now

○ My team (multiple people involved)
  → Enter emails to invite:
  [email input]
  [email input]
  [+ Add more]
  [Send Invites]

Completed: 2 of 5 team members certified
```

### Phase 6: Consent Tracking

Keep simple record of candidate notifications:

```
Consent Records
───────────────

Quick Add: [Candidate name] [Email] [Add Record]

Or: [Import from ATS] [Bulk Upload CSV]

Recent Records
─────────────
✓ John Smith - jan.15.2026 - Consented
✓ Jane Doe - jan.14.2026 - Consented  
○ Bob Wilson - jan.14.2026 - Pending

30-day summary: 45 notified, 42 consented, 3 pending
```

---

## State-Specific Requirements Matrix

| State | Disclosure | Impact Assessment | Bias Audit | Consent | Training |
|-------|-----------|-------------------|------------|---------|----------|
| CO    | ✓         | ✓                 |            | ✓       | ✓        |
| IL    | ✓         |                   |            | ✓*      | ✓        |
| NYC   | ✓         |                   | ✓          |         |          |
| CA    | ✓         |                   |            | ✓       |          |
| MD    | ✓         |                   |            | ✓       |          |

*IL requires consent specifically for video interview AI

---

## Implementation Priority

### Phase 1 (This week)
1. ✅ Clean dashboard with checklist
2. ✅ Simplified sidebar
3. Update dashboard to show state-specific requirements
4. Pre-populate audit from scorecard data (skip wizard if we have data)

### Phase 2 (Next)
5. Filter documents page by user's states
6. One-click document generation
7. Move disclosures to first-class page

### Phase 3 (Polish)
8. Simplify training flow
9. Add progress tracking across all items
10. Add deadline reminders

---

## Technical Changes Needed

### Dashboard
- Fetch org.states and show state-specific checklist
- Use stateRequirements data to build personalized list
- Track completion status for each requirement type per state

### Audit Page  
- If org.states exists, skip to results
- Show "Edit my setup" link to modify
- Remove redundant wizard

### Documents Page
- Filter documentTypes by user's states
- Show "Required by: [Law Name]" for each
- Auto-mark checklist when document generated

### New Data Model
```sql
-- Track completion per requirement
CREATE TABLE compliance_progress (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES organizations(id),
  requirement_type TEXT, -- 'disclosure', 'impact_assessment', 'training', etc.
  state_code TEXT,       -- 'CO', 'IL', etc.  
  completed_at TIMESTAMPTZ,
  document_id UUID,      -- link to generated doc if applicable
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Sample User Journey

**Maria signs up:**
1. Completes scorecard → selects CO, IL → sees 65 risk score
2. Clicks "Start Free Trial" → Stripe → sets password
3. Lands on dashboard:
   > "You hire in Colorado and Illinois. Here are your 6 requirements:"
4. Clicks "Generate Colorado Impact Assessment"
5. Reviews pre-filled document → saves
6. Checklist updates: ✓ Colorado Impact Assessment
7. Continues through remaining items
8. 20 minutes later: all green checkmarks
9. Dashboard shows: "🎉 You're compliant! Here's your ongoing checklist..."

**Ongoing:**
- Maria invites her recruiter Sarah
- Sarah completes training → Maria sees completion
- Maria logs consent records as candidates apply
- 11 months later: "Reminder: Colorado Impact Assessment renewal due in 30 days"
