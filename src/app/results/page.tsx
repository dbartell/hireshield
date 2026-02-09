'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  CheckCircle2, Circle, ArrowRight, Shield, ChevronRight,
  Sparkles, AlertCircle, Calendar, FileText, Clock, 
  Users, ClipboardCheck, ShieldCheck, Zap, Award,
  BookOpen, FileCheck, UserCheck, Building2, TrendingUp
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { 
  getRequirementsForStates,
  getRequirementsByPhase,
  getPhaseTimeEstimate,
  PHASE_CONFIG,
  TaskPhase,
  ComplianceRequirement,
  StateCompliance
} from "@/data/compliance-requirements"
import { PaywallModal } from "@/components/paywall-modal"
import { PaywallStatus } from "@/lib/paywall"

const ONBOARD_STORAGE_KEY = 'hireshield_onboard_data'

// ============================================================
// CIRCULAR PROGRESS RING COMPONENT
// ============================================================
function CircularProgress({ 
  percentage, 
  size = 200, 
  strokeWidth = 12,
  isComplete = false 
}: { 
  percentage: number
  size?: number
  strokeWidth?: number
  isComplete?: boolean
}) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage)
    }, 100)
    return () => clearTimeout(timer)
  }, [percentage])

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (animatedPercentage / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-100"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isComplete ? "#22c55e" : "#3b82f6"} />
            <stop offset="100%" stopColor={isComplete ? "#16a34a" : "#8b5cf6"} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold ${isComplete ? 'text-green-600' : 'text-white'}`}>
          {animatedPercentage}%
        </span>
        <span className="text-sm text-white/80 mt-1">Complete</span>
      </div>
    </div>
  )
}

// ============================================================
// TASK CARD COMPONENT
// ============================================================
function TaskCard({ 
  requirement, 
  state, 
  isComplete, 
  onTaskClick,
}: { 
  requirement: ComplianceRequirement
  state?: StateCompliance
  isComplete: boolean
  isInProgress?: boolean
  onTaskClick: (href: string) => void
}) {
  return (
    <div
      onClick={() => onTaskClick(requirement.href)}
      className={`group w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all cursor-pointer ${
        isComplete 
          ? 'bg-green-50 border-green-200' 
          : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
      }`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isComplete 
          ? 'bg-green-500 text-white' 
          : 'bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-500'
      }`}>
        {isComplete ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <Circle className="w-5 h-5" />
        )}
      </div>
      
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-medium ${isComplete ? 'text-green-700' : 'text-gray-900'}`}>
            {requirement.title}
          </span>
          {state && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full flex-shrink-0">
              {state.code}
            </span>
          )}
        </div>
        <p className={`text-sm ${isComplete ? 'text-green-600' : 'text-gray-500'}`}>
          {requirement.description}
        </p>
        {state?.law && (
          <p className="text-xs text-gray-400 mt-1">
            {state.law}
          </p>
        )}
      </div>
      
      {requirement.estimatedTime && !isComplete && (
        <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
          <Clock className="w-3 h-3" />
          {requirement.estimatedTime}
        </div>
      )}
      
      <ChevronRight className={`w-5 h-5 flex-shrink-0 transition-transform ${
        isComplete ? 'text-green-400' : 'text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1'
      }`} />
    </div>
  )
}

// ============================================================
// STAT CARD COMPONENT
// ============================================================
function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  subtext,
  color = 'blue' 
}: { 
  icon: React.ElementType
  label: string
  value: string | number
  subtext?: string
  color?: 'blue' | 'green' | 'purple' | 'amber' | 'red'
}) {
  const colorStyles = {
    blue: 'from-blue-500 to-blue-600 text-blue-600 bg-blue-50',
    green: 'from-green-500 to-green-600 text-green-600 bg-green-50',
    purple: 'from-purple-500 to-purple-600 text-purple-600 bg-purple-50',
    amber: 'from-amber-500 to-amber-600 text-amber-600 bg-amber-50',
    red: 'from-red-500 to-red-600 text-red-600 bg-red-50',
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorStyles[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">{label}</div>
        </div>
      </div>
      {subtext && (
        <div className="text-xs text-gray-500 mt-2">{subtext}</div>
      )}
    </div>
  )
}

// ============================================================
// PREVIEW PAGE (GUEST DASHBOARD)
// ============================================================
export default function PreviewPage() {
  const router = useRouter()
  const [data, setData] = useState<{
    orgName: string
    states: string[]
    riskScore: number | null
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPaywall, setShowPaywall] = useState(false)
  const [paywallStatus, setPaywallStatus] = useState<PaywallStatus | null>(null)

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0)
    
    // Check if user is logged in - redirect to dashboard
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/dashboard')
        return
      }

      // Load from localStorage
      const storedData = localStorage.getItem(ONBOARD_STORAGE_KEY)
      if (storedData) {
        try {
          const onboardData = JSON.parse(storedData)
          setData({
            orgName: onboardData.company || 'Your Company',
            states: onboardData.states || [],
            riskScore: onboardData.riskScore || null,
          })
        } catch (e) {
          // Invalid data, redirect to onboard
          router.push('/quiz')
          return
        }
      } else {
        // No data, redirect to onboard
        router.push('/quiz')
        return
      }
      setLoading(false)
    }
    checkAuth()
  }, [router])

  const handleTaskClick = () => {
    setPaywallStatus({
      shouldShowPaywall: true,
      reason: null,
      trialDaysRemaining: 0,
      documentsGenerated: 0,
      isSubscribed: false,
      states: data?.states || [],
    })
    setShowPaywall(true)
  }

  // Calculate dashboard state
  const dashboardState = useMemo(() => {
    if (!data) return null

    const hasStates = data.states.length > 0
    const { stateRequirements, generalRequirements: general } = getRequirementsForStates(data.states)

    // All tasks incomplete for preview
    const isComplete = () => false

    let totalReqs = 0
    stateRequirements.forEach(({ requirements }) => {
      totalReqs += requirements.length
    })
    totalReqs += general.length

    const progress = 0
    const completedReqs = 0

    // Days until Colorado deadline
    const nextDeadline = new Date('2026-02-01')
    const today = new Date()
    const daysUntilDeadline = Math.ceil((nextDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    // Find next action
    let nextAction: { title: string; href: string; description: string } | null = null
    const phasedRequirements = getRequirementsByPhase(stateRequirements, general)
    const phases: TaskPhase[] = ['today', 'this_week', 'setup_once']
    
    for (const phase of phases) {
      for (const { requirement } of phasedRequirements[phase]) {
        nextAction = { title: requirement.title, description: requirement.description, href: requirement.href }
        break
      }
      if (nextAction) break
    }

    return {
      hasStates,
      stateRequirements,
      general,
      isComplete,
      totalReqs,
      completedReqs,
      progress,
      daysUntilDeadline,
      nextAction,
    }
  }, [data])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  if (!data || !dashboardState) {
    return null
  }

  const { hasStates, stateRequirements, general, isComplete, totalReqs, completedReqs, progress, daysUntilDeadline, nextAction } = dashboardState

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 overflow-x-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">AI Hire Law</span>
          </Link>
          <Link 
            href="/login" 
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Paywall Modal */}
      {showPaywall && paywallStatus && (
        <PaywallModal
          status={paywallStatus}
          isGuest={true}
          onClose={() => setShowPaywall(false)}
          onUpgrade={() => router.push('/quiz')}
        />
      )}
      
      <div className="max-w-5xl mx-auto px-4 py-6 md:p-8 overflow-hidden">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl mb-8 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          
          <div className="relative p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
                  <CircularProgress percentage={progress} size={180} strokeWidth={14} />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <Building2 className="w-5 h-5 text-white/80" />
                  <span className="text-white/80 font-medium">{data.orgName}</span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Your Compliance Plan
                </h1>
                <p className="text-white/80 text-lg mb-4">
                  {completedReqs} of {totalReqs} requirements complete
                </p>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <div className="inline-flex items-center gap-2 bg-red-400/30 text-white rounded-full px-4 py-2 text-sm font-medium">
                    <ShieldCheck className="w-4 h-4" />
                    At Risk
                  </div>
                  
                  {daysUntilDeadline > 0 && (
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white">
                      <Calendar className="w-4 h-4" />
                      <span>{daysUntilDeadline} days until next deadline</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        {hasStates && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard 
              icon={AlertCircle} 
              label="Risk Score" 
              value={data.riskScore !== null ? data.riskScore : '—'}
              subtext={data.riskScore !== null ? (data.riskScore > 50 ? 'High risk' : data.riskScore > 25 ? 'Medium risk' : 'Low risk') : 'Not assessed'}
              color={data.riskScore !== null ? (data.riskScore > 50 ? 'red' : data.riskScore > 25 ? 'amber' : 'green') : 'blue'}
            />
            <StatCard 
              icon={FileCheck} 
              label="Tasks Complete" 
              value={`${completedReqs}/${totalReqs}`}
              color="blue"
            />
            <StatCard 
              icon={Users} 
              label="Team Training" 
              value="—"
              subtext="Not started"
              color="purple"
            />
            <StatCard 
              icon={ClipboardCheck} 
              label="Consent Records" 
              value={0}
              subtext="This month"
              color="green"
            />
          </div>
        )}

        {/* Next Step CTA */}
        {nextAction && hasStates && (
          <div 
            onClick={handleTaskClick}
            className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 mb-8 hover:from-blue-600 hover:to-indigo-700 transition-all cursor-pointer shadow-lg hover:shadow-xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white/20">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-white/80 text-sm font-medium mb-1">Get started</div>
                  <div className="font-bold text-xl text-white">{nextAction.title}</div>
                  <div className="text-white/70 text-sm mt-1">{nextAction.description}</div>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-white/80 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        )}

        {/* Task Cards by Phase */}
        {hasStates && (() => {
          const phasedRequirements = getRequirementsByPhase(stateRequirements, general)
          const phases: TaskPhase[] = ['today', 'this_week', 'setup_once']
          
          return (
            <div className="space-y-8">
              {phases.map(phase => {
                const items = phasedRequirements[phase]
                if (items.length === 0) return null
                
                const config = PHASE_CONFIG[phase]
                const timeEstimate = getPhaseTimeEstimate(items)
                
                return (
                  <div key={phase}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                          phase === 'today' ? 'bg-red-100 text-red-700' :
                          phase === 'this_week' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {config.label}
                        </div>
                        <span className="text-sm text-gray-500">{config.sublabel}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        {timeEstimate && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {timeEstimate}
                          </span>
                        )}
                        <span>0/{items.length} done</span>
                      </div>
                    </div>
                    
                    <div className="grid gap-3">
                      {items.map(({ requirement: req, state }) => (
                        <TaskCard
                          key={`${req.id}-${state?.code || 'general'}`}
                          requirement={req}
                          state={state}
                          isComplete={false}
                          onTaskClick={handleTaskClick}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })()}

        {/* Footer CTA */}
        <div className="mt-12 text-center border-t pt-8">
          <div className="inline-flex items-center gap-2 text-gray-500 mb-3">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Need expert guidance?</span>
          </div>
          <p className="text-sm">
            <a 
              href="https://calendly.com/aihirelaw/compliance-review" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              Book a free compliance review →
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
