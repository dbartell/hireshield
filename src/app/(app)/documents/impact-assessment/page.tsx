"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, HelpModal } from "@/components/ui/tooltip"
import { 
  ArrowLeft, ArrowRight, CheckCircle, FileText, AlertTriangle, 
  Download, Loader2, Info, Plus, X, Shield, Check, BookOpen,
  Cloud, ChevronDown, ChevronUp
} from "lucide-react"
import Link from "next/link"
import { 
  getImpactAssessments, 
  saveImpactAssessment, 
  completeImpactAssessment
} from "@/lib/actions/compliance"
import type { ImpactAssessment, DataInput } from "@/lib/types/compliance"
import { getHiringStatesAndTools } from "@/lib/actions/audit"

type WizardStep = 1 | 2 | 3 | 4 | 5

// Step configuration with Colorado AI Act context
const stepConfig = {
  1: {
    title: "AI System Details",
    shortTitle: "System",
    description: "Tell us about the AI system you're assessing",
    legalContext: {
      title: "Why This Matters",
      requirement: "Colorado AI Act § 6-1-1702(1)",
      content: (
        <div className="space-y-3 text-sm">
          <p>The Colorado AI Act requires deployers to clearly identify and document each high-risk AI system used in consequential decisions.</p>
          <p><strong>You must document:</strong></p>
          <ul className="list-disc ml-4 space-y-1">
            <li>The specific AI tools and vendors involved</li>
            <li>When the system was deployed</li>
            <li>The purpose and scope of AI decision-making</li>
          </ul>
          <p className="text-gray-500 mt-2">This information must be available to the Attorney General upon request.</p>
        </div>
      )
    },
    requiredFields: ['system_name'] as (keyof ImpactAssessment)[],
    recommendedFields: ['system_purpose', 'vendor_name', 'deployment_date', 'ai_tools'] as (keyof ImpactAssessment)[],
  },
  2: {
    title: "Data Inputs",
    shortTitle: "Data",
    description: "What data does this AI system process?",
    legalContext: {
      title: "Data Transparency Requirements",
      requirement: "Colorado AI Act § 6-1-1703(2)(a)",
      content: (
        <div className="space-y-3 text-sm">
          <p>You must document what personal data the AI system processes to make or influence decisions about candidates.</p>
          <p><strong>Key requirements:</strong></p>
          <ul className="list-disc ml-4 space-y-1">
            <li>Identify all data inputs (especially sensitive data)</li>
            <li>Document data sources and collection methods</li>
            <li>Establish and disclose retention periods</li>
          </ul>
          <p className="text-gray-500 mt-2">Sensitive data (biometrics, protected class proxies) requires additional safeguards.</p>
        </div>
      )
    },
    requiredFields: [] as (keyof ImpactAssessment)[],
    recommendedFields: ['data_inputs', 'data_sources', 'data_retention_period'] as (keyof ImpactAssessment)[],
  },
  3: {
    title: "Discrimination Risk Analysis",
    shortTitle: "Risks",
    description: "Assess potential risks and safeguards",
    legalContext: {
      title: "Bias & Discrimination Prevention",
      requirement: "Colorado AI Act § 6-1-1703(3)",
      content: (
        <div className="space-y-3 text-sm">
          <p>The core purpose of the Colorado AI Act is preventing algorithmic discrimination. You must proactively identify and mitigate risks.</p>
          <p><strong>Required analysis:</strong></p>
          <ul className="list-disc ml-4 space-y-1">
            <li>Identify protected groups that could be impacted</li>
            <li>Assess the likelihood and severity of discriminatory outcomes</li>
            <li>Document safeguards and testing procedures</li>
            <li>Conduct bias testing before deployment</li>
          </ul>
          <p className="text-gray-500 mt-2">High-risk systems require more rigorous testing and ongoing monitoring.</p>
        </div>
      )
    },
    requiredFields: [] as (keyof ImpactAssessment)[],
    recommendedFields: ['affected_groups', 'risk_level', 'safeguards', 'bias_testing_date'] as (keyof ImpactAssessment)[],
  },
  4: {
    title: "Transparency Measures",
    shortTitle: "Transparency",
    description: "How do you notify and support affected individuals?",
    legalContext: {
      title: "Notice & Appeal Requirements",
      requirement: "Colorado AI Act § 6-1-1704",
      content: (
        <div className="space-y-3 text-sm">
          <p>Colorado law requires transparency and recourse for individuals affected by AI decisions.</p>
          <p><strong>Mandatory requirements:</strong></p>
          <ul className="list-disc ml-4 space-y-1">
            <li>Notify candidates that AI is being used before consequential decisions</li>
            <li>Provide opportunity to correct inaccurate data</li>
            <li>Offer human review of AI-influenced decisions upon request</li>
            <li>Designate a human reviewer with actual authority</li>
          </ul>
          <p className="text-gray-500 mt-2">Failure to provide notice is a separate violation from any discriminatory outcome.</p>
        </div>
      )
    },
    requiredFields: [] as (keyof ImpactAssessment)[],
    recommendedFields: ['notification_method', 'appeal_process', 'human_reviewer_name'] as (keyof ImpactAssessment)[],
  },
  5: {
    title: "Review & Complete",
    shortTitle: "Review",
    description: "Review your impact assessment before finalizing",
    legalContext: {
      title: "Annual Compliance Requirement",
      requirement: "Colorado AI Act § 6-1-1703(4)",
      content: (
        <div className="space-y-3 text-sm">
          <p>Impact assessments must be updated annually or within 90 days of any substantial modification.</p>
          <p><strong>Ongoing obligations:</strong></p>
          <ul className="list-disc ml-4 space-y-1">
            <li>Keep assessments current and accessible</li>
            <li>Update when AI system changes significantly</li>
            <li>Retain records for at least 3 years</li>
            <li>Provide to Attorney General upon request</li>
          </ul>
        </div>
      )
    },
    requiredFields: ['system_name'] as (keyof ImpactAssessment)[],
    recommendedFields: [] as (keyof ImpactAssessment)[],
  },
}

const dataInputOptions = [
  { type: 'resume', label: 'Resume/CV content', description: 'Text, skills, experience from resumes' },
  { type: 'assessment', label: 'Assessment scores', description: 'Results from skills or personality tests' },
  { type: 'interview', label: 'Interview recordings/transcripts', description: 'Video, audio, or text from interviews' },
  { type: 'application', label: 'Application responses', description: 'Answers to application questions' },
  { type: 'social', label: 'Social media profiles', description: 'LinkedIn or other social data' },
  { type: 'background', label: 'Background check data', description: 'Criminal, credit, or employment history' },
  { type: 'biometric', label: 'Biometric data', description: 'Facial recognition, voice analysis' },
  { type: 'performance', label: 'Performance data', description: 'Historical performance metrics' },
]

const protectedGroups = [
  'Race/Ethnicity',
  'Gender/Sex',
  'Age (40+)',
  'Disability status',
  'Religion',
  'National origin',
  'Pregnancy status',
  'Veteran status',
  'Sexual orientation',
  'Genetic information',
]

// Calculate step completion
function getStepCompletion(step: WizardStep, formData: Partial<ImpactAssessment>): { complete: number; total: number; isComplete: boolean } {
  const config = stepConfig[step]
  const allFields = [...config.requiredFields, ...config.recommendedFields]
  
  let complete = 0
  for (const field of allFields) {
    const value = formData[field]
    if (value !== undefined && value !== null && value !== '' && 
        !(Array.isArray(value) && value.length === 0)) {
      complete++
    }
  }
  
  // Check required fields for isComplete
  const requiredComplete = config.requiredFields.every(field => {
    const value = formData[field]
    return value !== undefined && value !== null && value !== '' &&
           !(Array.isArray(value) && value.length === 0)
  })
  
  return { 
    complete, 
    total: allFields.length, 
    isComplete: requiredComplete && complete > 0 
  }
}

// Previous step summary component
function StepSummary({ step, formData, onEdit }: { 
  step: WizardStep
  formData: Partial<ImpactAssessment>
  onEdit: (step: WizardStep) => void 
}) {
  const [expanded, setExpanded] = useState(false)
  
  const getSummaryContent = () => {
    switch (step) {
      case 1:
        return {
          icon: <FileText className="w-4 h-4" />,
          title: "AI System",
          items: [
            formData.system_name && `System: ${formData.system_name}`,
            formData.vendor_name && `Vendor: ${formData.vendor_name}`,
            formData.ai_tools?.length && `${formData.ai_tools.length} tool(s) configured`,
          ].filter(Boolean) as string[]
        }
      case 2:
        return {
          icon: <Shield className="w-4 h-4" />,
          title: "Data Inputs",
          items: [
            formData.data_inputs?.length && `${formData.data_inputs.length} data type(s) selected`,
            formData.data_retention_period && `Retention: ${formData.data_retention_period}`,
          ].filter(Boolean) as string[]
        }
      case 3:
        return {
          icon: <AlertTriangle className="w-4 h-4" />,
          title: "Risk Analysis",
          items: [
            formData.risk_level && `Risk level: ${formData.risk_level}`,
            formData.affected_groups?.length && `${formData.affected_groups.length} group(s) identified`,
            formData.bias_testing_date && `Bias testing: ${formData.bias_testing_date}`,
          ].filter(Boolean) as string[]
        }
      case 4:
        return {
          icon: <BookOpen className="w-4 h-4" />,
          title: "Transparency",
          items: [
            formData.human_reviewer_name && `Reviewer: ${formData.human_reviewer_name}`,
            formData.notification_method && 'Notification method set',
            formData.appeal_process && 'Appeal process defined',
          ].filter(Boolean) as string[]
        }
      default:
        return { icon: null, title: '', items: [] }
    }
  }
  
  const { icon, title, items } = getSummaryContent()
  const completion = getStepCompletion(step, formData)
  
  if (items.length === 0) return null
  
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">Step {step} Complete: {title}</span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-green-600" /> : <ChevronDown className="w-4 h-4 text-green-600" />}
      </button>
      {expanded && (
        <div className="mt-3 pt-3 border-t border-green-200">
          <ul className="text-sm text-green-700 space-y-1 mb-2">
            {items.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="w-3 h-3" /> {item}
              </li>
            ))}
          </ul>
          <button 
            onClick={() => onEdit(step)}
            className="text-xs text-green-600 hover:text-green-800 underline"
          >
            Edit this step
          </button>
        </div>
      )}
    </div>
  )
}

export default function ImpactAssessmentPage() {
  const [step, setStep] = useState<WizardStep>(1)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [existingAssessments, setExistingAssessments] = useState<ImpactAssessment[]>([])
  const [prefilledTools, setPrefilledTools] = useState<string[]>([])
  const [showList, setShowList] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right')
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Form state
  const [formData, setFormData] = useState<Partial<ImpactAssessment>>({
    system_name: '',
    system_purpose: '',
    vendor_name: '',
    deployment_date: '',
    ai_tools: [],
    data_inputs: [],
    data_sources: '',
    data_retention_period: '',
    affected_groups: [],
    potential_harms: '',
    risk_level: null,
    safeguards: '',
    bias_testing_date: '',
    bias_testing_results: '',
    notification_method: '',
    appeal_process: '',
    human_reviewer_name: '',
    human_reviewer_role: '',
    human_reviewer_contact: '',
    status: 'draft',
  })

  useEffect(() => {
    loadData()
  }, [])

  // Auto-save with debounce
  const autoSave = useCallback(async () => {
    if (!formData.system_name) return // Don't save empty forms
    
    setSaveStatus('saving')
    try {
      const result = await saveImpactAssessment(formData)
      if (result.assessment) {
        setFormData(prev => ({ ...prev, id: result.assessment!.id }))
        setLastSaved(new Date())
        setSaveStatus('saved')
        // Reset to idle after 3 seconds
        setTimeout(() => setSaveStatus('idle'), 3000)
      }
    } catch (error) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }, [formData])

  const loadData = async () => {
    setLoading(true)
    const [assessments, auditData] = await Promise.all([
      getImpactAssessments(),
      getHiringStatesAndTools(),
    ])
    setExistingAssessments(assessments)
    
    // Pre-fill tools from audit
    if (auditData.tools?.length > 0) {
      setPrefilledTools(auditData.tools.map((t: { tool_name: string }) => t.tool_name))
    }
    
    setLoading(false)
  }

  const startNewAssessment = () => {
    setFormData({
      ...formData,
      ai_tools: prefilledTools,
    })
    setShowList(false)
    setStep(1)
  }

  const editAssessment = (assessment: ImpactAssessment) => {
    setFormData(assessment)
    setShowList(false)
    setStep(1)
  }

  const updateForm = (updates: Partial<ImpactAssessment>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const toggleDataInput = (type: string) => {
    const current = formData.data_inputs || []
    const exists = current.find(d => d.type === type)
    
    if (exists) {
      updateForm({ data_inputs: current.filter(d => d.type !== type) })
    } else {
      updateForm({ 
        data_inputs: [...current, { type, description: '', sensitive: false }] 
      })
    }
  }

  const toggleAffectedGroup = (group: string) => {
    const current = formData.affected_groups || []
    if (current.includes(group)) {
      updateForm({ affected_groups: current.filter(g => g !== group) })
    } else {
      updateForm({ affected_groups: [...current, group] })
    }
  }

  const addCustomTool = () => {
    const tool = prompt('Enter tool name:')
    if (tool) {
      updateForm({ ai_tools: [...(formData.ai_tools || []), tool] })
    }
  }

  const removeTool = (tool: string) => {
    updateForm({ ai_tools: (formData.ai_tools || []).filter(t => t !== tool) })
  }

  const handleSave = async () => {
    setSaving(true)
    const result = await saveImpactAssessment(formData)
    if (result.assessment) {
      setFormData(result.assessment)
      setLastSaved(new Date())
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
    setSaving(false)
  }

  const handleComplete = async () => {
    if (!formData.id) {
      // Save first if new
      const saveResult = await saveImpactAssessment(formData)
      if (saveResult.assessment) {
        await completeImpactAssessment(saveResult.assessment.id)
      }
    } else {
      await completeImpactAssessment(formData.id)
    }
    await loadData()
    setShowList(true)
  }

  const nextStep = async () => {
    if (step < 5) {
      // Auto-save before moving to next step
      if (formData.system_name) {
        await autoSave()
      }
      
      setSlideDirection('right')
      setIsTransitioning(true)
      setTimeout(() => {
        setStep((step + 1) as WizardStep)
        setIsTransitioning(false)
      }, 150)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setSlideDirection('left')
      setIsTransitioning(true)
      setTimeout(() => {
        setStep((step - 1) as WizardStep)
        setIsTransitioning(false)
      }, 150)
    }
  }

  const goToStep = (targetStep: WizardStep) => {
    if (targetStep !== step) {
      setSlideDirection(targetStep > step ? 'right' : 'left')
      setIsTransitioning(true)
      setTimeout(() => {
        setStep(targetStep)
        setIsTransitioning(false)
      }, 150)
    }
  }

  const generateDocument = () => {
    // Generate a text document from the assessment data
    const doc = `COLORADO AI ACT IMPACT ASSESSMENT

COMPANY: ${formData.system_name}
ASSESSMENT DATE: ${new Date().toLocaleDateString()}
VERSION: ${formData.version || 1}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. AI SYSTEM DESCRIPTION

System Name: ${formData.system_name}
Purpose: ${formData.system_purpose || 'Not specified'}
Vendor: ${formData.vendor_name || 'Not specified'}
Deployment Date: ${formData.deployment_date || 'Not specified'}

AI Tools in Use:
${(formData.ai_tools || []).map(t => `  • ${t}`).join('\n') || '  None specified'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. DATA INPUTS

Data Types Processed:
${(formData.data_inputs || []).map(d => `  • ${d.type}${d.sensitive ? ' (sensitive)' : ''}`).join('\n') || '  None specified'}

Data Sources: ${formData.data_sources || 'Not specified'}
Data Retention Period: ${formData.data_retention_period || 'Not specified'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. DISCRIMINATION RISK ANALYSIS

Risk Level: ${formData.risk_level?.toUpperCase() || 'Not assessed'}

Protected Groups Potentially Affected:
${(formData.affected_groups || []).map(g => `  • ${g}`).join('\n') || '  None identified'}

Potential Harms:
${formData.potential_harms || 'Not specified'}

Safeguards Implemented:
${formData.safeguards || 'Not specified'}

Bias Testing:
  Date: ${formData.bias_testing_date || 'Not conducted'}
  Results: ${formData.bias_testing_results || 'N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4. TRANSPARENCY MEASURES

Notification Method: ${formData.notification_method || 'Not specified'}

Appeal Process: ${formData.appeal_process || 'Not specified'}

Human Reviewer:
  Name: ${formData.human_reviewer_name || 'Not specified'}
  Role: ${formData.human_reviewer_role || 'Not specified'}
  Contact: ${formData.human_reviewer_contact || 'Not specified'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CERTIFICATION

This impact assessment was completed in accordance with the Colorado AI Act (SB24-205) requirements.

Status: ${formData.status === 'complete' ? 'COMPLETE' : 'DRAFT'}
Completed: ${formData.completed_at ? new Date(formData.completed_at).toLocaleDateString() : 'Pending'}
Expires: ${formData.expires_at ? new Date(formData.expires_at).toLocaleDateString() : 'N/A (annual renewal required)'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generated by HireShield • ${new Date().toLocaleString()}
`

    const blob = new Blob([doc], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `impact-assessment-${formData.system_name?.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'draft'}.txt`
    a.click()
  }

  // Calculate overall completion
  const getOverallCompletion = () => {
    let totalComplete = 0
    let totalFields = 0
    for (let s = 1; s <= 4; s++) {
      const completion = getStepCompletion(s as WizardStep, formData)
      totalComplete += completion.complete
      totalFields += completion.total
    }
    return totalFields > 0 ? Math.round((totalComplete / totalFields) * 100) : 0
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  // List view
  if (showList) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link href="/documents" className="text-gray-600 hover:text-gray-900">
                  Documents
                </Link>
                <span className="text-gray-400">/</span>
                <span className="font-medium">Impact Assessment</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Impact Assessment Wizard</h1>
              <p className="text-gray-600">
                Create and manage Colorado AI Act impact assessments
              </p>
            </div>
            <Button onClick={startNewAssessment}>
              <Plus className="w-4 h-4 mr-2" /> New Assessment
            </Button>
          </div>

          {/* Info Card */}
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-900">Colorado AI Act Requirement</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Impact assessments must be completed annually or within 90 days of any substantial 
                    modification to your AI system. This wizard will guide you through the process.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Existing Assessments */}
          <Card>
            <CardHeader>
              <CardTitle>Your Impact Assessments</CardTitle>
              <CardDescription>View and manage your impact assessments</CardDescription>
            </CardHeader>
            <CardContent>
              {existingAssessments.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="font-medium text-lg mb-2">No assessments yet</h3>
                  <p className="text-gray-600 mb-4">
                    Create your first impact assessment to meet Colorado compliance requirements.
                  </p>
                  <Button onClick={startNewAssessment}>
                    <Plus className="w-4 h-4 mr-2" /> Create Assessment
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {existingAssessments.map(assessment => (
                    <div 
                      key={assessment.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          assessment.status === 'complete' ? 'bg-green-100' : 'bg-yellow-100'
                        }`}>
                          {assessment.status === 'complete' ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <FileText className="w-5 h-5 text-yellow-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{assessment.system_name}</div>
                          <div className="text-sm text-gray-600">
                            {assessment.status === 'complete' ? (
                              <>
                                Completed {new Date(assessment.completed_at!).toLocaleDateString()}
                                {assessment.expires_at && (
                                  <> • Expires {new Date(assessment.expires_at).toLocaleDateString()}</>
                                )}
                              </>
                            ) : (
                              <>Draft • Last updated {new Date(assessment.created_at).toLocaleDateString()}</>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          assessment.status === 'complete' 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {assessment.status === 'complete' ? 'Complete' : 'Draft'}
                        </span>
                        <Button variant="outline" size="sm" onClick={() => editAssessment(assessment)}>
                          {assessment.status === 'complete' ? 'View' : 'Continue'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Wizard view
  const currentConfig = stepConfig[step]
  const stepCompletion = getStepCompletion(step, formData)
  const overallCompletion = getOverallCompletion()

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header with save status */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={() => setShowList(true)}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Assessments
            </Button>
            
            {/* Save status indicator */}
            <div className="flex items-center gap-2 text-sm">
              {saveStatus === 'saving' && (
                <span className="flex items-center gap-1 text-gray-500">
                  <Loader2 className="w-3 h-3 animate-spin" /> Saving...
                </span>
              )}
              {saveStatus === 'saved' && (
                <span className="flex items-center gap-1 text-green-600">
                  <Cloud className="w-3 h-3" /> Saved
                </span>
              )}
              {saveStatus === 'error' && (
                <span className="flex items-center gap-1 text-red-600">
                  <AlertTriangle className="w-3 h-3" /> Save failed
                </span>
              )}
              {lastSaved && saveStatus === 'idle' && (
                <span className="text-gray-400 text-xs">
                  Last saved {lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Impact Assessment Wizard</h1>
              <p className="text-gray-600">Step {step} of 5 • {overallCompletion}% complete</p>
            </div>
            <HelpModal
              title={currentConfig.legalContext.title}
              trigger={
                <span className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm">
                  <BookOpen className="w-4 h-4" />
                  <span>{currentConfig.legalContext.requirement}</span>
                </span>
              }
              content={currentConfig.legalContext.content}
            />
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            {([1, 2, 3, 4, 5] as WizardStep[]).map((s) => {
              const completion = getStepCompletion(s, formData)
              const isActive = step === s
              const isPast = step > s
              
              return (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <button
                    onClick={() => goToStep(s)}
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all duration-200 flex-shrink-0 ${
                      isActive 
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100' 
                        : isPast && completion.isComplete
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : isPast
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {isPast && completion.isComplete ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      s
                    )}
                    
                    {/* Completion indicator dot */}
                    {completion.complete > 0 && !isPast && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </button>
                  {s < 5 && (
                    <div className={`flex-1 h-1 mx-2 rounded transition-colors duration-200 ${
                      step > s ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
          <div className="flex items-center">
            {([1, 2, 3, 4, 5] as WizardStep[]).map((s) => {
              const completion = getStepCompletion(s, formData)
              return (
                <div key={s} className="flex-1 last:flex-none text-center" style={{ width: s === 5 ? '40px' : undefined }}>
                  <div className={`text-xs ${step === s ? 'font-medium text-blue-600' : 'text-gray-600'}`}>
                    {stepConfig[s].shortTitle}
                  </div>
                  {completion.total > 0 && (
                    <div className="text-[10px] text-gray-400">
                      {completion.complete}/{completion.total}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Step content with animation */}
        <div 
          className={`transition-all duration-150 ease-in-out ${
            isTransitioning 
              ? slideDirection === 'right' 
                ? 'opacity-0 translate-x-4' 
                : 'opacity-0 -translate-x-4'
              : 'opacity-100 translate-x-0'
          }`}
        >
          {/* Previous steps summary (show for steps 2-5) */}
          {step > 1 && (
            <div className="mb-4">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Previously completed
              </div>
              {Array.from({ length: step - 1 }, (_, i) => (
                <StepSummary 
                  key={i + 1} 
                  step={(i + 1) as WizardStep} 
                  formData={formData}
                  onEdit={goToStep}
                />
              ))}
            </div>
          )}

          {/* Step 1: AI System Details */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{currentConfig.title}</CardTitle>
                    <CardDescription>{currentConfig.description}</CardDescription>
                  </div>
                  <Tooltip content="This step identifies the AI system for compliance documentation. Required by Colorado AI Act § 6-1-1702." />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    System Name *
                    <Tooltip content="A unique name to identify this AI system in your compliance records." />
                  </label>
                  <input
                    type="text"
                    value={formData.system_name || ''}
                    onChange={(e) => updateForm({ system_name: e.target.value })}
                    placeholder="e.g., Hiring AI System"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Purpose / Description
                    <Tooltip content="Describe what decisions this AI helps make and how it's used in your hiring process." />
                  </label>
                  <textarea
                    value={formData.system_purpose || ''}
                    onChange={(e) => updateForm({ system_purpose: e.target.value })}
                    placeholder="Describe what this AI system does..."
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Vendor Name
                      <Tooltip content="The company that provides this AI tool. Important for liability and vendor management." />
                    </label>
                    <input
                      type="text"
                      value={formData.vendor_name || ''}
                      onChange={(e) => updateForm({ vendor_name: e.target.value })}
                      placeholder="e.g., HireVue"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Deployment Date
                      <Tooltip content="When this AI system was first used. Helps track assessment renewal dates." />
                    </label>
                    <input
                      type="date"
                      value={formData.deployment_date || ''}
                      onChange={(e) => updateForm({ deployment_date: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    AI Tools Included
                    <Tooltip content="All AI-powered tools that are part of this system. Pre-filled from your audit data." />
                  </label>
                  <p className="text-sm text-gray-600 mb-3">
                    These were pre-filled from your audit. Add or remove as needed.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(formData.ai_tools || []).map(tool => (
                      <span 
                        key={tool}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {tool}
                        <button onClick={() => removeTool(tool)} className="hover:text-blue-600">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" onClick={addCustomTool}>
                    <Plus className="w-4 h-4 mr-1" /> Add Tool
                  </Button>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={nextStep} disabled={!formData.system_name}>
                    Next: Data Inputs <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Data Inputs */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{currentConfig.title}</CardTitle>
                    <CardDescription>{currentConfig.description}</CardDescription>
                  </div>
                  <Tooltip content="Data transparency is required by Colorado AI Act § 6-1-1703(2)(a). Sensitive data requires additional safeguards." />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Data Types Collected
                    <Tooltip content="Select all types of candidate data that this AI system processes." />
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {dataInputOptions.map(option => (
                      <button
                        key={option.type}
                        onClick={() => toggleDataInput(option.type)}
                        className={`p-3 text-left rounded-lg border transition-all duration-150 ${
                          (formData.data_inputs || []).find(d => d.type === option.type)
                            ? 'bg-blue-50 border-blue-600 ring-1 ring-blue-600'
                            : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`w-4 h-4 mt-0.5 rounded border flex items-center justify-center transition-colors ${
                            (formData.data_inputs || []).find(d => d.type === option.type)
                              ? 'bg-blue-600 border-blue-600'
                              : 'border-gray-300'
                          }`}>
                            {(formData.data_inputs || []).find(d => d.type === option.type) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{option.label}</div>
                            <div className="text-xs text-gray-600">{option.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Data Sources
                    <Tooltip content="Where does this data come from? This helps assess data quality and consent." />
                  </label>
                  <textarea
                    value={formData.data_sources || ''}
                    onChange={(e) => updateForm({ data_sources: e.target.value })}
                    placeholder="Where does the data come from? (e.g., job applications, ATS exports, candidate uploads)"
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Data Retention Period
                    <Tooltip content="How long is candidate data kept? Colorado has specific requirements for data deletion." />
                  </label>
                  <select
                    value={formData.data_retention_period || ''}
                    onChange={(e) => updateForm({ data_retention_period: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  >
                    <option value="">Select retention period...</option>
                    <option value="30 days">30 days</option>
                    <option value="90 days">90 days</option>
                    <option value="1 year">1 year</option>
                    <option value="2 years">2 years</option>
                    <option value="Until deletion requested">Until deletion requested</option>
                    <option value="Indefinite">Indefinite</option>
                  </select>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button onClick={nextStep}>
                    Next: Risk Analysis <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Discrimination Risk Analysis */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{currentConfig.title}</CardTitle>
                    <CardDescription>{currentConfig.description}</CardDescription>
                  </div>
                  <Tooltip content="This is the core of Colorado AI Act compliance. You must actively assess and mitigate discrimination risks." />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Risk context card */}
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-orange-800">
                      <strong>Important:</strong> The Colorado AI Act specifically targets algorithmic discrimination. 
                      This section documents your proactive risk assessment and mitigation efforts.
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">
                    Which protected groups could be disadvantaged?
                    <Tooltip content="Identify groups that could potentially be impacted by AI decisions. This doesn't mean discrimination is occurring—it's about proactive risk assessment." />
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {protectedGroups.map(group => (
                      <button
                        key={group}
                        onClick={() => toggleAffectedGroup(group)}
                        className={`p-2 text-left text-sm rounded-lg border transition-all duration-150 flex items-center gap-2 ${
                          (formData.affected_groups || []).includes(group)
                            ? 'bg-orange-50 border-orange-500 text-orange-800'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          (formData.affected_groups || []).includes(group)
                            ? 'bg-orange-500 border-orange-500'
                            : 'border-gray-300'
                        }`}>
                          {(formData.affected_groups || []).includes(group) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        {group}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Potential Harms
                    <Tooltip content="Describe what could go wrong. Be specific about how candidates might be negatively affected." />
                  </label>
                  <textarea
                    value={formData.potential_harms || ''}
                    onChange={(e) => updateForm({ potential_harms: e.target.value })}
                    placeholder="Describe potential negative impacts on candidates..."
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Overall Risk Level
                    <Tooltip content="Based on your analysis, how risky is this AI system for potential discrimination?" />
                  </label>
                  <div className="flex gap-3">
                    {(['low', 'medium', 'high'] as const).map(level => (
                      <button
                        key={level}
                        onClick={() => updateForm({ risk_level: level })}
                        className={`flex-1 py-3 rounded-lg border font-medium capitalize transition-all duration-150 ${
                          formData.risk_level === level
                            ? level === 'low' ? 'bg-green-50 border-green-500 text-green-700 ring-1 ring-green-500'
                            : level === 'medium' ? 'bg-yellow-50 border-yellow-500 text-yellow-700 ring-1 ring-yellow-500'
                            : 'bg-red-50 border-red-500 text-red-700 ring-1 ring-red-500'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Safeguards Implemented
                    <Tooltip content="What are you doing to prevent discrimination? Document your mitigation measures." />
                  </label>
                  <textarea
                    value={formData.safeguards || ''}
                    onChange={(e) => updateForm({ safeguards: e.target.value })}
                    placeholder="What safeguards are in place to prevent discrimination? (e.g., bias testing, human review, input validation)"
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Bias Testing Date
                      <Tooltip content="When was the last bias audit conducted? Testing should be done before deployment and periodically after." />
                    </label>
                    <input
                      type="date"
                      value={formData.bias_testing_date || ''}
                      onChange={(e) => updateForm({ bias_testing_date: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Testing Results
                      <Tooltip content="Summary of bias testing outcomes. Document any issues found and corrective actions taken." />
                    </label>
                    <input
                      type="text"
                      value={formData.bias_testing_results || ''}
                      onChange={(e) => updateForm({ bias_testing_results: e.target.value })}
                      placeholder="e.g., Pass, No significant bias detected"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button onClick={nextStep}>
                    Next: Transparency <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Transparency Measures */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{currentConfig.title}</CardTitle>
                    <CardDescription>{currentConfig.description}</CardDescription>
                  </div>
                  <Tooltip content="Colorado requires notice before AI is used and an opportunity for human review. This is mandatory, not optional." />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Legal requirement card */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <strong>Legal Requirement:</strong> You must notify candidates that AI will be used 
                      <em> before</em> any consequential decision is made, and provide an opportunity for human review.
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Notification Method
                    <Tooltip content="How do you tell candidates that AI is involved in the hiring decision? This must happen BEFORE the decision." />
                  </label>
                  <textarea
                    value={formData.notification_method || ''}
                    onChange={(e) => updateForm({ notification_method: e.target.value })}
                    placeholder="How do you notify candidates that AI will be used? (e.g., email disclosure, application notice, website posting)"
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Appeal Process
                    <Tooltip content="Candidates must be able to request human review of AI-influenced decisions. Describe how they can do this." />
                  </label>
                  <textarea
                    value={formData.appeal_process || ''}
                    onChange={(e) => updateForm({ appeal_process: e.target.value })}
                    placeholder="How can candidates appeal AI-assisted decisions? (Colorado requires opportunity for human review)"
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    Human Reviewer
                    <Tooltip content="Designate someone with actual authority to review and override AI decisions. This person should be trained on bias awareness." />
                  </h4>
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Reviewer Name</label>
                      <input
                        type="text"
                        value={formData.human_reviewer_name || ''}
                        onChange={(e) => updateForm({ human_reviewer_name: e.target.value })}
                        placeholder="e.g., Jane Smith"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Reviewer Role</label>
                      <input
                        type="text"
                        value={formData.human_reviewer_role || ''}
                        onChange={(e) => updateForm({ human_reviewer_role: e.target.value })}
                        placeholder="e.g., HR Director"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Contact Information</label>
                      <input
                        type="text"
                        value={formData.human_reviewer_contact || ''}
                        onChange={(e) => updateForm({ human_reviewer_contact: e.target.value })}
                        placeholder="e.g., appeals@company.com"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button onClick={nextStep}>
                    Review Assessment <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Review & Complete */}
          {step === 5 && (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{currentConfig.title}</CardTitle>
                    <CardDescription>{currentConfig.description}</CardDescription>
                  </div>
                  <Tooltip content="Review all information before finalizing. Once complete, you should retain this assessment for at least 3 years." />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Completion progress */}
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Assessment Completion</span>
                    <span className="text-sm text-gray-600">{overallCompletion}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        overallCompletion >= 80 ? 'bg-green-500' :
                        overallCompletion >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${overallCompletion}%` }}
                    />
                  </div>
                </div>

                {/* Summary Sections */}
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        AI System
                      </h4>
                      <button 
                        onClick={() => goToStep(1)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="text-sm space-y-1">
                      <p><strong>Name:</strong> {formData.system_name || <span className="text-red-500">Required</span>}</p>
                      <p><strong>Purpose:</strong> {formData.system_purpose || <span className="text-gray-400">Not specified</span>}</p>
                      <p><strong>Vendor:</strong> {formData.vendor_name || <span className="text-gray-400">Not specified</span>}</p>
                      <p><strong>Tools:</strong> {(formData.ai_tools || []).join(', ') || <span className="text-gray-400">None</span>}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <Shield className="w-4 h-4 text-gray-500" />
                        Data Inputs
                      </h4>
                      <button 
                        onClick={() => goToStep(2)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="text-sm space-y-1">
                      <p>
                        <strong>Types:</strong> {(formData.data_inputs || []).map(d => d.type).join(', ') || <span className="text-gray-400">None</span>}
                      </p>
                      <p><strong>Retention:</strong> {formData.data_retention_period || <span className="text-gray-400">Not specified</span>}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-gray-500" />
                        Risk Assessment
                      </h4>
                      <button 
                        onClick={() => goToStep(3)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="text-sm space-y-1">
                      <p>
                        <strong>Risk Level:</strong>{' '}
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          formData.risk_level === 'low' ? 'bg-green-100 text-green-700' :
                          formData.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          formData.risk_level === 'high' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {formData.risk_level || 'Not assessed'}
                        </span>
                      </p>
                      <p>
                        <strong>Groups:</strong> {(formData.affected_groups || []).join(', ') || <span className="text-gray-400">None identified</span>}
                      </p>
                      <p><strong>Bias Testing:</strong> {formData.bias_testing_date || <span className="text-gray-400">Not conducted</span>}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-gray-500" />
                        Transparency
                      </h4>
                      <button 
                        onClick={() => goToStep(4)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="text-sm space-y-1">
                      <p><strong>Human Reviewer:</strong> {formData.human_reviewer_name || <span className="text-gray-400">Not specified</span>}</p>
                      <p><strong>Appeal Contact:</strong> {formData.human_reviewer_contact || <span className="text-gray-400">Not specified</span>}</p>
                      <p><strong>Notification:</strong> {formData.notification_method ? 'Configured' : <span className="text-gray-400">Not specified</span>}</p>
                    </div>
                  </div>
                </div>

                {/* Warning if incomplete */}
                {(!formData.system_name || overallCompletion < 50) && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Assessment incomplete</h4>
                      <p className="text-sm text-yellow-700">
                        {!formData.system_name 
                          ? 'System name is required. Go back to Step 1 to add it.'
                          : 'Consider filling in more fields for a comprehensive assessment. You can save as draft and complete later.'}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3 pt-4 border-t">
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={prevStep} className="flex-1">
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <Button variant="outline" onClick={handleSave} disabled={saving} className="flex-1">
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Cloud className="w-4 h-4 mr-2" /> Save Draft
                        </>
                      )}
                    </Button>
                  </div>
                  <Button onClick={handleComplete} disabled={saving || !formData.system_name} className="w-full">
                    <CheckCircle className="w-4 h-4 mr-2" /> Complete Assessment
                  </Button>
                  {formData.status === 'complete' && (
                    <Button variant="outline" onClick={generateDocument} className="w-full">
                      <Download className="w-4 h-4 mr-2" /> Download Document
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
