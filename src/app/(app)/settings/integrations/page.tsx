'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Link2,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Users,
  FileText,
  XCircle,
  ExternalLink,
  Loader2,
} from 'lucide-react'

interface Integration {
  id: string
  integration_slug: string
  integration_name: string
  status: 'active' | 'paused' | 'disconnected' | 'error'
  last_sync_at: string | null
  sync_error: string | null
  created_at: string
  stats: {
    candidates: number
    applications: number
    regulated: number
    missingConsent: number
  }
}

const ATS_LOGOS: Record<string, string> = {
  greenhouse: '🌱',
  lever: '🎯',
  workday: '📊',
  ashby: '🔷',
  bamboohr: '🎋',
  icims: '📋',
  jobvite: '💼',
  smartrecruiters: '🧠',
  taleo: '🏢',
  default: '🔗',
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [syncing, setSyncing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchIntegrations = useCallback(async () => {
    try {
      const res = await fetch('/api/integrations/merge')
      if (!res.ok) throw new Error('Failed to fetch integrations')
      const data = await res.json()
      setIntegrations(data.integrations)
    } catch (err) {
      console.error(err)
      setError('Failed to load integrations')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchIntegrations()
  }, [fetchIntegrations])

  const handleConnectATS = async () => {
    setConnecting(true)
    setError(null)

    try {
      // Get a Link token
      const res = await fetch('/api/integrations/merge/link', { method: 'POST' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create connection')
      }
      
      const { linkToken, magicLinkUrl } = await res.json()

      // In production, you'd use Merge Link's embedded component
      // For now, open the magic link URL in a new window
      if (magicLinkUrl) {
        const popup = window.open(magicLinkUrl, 'merge-link', 'width=600,height=700')
        
        // Poll for popup close and check for new integrations
        const pollInterval = setInterval(async () => {
          if (popup?.closed) {
            clearInterval(pollInterval)
            setConnecting(false)
            // Refresh integrations
            fetchIntegrations()
          }
        }, 1000)
      } else {
        // Fallback: log the link token for manual setup
        console.log('Link token:', linkToken)
        alert('Merge Link token created. Please complete setup in the Merge dashboard.')
        setConnecting(false)
      }
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Failed to start connection')
      setConnecting(false)
    }
  }

  const handleSync = async (integrationId: string) => {
    setSyncing(integrationId)
    try {
      const res = await fetch('/api/integrations/merge/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ integrationId }),
      })
      
      if (!res.ok) throw new Error('Sync failed')
      
      const data = await res.json()
      console.log('Sync completed:', data.stats)
      
      // Refresh integrations to get updated stats
      fetchIntegrations()
    } catch (err) {
      console.error(err)
      setError('Sync failed. Please try again.')
    } finally {
      setSyncing(null)
    }
  }

  const handleDisconnect = async (integrationId: string, name: string) => {
    if (!confirm(`Are you sure you want to disconnect ${name}? This will stop syncing but preserve your existing data.`)) {
      return
    }

    try {
      const res = await fetch('/api/integrations/merge', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ integrationId }),
      })
      
      if (!res.ok) throw new Error('Failed to disconnect')
      
      fetchIntegrations()
    } catch (err) {
      console.error(err)
      setError('Failed to disconnect integration')
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleString()
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const activeIntegrations = integrations.filter(i => i.status === 'active')
  const disconnectedIntegrations = integrations.filter(i => i.status !== 'active')

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ATS Integrations</h1>
          <p className="text-gray-600">
            Connect your Applicant Tracking System to automatically sync candidates and track compliance.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
              ✕
            </button>
          </div>
        )}

        {/* Connect New ATS */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="w-5 h-5" />
              Connect Your ATS
            </CardTitle>
            <CardDescription>
              Connect to 60+ ATS platforms including Greenhouse, Lever, Workday, and more via Merge.dev
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button
                onClick={handleConnectATS}
                disabled={connecting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {connecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4 mr-2" />
                    Connect ATS
                  </>
                )}
              </Button>
              <span className="text-sm text-gray-500">
                Secure OAuth connection • No passwords stored
              </span>
            </div>
            
            {/* Supported ATS logos */}
            <div className="mt-4 flex flex-wrap gap-2">
              {['Greenhouse', 'Lever', 'Workday', 'Ashby', 'BambooHR', 'iCIMS', 'Jobvite', 'SmartRecruiters'].map(
                (ats) => (
                  <span key={ats} className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-600">
                    {ats}
                  </span>
                )
              )}
              <span className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-600">+50 more</span>
            </div>
          </CardContent>
        </Card>

        {/* Active Integrations */}
        {activeIntegrations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Integrations</h2>
            <div className="space-y-4">
              {activeIntegrations.map((integration) => (
                <Card key={integration.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">
                          {ATS_LOGOS[integration.integration_slug] || ATS_LOGOS.default}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{integration.integration_name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            Connected
                            <span className="mx-1">•</span>
                            Last sync: {formatDate(integration.last_sync_at)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSync(integration.id)}
                          disabled={syncing === integration.id}
                        >
                          {syncing === integration.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                          <span className="ml-1">Sync</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDisconnect(integration.id, integration.integration_name)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Disconnect
                        </Button>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-4 grid grid-cols-4 gap-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Users className="w-4 h-4" />
                          Candidates
                        </div>
                        <div className="text-2xl font-semibold mt-1">
                          {integration.stats.candidates.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <FileText className="w-4 h-4" />
                          Applications
                        </div>
                        <div className="text-2xl font-semibold mt-1">
                          {integration.stats.applications.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 text-blue-600 text-sm">
                          <AlertTriangle className="w-4 h-4" />
                          Regulated
                        </div>
                        <div className="text-2xl font-semibold text-blue-700 mt-1">
                          {integration.stats.regulated.toLocaleString()}
                        </div>
                      </div>
                      <div className={`p-3 rounded-lg ${integration.stats.missingConsent > 0 ? 'bg-amber-50' : 'bg-green-50'}`}>
                        <div className={`flex items-center gap-2 text-sm ${integration.stats.missingConsent > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                          {integration.stats.missingConsent > 0 ? (
                            <AlertTriangle className="w-4 h-4" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          Missing Consent
                        </div>
                        <div className={`text-2xl font-semibold mt-1 ${integration.stats.missingConsent > 0 ? 'text-amber-700' : 'text-green-700'}`}>
                          {integration.stats.missingConsent.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Sync error */}
                    {integration.sync_error && (
                      <div className="mt-4 p-3 bg-red-50 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        {integration.sync_error}
                      </div>
                    )}

                    {/* View candidates link */}
                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                      <a
                        href={`/settings/integrations/candidates?integration=${integration.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                      >
                        View synced candidates
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <span className="text-xs text-gray-400">
                        Connected {formatDate(integration.created_at)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {activeIntegrations.length === 0 && (
          <Card className="mb-8">
            <CardContent className="py-12 text-center">
              <Link2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No ATS connected</h3>
              <p className="text-gray-500 mb-4">
                Connect your ATS to automatically sync candidates and track AI compliance.
              </p>
              <Button onClick={handleConnectATS} disabled={connecting}>
                <Link2 className="w-4 h-4 mr-2" />
                Connect Your ATS
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Disconnected Integrations */}
        {disconnectedIntegrations.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Previous Integrations</h2>
            <div className="space-y-2">
              {disconnectedIntegrations.map((integration) => (
                <div
                  key={integration.id}
                  className="p-4 bg-gray-50 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-xl opacity-50">
                      {ATS_LOGOS[integration.integration_slug] || ATS_LOGOS.default}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">{integration.integration_name}</span>
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <XCircle className="w-3 h-3" />
                        Disconnected
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {integration.stats.candidates} candidates synced
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">How it works</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Candidates and applications are synced automatically</li>
            <li>• We detect candidates in regulated jurisdictions (NYC, CO, IL, CA)</li>
            <li>• Consent status is tracked from your ATS tags and activities</li>
            <li>• Get alerts when candidates need disclosure notices</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
