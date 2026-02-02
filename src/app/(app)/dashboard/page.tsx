import Link from "next/link"
import { 
  CheckCircle2, Circle, ArrowRight, Shield, ChevronRight,
  Sparkles, AlertCircle, Calendar, FileText, ExternalLink
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { stateCompliance, generalRequirements, getRequirementsForStates } from "@/data/compliance-requirements"

async function getDashboardData() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const orgId = user.id

  // Get organization with states
  const { data: org } = await supabase
    .from('organizations')
    .select('name, states')
    .eq('id', orgId)
    .single()

  // Get completed documents
  const { data: documents } = await supabase
    .from('documents')
    .select('doc_type')
    .eq('org_id', orgId)

  // Get disclosure page status
  const { data: disclosurePage } = await supabase
    .from('disclosure_pages')
    .select('is_published')
    .eq('organization_id', orgId)
    .single()

  // Get training completion
  const { count: trainingComplete } = await supabase
    .from('training_assignments')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', orgId)
    .eq('status', 'completed')

  // Get audit status  
  const { count: auditsCount } = await supabase
    .from('audits')
    .select('*', { count: 'exact', head: true })
    .eq('org_id', orgId)

  const completedDocTypes = documents?.map(d => d.doc_type) || []

  return {
    orgName: org?.name || 'Your Company',
    states: org?.states || [],
    completedDocTypes,
    hasDisclosure: disclosurePage?.is_published || false,
    hasTraining: (trainingComplete || 0) > 0,
    hasAudit: (auditsCount || 0) > 0,
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  if (!data) {
    return <div className="p-8">Loading...</div>
  }

  const hasStates = data.states.length > 0
  const { stateRequirements, generalRequirements: general } = getRequirementsForStates(data.states)

  // Build completion map
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

  // Find next action
  let nextAction: { title: string; href: string; description: string } | null = null
  
  if (!hasStates) {
    nextAction = {
      title: 'Set up your compliance profile',
      description: 'Tell us where you hire so we can show your requirements',
      href: '/audit',
    }
  } else {
    for (const { requirements } of stateRequirements) {
      for (const req of requirements) {
        if (!isComplete(req.id, req.docType)) {
          nextAction = { title: req.title, description: req.description, href: req.href }
          break
        }
      }
      if (nextAction) break
    }
    if (!nextAction) {
      for (const req of general) {
        if (!isComplete(req.id, req.docType)) {
          nextAction = { title: req.title, description: req.description, href: req.href }
          break
        }
      }
    }
  }

  return (
    <div className="min-h-screen p-6 md:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600 mt-1">{data.orgName}</p>
      </div>

      {/* No states configured */}
      {!hasStates && (
        <Link href="/audit">
          <div className="bg-blue-600 text-white rounded-xl p-5 mb-6 hover:bg-blue-700 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-lg">Let's get started</div>
                <div className="text-blue-100 text-sm mt-1">
                  Tell us where you hire and what tools you use to see your compliance requirements.
                </div>
              </div>
              <ArrowRight className="w-6 h-6" />
            </div>
          </div>
        </Link>
      )}

      {/* Progress bar */}
      {hasStates && (
        <div className="bg-white rounded-xl border p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="font-semibold">Compliance Progress</span>
            </div>
            <span className="text-sm text-gray-600">{completedReqs} of {totalReqs}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${allComplete ? 'bg-green-500' : 'bg-blue-600'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          {allComplete && (
            <div className="mt-3 flex items-center gap-2 text-green-600 text-sm">
              <Sparkles className="w-4 h-4" />
              <span>All requirements complete! Keep tracking consent and stay current.</span>
            </div>
          )}
        </div>
      )}

      {/* Next Action CTA */}
      {nextAction && hasStates && !allComplete && (
        <Link href={nextAction.href}>
          <div className="bg-blue-600 text-white rounded-xl p-5 mb-6 hover:bg-blue-700 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-blue-100 text-sm mb-1">Next step</div>
                <div className="font-semibold text-lg">{nextAction.title}</div>
                <div className="text-blue-100 text-sm mt-1">{nextAction.description}</div>
              </div>
              <ArrowRight className="w-6 h-6" />
            </div>
          </div>
        </Link>
      )}

      {/* State-specific requirements */}
      {hasStates && stateRequirements.length > 0 && (
        <div className="space-y-4 mb-6">
          {stateRequirements.map(({ state, requirements }) => (
            <div key={state.code} className="bg-white rounded-xl border overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{state.name}</div>
                  <div className="text-xs text-gray-500">{state.law}</div>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  state.isActive 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {state.isActive ? 'Active' : `Effective ${state.effectiveDate}`}
                </div>
              </div>
              <div className="divide-y">
                {requirements.map((req) => {
                  const done = isComplete(req.id, req.docType)
                  return (
                    <Link 
                      key={req.id} 
                      href={req.href}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      {done ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium text-sm ${done ? 'text-gray-500' : 'text-gray-900'}`}>
                          {req.title}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {req.description}
                        </div>
                      </div>
                      {req.estimatedTime && !done && (
                        <span className="text-xs text-gray-400">{req.estimatedTime}</span>
                      )}
                      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* General requirements */}
      {hasStates && (
        <div className="bg-white rounded-xl border overflow-hidden mb-6">
          <div className="px-4 py-3 bg-gray-50 border-b">
            <div className="font-semibold text-gray-900">General Best Practices</div>
            <div className="text-xs text-gray-500">Recommended for all organizations</div>
          </div>
          <div className="divide-y">
            {general.map((req) => {
              const done = isComplete(req.id, req.docType)
              return (
                <Link 
                  key={req.id} 
                  href={req.href}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  {done ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-sm ${done ? 'text-gray-500' : 'text-gray-900'}`}>
                      {req.title}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {req.description}
                    </div>
                  </div>
                  {req.estimatedTime && !done && (
                    <span className="text-xs text-gray-400">{req.estimatedTime}</span>
                  )}
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Help CTA */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          Need help? {' '}
          <a 
            href="https://calendly.com/aihirelaw/compliance-review" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Book a free compliance review
          </a>
        </p>
      </div>
    </div>
  )
}
