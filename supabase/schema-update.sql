-- HireShield Schema Updates
-- Run this in the Supabase SQL Editor

-- Add missing columns to consent_records table
ALTER TABLE consent_records 
ADD COLUMN IF NOT EXISTS disclosure_date date,
ADD COLUMN IF NOT EXISTS consent_date date,
ADD COLUMN IF NOT EXISTS position text,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending';

-- Add company_size to leads if missing
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS company_size text;

-- That's it! RLS policies were already created in the original schema.sql
