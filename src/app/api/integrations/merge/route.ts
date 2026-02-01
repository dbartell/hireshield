import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createMergeClient } from '@/lib/merge/client'

/**
 * GET /api/integrations/merge
 * 
 * List all ATS integrations for the current organization.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: integrations, error } = await supabase
      .from('ats_integrations')
      .select('*')
      .eq('org_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch integrations' },
        { status: 500 }
      )
    }

    // Get sync stats for each integration
    const integrationsWithStats = await Promise.all(
      (integrations || []).map(async (integration) => {
        const [candidates, applications] = await Promise.all([
          supabase
            .from('synced_candidates')
            .select('id', { count: 'exact', head: true })
            .eq('integration_id', integration.id),
          supabase
            .from('synced_applications')
            .select('id', { count: 'exact', head: true })
            .eq('integration_id', integration.id),
        ])

        // Get compliance stats
        const { count: regulatedCount } = await supabase
          .from('synced_candidates')
          .select('id', { count: 'exact', head: true })
          .eq('integration_id', integration.id)
          .eq('is_regulated', true)

        const { count: missingConsentCount } = await supabase
          .from('synced_candidates')
          .select('id', { count: 'exact', head: true })
          .eq('integration_id', integration.id)
          .eq('is_regulated', true)
          .eq('consent_status', 'unknown')

        return {
          ...integration,
          stats: {
            candidates: candidates.count || 0,
            applications: applications.count || 0,
            regulated: regulatedCount || 0,
            missingConsent: missingConsentCount || 0,
          },
        }
      })
    )

    return NextResponse.json({ integrations: integrationsWithStats })
  } catch (error) {
    console.error('Integrations fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch integrations' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/integrations/merge
 * 
 * Disconnect an ATS integration.
 */
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { integrationId } = await req.json()

    if (!integrationId) {
      return NextResponse.json(
        { error: 'integrationId is required' },
        { status: 400 }
      )
    }

    // Get the integration
    const { data: integration } = await supabase
      .from('ats_integrations')
      .select('*')
      .eq('id', integrationId)
      .eq('org_id', user.id)
      .single()

    if (!integration) {
      return NextResponse.json(
        { error: 'Integration not found' },
        { status: 404 }
      )
    }

    // Try to delete the linked account in Merge
    try {
      const mergeClient = createMergeClient(integration.merge_account_token)
      await mergeClient.deleteAccount()
    } catch (err) {
      console.error('Failed to delete Merge account:', err)
      // Continue anyway - the token might already be invalid
    }

    // Mark integration as disconnected (keep data for audit purposes)
    const { error } = await supabase
      .from('ats_integrations')
      .update({ status: 'disconnected' })
      .eq('id', integrationId)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to disconnect integration' },
        { status: 500 }
      )
    }

    // Log the disconnection
    await supabase.from('ats_audit_events').insert({
      org_id: user.id,
      integration_id: integrationId,
      event_type: 'sync_completed',
      event_source: 'manual_disconnect',
      description: `Disconnected ${integration.integration_name} integration`,
      severity: 'info',
      metadata: {},
      occurred_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete integration error:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect integration' },
      { status: 500 }
    )
  }
}
