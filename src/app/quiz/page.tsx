'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, ArrowRight, ArrowLeft, AlertTriangle, Loader2, Search, Globe, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { allStates, regulatedStates } from '@/data/states'
import { aiHiringTools, usageTypes } from '@/data/tools'

type Step = 'states' | 'tools' | 'usage' | 'employees' | 'email' | 'creating'

interface OnboardData {
  states: string[]
  tools: string[]
  customTool: string
  usages: string[]
  employeeCount: string
  email: string
  company: string
  industry: string
}

const industries = [
  { id: '', label: 'Select industry (optional)' },
  { id: 'technology', label: 'Technology / Software' },
  { id: 'healthcare', label: 'Healthcare / Medical' },
  { id: 'finance', label: 'Finance / Banking' },
  { id: 'retail', label: 'Retail / E-commerce' },
  { id: 'manufacturing', label: 'Manufacturing' },
  { id: 'professional-services', label: 'Professional Services' },
  { id: 'education', label: 'Education' },
  { id: 'hospitality', label: 'Hospitality / Travel' },
  { id: 'logistics', label: 'Logistics / Transportation' },
  { id: 'media', label: 'Media / Entertainment' },
  { id: 'government', label: 'Government / Public Sector' },
  { id: 'nonprofit', label: 'Non-profit' },
  { id: 'other', label: 'Other' },
]

const employeeTiers = [
  { id: '1-50', label: '1-50 employees', description: 'Small team' },
  { id: '51-200', label: '51-200 employees', description: 'Growing company' },
  { id: '201-500', label: '201-500 employees', description: 'Mid-size organization' },
  { id: '501-1000', label: '501-1,000 employees', description: 'Large company' },
  { id: '1000+', label: '1,000+ employees', description: 'Enterprise' },
]

// Calculate risk score from selections
function calculateRiskScore(data: OnboardData): number {
  let score = 0
  
  data.states.forEach(stateCode => {
    if (regulatedStates.includes(stateCode)) {
      score += 25
    }
  })
  
  const highRiskUsages = ['screening', 'ranking', 'interview-analysis', 'assessment-scoring', 'termination', 'promotion']
  if (data.usages.some(u => highRiskUsages.includes(u))) {
    score += 15
  }
  
  if (data.tools.length > 0) {
    score += Math.min(data.tools.length * 5, 20)
  }
  
  return Math.min(score, 100)
}

// LocalStorage key for onboard data
const ONBOARD_STORAGE_KEY = 'hireshield_onboard_progress'

export default function OnboardPage() {
  const [step, setStep] = useState<Step>('states')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toolSearch, setToolSearch] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter()
  
  const [data, setData] = useState<OnboardData>({
    states: [],
    tools: [],
    customTool: '',
    usages: [],
    employeeCount: '',
    email: '',
    company: '',
    industry: ''
  })

  // Load saved progress from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(ONBOARD_STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setData(prev => ({
          ...prev,
          states: parsed.states || [],
          tools: parsed.tools || [],
          customTool: parsed.customTool || '',
          usages: parsed.usages || [],
          employeeCount: parsed.employeeCount || '',
          email: parsed.email || '',
          company: parsed.company || '',
          industry: parsed.industry || '',
        }))
        // Resume at the furthest incomplete step
        if (parsed.email && parsed.company) setStep('email')
        else if (parsed.employeeCount) setStep('employees')
        else if (parsed.usages?.length > 0) setStep('usage')
        else if (parsed.tools?.length > 0) setStep('tools')
      } catch (e) {
        // Invalid JSON, ignore
      }
    }
    setIsLoaded(true)
  }, [])

  // Save progress to localStorage on data change
  useEffect(() => {
    if (isLoaded && step !== 'creating') {
      localStorage.setItem(ONBOARD_STORAGE_KEY, JSON.stringify(data))
    }
  }, [data, isLoaded, step])

  // Check if user is already logged in - redirect to dashboard
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/dashboard')
      }
    }
    checkAuth()
  }, [router])

  const goToStep = (newStep: Step) => {
    setStep(newStep)
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      document.documentElement.scrollTop = 0
    }, 50)
  }

  const toggleState = (code: string) => {
    setData(prev => ({
      ...prev,
      states: prev.states.includes(code)
        ? prev.states.filter(s => s !== code)
        : [...prev.states, code]
    }))
  }

  const toggleTool = (id: string) => {
    setData(prev => ({
      ...prev,
      tools: prev.tools.includes(id)
        ? prev.tools.filter(t => t !== id)
        : [...prev.tools, id]
    }))
  }

  const toggleUsage = (id: string) => {
    setData(prev => ({
      ...prev,
      usages: prev.usages.includes(id)
        ? prev.usages.filter(u => u !== id)
        : [...prev.usages, id]
    }))
  }

  const submitAndContinue = async () => {
    setIsCreating(true)
    setError(null)

    try {
      const riskScore = calculateRiskScore(data)
      
      // Build tools list including custom tool
      const allTools = data.customTool.trim() 
        ? [...data.tools.filter(t => t !== 'other'), data.customTool.trim()]
        : data.tools
      
      // Save completed data to localStorage (different key for completed data)
      const onboardData = {
        ...data,
        tools: allTools,
        riskScore,
        completedAt: new Date().toISOString(),
      }
      localStorage.setItem('hireshield_onboard_data', JSON.stringify(onboardData))
      
      // Clear progress localStorage since we're done
      localStorage.removeItem(ONBOARD_STORAGE_KEY)

      // Save lead to database (fire and forget - don't block on errors)
      fetch('/api/onboard/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          company: data.company,
          states: data.states,
          tools: allTools,
          usages: data.usages,
          employeeCount: data.employeeCount,
          industry: data.industry || null,
          riskScore,
          customTool: data.customTool.trim() || null,
        }),
      }).catch(() => {
        // Ignore errors - localStorage is the source of truth
      })

      // Show creating state briefly then redirect
      setStep('creating')
      
      setTimeout(() => {
        router.push('/results')
      }, 1500)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setIsCreating(false)
    }
  }

  const progress = ['states', 'tools', 'usage', 'employees', 'email'].indexOf(step) + 1
  const totalSteps = 5

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-900">AI Hire Law</span>
            </div>
            {step !== 'creating' && (
              <div className="text-sm text-gray-500">
                Step {progress} of {totalSteps}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress bar */}
        {step !== 'creating' && (
          <div className="mb-8">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                style={{ width: `${(progress / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Step 1: States */}
        {step === 'states' && (
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Where do you hire?</h1>
              <p className="text-gray-600 mb-6">
                Select all states where you have employees or recruit candidates.
              </p>
              
              {/* Nationwide toggle */}
              <div className="mb-4">
                <button
                  onClick={() => {
                    const allStateCodes = allStates.map(s => s.code)
                    const allSelected = allStateCodes.every(code => data.states.includes(code))
                    setData(prev => ({
                      ...prev,
                      states: allSelected ? [] : allStateCodes
                    }))
                  }}
                  className={`w-full p-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                    data.states.length === allStates.length
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-700 hover:border-blue-300'
                  }`}
                >
                  <Globe className="w-5 h-5" />
                  <span className="font-medium">
                    {data.states.length === allStates.length ? 'Nationwide Selected' : 'Select Nationwide (All States)'}
                  </span>
                </button>
              </div>
              
              <div className="text-sm text-gray-500 mb-3">Or select individual states:</div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6 max-h-80 overflow-y-auto">
                {allStates.map(state => (
                  <button
                    key={state.code}
                    onClick={() => toggleState(state.code)}
                    className={`p-2 text-sm rounded-lg border transition-all ${
                      data.states.includes(state.code)
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                    } ${regulatedStates.includes(state.code) ? 'font-medium' : ''}`}
                  >
                    {regulatedStates.includes(state.code) && (
                      <AlertTriangle className="w-3 h-3 inline mr-1 text-amber-500" />
                    )}
                    {state.name}
                  </button>
                ))}
              </div>
              
              {data.states.some(s => regulatedStates.includes(s)) && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-amber-800">
                    <AlertTriangle className="w-4 h-4 inline mr-1" />
                    You've selected states with AI hiring regulations. We'll show you what's required.
                  </p>
                </div>
              )}
              
              <Button 
                onClick={() => goToStep('tools')} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={data.states.length === 0}
              >
                Continue <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Tools */}
        {step === 'tools' && (
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">What hiring tools do you use?</h1>
              <p className="text-gray-600 mb-6">
                Select the AI-powered tools in your recruiting stack.
              </p>
              
              {/* Search input */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={toolSearch}
                  onChange={(e) => setToolSearch(e.target.value)}
                  placeholder="Search tools..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Filtered tools grid */}
              {(() => {
                const filteredTools = aiHiringTools.filter(tool => 
                  tool.id !== 'other' && (
                    tool.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
                    tool.category.toLowerCase().includes(toolSearch.toLowerCase())
                  )
                )
                
                return (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                      {filteredTools.map(tool => (
                        <button
                          key={tool.id}
                          onClick={() => toggleTool(tool.id)}
                          className={`p-3 text-left rounded-lg border transition-all ${
                            data.tools.includes(tool.id)
                              ? 'bg-blue-600 border-blue-500 text-white'
                              : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`font-medium ${data.tools.includes(tool.id) ? 'text-white' : 'text-gray-900'}`}>{tool.name}</div>
                          <div className={`text-xs ${data.tools.includes(tool.id) ? 'text-blue-100' : 'text-gray-500'}`}>{tool.category}</div>
                        </button>
                      ))}
                    </div>
                    
                    {/* Show "Other" option when search has no results or user wants custom */}
                    {(filteredTools.length === 0 || toolSearch.length > 0) && (
                      <div className="border-t border-gray-200 pt-4 mb-4">
                        <p className="text-sm text-gray-600 mb-2">
                          {filteredTools.length === 0 
                            ? "Can't find your tool? Add it below:" 
                            : "Using a different tool?"}
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={data.customTool}
                            onChange={(e) => setData(prev => ({ ...prev, customTool: e.target.value }))}
                            placeholder="Enter tool name..."
                            className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              if (data.customTool.trim() && !data.tools.includes('other')) {
                                toggleTool('other')
                              }
                            }}
                            disabled={!data.customTool.trim() || data.tools.includes('other')}
                            className="border-gray-300"
                          >
                            <Plus className="w-4 h-4 mr-1" /> Add
                          </Button>
                        </div>
                        {data.tools.includes('other') && data.customTool && (
                          <p className="text-sm text-green-600 mt-2">
                            ✓ Added: {data.customTool}
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )
              })()}
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => goToStep('states')} className="border-gray-300 text-gray-700 hover:bg-gray-100">
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back
                </Button>
                <Button 
                  onClick={() => goToStep('usage')} 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={data.tools.length === 0 && !data.customTool.trim()}
                >
                  Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Usage */}
        {step === 'usage' && (
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">How is AI used in decisions?</h1>
              <p className="text-gray-600 mb-6">
                Select how these tools influence your hiring process.
              </p>
              
              <div className="space-y-2 mb-6">
                {usageTypes.map(usage => (
                  <button
                    key={usage.id}
                    onClick={() => toggleUsage(usage.id)}
                    className={`w-full p-3 text-left rounded-lg border transition-all ${
                      data.usages.includes(usage.id)
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`font-medium ${data.usages.includes(usage.id) ? 'text-white' : 'text-gray-900'}`}>{usage.label}</div>
                    <div className={`text-xs ${data.usages.includes(usage.id) ? 'text-blue-100' : 'text-gray-500'}`}>{usage.description}</div>
                  </button>
                ))}
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => goToStep('tools')} className="border-gray-300 text-gray-700 hover:bg-gray-100">
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back
                </Button>
                <Button 
                  onClick={() => goToStep('employees')} 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={data.usages.length === 0}
                >
                  Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Employees */}
        {step === 'employees' && (
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">How many employees?</h1>
              <p className="text-gray-600 mb-6">
                This helps us personalize your compliance plan and pricing.
              </p>
              
              <div className="space-y-2 mb-6">
                {employeeTiers.map(tier => (
                  <button
                    key={tier.id}
                    onClick={() => setData(prev => ({ ...prev, employeeCount: tier.id }))}
                    className={`w-full p-4 text-left rounded-lg border transition-all ${
                      data.employeeCount === tier.id
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`font-medium ${data.employeeCount === tier.id ? 'text-white' : 'text-gray-900'}`}>{tier.label}</div>
                    <div className={`text-sm ${data.employeeCount === tier.id ? 'text-blue-100' : 'text-gray-500'}`}>{tier.description}</div>
                  </button>
                ))}
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => goToStep('usage')} className="border-gray-300 text-gray-700 hover:bg-gray-100">
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back
                </Button>
                <Button 
                  onClick={() => goToStep('email')} 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!data.employeeCount}
                >
                  Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Email */}
        {step === 'email' && (
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Almost there!</h1>
              <p className="text-gray-600 mb-6">
                Enter your details to see your personalized compliance checklist.
              </p>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={data.email}
                    onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="organization"
                    autoComplete="organization"
                    value={data.company}
                    onChange={(e) => setData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Acme Inc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <select
                    value={data.industry}
                    onChange={(e) => setData(prev => ({ ...prev, industry: e.target.value }))}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {industries.map(ind => (
                      <option key={ind.id} value={ind.id}>
                        {ind.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => goToStep('employees')} className="border-gray-300 text-gray-700 hover:bg-gray-100">
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back
                </Button>
                <Button 
                  onClick={submitAndContinue}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  disabled={!data.email || !data.company || isCreating}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      See My Compliance Plan <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                No account required. We'll show you exactly what you need.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Creating state */}
        {step === 'creating' && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Building your compliance plan...</h2>
            <p className="text-gray-600">This will only take a moment.</p>
          </div>
        )}

      </div>
    </div>
  )
}
