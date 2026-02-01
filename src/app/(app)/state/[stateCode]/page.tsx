"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  CheckCircle, Circle, ArrowRight, Shield, AlertTriangle, 
  Award, Loader2, RefreshCw, FileText, ClipboardCheck,
  ChevronRight
} from "lucide-react"
import { StateOutline, getStateName as getStateNameFromComponent } from "@/components/state-outline"
import { 
  getRemediationItems, 
  getStateProgress,
  initializeRemediation,
  updateRemediationStatus,
  getComplianceVerification,
  saveComplianceVerification,
  stateChecklists,
  type RemediationItem,
  type ComplianceVerification,
  type HiringStateWithProgress
} from "@/lib/actions/compliance"
import { stateRequirements, regulatedStates } from "@/data/states"

interface StatePageProps {
  params: Promise<{ stateCode: string }>
}

export default function StatePage({ params }: StatePageProps) {
  const resolvedParams = use(params)
  const stateCode = resolvedParams.stateCode.toUpperCase()
  
  const [loading, setLoading] = useState(true)
  const [stateInfo, setStateInfo] = useState<HiringStateWithProgress | null>(null)
  const [items, setItems] = useState<RemediationItem[]>([])
  const [verification, setVerification] = useState<ComplianceVerification | null>(null)
  const [updatingItem, setUpdatingItem] = useState<string | null>(null)
  const [verifying, setVerifying] = useState(false)

  // Check if this is a regulated state
  const isRegulated = regulatedStates.includes(stateCode)
  const requirement = stateRequirements.find(s => s.code === stateCode)
  const checklist = stateChecklists[stateCode] || []

  useEffect(() => {
    if (isRegulated) {
      loadData()
    } else {
      setLoading(false)
    }
  }, [stateCode, isRegulated])

  const loadData = async () => {
    setLoading(true)
    
    // Initialize remediation items if needed
    await initializeRemediation(stateCode)
    
    // Load state progress
    const progress = await getStateProgress(stateCode)
    setStateInfo(progress)
    
    // Load remediation items
    const remItems = await getRemediationItems(stateCode)
    setItems(remItems)
    
    // Load verification
    const ver = await getComplianceVerification(stateCode)
    setVerification(ver)
    
    setLoading(false)
  }

  const handleMarkComplete = async (itemId: string) => {
    setUpdatingItem(itemId)
    await updateRemediationStatus(itemId, 'complete')
    await loadData()
    setUpdatingItem(null)
  }

  const handleVerifyCompliance = async () => {
    setVerifying(true)
    
    // Build confirmation object
    const confirmations: Record<string, boolean> = {}
    items.forEach(item => {
      const key = `confirmed_${item.item_key.replace(/_/g, '')}`
      confirmations[key] = true
    })

    await saveComplianceVerification(stateCode, confirmations as Partial<ComplianceVerification>)
    await loadData()
    setVerifying(false)
  }

  // Not a regulated state - show simple info page
  if (!isRegulated) {
    return (
      <div className="p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <StateOutline stateCode={stateCode} size={48} highlighted />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {getStateNameFromComponent(stateCode)}
              </h1>
              <p className="text-gray-600">No AI hiring regulations (yet)</p>
            </div>
          </div>

          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h2 className="text-2xl font-bold mb-2">No Action Required</h2>
              <p className="text-gray-600 mb-6">
                {getStateNameFromComponent(stateCode)} does not currently have AI hiring regulations 
                that require compliance action. We'll notify you if this changes.
              </p>
              <Link href="/states">
                <Button variant="outline">
                  Manage Your States
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  const completed = items.filter(i => i.status === 'complete').length
  const total = items.length
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0
  const isCompliant = verification?.is_compliant || false
  const allComplete = completed === total && total > 0

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <StateOutline stateCode={stateCode} size={48} highlighted />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">
                  {getStateNameFromComponent(stateCode)}
                </h1>
                {isCompliant && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Compliant
                  </span>
                )}
              </div>
              <p className="text-gray-600">{requirement?.law}</p>
              {requirement?.effective && (
                <p className="text-sm text-gray-500">
                  Effective: {requirement.effective}
                </p>
              )}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>

        {/* Progress Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">Compliance Progress</h3>
                <p className="text-sm text-gray-600">
                  {completed} of {total} requirements complete
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">{progressPercent}%</div>
              </div>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  progressPercent === 100 ? 'bg-green-500' : 'bg-blue-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Link href="/audit">
            <Card className="hover:border-blue-300 transition-colors cursor-pointer h-full">
              <CardContent className="py-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Run Compliance Audit</h4>
                  <p className="text-sm text-gray-500">Check for AI tools and gaps</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/documents">
            <Card className="hover:border-blue-300 transition-colors cursor-pointer h-full">
              <CardContent className="py-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Generate Documents</h4>
                  <p className="text-sm text-gray-500">Disclosure notices & policies</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {items.map((item, index) => {
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

            {/* Compliance Verification */}
            {allComplete && (
              <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <div className="flex items-start gap-4">
                  <Award className="w-8 h-8 text-green-600 flex-shrink-0" />
                  <div className="flex-1">
                    {isCompliant ? (
                      <>
                        <h3 className="font-semibold text-green-800 text-lg">
                          🎉 {getStateNameFromComponent(stateCode)} Compliance Achieved!
                        </h3>
                        <p className="text-green-700 text-sm mt-1">
                          You've completed all required compliance steps.
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
                              Mark as Compliant
                            </>
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Requirements Info */}
        {requirement && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Regulation Details</CardTitle>
            </CardHeader>
            <CardContent>
              <h4 className="font-medium text-gray-900 mb-2">{requirement.law}</h4>
              <p className="text-sm text-gray-500 mb-4">Effective: {requirement.effective}</p>
              
              <h5 className="font-medium text-gray-700 mb-2">Key Requirements:</h5>
              <ul className="space-y-2">
                {requirement.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-blue-500">•</span>
                    {req}
                  </li>
                ))}
              </ul>

              {requirement.penalties && (
                <>
                  <h5 className="font-medium text-gray-700 mt-4 mb-2">Penalties:</h5>
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <p className="text-sm text-red-700">{requirement.penalties}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Help Card */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
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
