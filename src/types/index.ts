// Database types

export interface Organization {
  id: string
  name: string
  size: 'small' | 'medium' | 'large' | 'enterprise'
  industry: string
  employee_count?: number
  seat_limit?: number
  seats_used?: number
  created_at: string
}

export type MemberRole = 'owner' | 'admin' | 'manager' | 'member'

export interface OrganizationMember {
  id: string
  organization_id: string
  user_id: string
  role: MemberRole
  invited_by?: string
  joined_at: string
  last_active_at?: string
  created_at: string
  updated_at: string
  // Joined data
  user?: {
    email: string
    full_name?: string
  }
}

export interface TeamInvite {
  id: string
  organization_id: string
  email: string
  role: Exclude<MemberRole, 'owner'>
  token: string
  invited_by?: string
  expires_at: string
  accepted_at?: string
  created_at: string
  // Joined data
  inviter?: {
    email: string
    full_name?: string
  }
  organization?: {
    name: string
  }
}

export interface User {
  id: string
  org_id: string
  email: string
  role: 'admin' | 'member'
  created_at: string
}

export interface HiringState {
  id: string
  org_id: string
  state_code: string
}

export interface HiringTool {
  id: string
  org_id: string
  tool_name: string
  tool_type: 'ats' | 'screening' | 'assessment' | 'interview' | 'other'
  usage_description: string
}

export interface Audit {
  id: string
  org_id: string
  created_at: string
  risk_score: number
  status: 'draft' | 'completed'
}

export interface AuditFinding {
  id: string
  audit_id: string
  state_code: string
  finding_type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  remediation: string
}

export interface Document {
  id: string
  org_id: string
  doc_type: 'disclosure' | 'consent' | 'policy' | 'assessment'
  title: string
  content: string
  version: number
  created_at: string
}

export interface ConsentRecord {
  id: string
  org_id: string
  candidate_email: string
  candidate_name: string
  disclosure_date: string
  consent_date: string | null
  document_id: string
}

export interface TrainingCompletion {
  id: string
  user_id: string
  course_id: string
  completed_at: string
  score: number
  certificate_url: string | null
}

// Training Platform types
export type TrainingTrack = 'recruiter' | 'manager' | 'admin' | 'executive'
export type TrainingStatus = 'pending' | 'in_progress' | 'completed'

export interface TrainingAssignment {
  id: string
  org_id: string
  user_email: string
  user_name: string
  track: TrainingTrack
  assigned_at: string
  assigned_by?: string
  status: TrainingStatus
  completed_at?: string
  certificate_id?: string
  magic_token: string
  token_expires_at: string
  created_at: string
  updated_at: string
}

export interface TrainingProgress {
  id: string
  assignment_id: string
  section_number: number
  started_at: string
  completed_at?: string
  video_watched_seconds: number
  video_total_seconds: number
  created_at: string
  updated_at: string
}

export interface TrainingQuizAttempt {
  id: string
  assignment_id: string
  section_number: number
  answers: Record<string, number>
  score: number
  passed: boolean
  attempted_at: string
  created_at: string
}

export interface TrainingCertificate {
  id: string
  assignment_id: string
  certificate_number: string
  issued_at: string
  expires_at: string
  pdf_url?: string
  created_at: string
}

// Merge.dev ATS Integration types

export interface ATSIntegration {
  id: string
  org_id: string
  merge_account_token: string
  integration_slug: string
  integration_name: string
  status: 'active' | 'paused' | 'disconnected' | 'error'
  last_sync_at: string | null
  sync_cursor: string | null
  sync_error: string | null
  settings: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface SyncedCandidate {
  id: string
  org_id: string
  integration_id: string
  merge_id: string
  remote_id: string | null
  email: string | null
  first_name: string | null
  last_name: string | null
  phone_numbers: { value: string; type: string | null }[]
  locations: { raw: string; city?: string; state?: string; country?: string }[]
  tags: string[]
  is_regulated: boolean
  regulated_jurisdictions: string[]
  consent_status: 'unknown' | 'pending' | 'granted' | 'denied' | 'not_required'
  consent_granted_at: string | null
  disclosure_sent_at: string | null
  raw_data: Record<string, unknown>
  synced_at: string
  created_at: string
  updated_at: string
}

export interface SyncedApplication {
  id: string
  org_id: string
  integration_id: string
  candidate_id: string
  merge_id: string
  remote_id: string | null
  job_merge_id: string | null
  job_name: string | null
  job_offices: string[]
  current_stage: string | null
  current_stage_id: string | null
  applied_at: string | null
  rejected_at: string | null
  is_ai_screened: boolean
  ai_screening_stage: string | null
  compliance_flags: ComplianceFlag[]
  raw_data: Record<string, unknown>
  synced_at: string
  created_at: string
  updated_at: string
}

export interface ComplianceFlag {
  type: 'missing_consent' | 'missing_disclosure' | 'ai_screen_without_consent' | 'regulated_jurisdiction'
  severity: 'info' | 'warning' | 'error' | 'critical'
  message: string
  detected_at: string
}

export interface ATSAuditEvent {
  id: string
  org_id: string
  integration_id: string | null
  candidate_id: string | null
  application_id: string | null
  event_type: string
  event_source: string
  description: string
  severity: 'info' | 'warning' | 'error' | 'critical'
  metadata: Record<string, unknown>
  occurred_at: string
  created_at: string
}

// App types

export interface StateRequirement {
  code: string
  name: string
  law: string
  effective: string
  requirements: string[]
  penalties: string
}

export interface AITool {
  id: string
  name: string
  category: string
  description: string
  commonUses: string[]
}

export interface AuditQuestion {
  id: string
  question: string
  type: 'select' | 'multiselect' | 'text' | 'boolean'
  options?: string[]
  stateRelevance?: string[]
}

export interface RiskFactor {
  factor: string
  weight: number
  stateCode?: string
}

// Compliance document types
export interface ComplianceDocument {
  id: string
  org_id: string
  document_type: 'bias_audit' | 'impact_assessment' | 'disclosure' | 'training_cert' | 'adverse_policy'
  title: string
  description?: string
  jurisdiction?: string
  issued_at: string
  expires_at: string
  status: 'active' | 'expiring_soon' | 'expired' | 'renewed'
  renewed_from_id?: string
  file_url?: string
  file_name?: string
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface RenewalNotification {
  id: string
  document_id: string
  notification_type: 'day_90' | 'day_60' | 'day_30' | 'day_7' | 'day_0' | 'day_-30'
  sent_at: string
  email_to: string
  email_message_id?: string
  opened_at?: string
  clicked_at?: string
}

export const DOCUMENT_TYPE_LABELS: Record<ComplianceDocument['document_type'], string> = {
  bias_audit: 'Bias Audit',
  impact_assessment: 'Impact Assessment',
  disclosure: 'Candidate Disclosure',
  training_cert: 'Training Certificate',
  adverse_policy: 'Adverse Action Policy',
}

export const DOCUMENT_VALIDITY_YEARS: Record<ComplianceDocument['document_type'], number> = {
  bias_audit: 1,
  impact_assessment: 1,
  disclosure: 1,
  training_cert: 1,
  adverse_policy: 1,
}
