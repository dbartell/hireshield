"use server"

import { createClient } from '@/lib/supabase/server'
import { getUpcomingRenewals } from './compliance-documents'

export async function getDashboardData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const orgId = user.id

  // Check if user is super admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_super_admin')
    .eq('id', user.id)
    .single()
  
  const isSuperAdmin = profile?.is_super_admin || false

  // Check for lead data from scorecard (for pre-population)
  const { data: leadData } = await supabase
    .from('leads')
    .select('states, tools, risk_score')
    .eq('email', user.email)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // Get organization
  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', orgId)
    .single()

  // Get latest audit
  const { data: latestAudit } = await supabase
    .from('audits')
    .select('*, audit_findings(*)')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // Get all audits count
  const { count: auditsCount } = await supabase
    .from('audits')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', orgId)

  // Get documents count
  const { count: documentsCount } = await supabase
    .from('documents')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', orgId)

  // Get consent records count (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const { count: consentCount } = await supabase
    .from('consent_records')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', orgId)
    .gte('disclosure_date', thirtyDaysAgo.toISOString())

  // Get training completions
  const { data: trainingCompletions } = await supabase
    .from('training_completions')
    .select('*')
    .eq('user_id', user.id)

  // Get hiring states (defensive - table may not exist yet)
  let hiringStates: { state_code: string }[] | null = null
  try {
    const { data } = await supabase
      .from('hiring_states')
      .select('state_code')
      .eq('org_id', orgId)
    hiringStates = data
  } catch {
    hiringStates = []
  }

  // Get hiring tools (defensive - table may not exist yet)
  let toolsCount: number | null = 0
  try {
    const { count } = await supabase
      .from('hiring_tools')
      .select('*', { count: 'exact', head: true })
      .eq('org_id', orgId)
    toolsCount = count
  } catch {
    toolsCount = 0
  }

  // Get recent documents
  const { data: recentDocs } = await supabase
    .from('documents')
    .select('id, title, created_at')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false })
    .limit(3)

  // Calculate compliance score based on various factors
  const totalCourses = 5
  const completedCourses = trainingCompletions?.length || 0
  const hasAudit = !!latestAudit
  const docsGenerated = documentsCount || 0

  let complianceScore = 0
  if (hasAudit) complianceScore += 30
  complianceScore += Math.min(30, (docsGenerated / 5) * 30)
  complianceScore += (completedCourses / totalCourses) * 40
  complianceScore = Math.round(complianceScore)

  // Check for expired training certs
  const now = new Date()
  const hasExpiredTraining = trainingCompletions?.some(tc => 
    tc.expires_at && new Date(tc.expires_at) < now
  ) || false

  // Use lead data states if no hiring states configured
  const effectiveStates = hiringStates?.length 
    ? hiringStates.map(s => s.state_code)
    : (leadData?.states || [])

  // Get upcoming renewals for dashboard widget
  const { renewals: upcomingRenewals } = await getUpcomingRenewals()

  return {
    organization: org,
    complianceScore,
    latestAudit,
    lastAuditDate: latestAudit?.completed_at || null,
    auditsCount: auditsCount || 0,
    documentsCount: documentsCount || 0,
    consentCount: consentCount || 0,
    trainingCompleted: completedCourses,
    trainingTotal: totalCourses,
    trainingExpired: hasExpiredTraining,
    hiringStates: effectiveStates,
    toolsCount: toolsCount || 0,
    recentDocs,
    leadData: leadData || null,
    userName: user.user_metadata?.full_name || user.email?.split('@')[0] || null,
    upcomingRenewals: upcomingRenewals || [],
    isSuperAdmin,
  }
}
