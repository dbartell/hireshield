-- Add super admin field to organizations (not profiles - profiles table not used)
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT false;

-- Create index for quick admin lookups
CREATE INDEX IF NOT EXISTS idx_organizations_super_admin ON organizations(is_super_admin) WHERE is_super_admin = true;

-- Function to completely delete an organization and all associated data
CREATE OR REPLACE FUNCTION delete_organization_completely(org_uuid UUID)
RETURNS void AS $$
BEGIN
  -- Delete in correct order to respect foreign keys
  
  -- Training related (uses org_id)
  DELETE FROM training_certificates WHERE assignment_id IN (
    SELECT id FROM training_assignments WHERE org_id = org_uuid
  );
  DELETE FROM training_quiz_attempts WHERE assignment_id IN (
    SELECT id FROM training_assignments WHERE org_id = org_uuid
  );
  DELETE FROM training_progress WHERE assignment_id IN (
    SELECT id FROM training_assignments WHERE org_id = org_uuid
  );
  DELETE FROM training_assignments WHERE org_id = org_uuid;
  
  -- Compliance documents (uses org_id)
  DELETE FROM renewal_notifications WHERE document_id IN (
    SELECT id FROM compliance_documents WHERE org_id = org_uuid
  );
  DELETE FROM compliance_documents WHERE org_id = org_uuid;
  
  -- ATS integration (uses org_id)
  DELETE FROM ats_audit_events WHERE org_id = org_uuid;
  DELETE FROM synced_applications WHERE org_id = org_uuid;
  DELETE FROM synced_candidates WHERE org_id = org_uuid;
  DELETE FROM ats_integrations WHERE org_id = org_uuid;
  
  -- Disclosure pages (uses organization_id)
  DELETE FROM disclosure_page_views WHERE disclosure_page_id IN (
    SELECT id FROM disclosure_pages WHERE organization_id = org_uuid
  );
  DELETE FROM disclosure_pages WHERE organization_id = org_uuid;
  
  -- Team (uses organization_id)
  DELETE FROM team_invites WHERE organization_id = org_uuid;
  DELETE FROM organization_members WHERE organization_id = org_uuid;
  
  -- Audits (uses org_id)
  DELETE FROM audit_findings WHERE audit_id IN (
    SELECT id FROM audits WHERE org_id = org_uuid
  );
  DELETE FROM audits WHERE org_id = org_uuid;
  
  -- Other org data (uses org_id)
  DELETE FROM hiring_tools WHERE org_id = org_uuid;
  DELETE FROM documents WHERE org_id = org_uuid;
  DELETE FROM consent_records WHERE org_id = org_uuid;
  
  -- Finally delete the organization (profiles will cascade)
  DELETE FROM organizations WHERE id = org_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
