import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/integrations/merge/candidates
 * 
 * List synced candidates with pagination and filtering.
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
    const offset = (page - 1) * limit

    // Filters
    const regulated = searchParams.get('regulated')
    const consentStatus = searchParams.get('consent_status')
    const jurisdiction = searchParams.get('jurisdiction')
    const search = searchParams.get('search')
    const integrationId = searchParams.get('integration_id')

    // Build query
    let query = supabase
      .from('synced_candidates')
      .select('*, synced_applications(count)', { count: 'exact' })
      .eq('org_id', user.id)
      .order('synced_at', { ascending: false })

    // Apply filters
    if (regulated === 'true') {
      query = query.eq('is_regulated', true)
    } else if (regulated === 'false') {
      query = query.eq('is_regulated', false)
    }

    if (consentStatus) {
      query = query.eq('consent_status', consentStatus)
    }

    if (jurisdiction) {
      query = query.contains('regulated_jurisdictions', [jurisdiction])
    }

    if (integrationId) {
      query = query.eq('integration_id', integrationId)
    }

    if (search) {
      query = query.or(
        `email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`
      )
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: candidates, count, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch candidates' },
        { status: 500 }
      )
    }

    // Get summary stats
    const { data: stats } = await supabase
      .from('synced_candidates')
      .select('is_regulated, consent_status')
      .eq('org_id', user.id)

    const summary = {
      total: stats?.length || 0,
      regulated: stats?.filter(c => c.is_regulated).length || 0,
      missingConsent: stats?.filter(c => c.is_regulated && c.consent_status === 'unknown').length || 0,
      consentGranted: stats?.filter(c => c.consent_status === 'granted').length || 0,
      consentDenied: stats?.filter(c => c.consent_status === 'denied').length || 0,
    }

    return NextResponse.json({
      candidates: candidates || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
      summary,
    })
  } catch (error) {
    console.error('Candidates fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch candidates' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/integrations/merge/candidates
 * 
 * Update a candidate's consent status or other compliance fields.
 */
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { candidateId, consentStatus, disclosureSentAt } = await req.json()

    if (!candidateId) {
      return NextResponse.json(
        { error: 'candidateId is required' },
        { status: 400 }
      )
    }

    // Verify ownership
    const { data: candidate } = await supabase
      .from('synced_candidates')
      .select('id, org_id')
      .eq('id', candidateId)
      .eq('org_id', user.id)
      .single()

    if (!candidate) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      )
    }

    // Build update object
    const updates: Record<string, unknown> = {}
    
    if (consentStatus) {
      updates.consent_status = consentStatus
      if (consentStatus === 'granted') {
        updates.consent_granted_at = new Date().toISOString()
      }
    }
    
    if (disclosureSentAt) {
      updates.disclosure_sent_at = disclosureSentAt
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No updates provided' },
        { status: 400 }
      )
    }

    const { data: updated, error } = await supabase
      .from('synced_candidates')
      .update(updates)
      .eq('id', candidateId)
      .select()
      .single()

    if (error) {
      console.error('Update error:', error)
      return NextResponse.json(
        { error: 'Failed to update candidate' },
        { status: 500 }
      )
    }

    // Log the update
    await supabase.from('ats_audit_events').insert({
      org_id: user.id,
      candidate_id: candidateId,
      event_type: consentStatus ? 'consent_detected' : 'disclosure_sent',
      event_source: 'manual_update',
      description: consentStatus
        ? `Consent status updated to: ${consentStatus}`
        : 'Disclosure sent date recorded',
      severity: 'info',
      metadata: updates,
      occurred_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, candidate: updated })
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json(
      { error: 'Failed to update candidate' },
      { status: 500 }
    )
  }
}
