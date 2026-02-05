-- Add documents_generated column for paywall tracking
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS documents_generated INTEGER DEFAULT 0;
