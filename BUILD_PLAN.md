# AIHireLaw Build Plan

## Phase 1: MVP (Audit + Documents)

### Marketing Site
- [x] Project setup (Next.js + Supabase + Tailwind)
- [x] Landing page (hero, problem, solution, pricing preview)
- [x] Pricing page (3 tiers with comparison table + FAQ)
- [x] State compliance pages (IL, CO, CA, NYC)
- [x] Free scorecard tool (lead capture)
- [ ] Resources/blog structure

### Web App - Core
- [x] App layout with sidebar navigation
- [x] Dashboard with compliance score, stats, activity
- [ ] Supabase auth setup (login/signup pages)
- [ ] Database schema migration
- [ ] Onboarding flow

### Web App - Audit Tool
- [x] Audit questionnaire flow (states → tools → usage)
- [x] State selector with regulation indicators
- [x] Tool selector (LinkedIn, HireVue, etc.)
- [x] Usage questions
- [x] Risk scoring algorithm
- [x] Results page with findings
- [ ] PDF report generation

### Web App - Document Generator
- [x] Document type selector UI
- [x] Generated documents list
- [ ] Template engine with variable substitution
- [ ] State-specific content logic
- [ ] Preview component
- [ ] PDF/Word export

## Phase 2: Training & Tracking

### Training Module
- [x] Course list UI with progress tracking
- [x] Team progress view
- [x] Certificate display
- [ ] Video player integration
- [ ] Quiz engine
- [ ] Certificate generation
- [ ] Completion tracking (database)

### Consent Tracking
- [x] Records table with search/filter
- [x] Stats overview
- [x] Status indicators
- [ ] Add record form
- [ ] CSV import functionality
- [ ] Audit log export

---

## Tech Stack
- **Framework:** Next.js 16+ (App Router)
- **Database:** Supabase (Postgres)
- **Auth:** Supabase Auth
- **Styling:** Tailwind CSS
- **PDF:** @react-pdf/renderer or Puppeteer
- **Payments:** Stripe (later)
- **Hosting:** Vercel

## Pages Built (15 total)
- `/` - Landing page
- `/pricing` - Pricing with tiers and FAQ
- `/scorecard` - Lead capture assessment
- `/compliance/illinois` - IL law guide
- `/compliance/colorado` - CO law guide  
- `/compliance/california` - CA law guide
- `/compliance/nyc` - NYC law guide
- `/dashboard` - App dashboard
- `/audit` - Compliance audit tool
- `/documents` - Document generator
- `/training` - Training courses
- `/consent` - Consent tracking

## Current Status
- **Date:** 2026-01-28
- **Status:** Core UI complete, needs backend integration

## Next Steps
1. Add Supabase auth (login/signup)
2. Create database schema
3. Wire up forms to backend
4. Add PDF generation
5. Deploy to Vercel
