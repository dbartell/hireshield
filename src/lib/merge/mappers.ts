/**
 * Merge.dev Data Mappers
 * 
 * Transform Merge.dev API responses to HireShield database format.
 */

import type {
  MergeCandidate,
  MergeApplication,
} from './client'
import { detectJurisdictions, checkConsentFromTags } from './compliance-engine'

// ============================================
// DATABASE TYPES (matching migration schema)
// ============================================

export interface SyncedCandidate {
  id?: string
  org_id: string
  integration_id: string
  merge_id: string
  remote_id: string | null
  email: string | null
  first_name: string | null
  last_name: string | null
  phone_numbers: PhoneNumber[]
  locations: CandidateLocation[]
  tags: string[]
  is_regulated: boolean
  regulated_jurisdictions: string[]
  consent_status: ConsentStatus
  consent_granted_at: string | null
  disclosure_sent_at: string | null
  raw_data: MergeCandidate
  synced_at: string
}

export interface SyncedApplication {
  id?: string
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
  raw_data: MergeApplication
  synced_at: string
}

export interface ATSAuditEvent {
  id?: string
  org_id: string
  integration_id?: string
  candidate_id?: string
  application_id?: string
  event_type: ATSEventType
  event_source: string
  description: string
  severity: EventSeverity
  metadata: Record<string, unknown>
  occurred_at: string
}

// ============================================
// ENUMS & TYPES
// ============================================

export type ConsentStatus = 'unknown' | 'pending' | 'granted' | 'denied' | 'not_required'

export type ATSEventType = 
  | 'ai_screen'
  | 'consent_detected'
  | 'disclosure_sent'
  | 'stage_change'
  | 'rejection'
  | 'candidate_created'
  | 'application_created'
  | 'sync_completed'
  | 'compliance_alert'

export type EventSeverity = 'info' | 'warning' | 'error' | 'critical'

export interface PhoneNumber {
  value: string
  type: string | null
}

export interface CandidateLocation {
  raw: string
  city?: string
  state?: string
  country?: string
}

export interface ComplianceFlag {
  type: 'missing_consent' | 'missing_disclosure' | 'ai_screen_without_consent' | 'regulated_jurisdiction'
  severity: EventSeverity
  message: string
  detected_at: string
}

// ============================================
// MAPPERS
// ============================================

/**
 * Map a Merge candidate to our synced_candidates format.
 */
export function mapMergeCandidate(
  candidate: MergeCandidate,
  orgId: string,
  integrationId: string
): SyncedCandidate {
  // Parse locations
  const locations: CandidateLocation[] = (candidate.locations || []).map(loc => ({
    raw: loc,
    ...parseLocation(loc),
  }))

  // Detect regulated jurisdictions
  const jurisdictions = detectJurisdictions(locations)
  const isRegulated = jurisdictions.length > 0

  // Check for consent indicators in tags
  const consentInfo = checkConsentFromTags(candidate.tags || [])

  // Extract primary email
  const primaryEmail = candidate.email_addresses?.find(
    e => e.email_address_type === 'PERSONAL' || e.email_address_type === 'WORK'
  )?.value || candidate.email_addresses?.[0]?.value || null

  return {
    org_id: orgId,
    integration_id: integrationId,
    merge_id: candidate.id,
    remote_id: candidate.remote_id,
    email: primaryEmail,
    first_name: candidate.first_name,
    last_name: candidate.last_name,
    phone_numbers: (candidate.phone_numbers || []).map(p => ({
      value: p.value,
      type: p.phone_number_type,
    })),
    locations,
    tags: candidate.tags || [],
    is_regulated: isRegulated,
    regulated_jurisdictions: jurisdictions,
    consent_status: consentInfo.status,
    consent_granted_at: consentInfo.grantedAt,
    disclosure_sent_at: consentInfo.disclosureSentAt,
    raw_data: candidate,
    synced_at: new Date().toISOString(),
  }
}

/**
 * Map a Merge application to our synced_applications format.
 */
export function mapMergeApplication(
  application: MergeApplication,
  orgId: string,
  integrationId: string,
  candidateDbId: string,
  jobInfo?: { name: string | null; offices: string[] },
  stageInfo?: { name: string | null; isAI: boolean }
): SyncedApplication {
  const flags: ComplianceFlag[] = []

  // Flag if in AI screening stage
  if (stageInfo?.isAI) {
    flags.push({
      type: 'ai_screen_without_consent',
      severity: 'warning',
      message: `Application is in AI screening stage: ${stageInfo.name}`,
      detected_at: new Date().toISOString(),
    })
  }

  return {
    org_id: orgId,
    integration_id: integrationId,
    candidate_id: candidateDbId,
    merge_id: application.id,
    remote_id: application.remote_id,
    job_merge_id: application.job,
    job_name: jobInfo?.name || null,
    job_offices: jobInfo?.offices || [],
    current_stage: stageInfo?.name || null,
    current_stage_id: application.current_stage,
    applied_at: application.applied_at,
    rejected_at: application.rejected_at,
    is_ai_screened: stageInfo?.isAI || false,
    ai_screening_stage: stageInfo?.isAI ? stageInfo.name : null,
    compliance_flags: flags,
    raw_data: application,
    synced_at: new Date().toISOString(),
  }
}

/**
 * Create an audit event for a candidate sync.
 */
export function createCandidateSyncEvent(
  candidate: SyncedCandidate,
  source: string = 'merge_sync'
): ATSAuditEvent {
  const severity: EventSeverity = candidate.is_regulated && candidate.consent_status === 'unknown'
    ? 'warning'
    : 'info'

  return {
    org_id: candidate.org_id,
    integration_id: candidate.integration_id,
    event_type: 'candidate_created',
    event_source: source,
    description: `Synced candidate: ${candidate.first_name} ${candidate.last_name} (${candidate.email})`,
    severity,
    metadata: {
      merge_id: candidate.merge_id,
      is_regulated: candidate.is_regulated,
      jurisdictions: candidate.regulated_jurisdictions,
      consent_status: candidate.consent_status,
    },
    occurred_at: new Date().toISOString(),
  }
}

/**
 * Create an audit event for an application sync.
 */
export function createApplicationSyncEvent(
  application: SyncedApplication,
  source: string = 'merge_sync'
): ATSAuditEvent {
  const hasFlags = application.compliance_flags.length > 0
  const severity: EventSeverity = hasFlags ? 'warning' : 'info'

  return {
    org_id: application.org_id,
    integration_id: application.integration_id,
    candidate_id: application.candidate_id,
    event_type: 'application_created',
    event_source: source,
    description: `Synced application for job: ${application.job_name || 'Unknown'}`,
    severity,
    metadata: {
      merge_id: application.merge_id,
      job_name: application.job_name,
      current_stage: application.current_stage,
      is_ai_screened: application.is_ai_screened,
      compliance_flags: application.compliance_flags,
    },
    occurred_at: new Date().toISOString(),
  }
}

/**
 * Create an audit event for a compliance alert.
 */
export function createComplianceAlertEvent(
  orgId: string,
  candidateId: string,
  applicationId: string | null,
  flag: ComplianceFlag,
  source: string = 'compliance_engine'
): ATSAuditEvent {
  return {
    org_id: orgId,
    candidate_id: candidateId,
    application_id: applicationId || undefined,
    event_type: 'compliance_alert',
    event_source: source,
    description: flag.message,
    severity: flag.severity,
    metadata: {
      flag_type: flag.type,
    },
    occurred_at: new Date().toISOString(),
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Parse a location string into components.
 * Examples: "New York, NY", "Denver, CO, USA", "California"
 */
function parseLocation(location: string): { city?: string; state?: string; country?: string } {
  const parts = location.split(',').map(p => p.trim())
  
  if (parts.length === 1) {
    // Could be just a state or city
    const stateCode = normalizeStateCode(parts[0])
    if (stateCode) {
      return { state: stateCode }
    }
    return { city: parts[0] }
  }
  
  if (parts.length === 2) {
    // City, State or City, Country
    const stateCode = normalizeStateCode(parts[1])
    if (stateCode) {
      return { city: parts[0], state: stateCode }
    }
    return { city: parts[0], country: parts[1] }
  }
  
  if (parts.length >= 3) {
    // City, State, Country
    const stateCode = normalizeStateCode(parts[1])
    return {
      city: parts[0],
      state: stateCode || parts[1],
      country: parts[2],
    }
  }
  
  return {}
}

/**
 * Normalize state names to standard codes.
 */
function normalizeStateCode(input: string): string | null {
  const normalized = input.toUpperCase().trim()
  
  const stateMap: Record<string, string> = {
    'NEW YORK': 'NY',
    'CALIFORNIA': 'CA',
    'COLORADO': 'CO',
    'ILLINOIS': 'IL',
    'TEXAS': 'TX',
    'FLORIDA': 'FL',
    'WASHINGTON': 'WA',
    'MASSACHUSETTS': 'MA',
    'MARYLAND': 'MD',
    'CONNECTICUT': 'CT',
    'NEW JERSEY': 'NJ',
    // Add more as needed
  }
  
  // If it's already a 2-letter code
  if (/^[A-Z]{2}$/.test(normalized)) {
    return normalized
  }
  
  return stateMap[normalized] || null
}

/**
 * Detect if a stage name indicates AI screening.
 */
export function isAIScreeningStage(stageName: string): boolean {
  const aiIndicators = [
    'ai screen',
    'automated screen',
    'hirevue',
    'pymetrics',
    'codility',
    'hackerrank',
    'video interview',
    'automated assessment',
    'skills assessment',
    'ai interview',
    'chatbot',
    'bot screen',
    'auto reject',
    'auto-reject',
  ]
  
  const lowerName = stageName.toLowerCase()
  return aiIndicators.some(indicator => lowerName.includes(indicator))
}

/**
 * Map job offices to jurisdiction codes.
 */
export function mapOfficesToJurisdictions(offices: string[]): string[] {
  const jurisdictions: Set<string> = new Set()
  
  for (const office of offices) {
    const lower = office.toLowerCase()
    
    if (lower.includes('new york') || lower.includes('nyc') || lower.includes('manhattan') || lower.includes('brooklyn')) {
      jurisdictions.add('nyc')
    }
    if (lower.includes('colorado') || lower.includes('denver') || lower.includes('boulder')) {
      jurisdictions.add('colorado')
    }
    if (lower.includes('illinois') || lower.includes('chicago')) {
      jurisdictions.add('illinois')
    }
    if (lower.includes('california') || lower.includes('san francisco') || lower.includes('los angeles') || lower.includes('san diego')) {
      jurisdictions.add('california')
    }
    if (lower.includes('maryland') || lower.includes('baltimore')) {
      jurisdictions.add('maryland')
    }
  }
  
  return Array.from(jurisdictions)
}
