-- Add unique constraint on leads email for upsert support
-- First remove duplicates if any exist
DELETE FROM leads a USING leads b 
WHERE a.id < b.id AND a.email = b.email;

-- Then add the constraint
ALTER TABLE leads ADD CONSTRAINT leads_email_unique UNIQUE (email);
