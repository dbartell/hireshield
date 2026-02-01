'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Mail,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Loader2,
  Shield,
} from 'lucide-react'

interface Candidate {
  id: string
  merge_id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  locations: { raw: string; state?: string }[]
  is_regulated: boolean
  regulated_jurisdictions: string[]
  consent_status: 'unknown' | 'pending' | 'granted' | 'denied' | 'not_required'
  consent_granted_at: string | null
  disclosure_sent_at: string | null
  synced_at: string
  synced_applications: { count: number }[]
}

interface Summary {
  total: number
  regulated: number
  missingConsent: number
  consentGranted: number
  consentDenied: number
}

const CONSENT_STATUS_CONFIG = {
  unknown: { label: 'Unknown', color: 'text-gray-500', bg: 'bg-gray-100', icon: Clock },
  pending: { label: 'Pending', color: 'text-amber-500', bg: 'bg-amber-100', icon: Clock },
  granted: { label: 'Granted', color: 'text-green-500', bg: 'bg-green-100', icon: CheckCircle2 },
  denied: { label: 'Denied', color: 'text-red-500', bg: 'bg-red-100', icon: XCircle },
  not_required: { label: 'Not Required', color: 'text-gray-400', bg: 'bg-gray-50', icon: CheckCircle2 },
}

const JURISDICTION_LABELS: Record<string, string> = {
  nyc: 'NYC (LL144)',
  colorado: 'Colorado',
  illinois: 'Illinois',
  california: 'California',
  maryland: 'Maryland',
}

export default function SyncedCandidatesPage() {
  const searchParams = useSearchParams()
  const integrationId = searchParams.get('integration')

  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [regulatedFilter, setRegulatedFilter] = useState<string>('')
  const [consentFilter, setConsentFilter] = useState<string>('')
  const [jurisdictionFilter, setJurisdictionFilter] = useState<string>('')

  const fetchCandidates = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      })

      if (integrationId) params.set('integration_id', integrationId)
      if (searchQuery) params.set('search', searchQuery)
      if (regulatedFilter) params.set('regulated', regulatedFilter)
      if (consentFilter) params.set('consent_status', consentFilter)
      if (jurisdictionFilter) params.set('jurisdiction', jurisdictionFilter)

      const res = await fetch(`/api/integrations/merge/candidates?${params}`)
      if (!res.ok) throw new Error('Failed to fetch candidates')

      const data = await res.json()
      setCandidates(data.candidates)
      setSummary(data.summary)
      setTotalPages(data.pagination.totalPages)
      setTotal(data.pagination.total)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, searchQuery, regulatedFilter, consentFilter, jurisdictionFilter, integrationId])

  useEffect(() => {
    fetchCandidates()
  }, [fetchCandidates])

  const handleUpdateConsent = async (candidateId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/integrations/merge/candidates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId,
          consentStatus: newStatus,
        }),
      })

      if (!res.ok) throw new Error('Failed to update')

      // Refresh candidates
      fetchCandidates()
    } catch (err) {
      console.error(err)
      alert('Failed to update consent status')
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <a
            href="/settings/integrations"
            className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Integrations
          </a>
          <h1 className="text-3xl font-bold text-gray-900">Synced Candidates</h1>
          <p className="text-gray-600">
            Review candidate compliance status from your connected ATS
          </p>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-5 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Total
                </div>
                <div className="text-2xl font-bold">{summary.total.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="text-sm text-blue-600 flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  Regulated
                </div>
                <div className="text-2xl font-bold text-blue-700">{summary.regulated.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card className={summary.missingConsent > 0 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}>
              <CardContent className="p-4">
                <div className={`text-sm flex items-center gap-1 ${summary.missingConsent > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                  <AlertTriangle className="w-4 h-4" />
                  Missing Consent
                </div>
                <div className={`text-2xl font-bold ${summary.missingConsent > 0 ? 'text-amber-700' : 'text-green-700'}`}>
                  {summary.missingConsent.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Consent Granted
                </div>
                <div className="text-2xl font-bold text-green-700">{summary.consentGranted.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="text-sm text-red-600 flex items-center gap-1">
                  <XCircle className="w-4 h-4" />
                  Consent Denied
                </div>
                <div className="text-2xl font-bold text-red-700">{summary.consentDenied.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setPage(1)
                  }}
                  className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={regulatedFilter}
                onChange={(e) => {
                  setRegulatedFilter(e.target.value)
                  setPage(1)
                }}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Candidates</option>
                <option value="true">Regulated Only</option>
                <option value="false">Non-Regulated</option>
              </select>

              <select
                value={consentFilter}
                onChange={(e) => {
                  setConsentFilter(e.target.value)
                  setPage(1)
                }}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Consent Status</option>
                <option value="unknown">Unknown</option>
                <option value="pending">Pending</option>
                <option value="granted">Granted</option>
                <option value="denied">Denied</option>
              </select>

              <select
                value={jurisdictionFilter}
                onChange={(e) => {
                  setJurisdictionFilter(e.target.value)
                  setPage(1)
                }}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Jurisdictions</option>
                <option value="nyc">NYC (LL144)</option>
                <option value="colorado">Colorado</option>
                <option value="illinois">Illinois</option>
                <option value="california">California</option>
                <option value="maryland">Maryland</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setRegulatedFilter('')
                  setConsentFilter('')
                  setJurisdictionFilter('')
                  setPage(1)
                }}
              >
                <Filter className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Candidates Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Candidates ({total.toLocaleString()})</span>
              {loading && <Loader2 className="w-5 h-5 animate-spin text-gray-400" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">
                    <th className="pb-3 font-medium">Candidate</th>
                    <th className="pb-3 font-medium">Location</th>
                    <th className="pb-3 font-medium">Jurisdictions</th>
                    <th className="pb-3 font-medium">Consent Status</th>
                    <th className="pb-3 font-medium">Disclosure Sent</th>
                    <th className="pb-3 font-medium">Applications</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate) => {
                    const consentConfig = CONSENT_STATUS_CONFIG[candidate.consent_status]
                    const ConsentIcon = consentConfig.icon

                    return (
                      <tr key={candidate.id} className="border-b last:border-0">
                        <td className="py-4">
                          <div className="font-medium text-gray-900">
                            {candidate.first_name} {candidate.last_name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {candidate.email || '-'}
                          </div>
                        </td>
                        <td className="py-4">
                          {candidate.locations.length > 0 ? (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              {candidate.locations[0].raw}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-4">
                          {candidate.is_regulated ? (
                            <div className="flex flex-wrap gap-1">
                              {candidate.regulated_jurisdictions.map((j) => (
                                <span
                                  key={j}
                                  className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                                >
                                  {JURISDICTION_LABELS[j] || j}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">None</span>
                          )}
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm ${consentConfig.bg} ${consentConfig.color}`}>
                            <ConsentIcon className="w-4 h-4" />
                            {consentConfig.label}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-gray-600">
                          {formatDate(candidate.disclosure_sent_at)}
                        </td>
                        <td className="py-4 text-sm text-gray-600">
                          {candidate.synced_applications[0]?.count || 0}
                        </td>
                        <td className="py-4">
                          {candidate.is_regulated && candidate.consent_status === 'unknown' && (
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateConsent(candidate.id, 'granted')}
                                className="text-green-600 hover:text-green-700 text-xs"
                              >
                                ✓ Granted
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateConsent(candidate.id, 'denied')}
                                className="text-red-600 hover:text-red-700 text-xs"
                              >
                                ✗ Denied
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}

                  {candidates.length === 0 && !loading && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-500">
                        No candidates found matching your filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
