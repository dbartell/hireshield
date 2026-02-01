"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  CheckCircle, Circle, Clock, ArrowRight, Shield, AlertTriangle, 
  Award, Loader2, ChevronDown, ChevronUp, RefreshCw
} from "lucide-react"
import Link from "next/link"
import { 
  getRemediationItems, 
  getHiringStates, 
  initializeRemediation,
  updateRemediationStatus,
  getComplianceVerification,
  saveComplianceVerification
} from "@/lib/actions/compliance"
import { stateChecklists } from "@/lib/types/compliance"
import type { RemediationItem, ComplianceVerification } from "@/lib/types/compliance"
import { regulatedStates, stateRequirements } from "@/data/states"

export default function RemediationPage() {
  const [loading, setLoading] = useState(true)
  const [hiringStates, setHiringStates] = useState<string[]>([])
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [items, setItems] = useState<RemediationItem[]>([])
  const [verification, setVerification] = useState<ComplianceVerification | null>(null)
  const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set())
  const [updatingItem, setUpdatingItem] = useState<string | null>(null)
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const states = await getHiringStates()
    const regulated = states.filter(s => regulatedStates.includes(s))
    setHiringStates(regulated)

    // Initialize remediation items for each regulated state
    for (const state of regulated) {
      await initializeRemediation(state)
    }

    // Load all remediation items
    const allItems = await getRemediationItems()
    setItems(allItems)

    // Auto-expand all states and select first one
    setExpandedStates(new Set(regulated))
    if (regulated.length > 0) {
      setSelectedState(regulated[0])
      const ver = await getComplianceVerification(regulated[0])
      setVerification(ver)
    }

    setLoading(false)
  }

  const selectState = async (stateCode: string) => {
    setSelectedState(stateCode)
    const ver = await getComplianceVerification(stateCode)
    setVerification(ver)
  }

  const toggleStateExpanded = (stateCode: string) => {
    const newExpanded = new Set(expandedStates)
    if (newExpanded.has(stateCode)) {
      newExpanded.delete(stateCode)
    } else {
      newExpanded.add(stateCode)
    }
    setExpandedStates(newExpanded)
  }

  const handleMarkComplete = async (itemId: string) => {
    setUpdatingItem(itemId)
    await updateRemediationStatus(itemId, 'complete')
    const allItems = await getRemediationItems()
    setItems(allItems)
    setUpdatingItem(null)
  }

  const handleVerifyCompliance = async () => {
    if (!selectedState) return
    
    setVerifying(true)
    const stateItems = items.filter(i => i.state_code === selectedState)
    const allComplete = stateItems.every(i => i.status === 'complete')

    if (allComplete) {
      // Build confirmation object based on state requirements
      const confirmations: Partial<ComplianceVerification> = {}
      stateItems.forEach(item => {
        const key = `confirmed_${item.item_key.replace(/_/g, '')}` as keyof ComplianceVerification
        ;(confirmations as Record<string, boolean>)[key] = true
      })

      await saveComplianceVerification(selectedState, confirmations)
      const ver = await getComplianceVerification(selectedState)
      setVerification(ver)
    }
    setVerifying(false)
  }

  const getStateProgress = (stateCode: string) => {
    const stateItems = items.filter(i => i.state_code === stateCode)
    const completed = stateItems.filter(i => i.status === 'complete').length
    const total = stateItems.length
    return { completed, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0 }
  }

  const getStateName = (code: string) => {
    return stateRequirements.find(s => s.code === code)?.name || code
  }

  const getStateLaw = (code: string) => {
    return stateRequirements.find(s => s.code === code)?.law || ''
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (hiringStates.length === 0) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <Shield className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-2xl font-bold mb-2">No Regulated States Found</h2>
              <p className="text-gray-600 mb-6">
                Complete a compliance audit first to identify which states require action.
              </p>
              <Link href="/audit">
                <Button>
                  Run Compliance Audit <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Compliance Remediation</h1>
          <p className="text-gray-600">
            Complete these steps to achieve compliance for each regulated state
          </p>
        </div>

        {/* Overall Progress */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">Overall Progress</h3>
                <p className="text-sm text-gray-600">
                  {items.filter(i => i.status === 'complete').length} of {items.length} items complete
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={loadData}>
                <RefreshCw className="w-4 h-4 mr-2" /> Refresh
              </Button>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                style={{ 
                  width: `${items.length > 0 ? Math.round((items.filter(i => i.status === 'complete').length / items.length) * 100) : 0}%` 
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* State Tabs / Accordion */}
        <div className="space-y-4">
          {hiringStates.map(stateCode => {
            const progress = getStateProgress(stateCode)
            const stateItems = items.filter(i => i.state_code === stateCode)
            const isExpanded = expandedStates.has(stateCode)
            const isCompliant = verification?.state_code === stateCode && verification?.is_compliant
            const checklist = stateChecklists[stateCode] || []

            return (
              <Card 
                key={stateCode} 
                className={`overflow-hidden ${isCompliant ? 'border-green-500 border-2' : ''}`}
              >
                {/* State Header */}
                <button
                  onClick={() => {
                    toggleStateExpanded(stateCode)
                    selectState(stateCode)
                  }}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      progress.percent === 100 ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {progress.percent === 100 ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Shield className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{getStateName(stateCode)}</h3>
                        {isCompliant && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            Compliant
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{getStateLaw(stateCode)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{progress.percent}%</div>
                      <div className="text-xs text-gray-500">{progress.completed}/{progress.total} complete</div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Progress Bar */}
                <div className="px-6 pb-2">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        progress.percent === 100 ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${progress.percent}%` }}
                    />
                  </div>
                </div>

                {/* Checklist Items */}
                {isExpanded && (
                  <CardContent className="pt-4 border-t">
                    <div className="space-y-3">
                      {stateItems.map((item, index) => {
                        const checklistItem = checklist.find(c => c.key === item.item_key)
                        const isComplete = item.status === 'complete'

                        return (
                          <div 
                            key={item.id}
                            className={`flex items-start gap-4 p-4 rounded-lg border ${
                              isComplete 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex-shrink-0 mt-1">
                              {isComplete ? (
                                <CheckCircle className="w-6 h-6 text-green-600" />
                              ) : (
                                <Circle className="w-6 h-6 text-gray-300" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">Step {index + 1}</span>
                                {item.status === 'in_progress' && (
                                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                                    In Progress
                                  </span>
                                )}
                              </div>
                              <h4 className={`font-medium ${isComplete ? 'text-green-800' : 'text-gray-900'}`}>
                                {item.item_label}
                              </h4>
                              <p className={`text-sm ${isComplete ? 'text-green-600' : 'text-gray-600'}`}>
                                {item.item_description}
                              </p>
                              {item.completed_at && (
                                <p className="text-xs text-green-600 mt-1">
                                  Completed {new Date(item.completed_at).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <div className="flex-shrink-0">
                              {isComplete ? (
                                <Button variant="ghost" size="sm" disabled>
                                  <CheckCircle className="w-4 h-4 mr-1" /> Done
                                </Button>
                              ) : checklistItem?.route ? (
                                <div className="flex gap-2">
                                  <Link href={checklistItem.route}>
                                    <Button size="sm">
                                      Go <ArrowRight className="w-4 h-4 ml-1" />
                                    </Button>
                                  </Link>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleMarkComplete(item.id)}
                                    disabled={updatingItem === item.id}
                                  >
                                    {updatingItem === item.id ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      'Mark Done'
                                    )}
                                  </Button>
                                </div>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleMarkComplete(item.id)}
                                  disabled={updatingItem === item.id}
                                >
                                  {updatingItem === item.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    'Mark Complete'
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Compliance Verification Section */}
                    {progress.percent === 100 && (
                      <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                        <div className="flex items-start gap-4">
                          <Award className="w-8 h-8 text-green-600 flex-shrink-0" />
                          <div className="flex-1">
                            {isCompliant ? (
                              <>
                                <h3 className="font-semibold text-green-800 text-lg">
                                  🎉 {getStateName(stateCode)} Compliance Achieved!
                                </h3>
                                <p className="text-green-700 text-sm mt-1">
                                  You've completed all required compliance steps for {getStateLaw(stateCode)}.
                                  {verification?.expires_at && (
                                    <> Your compliance certification expires on {new Date(verification.expires_at).toLocaleDateString()}.</>
                                  )}
                                </p>
                                <div className="mt-3">
                                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium">
                                    <CheckCircle className="w-5 h-5" />
                                    Compliant
                                  </span>
                                </div>
                              </>
                            ) : (
                              <>
                                <h3 className="font-semibold text-gray-900 text-lg">
                                  All Steps Complete!
                                </h3>
                                <p className="text-gray-600 text-sm mt-1">
                                  You've completed all checklist items. Verify your compliance to receive your certification badge.
                                </p>
                                <Button 
                                  className="mt-3"
                                  onClick={handleVerifyCompliance}
                                  disabled={verifying}
                                >
                                  {verifying ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      Verifying...
                                    </>
                                  ) : (
                                    <>
                                      <Award className="w-4 h-4 mr-2" />
                                      Verify Compliance
                                    </>
                                  )}
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Incomplete Warning */}
                    {progress.percent < 100 && progress.percent > 0 && (
                      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800">
                            {progress.total - progress.completed} items remaining
                          </h4>
                          <p className="text-sm text-yellow-700">
                            Complete all items to achieve {getStateName(stateCode)} compliance.
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>

        {/* Help Card */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Need Help?</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Our compliance experts can help you complete these requirements faster.
                  Book a free consultation to get personalized guidance.
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  Schedule Consultation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
