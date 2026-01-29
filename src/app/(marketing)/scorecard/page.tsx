"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight, ArrowLeft, AlertTriangle, Shield } from "lucide-react"
import { allStates, regulatedStates, stateRequirements } from "@/data/states"
import { aiHiringTools, usageTypes } from "@/data/tools"

type Step = 'states' | 'tools' | 'usage' | 'email' | 'results'

interface ScorecardData {
  states: string[]
  tools: string[]
  usages: string[]
  email: string
  company: string
}

export default function ScorecardPage() {
  const [step, setStep] = useState<Step>('states')
  const [data, setData] = useState<ScorecardData>({
    states: [],
    tools: [],
    usages: [],
    email: '',
    company: ''
  })

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

  const calculateScore = () => {
    let riskScore = 0
    const findings: { state: string; issue: string; severity: 'low' | 'medium' | 'high' | 'critical' }[] = []

    // Check each regulated state
    data.states.forEach(stateCode => {
      if (regulatedStates.includes(stateCode)) {
        riskScore += 25

        // High-risk usages
        const highRiskUsages = ['screening', 'ranking', 'interview-analysis', 'assessment-scoring', 'termination', 'promotion']
        const hasHighRiskUsage = data.usages.some(u => highRiskUsages.includes(u))

        if (hasHighRiskUsage) {
          riskScore += 15
          findings.push({
            state: stateCode,
            issue: `AI used for high-risk employment decisions in ${stateCode}`,
            severity: 'high'
          })
        }

        // Add state-specific findings
        const stateReq = stateRequirements.find(s => s.code === stateCode)
        if (stateReq) {
          findings.push({
            state: stateCode,
            issue: `Must comply with ${stateReq.law}`,
            severity: 'critical'
          })
        }
      }
    })

    // Tool-specific risks
    if (data.tools.length > 0) {
      riskScore += Math.min(data.tools.length * 5, 20)
    }

    // Cap at 100
    riskScore = Math.min(riskScore, 100)

    return { riskScore, findings }
  }

  const { riskScore, findings } = calculateScore()

  const getRiskLevel = (score: number) => {
    if (score >= 75) return { level: 'Critical', color: 'text-red-600', bg: 'bg-red-100' }
    if (score >= 50) return { level: 'High', color: 'text-orange-600', bg: 'bg-orange-100' }
    if (score >= 25) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100' }
  }

  const risk = getRiskLevel(riskScore)

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Step {['states', 'tools', 'usage', 'email', 'results'].indexOf(step) + 1} of 5</span>
            <span>{Math.round((['states', 'tools', 'usage', 'email', 'results'].indexOf(step) + 1) / 5 * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-blue-600 rounded-full transition-all"
              style={{ width: `${(['states', 'tools', 'usage', 'email', 'results'].indexOf(step) + 1) / 5 * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: States */}
        {step === 'states' && (
          <Card>
            <CardHeader>
              <CardTitle>Where do you hire?</CardTitle>
              <CardDescription>
                Select all states where you have employees or hire candidates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6 max-h-80 overflow-y-auto">
                {allStates.map(state => (
                  <button
                    key={state.code}
                    onClick={() => toggleState(state.code)}
                    className={`p-2 text-sm rounded-lg border transition-colors ${
                      data.states.includes(state.code)
                        ? 'bg-blue-50 border-blue-600 text-blue-700'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    } ${regulatedStates.includes(state.code) ? 'font-medium' : ''}`}
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
                    You've selected states with active AI hiring regulations.
                  </p>
                </div>
              )}
              <Button 
                onClick={() => setStep('tools')} 
                className="w-full"
                disabled={data.states.length === 0}
              >
                Continue <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Tools */}
        {step === 'tools' && (
          <Card>
            <CardHeader>
              <CardTitle>What hiring tools do you use?</CardTitle>
              <CardDescription>
                Select all tools used in your recruiting and hiring process.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                {aiHiringTools.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => toggleTool(tool.id)}
                    className={`p-3 text-left rounded-lg border transition-colors ${
                      data.tools.includes(tool.id)
                        ? 'bg-blue-50 border-blue-600'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{tool.name}</div>
                    <div className="text-xs text-gray-500">{tool.category}</div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('states')}>
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back
                </Button>
                <Button 
                  onClick={() => setStep('usage')} 
                  className="flex-1"
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
          <Card>
            <CardHeader>
              <CardTitle>How is AI used in your hiring?</CardTitle>
              <CardDescription>
                Select all ways these tools influence hiring decisions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-6">
                {usageTypes.map(usage => (
                  <button
                    key={usage.id}
                    onClick={() => toggleUsage(usage.id)}
                    className={`w-full p-3 text-left rounded-lg border transition-colors ${
                      data.usages.includes(usage.id)
                        ? 'bg-blue-50 border-blue-600'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{usage.label}</div>
                    <div className="text-xs text-gray-500">{usage.description}</div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('tools')}>
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back
                </Button>
                <Button 
                  onClick={() => setStep('email')} 
                  className="flex-1"
                  disabled={data.usages.length === 0}
                >
                  Continue <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Email capture */}
        {step === 'email' && (
          <Card>
            <CardHeader>
              <CardTitle>Get your compliance report</CardTitle>
              <CardDescription>
                Enter your details to receive your personalized compliance score and recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={data.company}
                    onChange={(e) => setData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Acme Inc."
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('usage')}>
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back
                </Button>
                <Button 
                  onClick={() => setStep('results')} 
                  className="flex-1"
                  variant="cta"
                  disabled={!data.email || !data.company}
                >
                  Get My Score <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-4">
                We'll send your detailed report to this email. No spam, ever.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Results */}
        {step === 'results' && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Your Compliance Score</CardTitle>
                <CardDescription>{data.company}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${risk.bg}`}>
                    <div>
                      <div className={`text-4xl font-bold ${risk.color}`}>{riskScore}</div>
                      <div className={`text-sm font-medium ${risk.color}`}>{risk.level} Risk</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Summary</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-2xl font-bold">{data.states.filter(s => regulatedStates.includes(s)).length}</div>
                      <div className="text-xs text-gray-500">Regulated States</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-2xl font-bold">{data.tools.length}</div>
                      <div className="text-xs text-gray-500">AI Tools</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-2xl font-bold">{findings.length}</div>
                      <div className="text-xs text-gray-500">Action Items</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {findings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Findings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {findings.map((finding, i) => (
                      <div key={i} className={`p-3 rounded-lg border-l-4 ${
                        finding.severity === 'critical' ? 'bg-red-50 border-red-500' :
                        finding.severity === 'high' ? 'bg-orange-50 border-orange-500' :
                        finding.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                        'bg-green-50 border-green-500'
                      }`}>
                        <div className="font-medium text-sm">{finding.state}</div>
                        <div className="text-sm text-gray-600">{finding.issue}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-blue-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Shield className="w-12 h-12" />
                  <div>
                    <h3 className="font-semibold text-lg">Ready to get compliant?</h3>
                    <p className="text-blue-100 text-sm">
                      HireShield can help you fix these issues with automated documents, training, and tracking.
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 flex-1">
                    Start Free Trial
                  </Button>
                  <Button variant="outline" className="border-white text-white hover:bg-blue-700">
                    Talk to Sales
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
