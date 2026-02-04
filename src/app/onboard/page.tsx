'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, ArrowRight, ArrowLeft, AlertTriangle, Loader2, CheckCircle2, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { allStates, regulatedStates } from '@/data/states'
import { aiHiringTools, usageTypes } from '@/data/tools'

type Step = 'states' | 'tools' | 'usage' | 'employees' | 'email' | 'creating'

interface OnboardData {
  states: string[]
  tools: string[]
  usages: string[]
  employeeCount: string
  email: string
  company: string
}

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

export default function OnboardPage() {
  const [step, setStep] = useState<Step>('states')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [existingUser, setExistingUser] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const router = useRouter()
  
  const [data, setData] = useState<OnboardData>({
    states: [],
    tools: [],
    usages: [],
    employeeCount: '',
    email: '',
    company: ''
  })

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setIsLoggedIn(true)
        setCurrentUserId(user.id)
        
        // Check if they have states set up
        const { data: org } = await supabase
          .from('organizations')
          .select('states')
          .eq('id', user.id)
          .single()
        
        if (org?.states?.length > 0) {
          // Fully set up, go to dashboard
          router.push('/dashboard')
        }
        // Otherwise let them complete onboarding
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

  const createAccountAndContinue = async () => {
    setIsCreating(true)
    setError(null)
    setExistingUser(false)

    try {
      const riskScore = calculateRiskScore(data)
      const supabase = createClient()

      // If already logged in, just update their org and go to dashboard
      if (isLoggedIn && currentUserId) {
        await supabase
          .from('organizations')
          .update({
            name: data.company,
            states: data.states,
            quiz_tools: data.tools,
            quiz_usages: data.usages,
            quiz_risk_score: riskScore,
            employee_count: data.employeeCount,
          })
          .eq('id', currentUserId)
        
        router.push('/dashboard?welcome=true')
        return
      }
      
      const res = await fetch('/api/onboard/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          company: data.company,
          states: data.states,
          tools: data.tools,
          usages: data.usages,
          employeeCount: data.employeeCount,
          riskScore,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        setError(result.error || 'Failed to create account')
        setIsCreating(false)
        return
      }

      // Existing user - magic link sent (or fallback to sign in)
      if (result.existingUser) {
        if (result.magicLinkSent) {
          setMagicLinkSent(true)
        } else {
          setExistingUser(true)
        }
        setIsCreating(false)
        return
      }

      // New user - sign them in with the temp password
      if (result.tempPassword && result.email) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: result.email,
          password: result.tempPassword,
        })

        if (signInError) {
          console.error('Auto sign-in failed:', signInError)
          setError('Account created but sign-in failed. Please try logging in.')
          setIsCreating(false)
          return
        }

        // Success! Go to dashboard
        router.push('/dashboard?welcome=true')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setIsCreating(false)
    }
  }

  const progress = ['states', 'tools', 'usage', 'employees', 'email'].indexOf(step) + 1
  const totalSteps = 5

  // Use light mode only to avoid hydration mismatch
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                {aiHiringTools.map(tool => (
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
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => goToStep('states')} className="border-gray-300 text-gray-700 hover:bg-gray-100">
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back
                </Button>
                <Button 
                  onClick={() => goToStep('usage')} 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={data.tools.length === 0}
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
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {isLoggedIn ? 'Confirm your setup' : 'Create your account'}
              </h1>
              <p className="text-gray-600 mb-6">
                {isLoggedIn ? 'Review your details and continue to your dashboard.' : 'We\'ll set up your personalized compliance dashboard.'}
              </p>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              
              {magicLinkSent ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email!</h2>
                  <p className="text-gray-600 mb-4">
                    We sent a sign-in link to <strong className="text-gray-900">{data.email}</strong>
                  </p>
                  <p className="text-sm text-gray-500">
                    Click the link in your email to access your dashboard instantly.
                  </p>
                </div>
              ) : existingUser ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome back!</h2>
                  <p className="text-gray-600 mb-4">
                    You already have an account with <strong className="text-gray-900">{data.email}</strong>
                  </p>
                  <Button 
                    onClick={() => router.push(`/login?email=${encodeURIComponent(data.email)}&redirect=/dashboard`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Sign In to Continue
                  </Button>
                </div>
              ) : (
                <>
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
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => goToStep('usage')} className="border-gray-300 text-gray-700 hover:bg-gray-100">
                      <ArrowLeft className="mr-2 w-4 h-4" /> Back
                    </Button>
                    <Button 
                      onClick={createAccountAndContinue}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      disabled={!data.email || !data.company || isCreating}
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {isLoggedIn ? 'Saving...' : 'Creating account...'}
                        </>
                      ) : (
                        <>
                          Get My Compliance Plan <ArrowRight className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <p className="text-xs text-gray-500 text-center mt-4">
                    By continuing, you agree to our Terms of Service. No credit card required.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Creating state */}
        {step === 'creating' && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Setting up your dashboard...</h2>
            <p className="text-gray-600">This will only take a moment.</p>
          </div>
        )}

        {/* Preview what they'll get */}
        {step === 'email' && !existingUser && (
          <div className="mt-8 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-500" />
              Your Compliance Summary
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-gray-900">{data.states.filter(s => regulatedStates.includes(s)).length}</div>
                <div className="text-xs text-gray-500">Regulated States</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-gray-900">{data.tools.length}</div>
                <div className="text-xs text-gray-500">AI Tools</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-amber-500">{calculateRiskScore(data)}</div>
                <div className="text-xs text-gray-500">Risk Score</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
