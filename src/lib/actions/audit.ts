"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

interface AuditData {
  states: string[]
  tools: string[]
  usages: string[]
  riskScore: number
  findings: {
    state: string
    requirement: string
    status: 'compliant' | 'at-risk' | 'non-compliant'
    action: string
  }[]
}

export async function saveAudit(data: AuditData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const orgId = user.id

  // Create the audit
  const { data: audit, error: auditError } = await supabase
    .from('audits')
    .insert({
      org_id: orgId,
      risk_score: data.riskScore,
      status: 'completed',
    })
    .select()
    .single()

  if (auditError) {
    console.error('Error creating audit:', auditError)
    return { error: auditError.message }
  }

  // Save findings
  if (data.findings.length > 0) {
    const findingsToInsert = data.findings.map(f => ({
      audit_id: audit.id,
      state_code: f.state.substring(0, 2).toUpperCase(),
      finding_type: f.requirement,
      severity: f.status === 'non-compliant' ? 'high' : f.status === 'at-risk' ? 'medium' : 'low',
      remediation: f.action,
    }))

    const { error: findingsError } = await supabase
      .from('audit_findings')
      .insert(findingsToInsert)

    if (findingsError) {
      console.error('Error saving findings:', findingsError)
    }
  }

  // Update hiring states
  await supabase.from('hiring_states').delete().eq('org_id', orgId)
  
  if (data.states.length > 0) {
    const statesToInsert = data.states.map(code => ({
      org_id: orgId,
      state_code: code,
    }))

    await supabase.from('hiring_states').insert(statesToInsert)
  }

  // Update hiring tools
  await supabase.from('hiring_tools').delete().eq('org_id', orgId)
  
  if (data.tools.length > 0) {
    const toolsToInsert = data.tools.map(tool => ({
      org_id: orgId,
      tool_name: tool,
      tool_type: 'other' as const,
      usage_description: data.usages.join(', '),
    }))

    await supabase.from('hiring_tools').insert(toolsToInsert)
  }

  revalidatePath('/dashboard')
  revalidatePath('/audit')

  return { audit }
}

export async function getAuditHistory() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data: audits } = await supabase
    .from('audits')
    .select(`
      *,
      audit_findings (*)
    `)
    .eq('org_id', user.id)
    .order('created_at', { ascending: false })

  return audits || []
}

export async function getLatestAudit() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: audit } = await supabase
    .from('audits')
    .select(`
      *,
      audit_findings (*)
    `)
    .eq('org_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return audit
}

export async function getHiringStatesAndTools() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { states: [], tools: [] }
  }

  const [statesRes, toolsRes] = await Promise.all([
    supabase.from('hiring_states').select('state_code').eq('org_id', user.id),
    supabase.from('hiring_tools').select('*').eq('org_id', user.id),
  ])

  return {
    states: statesRes.data?.map(s => s.state_code) || [],
    tools: toolsRes.data || [],
  }
}
