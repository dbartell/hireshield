"use server"

import { createClient } from '@/lib/supabase/server'

export async function getDashboardData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const orgId = user.id

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

  // Get hiring states
  const { data: hiringStates } = await supabase
    .from('hiring_states')
    .select('state_code')
    .eq('org_id', orgId)

  // Get hiring tools
  const { count: toolsCount } = await supabase
    .from('hiring_tools')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', orgId)

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

  return {
    organization: org,
    complianceScore,
    latestAudit,
    auditsCount: auditsCount || 0,
    documentsCount: documentsCount || 0,
    consentCount: consentCount || 0,
    trainingCompleted: completedCourses,
    trainingTotal: totalCourses,
    hiringStates: hiringStates?.map(s => s.state_code) || [],
    toolsCount: toolsCount || 0,
    recentDocs,
  }
}
