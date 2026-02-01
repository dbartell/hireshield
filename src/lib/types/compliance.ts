// Compliance-related types - moved from server actions to allow imports

export interface RemediationItem {
  id: string
  org_id: string
  audit_id: string | null
  state_code: string
  item_key: string
  item_label: string
  item_description: string | null
  status: 'incomplete' | 'in_progress' | 'complete'
  completed_at: string | null
  linked_document_id: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export interface ImpactAssessment {
  id: string
  org_id: string
  system_name: string
  system_purpose: string | null
  vendor_name: string | null
  deployment_date: string | null
  ai_tools: string[]
  data_inputs: DataInput[]
  data_sources: string | null
  data_retention_period: string | null
  affected_groups: string[]
  potential_harms: string | null
  risk_level: 'low' | 'medium' | 'high' | null
  safeguards: string | null
  bias_testing_date: string | null
  bias_testing_results: string | null
  notification_method: string | null
  appeal_process: string | null
  human_reviewer_name: string | null
  human_reviewer_role: string | null
  human_reviewer_contact: string | null
  status: 'draft' | 'complete'
  version: number
  completed_at: string | null
  expires_at: string | null
  created_at: string
}

export interface DataInput {
  type: string
  description: string
  sensitive: boolean
}

export interface AdverseDecisionSettings {
  id: string
  org_id: string
  reviewer_name: string | null
  reviewer_role: string | null
  reviewer_email: string | null
  reviewer_phone: string | null
  response_deadline_days: number
  reasons_template: string | null
  appeal_instructions: string | null
}

export interface ConsentSettings {
  id: string
  org_id: string
  notification_template: string | null
  data_retention_days: number
  onboarding_completed: boolean
}

export interface ComplianceVerification {
  id: string
  org_id: string
  state_code: string
  confirmed_disclosure: boolean
  confirmed_training: boolean
  confirmed_consent_process: boolean
  confirmed_appeal_process: boolean
  confirmed_impact_assessment: boolean
  confirmed_bias_audit: boolean
  is_compliant: boolean
  compliant_at: string | null
  expires_at: string | null
}

export interface HiringStateWithProgress {
  state_code: string
  state_name: string
  checklist?: { key: string; label: string; description: string; route?: string }[]
  progress?: Record<string, boolean>
  is_verified?: boolean
  compliant_at?: string | null
  is_regulated?: boolean
  completed?: number
  total?: number
  is_compliant?: boolean
}

// State-specific checklist definitions
export const stateChecklists: Record<string, { key: string; label: string; description: string; route?: string }[]> = {
  CO: [
    { key: 'audit', label: 'Complete Compliance Audit', description: 'Run an audit to identify AI tools and usage patterns', route: '/audit' },
    { key: 'disclosure', label: 'Create Disclosure Notice', description: 'Generate disclosure documents for candidates and employees', route: '/documents' },
    { key: 'impact_assessment', label: 'Complete Impact Assessment', description: 'Document AI system risks and safeguards (annual requirement)', route: '/documents/impact-assessment' },
    { key: 'training', label: 'Complete Training', description: 'Ensure HR staff understands compliance requirements', route: '/training' },
    { key: 'adverse_decision', label: 'Set Up Adverse Decision Process', description: 'Configure human review and appeal process', route: '/settings/adverse-decisions' },
    { key: 'consent_tracking', label: 'Set Up Consent Tracking', description: 'Track candidate disclosures and consents', route: '/consent' },
  ],
  IL: [
    { key: 'audit', label: 'Complete Compliance Audit', description: 'Run an audit to identify AI tools and usage patterns', route: '/audit' },
    { key: 'disclosure', label: 'Create Disclosure Notice', description: 'Generate disclosure documents for employees', route: '/documents' },
    { key: 'training', label: 'Complete Training', description: 'Ensure HR staff understands compliance requirements', route: '/training' },
  ],
  CA: [
    { key: 'audit', label: 'Complete Compliance Audit', description: 'Run an audit to identify AI tools and usage patterns', route: '/audit' },
    { key: 'disclosure', label: 'Create Pre-Use Notice', description: 'Generate disclosure documents with opt-out rights', route: '/documents' },
    { key: 'consent_tracking', label: 'Set Up Opt-Out Tracking', description: 'Track candidate opt-out requests', route: '/consent' },
    { key: 'training', label: 'Complete Training', description: 'Ensure HR staff understands compliance requirements', route: '/training' },
  ],
  NYC: [
    { key: 'audit', label: 'Complete Compliance Audit', description: 'Run an audit to identify AEDT usage', route: '/audit' },
    { key: 'bias_audit', label: 'Schedule Bias Audit', description: 'Annual independent bias audit required', route: '/documents' },
    { key: 'disclosure', label: 'Publish Bias Audit Results', description: 'Create public disclosure page', route: '/documents' },
    { key: 'training', label: 'Complete Training', description: 'Ensure HR staff understands compliance requirements', route: '/training' },
  ],
}
