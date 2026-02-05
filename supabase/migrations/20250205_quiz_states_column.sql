-- Migration: Add states column for quiz data
-- The bootstrap API needs to store selected states from the onboarding quiz

-- Add states column if it doesn't exist
ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS states TEXT[] DEFAULT '{}';

-- Ensure other quiz columns exist (idempotent)
ALTER TABLE organizations
ADD COLUMN IF NOT EXISTS quiz_tools TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS quiz_risk_score INTEGER,
ADD COLUMN IF NOT EXISTS quiz_usages TEXT[] DEFAULT '{}';

-- Index for state-based queries
CREATE INDEX IF NOT EXISTS idx_organizations_states ON organizations USING GIN(states);
