"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ClipboardCheck, FileText, Download, CheckCircle, 
  ArrowRight, Sparkles, Shield, X
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface OnboardingWizardProps {
  userName?: string
  hasCompletedAudit: boolean
  hasGeneratedDoc: boolean
  leadData?: {
    states?: string[]
    tools?: string[]
    risk_score?: number
  } | null
  onDismiss?: () => void
}

export function OnboardingWizard({ 
  userName, 
  hasCompletedAudit, 
  hasGeneratedDoc,
  leadData,
  onDismiss 
}: OnboardingWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [dismissed, setDismissed] = useState(false)

  // Determine current step based on progress
  useEffect(() => {
    if (hasCompletedAudit && hasGeneratedDoc) {
      setCurrentStep(3)
    } else if (hasCompletedAudit) {
      setCurrentStep(2)
    } else {
      setCurrentStep(1)
    }
  }, [hasCompletedAudit, hasGeneratedDoc])

  const handleDismiss = async () => {
    setDismissed(true)
    // Save dismissal to localStorage
    localStorage.setItem('aihirelaw_onboarding_dismissed', 'true')
    onDismiss?.()
  }

  // Check if already dismissed
  useEffect(() => {
    const wasDismissed = localStorage.getItem('aihirelaw_onboarding_dismissed')
    if (wasDismissed === 'true') {
      setDismissed(true)
    }
  }, [])

  // All steps complete
  if (hasCompletedAudit && hasGeneratedDoc) {
    return null
  }

  if (dismissed) {
    return null
  }

  const steps = [
    {
      id: 1,
      title: "Run your first audit",
      description: "Find out where you stand in 5 minutes",
      icon: ClipboardCheck,
      action: () => {
        // Pass lead data to audit if available
        if (leadData) {
          sessionStorage.setItem('aihirelaw_audit_prefill', JSON.stringify(leadData))
        }
        router.push('/audit')
      },
      cta: "Start Audit",
      time: "5 min",
      complete: hasCompletedAudit
    },
    {
      id: 2,
      title: "Generate your first disclosure",
      description: "Get a compliant document for your state",
      icon: FileText,
      action: () => router.push('/documents'),
      cta: "Create Document",
      time: "2 min",
      complete: hasGeneratedDoc,
      locked: !hasCompletedAudit
    },
    {
      id: 3,
      title: "Download & implement",
      description: "Use it in your hiring process",
      icon: Download,
      action: () => router.push('/documents'),
      cta: "View Documents",
      time: "1 min",
      complete: false,
      locked: !hasGeneratedDoc
    }
  ]

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 mb-8 relative overflow-hidden">
      {/* Dismiss button */}
      <button 
        onClick={handleDismiss}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full -translate-y-32 translate-x-32 opacity-50" />

      <CardHeader className="relative">
        <div className="flex items-center gap-2 text-blue-600 mb-2">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-medium">Quick Start</span>
        </div>
        <CardTitle className="text-xl">
          Welcome{userName ? `, ${userName}` : ''}! Let's get you compliant.
        </CardTitle>
        <CardDescription>
          Complete these 3 steps in under 10 minutes to protect your company.
          {leadData && (
            <span className="block mt-1 text-blue-600">
              ✓ We've pre-loaded your scorecard answers to save time.
            </span>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="relative">
        <div className="grid md:grid-cols-3 gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = step.id === currentStep
            const isComplete = step.complete
            const isLocked = step.locked

            return (
              <div
                key={step.id}
                className={`
                  relative p-4 rounded-xl border-2 transition-all
                  ${isActive ? 'border-blue-500 bg-white shadow-lg' : ''}
                  ${isComplete ? 'border-green-300 bg-green-50' : ''}
                  ${isLocked ? 'border-gray-200 bg-gray-50 opacity-60' : ''}
                  ${!isActive && !isComplete && !isLocked ? 'border-gray-200 bg-white' : ''}
                `}
              >
                {/* Step number badge */}
                <div className={`
                  absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${isComplete ? 'bg-green-500 text-white' : ''}
                  ${isActive ? 'bg-blue-500 text-white' : ''}
                  ${!isComplete && !isActive ? 'bg-gray-200 text-gray-600' : ''}
                `}>
                  {isComplete ? <CheckCircle className="w-5 h-5" /> : step.id}
                </div>

                {/* Content */}
                <div className="pt-2">
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center mb-3
                    ${isComplete ? 'bg-green-100' : 'bg-blue-100'}
                  `}>
                    <Icon className={`w-5 h-5 ${isComplete ? 'text-green-600' : 'text-blue-600'}`} />
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{step.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{step.time}</span>
                    
                    {isComplete ? (
                      <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Done
                      </span>
                    ) : isLocked ? (
                      <span className="text-xs text-gray-400">Complete step {step.id - 1} first</span>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={step.action}
                        className={isActive ? 'bg-blue-600 hover:bg-blue-700' : ''}
                      >
                        {step.cta} <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 w-4 border-t-2 border-dashed border-gray-300" />
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom CTA for first-time users */}
        {!hasCompletedAudit && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-3">
              <Shield className="w-4 h-4 inline mr-1" />
              Most users finish all 3 steps in under 10 minutes
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
