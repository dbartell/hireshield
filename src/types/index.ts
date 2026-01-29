// Database types

export interface Organization {
  id: string
  name: string
  size: 'small' | 'medium' | 'large' | 'enterprise'
  industry: string
  created_at: string
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
