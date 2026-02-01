import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createMergeClient } from '@/lib/merge/client'
import {
  mapMergeCandidate,
  mapMergeApplication,
  createCandidateSyncEvent,
  createApplicationSyncEvent,
  isAIScreeningStage,
} from '@/lib/merge/mappers'
import { generateCandidateFlags, generateApplicationFlags } from '@/lib/merge/compliance-engine'

/**
 * POST /api/integrations/merge/sync
 * 
 * Trigger a manual sync of candidates and applications from the connected ATS.
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { integrationId, fullSync = false } = await req.json()

    // Get the integration
    const { data: integration, error: intError } = await supabase
      .from('ats_integrations')
      .select('*')
      .eq('org_id', user.id)
      .eq(integrationId ? 'id' : 'org_id', integrationId || user.id)
      .eq('status', 'active')
      .single()

    if (intError || !integration) {
      return NextResponse.json(
        { error: 'No active integration found' },
        { status: 404 }
      )
    }

    const mergeClient = createMergeClient(integration.merge_account_token)

    // Track sync stats
    const stats = {
      candidatesSynced: 0,
      applicationsSynced: 0,
      errors: 0,
      complianceFlags: 0,
    }

    // Determine modified_after for incremental sync
    const modifiedAfter = fullSync ? undefined : integration.last_sync_at

    // Sync candidates
    let candidateCursor: string | undefined
    do {
      try {
        const response = await mergeClient.getCandidates({
          cursor: candidateCursor,
          pageSize: 50,
          modifiedAfter,
        })

        for (const candidate of response.results) {
          try {
            const syncedCandidate = mapMergeCandidate(
              candidate,
              integration.org_id,
              integration.id
            )
            const flags = generateCandidateFlags(syncedCandidate)

            const { data: saved } = await supabase
              .from('synced_candidates')
              .upsert(syncedCandidate, { onConflict: 'org_id,merge_id' })
              .select()
              .single()

            if (saved) {
              stats.candidatesSynced++
              stats.complianceFlags += flags.length

              // Create audit event
              await supabase.from('ats_audit_events').insert(
                createCandidateSyncEvent({ ...syncedCandidate, id: saved.id }, 'merge_sync')
              )
            }
          } catch (err) {
            console.error('Error syncing candidate:', err)
            stats.errors++
          }
        }

        candidateCursor = response.next ? extractCursor(response.next) : undefined
      } catch (err) {
        console.error('Error fetching candidates:', err)
        break
      }
    } while (candidateCursor)

    // Build a cache of candidates for application mapping
    const { data: candidates } = await supabase
      .from('synced_candidates')
      .select('id, merge_id')
      .eq('org_id', integration.org_id)

    const candidateMap = new Map(candidates?.map(c => [c.merge_id, c]) || [])

    // Cache jobs for efficiency
    const jobCache = new Map<string, { name: string | null; offices: string[] }>()

    // Sync applications
    let applicationCursor: string | undefined
    do {
      try {
        const response = await mergeClient.getApplications({
          cursor: applicationCursor,
          pageSize: 50,
          modifiedAfter,
        })

        for (const application of response.results) {
          try {
            const candidateInfo = candidateMap.get(application.candidate)
            if (!candidateInfo) {
              continue // Skip if candidate not synced
            }

            // Get job info (with caching)
            let jobInfo: { name: string | null; offices: string[] } | undefined
            if (application.job) {
              if (jobCache.has(application.job)) {
                jobInfo = jobCache.get(application.job)
              } else {
                try {
                  const job = await mergeClient.getJob(application.job)
                  jobInfo = { name: job.name, offices: job.offices || [] }
                  jobCache.set(application.job, jobInfo)
                } catch {
                  // Ignore job fetch errors
                }
              }
            }

            // Check if current stage is AI screening
            let stageInfo: { name: string | null; isAI: boolean } | undefined
            if (application.current_stage) {
              try {
                const stages = await mergeClient.getJobInterviewStages({
                  jobId: application.job || undefined,
                })
                const stage = stages.results.find(s => s.id === application.current_stage)
                if (stage?.name) {
                  stageInfo = {
                    name: stage.name,
                    isAI: isAIScreeningStage(stage.name),
                  }
                }
              } catch {
                // Ignore stage fetch errors
              }
            }

            const syncedApplication = mapMergeApplication(
              application,
              integration.org_id,
              integration.id,
              candidateInfo.id,
              jobInfo,
              stageInfo
            )

            // Get full candidate for flag generation
            const { data: fullCandidate } = await supabase
              .from('synced_candidates')
              .select('*')
              .eq('id', candidateInfo.id)
              .single()

            if (fullCandidate) {
              const flags = generateApplicationFlags(syncedApplication, fullCandidate)
              syncedApplication.compliance_flags = [
                ...syncedApplication.compliance_flags,
                ...flags,
              ]
              stats.complianceFlags += flags.length
            }

            const { data: saved } = await supabase
              .from('synced_applications')
              .upsert(syncedApplication, { onConflict: 'org_id,merge_id' })
              .select()
              .single()

            if (saved) {
              stats.applicationsSynced++

              // Create audit event
              await supabase.from('ats_audit_events').insert(
                createApplicationSyncEvent({ ...syncedApplication, id: saved.id }, 'merge_sync')
              )
            }
          } catch (err) {
            console.error('Error syncing application:', err)
            stats.errors++
          }
        }

        applicationCursor = response.next ? extractCursor(response.next) : undefined
      } catch (err) {
        console.error('Error fetching applications:', err)
        break
      }
    } while (applicationCursor)

    // Update integration with last sync time
    await supabase
      .from('ats_integrations')
      .update({
        last_sync_at: new Date().toISOString(),
        sync_error: stats.errors > 0 ? `${stats.errors} errors during sync` : null,
      })
      .eq('id', integration.id)

    // Log sync completion
    await supabase.from('ats_audit_events').insert({
      org_id: integration.org_id,
      integration_id: integration.id,
      event_type: 'sync_completed',
      event_source: 'manual_sync',
      description: `Manual sync completed: ${stats.candidatesSynced} candidates, ${stats.applicationsSynced} applications`,
      severity: stats.errors > 0 ? 'warning' : 'info',
      metadata: stats,
      occurred_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { error: 'Sync failed' },
      { status: 500 }
    )
  }
}

/**
 * Extract cursor from a next URL.
 */
function extractCursor(nextUrl: string): string | undefined {
  try {
    const url = new URL(nextUrl)
    return url.searchParams.get('cursor') || undefined
  } catch {
    return undefined
  }
}
