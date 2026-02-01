import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createMergeClient } from '@/lib/merge/client'

/**
 * POST /api/integrations/merge/link
 * 
 * Generate a Merge Link token for connecting an ATS.
 * This initiates the OAuth flow via Merge Link.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get organization info
    const { data: org } = await supabase
      .from('organizations')
      .select('id, name')
      .eq('id', user.id)
      .single()

    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    // Check for existing Merge API key
    if (!process.env.MERGE_API_KEY) {
      return NextResponse.json(
        { error: 'Merge.dev integration not configured. Add MERGE_API_KEY to environment.' },
        { status: 503 }
      )
    }

    const mergeClient = createMergeClient()

    // Create a Link token for the embedded OAuth flow
    const linkToken = await mergeClient.createLinkToken({
      endUserEmailAddress: user.email || 'unknown@company.com',
      endUserOrganizationName: org.name || 'Unknown Organization',
      endUserOriginId: org.id, // Our org ID for reference
      categories: ['ats'],
      linkExpiryMins: 30,
    })

    return NextResponse.json({
      linkToken: linkToken.link_token,
      magicLinkUrl: linkToken.magic_link_url,
    })
  } catch (error) {
    console.error('Merge Link token error:', error)
    return NextResponse.json(
      { error: 'Failed to create Merge Link token' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/integrations/merge/link
 * 
 * Exchange a public token for an account token after OAuth completes.
 */
export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { publicToken } = await req.json()

    if (!publicToken) {
      return NextResponse.json({ error: 'publicToken is required' }, { status: 400 })
    }

    const mergeClient = createMergeClient()

    // Exchange public token for account token
    const { account_token } = await mergeClient.exchangeToken(publicToken)

    // Get account details to know which ATS was connected
    const accountClient = createMergeClient(account_token)
    const accountDetails = await accountClient.getAccountDetails()

    // Save the integration to database
    const { data: integration, error: dbError } = await supabase
      .from('ats_integrations')
      .upsert({
        org_id: user.id,
        merge_account_token: account_token,
        integration_slug: accountDetails.integration_slug,
        integration_name: accountDetails.integration,
        status: 'active',
        settings: {
          end_user_origin_id: accountDetails.end_user_origin_id,
          webhook_url: accountDetails.webhook_listener_url,
        },
      }, {
        onConflict: 'org_id,integration_slug',
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error saving integration:', dbError)
      return NextResponse.json(
        { error: 'Failed to save integration' },
        { status: 500 }
      )
    }

    // Log the connection event
    await supabase.from('ats_audit_events').insert({
      org_id: user.id,
      integration_id: integration.id,
      event_type: 'sync_completed',
      event_source: 'merge_link',
      description: `Connected ${accountDetails.integration} ATS integration`,
      severity: 'info',
      metadata: {
        integration_slug: accountDetails.integration_slug,
        end_user_organization: accountDetails.end_user_organization_name,
      },
      occurred_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      integration: {
        id: integration.id,
        name: accountDetails.integration,
        slug: accountDetails.integration_slug,
        status: 'active',
      },
    })
  } catch (error) {
    console.error('Merge token exchange error:', error)
    return NextResponse.json(
      { error: 'Failed to complete ATS connection' },
      { status: 500 }
    )
  }
}
