# AIHireLaw Outreach Strategy: First 1,000 Customers

## The Play
Find companies using AI hiring tools → verify they operate in regulated states → personalized outreach with specific risk/deadline messaging.

---

## Step 1: Build Target Company List

### Source A: Job Posting Scraping
Companies mention their ATS/tools in job postings. Scrape for:

**Keywords to find:**
- "Apply via Greenhouse" / "Powered by Greenhouse"
- "Apply via Lever"
- "HireVue assessment" / "video interview"
- "Workday careers"
- "Apply via Ashby"
- "iCIMS"
- "Pymetrics assessment"
- "Codility test" / "HackerRank assessment"

**Where to scrape:**
- LinkedIn Jobs API (or manual search)
- Indeed (filter by state: IL, CA, CO, NY)
- Glassdoor job listings
- Company career pages directly

**Tools:**
- Apify (LinkedIn scraper)
- PhantomBuster (LinkedIn automation)
- Bardeen.ai (no-code scraping)
- Custom Python script with BeautifulSoup

### Source B: Vendor Customer Lists
AI hiring tool vendors publish case studies and customer logos:

| Vendor | Customer Page |
|--------|---------------|
| HireVue | hirevue.com/customers |
| Greenhouse | greenhouse.io/customers |
| Lever | lever.co/customers |
| Pymetrics | pymetrics.ai/case-studies |
| Eightfold | eightfold.ai/customers |
| Paradox (Olivia) | paradox.ai/customers |
| Phenom | phenom.com/customers |

### Source C: G2/Capterra Reviews
People who leave reviews work at companies using the tool:
- G2.com/products/hirevue/reviews
- G2.com/products/greenhouse/reviews
- Extract company names from reviewer profiles

### Source D: BuiltWith / Wappalyzer
Detect what hiring tech companies use on their careers pages:
- BuiltWith.com → filter by "Greenhouse" or "Lever" technology
- Can filter by company size and location

### Source E: LinkedIn Sales Navigator
Filter by:
- Job title: "Talent Acquisition", "HR Manager", "People Ops", "Recruiter"
- Company headcount: 50-1000
- Geography: Illinois, California, Colorado, New York
- Boolean search in posts for tool mentions

---

## Step 2: Enrich & Qualify

For each company found, verify:

| Field | How to Get |
|-------|------------|
| HQ State | LinkedIn company page, Crunchbase |
| Employee count | LinkedIn, Crunchbase |
| Hiring states | Job posting locations |
| AI tools used | Job postings, BuiltWith |
| HR/Compliance contact | LinkedIn Sales Nav, Apollo.io |
| Contact email | Apollo.io, Hunter.io, Clearbit |

**Qualification criteria:**
- ✅ Uses AI hiring tool (confirmed)
- ✅ Has employees in IL, CA, CO, or NYC
- ✅ 50+ employees (can afford $99-349/mo)
- ✅ Has identifiable HR/compliance contact

---

## Step 3: Outreach Sequences

### Sequence A: Illinois Focus (Deadline Jan 1, 2026)
**Subject lines:**
- "Illinois AI law + [Company Name]"
- "[First Name], quick question about HireVue compliance"
- "You're using Greenhouse in Illinois — quick heads up"

**Email 1:**
```
Hey [First Name],

Noticed [Company] uses [Tool] for hiring — just wanted to flag that Illinois HB 3773 kicks in January 1, 2026.

If you're hiring anyone in Illinois, you'll need to:
- Notify employees when AI is used in hiring decisions
- Disclose the AI system name, purpose, and data collected
- Ensure no zip code proxies for protected classes

Non-compliance = civil rights violation (per employee).

We built a 5-min assessment that tells you exactly what you need: [link]

Happy to share what we're seeing from other [industry] companies if helpful.

— [Name]
```

**Email 2 (3 days later):**
```
Hey [First Name],

Quick follow-up — the Illinois law is trickier than it looks because it covers ANY AI used in "employment decisions" (not just hiring).

That includes promotion decisions, performance reviews, even scheduling software with AI.

Worth 5 minutes to check your exposure: [link]

— [Name]
```

**Email 3 (5 days later):**
```
[First Name] — last one from me.

If [Company] isn't on this yet, totally get it. When you're ready, the assessment is here: [link]

One thing that surprises most companies: LinkedIn Recruiter counts as AI under the law.

— [Name]
```

### Sequence B: Colorado Focus (Deadline Jun 30, 2026)
Emphasize:
- "Deadline extended — but law is coming"
- "NIST safe harbor = legal protection"
- "60-day cure period — catch violations early"

### Sequence C: California Focus (ALREADY IN EFFECT)
Emphasize:
- "You're already required to comply"
- "4-year record retention requirement"
- "Courts consider bias testing in discrimination cases"

### Sequence D: NYC Focus (Audit-Heavy)
Emphasize:
- "Audits cost $20-75K — prep matters"
- "Must publish results publicly"
- "We help you get audit-ready, then connect you with vendors"

---

## Step 4: Scale with Automation

### Tools to automate:
| Task | Tool |
|------|------|
| Find contacts | Apollo.io, Clearbit |
| Verify emails | NeverBounce, ZeroBounce |
| Send sequences | Instantly.ai, Smartlead, Apollo |
| Track opens/replies | Built into above tools |
| CRM | HubSpot (free tier), Pipedrive |

### Volumes to target:
- Week 1-2: 100 companies (manual, learn what works)
- Week 3-4: 500 companies (semi-automated)
- Month 2+: 2,000+ companies (fully automated sequences)

### Response benchmarks:
- Open rate: 40-60% (good subject lines)
- Reply rate: 5-15% (personalization matters)
- Meeting rate: 2-5% of sends
- Close rate: 20-30% of meetings

**Math:**
- 2,000 emails → 100 replies → 40 meetings → 10 customers
- Need ~20K emails to hit 100 customers
- At 500/week, that's 40 weeks
- To hit 842 customers (the $1M goal), need to optimize conversion OR add channels

---

## Step 5: LinkedIn Parallel Track

### Personal brand content:
Post 3-5x/week on topics like:
- "X companies just got fined for AI hiring violations"
- "The 3 AI tools that trigger Illinois law (you're probably using #2)"
- "Illinois vs NYC compliance: here's the real difference"
- State deadline countdowns
- Compliance checklists as carousels

### Direct outreach:
- Connect with HR/TA leaders
- Comment on their posts first (warm up)
- Then DM with value, not pitch

### LinkedIn Ads (later):
- Retarget quiz visitors
- Target by job title + geography

---

## Step 6: Community Infiltration

### Where HR folks hang out:
- r/humanresources (89K members)
- r/recruiting (47K members)
- SHRM Connect forums
- LinkedIn Groups: "HR Professionals", "Talent Acquisition Leaders"
- People Managing People community
- HR Morning newsletter audience
- Evil HR Lady readership

### How to engage:
- Answer questions about AI compliance (provide value)
- Share free resources (checklists, templates)
- Don't pitch — let them come to you
- Post your quiz as a "free tool I found" (from alt account if needed)

---

## Quick Start Checklist

- [ ] Scrape 100 companies using Greenhouse/HireVue in Illinois
- [ ] Find HR/TA contact for each (Apollo.io)
- [ ] Verify emails (NeverBounce)
- [ ] Send Sequence A (Illinois focus)
- [ ] Track responses in spreadsheet or HubSpot
- [ ] Iterate on subject lines based on open rates
- [ ] Scale what works

---

## Metrics to Track

| Metric | Target |
|--------|--------|
| Companies identified | 5,000+ |
| Emails sent/week | 500 |
| Open rate | 50%+ |
| Reply rate | 10%+ |
| Quiz completions | 20% of clicks |
| Trials started | 5% of quiz completions |
| Paid conversions | 20% of trials |

---

## Cost Estimate (Monthly)

| Tool | Cost |
|------|------|
| Apollo.io (email finding + sequences) | $99/mo |
| Instantly.ai (sending at scale) | $37/mo |
| NeverBounce (email verification) | ~$50/mo for 5K |
| LinkedIn Sales Nav | $99/mo |
| **Total** | ~$285/mo |

ROI: 3 customers at $99/mo = break even. Everything after = profit.
