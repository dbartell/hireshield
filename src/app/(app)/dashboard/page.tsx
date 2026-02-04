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
import { checkPaywallStatus, PaywallStatus } from "@/lib/paywall"

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
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-100"
        />
        {/* Progress circle */}
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
      {/* Center content */}
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
// CONFETTI ANIMATION COMPONENT
// ============================================================
function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        >
          <div 
            className="w-3 h-3 rounded-sm"
            style={{
              backgroundColor: ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'][Math.floor(Math.random() * 5)],
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        </div>
      ))}
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
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
  isInProgress = false,
  onTaskClick,
}: { 
  requirement: ComplianceRequirement
  state?: StateCompliance
  isComplete: boolean
  isInProgress?: boolean
  onTaskClick?: (href: string) => void
}) {
  const getIcon = () => {
    const iconClass = `w-5 h-5 ${isComplete ? 'text-green-600' : isInProgress ? 'text-blue-600' : 'text-gray-500'}`
    
    if (requirement.id.includes('disclosure') || requirement.id.includes('notice')) {
      return <FileCheck className={iconClass} />
    }
    if (requirement.id.includes('training')) {
      return <BookOpen className={iconClass} />
    }
    if (requirement.id.includes('consent')) {
      return <UserCheck className={iconClass} />
    }
    if (requirement.id.includes('audit') || requirement.id.includes('impact')) {
      return <ClipboardCheck className={iconClass} />
    }
    if (requirement.id.includes('handbook')) {
      return <FileText className={iconClass} />
    }
    return <FileText className={iconClass} />
  }

  const statusStyles = isComplete 
    ? 'border-green-200 bg-green-50/50' 
    : isInProgress 
      ? 'border-blue-200 bg-blue-50/50' 
      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'

  const handleClick = () => {
    if (onTaskClick) {
      onTaskClick(requirement.href)
    }
  }

  const content = (
    <div className={`group relative rounded-xl border p-4 transition-all duration-200 cursor-pointer ${statusStyles}`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 p-2 rounded-lg ${
          isComplete ? 'bg-green-100' : isInProgress ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-gray-200'
        }`}>
          {getIcon()}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`font-medium ${isComplete ? 'text-gray-500' : 'text-gray-900'}`}>
              {requirement.title}
            </h3>
            {state && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                {state.code}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{requirement.description}</p>
          
          {/* Bottom row */}
          <div className="flex items-center gap-3 mt-2">
            {requirement.estimatedTime && !isComplete && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {requirement.estimatedTime}
              </span>
            )}
            {state?.law && (
              <span className="text-xs text-gray-500">
                {state.law}
              </span>
            )}
          </div>
        </div>

        {/* Status / Arrow */}
        <div className="flex-shrink-0">
          {isComplete ? (
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-gray-700 group-hover:translate-x-0.5 transition-all" />
          )}
        </div>
      </div>
    </div>
  )

  // If there's an onTaskClick handler, use it instead of Link
  if (onTaskClick) {
    return <div onClick={handleClick}>{content}</div>
  }

  return <Link href={requirement.href}>{content}</Link>
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
// MAIN DASHBOARD COMPONENT
// ============================================================
export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<{
    orgName: string
    states: string[]
    completedDocTypes: string[]
    hasDisclosure: boolean
    hasTraining: boolean
    hasAudit: boolean
    riskScore: number | null
    trainingComplete: number
    trainingTotal: number
    consentCount: number
    subscriptionStatus: string | null
    trialStartedAt: Date | null
    documentsGenerated: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)
  const [paywallStatus, setPaywallStatus] = useState<PaywallStatus | null>(null)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const orgId = user.id

      // Get user email for leads lookup
      const userEmail = user.email

      // Parallel fetch all data
      const [orgRes, docsRes, disclosureRes, trainingCompleteRes, trainingTotalRes, auditsRes, consentsRes, hiringStatesRes, leadsRes] = await Promise.all([
        supabase.from('organizations').select('name, states, subscription_status, trial_started_at, documents_generated').eq('id', orgId).single(),
        supabase.from('documents').select('doc_type').eq('org_id', orgId),
        supabase.from('disclosure_pages').select('is_published').eq('organization_id', orgId).single(),
        supabase.from('training_assignments').select('*', { count: 'exact', head: true }).eq('org_id', orgId).eq('status', 'completed'),
        supabase.from('training_assignments').select('*', { count: 'exact', head: true }).eq('org_id', orgId),
        supabase.from('audits').select('risk_score').eq('org_id', orgId).order('created_at', { ascending: false }).limit(1),
        supabase.from('consents').select('*', { count: 'exact', head: true }).eq('org_id', orgId),
        supabase.from('hiring_states').select('state_code').eq('org_id', orgId),
        userEmail ? supabase.from('leads').select('risk_score').eq('email', userEmail).order('created_at', { ascending: false }).limit(1) : Promise.resolve({ data: null }),
      ])

      // Get risk score from most recent audit, or fall back to leads table (scorecard)
      const auditRiskScore = auditsRes.data?.[0]?.risk_score ?? null
      const leadRiskScore = leadsRes.data?.[0]?.risk_score ?? null
      const riskScore = auditRiskScore ?? leadRiskScore

      // Get states from org or fall back to hiring_states table
      const orgStates = orgRes.data?.states || []
      const hiringStates = hiringStatesRes.data?.map(s => s.state_code) || []
      const states = orgStates.length > 0 ? orgStates : hiringStates

      setData({
        orgName: orgRes.data?.name || 'Your Company',
        states,
        completedDocTypes: docsRes.data?.map(d => d.doc_type) || [],
        hasDisclosure: disclosureRes.data?.is_published || false,
        hasTraining: (trainingCompleteRes.count || 0) > 0,
        hasAudit: riskScore !== null,
        riskScore,
        trainingComplete: trainingCompleteRes.count || 0,
        trainingTotal: trainingTotalRes.count || 0,
        consentCount: consentsRes.count || 0,
        subscriptionStatus: orgRes.data?.subscription_status || null,
        trialStartedAt: orgRes.data?.trial_started_at ? new Date(orgRes.data.trial_started_at) : null,
        documentsGenerated: orgRes.data?.documents_generated || 0,
      })
      setLoading(false)
    }

    fetchData()
  }, [])

  // Calculate all derived values
  const dashboardState = useMemo(() => {
    if (!data) return null

    const hasStates = data.states.length > 0
    const { stateRequirements, generalRequirements: general } = getRequirementsForStates(data.states)

    const isComplete = (reqId: string, docType?: string): boolean => {
      if (docType && data.completedDocTypes.includes(docType)) return true
      if (reqId === 'training' && data.hasTraining) return true
      if (reqId.includes('audit') && data.hasAudit) return true
      if (reqId.includes('disclosure') && data.hasDisclosure) return true
      return false
    }

    // Calculate progress
    let totalReqs = 0
    let completedReqs = 0
    
    stateRequirements.forEach(({ requirements }) => {
      requirements.forEach(req => {
        totalReqs++
        if (isComplete(req.id, req.docType)) completedReqs++
      })
    })
    general.forEach(req => {
      totalReqs++
      if (isComplete(req.id, req.docType)) completedReqs++
    })

    const progress = totalReqs > 0 ? Math.round((completedReqs / totalReqs) * 100) : 0
    const allComplete = completedReqs === totalReqs && totalReqs > 0

    // Calculate days until next deadline (example: Colorado law effective Feb 1, 2026)
    const nextDeadline = new Date('2026-02-01')
    const today = new Date()
    const daysUntilDeadline = Math.ceil((nextDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    // Find next action
    let nextAction: { title: string; href: string; description: string } | null = null
    
    if (!hasStates) {
      nextAction = {
        title: 'Set up your compliance profile',
        description: 'Tell us where you hire so we can show your requirements',
        href: '/audit',
      }
    } else {
      const phasedRequirements = getRequirementsByPhase(stateRequirements, general)
      const phases: TaskPhase[] = ['today', 'this_week', 'setup_once']
      
      for (const phase of phases) {
        for (const { requirement } of phasedRequirements[phase]) {
          if (!isComplete(requirement.id, requirement.docType)) {
            nextAction = { title: requirement.title, description: requirement.description, href: requirement.href }
            break
          }
        }
        if (nextAction) break
      }
    }

    return {
      hasStates,
      stateRequirements,
      general,
      isComplete,
      totalReqs,
      completedReqs,
      progress,
      allComplete,
      daysUntilDeadline,
      nextAction,
    }
  }, [data])

  // Handle task click - check paywall
  const handleTaskClick = (href: string) => {
    if (!data) return
    
    const status = checkPaywallStatus({
      trialStartedAt: data.trialStartedAt,
      documentsGenerated: data.documentsGenerated,
      subscriptionStatus: data.subscriptionStatus,
    })
    
    // If subscribed, just navigate
    if (status.isSubscribed) {
      router.push(href)
      return
    }
    
    // Otherwise show paywall
    setPaywallStatus(status)
    setPendingNavigation(href)
    setShowPaywall(true)
  }

  // Show confetti when all complete
  useEffect(() => {
    if (dashboardState?.allComplete) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [dashboardState?.allComplete])

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
    return <div className="p-8">Loading...</div>
  }

  const { hasStates, stateRequirements, general, isComplete, totalReqs, completedReqs, progress, allComplete, daysUntilDeadline, nextAction } = dashboardState

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {showConfetti && <Confetti />}
      
      {/* Paywall Modal */}
      {showPaywall && paywallStatus && (
        <PaywallModal
          status={paywallStatus}
          onClose={() => {
            setShowPaywall(false)
            setPendingNavigation(null)
          }}
          onUpgrade={() => {
            router.push('/pricing')
          }}
        />
      )}
      
      <div className="max-w-5xl mx-auto p-6 md:p-8">
        
        {/* ============================================================ */}
        {/* HERO SECTION */}
        {/* ============================================================ */}
        <div className={`relative overflow-hidden rounded-2xl mb-8 ${
          allComplete 
            ? 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500' 
            : 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800'
        }`}>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          
          <div className="relative p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Left side - Progress Ring */}
              <div className="flex-shrink-0">
                <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
                  <CircularProgress 
                    percentage={progress} 
                    size={180} 
                    strokeWidth={14}
                    isComplete={allComplete}
                  />
                </div>
              </div>

              {/* Right side - Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <Building2 className="w-5 h-5 text-white/80" />
                  <span className="text-white/80 font-medium">{data.orgName}</span>
                </div>
                
                {allComplete ? (
                  <>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center justify-center md:justify-start gap-3">
                      <span>🎉</span> You're Compliant!
                    </h1>
                    <p className="text-white/80 text-lg">
                      All requirements complete. Keep tracking consent and stay current.
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                      <Award className="w-5 h-5 text-yellow-300" />
                      <span className="text-white font-medium">Compliance Champion</span>
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      Compliance Dashboard
                    </h1>
                    <p className="text-white/80 text-lg mb-4">
                      {completedReqs} of {totalReqs} requirements complete
                    </p>
                    
                    {/* Status badges */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                      <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                        progress >= 70 
                          ? 'bg-green-400/30 text-white' 
                          : progress >= 40 
                            ? 'bg-amber-400/30 text-white'
                            : 'bg-red-400/30 text-white'
                      }`}>
                        <ShieldCheck className="w-4 h-4" />
                        {progress >= 70 ? 'Protected' : progress >= 40 ? 'In Progress' : 'At Risk'}
                      </div>
                      
                      {daysUntilDeadline > 0 && (
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white">
                          <Calendar className="w-4 h-4" />
                          <span>{daysUntilDeadline} days until next deadline</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* NO STATES CONFIGURED - ONBOARDING CTA */}
        {/* ============================================================ */}
        {!hasStates && (
          <Link href="/audit">
            <div className="group bg-white rounded-2xl border-2 border-dashed border-blue-300 p-8 mb-8 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-blue-100 group-hover:bg-blue-200 transition-colors">
                    <Zap className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-xl text-gray-900">Let's get started</div>
                    <div className="text-gray-600 mt-1">
                      Tell us where you hire and what tools you use to see your compliance requirements.
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-blue-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        )}

        {/* ============================================================ */}
        {/* QUICK STATS ROW */}
        {/* ============================================================ */}
        {hasStates && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard 
              icon={FileCheck} 
              label="Tasks Complete" 
              value={`${completedReqs}/${totalReqs}`}
              color="blue"
            />
            <StatCard 
              icon={Users} 
              label="Team Training" 
              value={data.trainingTotal > 0 ? `${data.trainingComplete}/${data.trainingTotal}` : '—'}
              subtext={data.trainingTotal === 0 ? 'Not started' : undefined}
              color="purple"
            />
            <StatCard 
              icon={ClipboardCheck} 
              label="Consent Records" 
              value={data.consentCount}
              subtext="This month"
              color="green"
            />
            <StatCard 
              icon={AlertCircle} 
              label="Risk Score" 
              value={data.riskScore !== null ? data.riskScore : '—'}
              subtext={data.riskScore !== null ? (data.riskScore > 50 ? 'High risk' : data.riskScore > 25 ? 'Medium risk' : 'Low risk') : 'Not assessed'}
              color={data.riskScore !== null ? (data.riskScore > 50 ? 'red' : data.riskScore > 25 ? 'amber' : 'green') : 'blue'}
            />
          </div>
        )}

        {/* ============================================================ */}
        {/* NEXT STEP CTA */}
        {/* ============================================================ */}
        {nextAction && hasStates && !allComplete && (
          <Link href={nextAction.href}>
            <div className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 mb-8 hover:from-blue-600 hover:to-indigo-700 transition-all cursor-pointer shadow-lg hover:shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-white/20">
                    <ArrowRight className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white/80 text-sm font-medium mb-1">Continue where you left off</div>
                    <div className="font-bold text-xl text-white">{nextAction.title}</div>
                    <div className="text-white/70 text-sm mt-1">{nextAction.description}</div>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-white/80 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        )}

        {/* ============================================================ */}
        {/* TASK CARDS BY PHASE */}
        {/* ============================================================ */}
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
                const incompleteItems = items.filter(item => !isComplete(item.requirement.id, item.requirement.docType))
                const completeCount = items.length - incompleteItems.length
                const allDone = incompleteItems.length === 0
                
                return (
                  <div key={phase} className={allDone ? 'opacity-60' : ''}>
                    {/* Section Header */}
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
                        {timeEstimate && !allDone && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {timeEstimate}
                          </span>
                        )}
                        <span className={allDone ? 'text-green-600 font-medium' : ''}>
                          {completeCount}/{items.length} done
                        </span>
                      </div>
                    </div>
                    
                    {/* Task Cards Grid */}
                    <div className="grid gap-3">
                      {items.map(({ requirement: req, state }) => (
                        <TaskCard
                          key={`${req.id}-${state?.code || 'general'}`}
                          requirement={req}
                          state={state}
                          isComplete={isComplete(req.id, req.docType)}
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

        {/* ============================================================ */}
        {/* FOOTER CTA */}
        {/* ============================================================ */}
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
