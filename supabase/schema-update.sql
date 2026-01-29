-- HireShield Schema Updates
-- Run this in the Supabase SQL Editor if needed

-- Add position and status columns to consent_records if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'consent_records' AND column_name = 'position') THEN
        ALTER TABLE consent_records ADD COLUMN position text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'consent_records' AND column_name = 'status') THEN
        ALTER TABLE consent_records ADD COLUMN status text DEFAULT 'pending' CHECK (status IN ('pending', 'consented', 'declined'));
    END IF;
END $$;

-- Enable Row Level Security on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE hiring_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE hiring_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_completions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
CREATE POLICY IF NOT EXISTS "Users can view own organization" ON organizations
    FOR SELECT USING (auth.uid() = id);
    
CREATE POLICY IF NOT EXISTS "Users can update own organization" ON organizations
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can insert own organization" ON organizations
    FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for users table
CREATE POLICY IF NOT EXISTS "Users can view own record" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can insert own record" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for hiring_states
CREATE POLICY IF NOT EXISTS "Users can manage own hiring states" ON hiring_states
    FOR ALL USING (auth.uid() = org_id);

-- RLS Policies for hiring_tools
CREATE POLICY IF NOT EXISTS "Users can manage own hiring tools" ON hiring_tools
    FOR ALL USING (auth.uid() = org_id);

-- RLS Policies for audits
CREATE POLICY IF NOT EXISTS "Users can manage own audits" ON audits
    FOR ALL USING (auth.uid() = org_id);

-- RLS Policies for audit_findings
CREATE POLICY IF NOT EXISTS "Users can view own audit findings" ON audit_findings
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM audits WHERE audits.id = audit_findings.audit_id AND audits.org_id = auth.uid())
    );

CREATE POLICY IF NOT EXISTS "Users can insert own audit findings" ON audit_findings
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM audits WHERE audits.id = audit_findings.audit_id AND audits.org_id = auth.uid())
    );

-- RLS Policies for documents
CREATE POLICY IF NOT EXISTS "Users can manage own documents" ON documents
    FOR ALL USING (auth.uid() = org_id);

-- RLS Policies for consent_records
CREATE POLICY IF NOT EXISTS "Users can manage own consent records" ON consent_records
    FOR ALL USING (auth.uid() = org_id);

-- RLS Policies for training_completions
CREATE POLICY IF NOT EXISTS "Users can manage own training completions" ON training_completions
    FOR ALL USING (auth.uid() = user_id);
