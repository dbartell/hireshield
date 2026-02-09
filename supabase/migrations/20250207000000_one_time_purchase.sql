-- Add one-time purchase support to organizations table
-- For IL-only $199 one-time payments

ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS one_time_purchase boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS one_time_expires_at timestamp with time zone;

-- Add comment for documentation
COMMENT ON COLUMN organizations.one_time_purchase IS 'True if this org purchased a one-time plan (e.g., IL-only)';
COMMENT ON COLUMN organizations.one_time_expires_at IS 'When one-time purchase access to updates expires (typically 1 year from purchase)';
