"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface ConsentRecord {
  id: string
  org_id: string
  candidate_email: string
  candidate_name: string
  position?: string
  disclosure_date: string
  consent_date: string | null
  status: 'pending' | 'consented' | 'declined'
  document_id?: string
}

export async function getConsentRecords(filters?: {
  status?: string
  search?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  let query = supabase
    .from('consent_records')
    .select('*')
    .eq('org_id', user.id)
    .order('disclosure_date', { ascending: false })

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }

  if (filters?.search) {
    query = query.or(`candidate_name.ilike.%${filters.search}%,candidate_email.ilike.%${filters.search}%`)
  }

  const { data } = await query

  return data || []
}

export async function createConsentRecord(record: {
  candidate_email: string
  candidate_name: string
  position?: string
  disclosure_date: string
  consent_date?: string | null
  status: 'pending' | 'consented' | 'declined'
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('consent_records')
    .insert({
      org_id: user.id,
      candidate_email: record.candidate_email,
      candidate_name: record.candidate_name,
      position: record.position || null,
      disclosure_date: record.disclosure_date,
      consent_date: record.consent_date || null,
      status: record.status,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/consent')
  revalidatePath('/dashboard')

  return { record: data }
}

export async function updateConsentRecord(
  id: string,
  updates: Partial<{
    candidate_email: string
    candidate_name: string
    position: string
    disclosure_date: string
    consent_date: string | null
    status: 'pending' | 'consented' | 'declined'
  }>
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('consent_records')
    .update(updates)
    .eq('id', id)
    .eq('org_id', user.id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/consent')
  revalidatePath('/dashboard')

  return { record: data }
}

export async function deleteConsentRecord(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('consent_records')
    .delete()
    .eq('id', id)
    .eq('org_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/consent')
  revalidatePath('/dashboard')

  return { success: true }
}

export async function bulkImportConsent(records: {
  candidate_email: string
  candidate_name: string
  position?: string
  disclosure_date: string
  consent_date?: string
  status: string
}[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const recordsToInsert = records.map(r => ({
    org_id: user.id,
    candidate_email: r.candidate_email,
    candidate_name: r.candidate_name,
    position: r.position || null,
    disclosure_date: r.disclosure_date,
    consent_date: r.consent_date || null,
    status: r.status as 'pending' | 'consented' | 'declined',
  }))

  const { data, error } = await supabase
    .from('consent_records')
    .insert(recordsToInsert)
    .select()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/consent')
  revalidatePath('/dashboard')

  return { records: data, count: data?.length || 0 }
}

export async function getConsentStats() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { total: 0, consented: 0, pending: 0, declined: 0 }
  }

  const [total, consented, pending, declined] = await Promise.all([
    supabase.from('consent_records').select('*', { count: 'exact', head: true }).eq('org_id', user.id),
    supabase.from('consent_records').select('*', { count: 'exact', head: true }).eq('org_id', user.id).eq('status', 'consented'),
    supabase.from('consent_records').select('*', { count: 'exact', head: true }).eq('org_id', user.id).eq('status', 'pending'),
    supabase.from('consent_records').select('*', { count: 'exact', head: true }).eq('org_id', user.id).eq('status', 'declined'),
  ])

  return {
    total: total.count || 0,
    consented: consented.count || 0,
    pending: pending.count || 0,
    declined: declined.count || 0,
  }
}
