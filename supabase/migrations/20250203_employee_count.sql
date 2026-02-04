-- Add employee_count column to organizations table
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS employee_count TEXT;

-- Add index for pricing tier lookups
CREATE INDEX IF NOT EXISTS idx_organizations_employee_count ON organizations(employee_count);
