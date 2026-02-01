"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Types
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

// Get remediation items for an org
export async function getRemediationItems(stateCode?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  let query = supabase
    .from('remediation_items')
    .select('*')
    .eq('org_id', user.id)
    .order('created_at', { ascending: true })

  if (stateCode) {
    query = query.eq('state_code', stateCode)
  }

  const { data } = await query
  return data || []
}

// Initialize remediation items for a state after audit
export async function initializeRemediation(stateCode: string, auditId?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const checklist = stateChecklists[stateCode]
  if (!checklist) return { error: 'Unknown state' }

  // Check for existing items
  const { data: existing } = await supabase
    .from('remediation_items')
    .select('item_key')
    .eq('org_id', user.id)
    .eq('state_code', stateCode)

  const existingKeys = new Set(existing?.map(e => e.item_key) || [])

  // Only insert missing items
  const newItems = checklist
    .filter(item => !existingKeys.has(item.key))
    .map(item => ({
      org_id: user.id,
      audit_id: auditId || null,
      state_code: stateCode,
      item_key: item.key,
      item_label: item.label,
      item_description: item.description,
      status: 'incomplete',
    }))

  if (newItems.length > 0) {
    const { error } = await supabase
      .from('remediation_items')
      .insert(newItems)

    if (error) {
      console.error('Error initializing remediation:', error)
      return { error: error.message }
    }
  }

  revalidatePath('/audit/remediation')
  return { success: true }
}

// Update remediation item status
export async function updateRemediationStatus(
  itemId: string, 
  status: 'incomplete' | 'in_progress' | 'complete',
  linkedDocumentId?: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const updateData: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  }

  if (status === 'complete') {
    updateData.completed_at = new Date().toISOString()
    updateData.completed_by = user.id
  }

  if (linkedDocumentId) {
    updateData.linked_document_id = linkedDocumentId
  }

  const { error } = await supabase
    .from('remediation_items')
    .update(updateData)
    .eq('id', itemId)
    .eq('org_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/audit/remediation')
  revalidatePath('/dashboard')
  return { success: true }
}

// Get hiring states from audit
export async function getHiringStates(): Promise<string[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data } = await supabase
    .from('hiring_states')
    .select('state_code')
    .eq('org_id', user.id)

  return data?.map(s => s.state_code) || []
}

// Impact Assessment CRUD
export async function getImpactAssessments() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data } = await supabase
    .from('impact_assessments')
    .select('*')
    .eq('org_id', user.id)
    .order('created_at', { ascending: false })

  return data || []
}

export async function getImpactAssessment(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from('impact_assessments')
    .select('*')
    .eq('id', id)
    .eq('org_id', user.id)
    .single()

  return data
}

export async function saveImpactAssessment(assessment: Partial<ImpactAssessment>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const isNew = !assessment.id

  if (isNew) {
    const { data, error } = await supabase
      .from('impact_assessments')
      .insert({
        ...assessment,
        org_id: user.id,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) return { error: error.message }
    
    revalidatePath('/documents/impact-assessment')
    return { assessment: data }
  } else {
    const { data, error } = await supabase
      .from('impact_assessments')
      .update({
        ...assessment,
        updated_at: new Date().toISOString(),
      })
      .eq('id', assessment.id)
      .eq('org_id', user.id)
      .select()
      .single()

    if (error) return { error: error.message }
    
    revalidatePath('/documents/impact-assessment')
    return { assessment: data }
  }
}

export async function completeImpactAssessment(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  // Set expiry to 1 year from now
  const expiresAt = new Date()
  expiresAt.setFullYear(expiresAt.getFullYear() + 1)

  const { error } = await supabase
    .from('impact_assessments')
    .update({
      status: 'complete',
      completed_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('org_id', user.id)

  if (error) return { error: error.message }

  // Also update the remediation item
  await supabase
    .from('remediation_items')
    .update({
      status: 'complete',
      completed_at: new Date().toISOString(),
      completed_by: user.id,
    })
    .eq('org_id', user.id)
    .eq('item_key', 'impact_assessment')

  revalidatePath('/documents/impact-assessment')
  revalidatePath('/audit/remediation')
  return { success: true }
}

// Adverse Decision Settings
export async function getAdverseDecisionSettings(): Promise<AdverseDecisionSettings | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from('adverse_decision_settings')
    .select('*')
    .eq('org_id', user.id)
    .single()

  return data
}

export async function saveAdverseDecisionSettings(settings: Partial<AdverseDecisionSettings>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { data: existing } = await supabase
    .from('adverse_decision_settings')
    .select('id')
    .eq('org_id', user.id)
    .single()

  if (existing) {
    const { error } = await supabase
      .from('adverse_decision_settings')
      .update({
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .eq('org_id', user.id)

    if (error) return { error: error.message }
  } else {
    const { error } = await supabase
      .from('adverse_decision_settings')
      .insert({
        ...settings,
        org_id: user.id,
      })

    if (error) return { error: error.message }
  }

  // Update remediation item
  await supabase
    .from('remediation_items')
    .update({
      status: 'complete',
      completed_at: new Date().toISOString(),
      completed_by: user.id,
    })
    .eq('org_id', user.id)
    .eq('item_key', 'adverse_decision')

  revalidatePath('/settings/adverse-decisions')
  revalidatePath('/audit/remediation')
  return { success: true }
}

// Consent Settings
export async function getConsentSettings(): Promise<ConsentSettings | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from('consent_settings')
    .select('*')
    .eq('org_id', user.id)
    .single()

  return data
}

export async function saveConsentSettings(settings: Partial<ConsentSettings>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { data: existing } = await supabase
    .from('consent_settings')
    .select('id')
    .eq('org_id', user.id)
    .single()

  if (existing) {
    const { error } = await supabase
      .from('consent_settings')
      .update({
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .eq('org_id', user.id)

    if (error) return { error: error.message }
  } else {
    const { error } = await supabase
      .from('consent_settings')
      .insert({
        ...settings,
        org_id: user.id,
      })

    if (error) return { error: error.message }
  }

  // Update remediation item if onboarding completed
  if (settings.onboarding_completed) {
    await supabase
      .from('remediation_items')
      .update({
        status: 'complete',
        completed_at: new Date().toISOString(),
        completed_by: user.id,
      })
      .eq('org_id', user.id)
      .eq('item_key', 'consent_tracking')
  }

  revalidatePath('/consent')
  revalidatePath('/audit/remediation')
  return { success: true }
}

// Compliance Verification
export async function getComplianceVerification(stateCode: string): Promise<ComplianceVerification | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from('compliance_verifications')
    .select('*')
    .eq('org_id', user.id)
    .eq('state_code', stateCode)
    .single()

  return data
}

export async function saveComplianceVerification(stateCode: string, verification: Partial<ComplianceVerification>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { data: existing } = await supabase
    .from('compliance_verifications')
    .select('id')
    .eq('org_id', user.id)
    .eq('state_code', stateCode)
    .single()

  // Check if all confirmations are true to mark as compliant
  const checklist = stateChecklists[stateCode] || []
  const requiredConfirmations = checklist.map(item => `confirmed_${item.key.replace('_', '')}`)
  
  const allConfirmed = Object.entries(verification)
    .filter(([key]) => key.startsWith('confirmed_'))
    .every(([, value]) => value === true)

  if (allConfirmed) {
    const expiresAt = new Date()
    expiresAt.setFullYear(expiresAt.getFullYear() + 1)
    verification.is_compliant = true
    verification.compliant_at = new Date().toISOString()
    verification.expires_at = expiresAt.toISOString()
  }

  if (existing) {
    const { error } = await supabase
      .from('compliance_verifications')
      .update({
        ...verification,
        verified_by: user.id,
        updated_at: new Date().toISOString(),
      })
      .eq('org_id', user.id)
      .eq('state_code', stateCode)

    if (error) return { error: error.message }
  } else {
    const { error } = await supabase
      .from('compliance_verifications')
      .insert({
        ...verification,
        org_id: user.id,
        state_code: stateCode,
        verified_by: user.id,
      })

    if (error) return { error: error.message }
  }

  revalidatePath('/audit/remediation')
  revalidatePath('/dashboard')
  return { success: true }
}

// Get overall compliance status
export async function getComplianceStatus() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Get hiring states
  const { data: states } = await supabase
    .from('hiring_states')
    .select('state_code')
    .eq('org_id', user.id)

  const regulatedStates = ['IL', 'CO', 'CA', 'NYC']
  const userRegulatedStates = states?.filter(s => regulatedStates.includes(s.state_code)) || []

  // Get remediation items
  const { data: remediationItems } = await supabase
    .from('remediation_items')
    .select('*')
    .eq('org_id', user.id)

  // Get verifications
  const { data: verifications } = await supabase
    .from('compliance_verifications')
    .select('*')
    .eq('org_id', user.id)

  // Calculate per-state progress
  const stateProgress = userRegulatedStates.map(({ state_code }) => {
    const items = remediationItems?.filter(i => i.state_code === state_code) || []
    const completed = items.filter(i => i.status === 'complete').length
    const total = items.length || stateChecklists[state_code]?.length || 0
    const verification = verifications?.find(v => v.state_code === state_code)

    return {
      state_code,
      completed,
      total,
      progress: total > 0 ? Math.round((completed / total) * 100) : 0,
      is_compliant: verification?.is_compliant || false,
      expires_at: verification?.expires_at,
    }
  })

  return {
    states: userRegulatedStates.map(s => s.state_code),
    stateProgress,
    totalItems: remediationItems?.length || 0,
    completedItems: remediationItems?.filter(i => i.status === 'complete').length || 0,
    overallProgress: remediationItems?.length 
      ? Math.round((remediationItems.filter(i => i.status === 'complete').length / remediationItems.length) * 100)
      : 0,
  }
}

// ============================================
// HIRING STATES MANAGEMENT
// ============================================

export interface HiringStateWithProgress {
  state_code: string
  state_name: string
  is_regulated: boolean
  completed: number
  total: number
  is_compliant: boolean
}

// Add a hiring state and auto-create remediation items if regulated
export async function addHiringState(stateCode: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  // Check if already exists
  const { data: existing } = await supabase
    .from('hiring_states')
    .select('id')
    .eq('org_id', user.id)
    .eq('state_code', stateCode)
    .single()

  if (existing) {
    return { error: 'State already added' }
  }

  // Add the state
  const { error } = await supabase
    .from('hiring_states')
    .insert({
      org_id: user.id,
      state_code: stateCode,
    })

  if (error) return { error: error.message }

  // If it's a regulated state, initialize remediation items
  const regulatedStates = ['IL', 'CO', 'CA', 'NYC']
  if (regulatedStates.includes(stateCode)) {
    await initializeRemediation(stateCode)
  }

  revalidatePath('/states')
  revalidatePath('/dashboard')
  revalidatePath('/audit/remediation')
  return { success: true }
}

// Remove a hiring state (soft-remove by deleting from hiring_states, but keeping remediation records)
export async function removeHiringState(stateCode: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  // Just remove from hiring_states - remediation items remain for historical record
  const { error } = await supabase
    .from('hiring_states')
    .delete()
    .eq('org_id', user.id)
    .eq('state_code', stateCode)

  if (error) return { error: error.message }

  revalidatePath('/states')
  revalidatePath('/dashboard')
  revalidatePath('/audit/remediation')
  return { success: true }
}

// Get detailed state progress for a specific state
export async function getStateProgress(stateCode: string): Promise<HiringStateWithProgress | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const regulatedStates = ['IL', 'CO', 'CA', 'NYC']
  const isRegulated = regulatedStates.includes(stateCode)

  // Get state name from static data
  const stateNames: Record<string, string> = {
    AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
    CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
    HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
    KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
    MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
    MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
    NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
    OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
    SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
    VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
    DC: "Washington D.C.", NYC: "New York City",
  }

  if (!isRegulated) {
    return {
      state_code: stateCode,
      state_name: stateNames[stateCode] || stateCode,
      is_regulated: false,
      completed: 0,
      total: 0,
      is_compliant: true, // Non-regulated states are automatically compliant
    }
  }

  // Get remediation items for this state
  const { data: items } = await supabase
    .from('remediation_items')
    .select('*')
    .eq('org_id', user.id)
    .eq('state_code', stateCode)

  // Get compliance verification
  const { data: verification } = await supabase
    .from('compliance_verifications')
    .select('is_compliant')
    .eq('org_id', user.id)
    .eq('state_code', stateCode)
    .single()

  const completed = items?.filter(i => i.status === 'complete').length || 0
  const total = items?.length || stateChecklists[stateCode]?.length || 0

  return {
    state_code: stateCode,
    state_name: stateNames[stateCode] || stateCode,
    is_regulated: true,
    completed,
    total,
    is_compliant: verification?.is_compliant || false,
  }
}

// Get all hiring states with progress info
export async function getHiringStatesWithProgress(): Promise<HiringStateWithProgress[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  // Get all hiring states
  const { data: states } = await supabase
    .from('hiring_states')
    .select('state_code')
    .eq('org_id', user.id)
    .order('state_code')

  if (!states || states.length === 0) return []

  // Get all remediation items
  const { data: items } = await supabase
    .from('remediation_items')
    .select('*')
    .eq('org_id', user.id)

  // Get all verifications
  const { data: verifications } = await supabase
    .from('compliance_verifications')
    .select('state_code, is_compliant')
    .eq('org_id', user.id)

  const regulatedStates = ['IL', 'CO', 'CA', 'NYC']
  const stateNames: Record<string, string> = {
    AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
    CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
    HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
    KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
    MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
    MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
    NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
    OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
    SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
    VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
    DC: "Washington D.C.", NYC: "New York City",
  }

  return states.map(({ state_code }) => {
    const isRegulated = regulatedStates.includes(state_code)
    const stateItems = items?.filter(i => i.state_code === state_code) || []
    const verification = verifications?.find(v => v.state_code === state_code)
    
    const completed = stateItems.filter(i => i.status === 'complete').length
    const total = stateItems.length || (isRegulated ? stateChecklists[state_code]?.length || 0 : 0)

    return {
      state_code,
      state_name: stateNames[state_code] || state_code,
      is_regulated: isRegulated,
      completed,
      total,
      is_compliant: isRegulated ? (verification?.is_compliant || false) : true,
    }
  })
}

// Check if state has existing compliance work (for removal warning)
export async function stateHasComplianceWork(stateCode: string): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return false

  const { data: items } = await supabase
    .from('remediation_items')
    .select('id')
    .eq('org_id', user.id)
    .eq('state_code', stateCode)
    .limit(1)

  return (items?.length || 0) > 0
}
