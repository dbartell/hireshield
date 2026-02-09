-- Add state-as-product columns to organizations table
-- primary_state: The user's main/active state (for single-state view)
-- active_states: Array of states the user has paid for access to

ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS primary_state TEXT DEFAULT 'IL',
ADD COLUMN IF NOT EXISTS active_states TEXT[] DEFAULT ARRAY['IL']::TEXT[];

-- Add index for filtering by primary state
CREATE INDEX IF NOT EXISTS idx_organizations_primary_state ON organizations(primary_state);
