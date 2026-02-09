"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertTriangle, ArrowRight, ArrowLeft, Download, FileText, History, Loader2, Settings, RefreshCw } from "lucide-react"
import { allStates, regulatedStates, stateRequirements } from "@/data/states"
import { aiHiringTools, usageTypes } from "@/data/tools"
import { saveAudit, getAuditHistory, getOrganizationData } from "@/lib/actions/audit"
import Link from "next/link"
import { CalendlyCTA, ContextualHelp } from "@/components/calendly-cta"
import { AuditResultsHelp, RiskScoreHelp, StateLawsHelp } from "@/components/help-content"
import { useStateContext } from "@/lib/state-context"

type AuditStep = 'states' | 'tools' | 'usage' | 'results'
type ViewMode = 'loading' | 'wizard' | 'results'

interface AuditData {
  states: string[]
  tools: string[]
  usages: string[]
}

interface AuditRecord {
  id: string
  created_at: string
  risk_score: number
  status: string
  audit_findings: Array<{
    id: string
    state_code: string
    finding_type: string
    severity: string
    remediation: string
  }>
}

interface OrgData {
  states: string[] | null
  tools: string[] | null
  name: string | null
}

export default function AuditPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('loading')
  const [step, setStep] = useState<AuditStep>('states')
  const [data, setData] = useState<AuditData>({
    states: [],
    tools: [],
    usages: []
  })
  const [orgData, setOrgData] = useState<OrgData | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [auditHistory, setAuditHistory] = useState<AuditRecord[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  
  // Get current state from context (state-as-product architecture)
  const { currentState, stateName } = useStateContext()

  // Load org data on mount
  useEffect(() => {
    loadOrgData()
  }, [])

  const loadOrgData = async () => {
    setViewMode('loading')
    const org = await getOrganizationData()
    setOrgData(org)
    
    // If org has states and tools, auto-populate and show results
    // State-as-product: use currentState if available, otherwise fall back to org states
    const statesToUse = currentState ? [currentState] : (org?.states || [])
    
    if (statesToUse.length && org?.tools?.length) {
      setData({
        states: statesToUse,
        tools: org.tools,
        usages: ['screening', 'ranking'] // Default common usages
      })
      setViewMode('results')
    } else if (statesToUse.length) {
      // Has states but no tools - prefill states, go to tools step
      setData(prev => ({ ...prev, states: statesToUse }))
      setStep('tools')
      setViewMode('wizard')
    } else {
      setViewMode('wizard')
    }
  }

  const loadHistory = async () => {
    setLoadingHistory(true)
    const history = await getAuditHistory()
    setAuditHistory(history)
    setLoadingHistory(false)
  }

  useEffect(() => {
    if (showHistory) {
      loadHistory()
    }
  }, [showHistory])

  const goToStep = (newStep: AuditStep) => {
    setStep(newStep)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleItem = (key: keyof AuditData, value: string) => {
    setData(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value]
    }))
  }

  const calculateResults = () => {
    let riskScore = 0
    const findings: { state: string; requirement: string; status: 'compliant' | 'at-risk' | 'non-compliant'; action: string }[] = []

    data.states.forEach(stateCode => {
      if (regulatedStates.includes(stateCode)) {
        const stateReq = stateRequirements.find(s => s.code === stateCode)
        if (stateReq) {
          riskScore += 20
          
          const highRiskUsages = ['screening', 'ranking', 'interview-analysis', 'termination']
          const hasHighRisk = data.usages.some(u => highRiskUsages.includes(u))
          
          findings.push({
            state: stateReq.name,
            requirement: `${stateReq.law} - Disclosure Required`,
            status: 'non-compliant',
            action: 'Generate disclosure notice for candidates/employees'
          })

          if (stateCode === 'CO') {
            findings.push({
              state: stateReq.name,
              requirement: 'Impact Assessment Required',
              status: 'non-compliant',
              action: 'Complete impact assessment template'
            })
          }

          if (stateCode === 'NYC') {
            findings.push({
              state: stateReq.name,
              requirement: 'Annual Bias Audit Required',
              status: 'at-risk',
              action: 'Schedule bias audit with independent auditor'
            })
          }

          if (hasHighRisk) {
            riskScore += 15
            findings.push({
              state: stateReq.name,
              requirement: 'High-risk AI usage detected',
              status: 'at-risk',
              action: 'Review AI usage for potential discrimination'
            })
          }
        }
      }
    })

    riskScore = Math.min(riskScore, 100)
    return { riskScore, findings }
  }

  const { riskScore, findings } = calculateResults()

  const handleSaveAudit = async () => {
    setSaving(true)
    const result = await saveAudit({
      states: data.states,
      tools: data.tools,
      usages: data.usages,
      riskScore,
      findings,
    })
    setSaving(false)
    if (!result.error) {
      setSaved(true)
    }
  }

  const startNewAudit = () => {
    setData({ states: [], tools: [], usages: [] })
    setSaved(false)
    setShowHistory(false)
    setViewMode('wizard')
    goToStep('states')
  }

  const editSetup = () => {
    setViewMode('wizard')
    goToStep('states')
  }

  // Loading state
  if (viewMode === 'loading') {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  // History view
  if (showHistory) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Audit History</h1>
            <p className="text-gray-600">View your previous compliance audits</p>
          </div>
          <Button onClick={() => setShowHistory(false)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </div>

        {loadingHistory ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Loading audit history...</p>
            </CardContent>
          </Card>
        ) : auditHistory.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <History className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="font-medium text-lg mb-2">No audits yet</h3>
              <p className="text-gray-600 mb-4">Run your first compliance audit to get started</p>
              <Button onClick={() => setShowHistory(false)}>Run Audit</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {auditHistory.map((audit) => (
              <Card key={audit.id}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        Audit - {new Date(audit.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        {audit.audit_findings?.length || 0} findings
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`text-2xl font-bold ${
                        audit.risk_score > 50 ? 'text-red-600' : 
                        audit.risk_score > 25 ? 'text-yellow-600' : 
                        'text-green-600'
                      }`}>
                        {audit.risk_score}
                      </div>
                      <span className="text-xs text-gray-500">Risk Score</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Results view (auto-populated or after wizard)
  if (viewMode === 'results') {
    const regulatedStateCount = data.states.filter(s => regulatedStates.includes(s)).length
    
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Compliance Audit</h1>
            <p className="text-gray-600">Your AI hiring compliance assessment</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowHistory(true)}>
              <History className="w-4 h-4 mr-2" /> History
            </Button>
            <Button variant="outline" onClick={editSetup}>
              <Settings className="w-4 h-4 mr-2" /> Edit Setup
            </Button>
          </div>
        </div>

        {/* Auto-populated banner */}
        {orgData?.states?.length && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Assessment auto-populated from your profile.</span>
                    {' '}Based on hiring in {data.states.join(', ')}.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={editSetup}>
                  <RefreshCw className="w-3 h-3 mr-1" /> Update
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Assessment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{regulatedStateCount}</div>
                <div className="text-sm text-gray-600">Regulated States</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{data.tools.length}</div>
                <div className="text-sm text-gray-600">AI Tools</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">{findings.length}</div>
                <div className="text-sm text-gray-600">Action Items</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center gap-1">
                  <div className={`text-3xl font-bold ${riskScore > 50 ? 'text-red-600' : 'text-yellow-600'}`}>{riskScore}</div>
                  <RiskScoreHelp />
                </div>
                <div className="text-sm text-gray-600">Risk Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Findings */}
        {findings.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Compliance Findings
                <AuditResultsHelp />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {findings.map((finding, i) => (
                  <div key={i} className={`p-4 rounded-lg border-l-4 ${
                    finding.status === 'non-compliant' ? 'bg-red-50 border-red-500' :
                    finding.status === 'at-risk' ? 'bg-orange-50 border-orange-500' :
                    'bg-green-50 border-green-500'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{finding.state}</div>
                        <div className="text-sm text-gray-600">{finding.requirement}</div>
                        <div className="text-sm mt-2">
                          <span className="font-medium">Action: </span>{finding.action}
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        finding.status === 'non-compliant' ? 'bg-red-100 text-red-700' :
                        finding.status === 'at-risk' ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {finding.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No findings */}
        {findings.length === 0 && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="py-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg text-green-800">No Compliance Issues Found</h3>
              <p className="text-green-700 mt-2">
                Based on your current setup, you don't have specific state compliance requirements.
                Still, we recommend following best practices.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            {saved ? (
              <div className="text-center py-4">
                <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <h3 className="font-medium mb-2">Audit Saved!</h3>
                <p className="text-gray-600 text-sm mb-4">Continue to your dashboard to track compliance progress.</p>
                <Link href="/dashboard">
                  <Button>Go to Dashboard</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <Button 
                    className="h-auto py-4" 
                    onClick={handleSaveAudit}
                    disabled={saving}
                  >
                    <div className="flex items-center gap-3">
                      {saving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Download className="w-5 h-5" />
                      )}
                      <div className="text-left">
                        <div className="font-medium">{saving ? 'Saving...' : 'Save Audit'}</div>
                        <div className="text-xs opacity-80">Save to your account</div>
                      </div>
                    </div>
                  </Button>
                  <Link href="/documents">
                    <Button className="h-auto py-4 w-full" variant="outline">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-medium">Generate Documents</div>
                          <div className="text-xs text-gray-600">Create compliance documents</div>
                        </div>
                      </div>
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Wizard view
  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Audit</h1>
          <p className="text-gray-600">Assess your AI hiring tools against state regulations</p>
        </div>
        <Button variant="outline" onClick={() => setShowHistory(true)}>
          <History className="w-4 h-4 mr-2" /> History
        </Button>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {['states', 'tools', 'usage', 'results'].map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                ['states', 'tools', 'usage', 'results'].indexOf(step) >= i
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {i + 1}
              </div>
              {i < 3 && (
                <div className={`w-16 md:w-24 h-1 mx-2 ${
                  ['states', 'tools', 'usage', 'results'].indexOf(step) > i
                    ? 'bg-blue-600'
                    : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>States</span>
          <span>Tools</span>
          <span>Usage</span>
          <span>Results</span>
        </div>
      </div>

      {/* Step 1: States */}
      {step === 'states' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Where do you hire employees?
              <StateLawsHelp />
            </CardTitle>
            <CardDescription>Select all states where you have employees or conduct hiring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-6 max-h-80 overflow-y-auto">
              {allStates.map(state => (
                <button
                  key={state.code}
                  onClick={() => toggleItem('states', state.code)}
                  className={`p-2 text-sm rounded-lg border transition-colors text-left ${
                    data.states.includes(state.code)
                      ? 'bg-blue-50 border-blue-600 text-blue-700'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {regulatedStates.includes(state.code) && (
                    <AlertTriangle className="w-3 h-3 inline mr-1 text-orange-500" />
                  )}
                  {state.name}
                </button>
              ))}
            </div>
            {data.states.some(s => regulatedStates.includes(s)) && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-orange-800">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  {data.states.filter(s => regulatedStates.includes(s)).length} state(s) with AI hiring regulations
                </p>
              </div>
            )}
            <Button onClick={() => goToStep('tools')} disabled={data.states.length === 0}>
              Continue <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Tools */}
      {step === 'tools' && (
        <Card>
          <CardHeader>
            <CardTitle>What AI hiring tools do you use?</CardTitle>
            <CardDescription>Select all tools used in your recruiting and hiring process</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-2 mb-6">
              {aiHiringTools.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => toggleItem('tools', tool.id)}
                  className={`p-3 text-left rounded-lg border transition-colors ${
                    data.tools.includes(tool.id)
                      ? 'bg-blue-50 border-blue-600'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{tool.name}</div>
                  <div className="text-xs text-gray-600">{tool.category}</div>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => goToStep('states')}>
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button onClick={() => goToStep('usage')} disabled={data.tools.length === 0}>
                Continue <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Usage */}
      {step === 'usage' && (
        <Card>
          <CardHeader>
            <CardTitle>How are these tools used?</CardTitle>
            <CardDescription>Select all ways AI influences your employment decisions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-6">
              {usageTypes.map(usage => (
                <button
                  key={usage.id}
                  onClick={() => toggleItem('usages', usage.id)}
                  className={`w-full p-3 text-left rounded-lg border transition-colors ${
                    data.usages.includes(usage.id)
                      ? 'bg-blue-50 border-blue-600'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{usage.label}</div>
                  <div className="text-xs text-gray-600">{usage.description}</div>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => goToStep('tools')}>
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </Button>
              <Button onClick={() => setViewMode('results')} disabled={data.usages.length === 0}>
                View Results <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
