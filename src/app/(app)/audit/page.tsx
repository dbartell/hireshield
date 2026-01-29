"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertTriangle, ArrowRight, ArrowLeft, Download, FileText } from "lucide-react"
import { allStates, regulatedStates, stateRequirements } from "@/data/states"
import { aiHiringTools, usageTypes } from "@/data/tools"

type AuditStep = 'states' | 'tools' | 'usage' | 'results'

interface AuditData {
  states: string[]
  tools: string[]
  usages: string[]
}

export default function AuditPage() {
  const [step, setStep] = useState<AuditStep>('states')
  const [data, setData] = useState<AuditData>({
    states: [],
    tools: [],
    usages: []
  })

  const toggleItem = (key: keyof AuditData, value: string) => {
    setData(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value]
    }))
  }

  const calculateResults = () => {
    let riskScore = 0
    const findings: { state: string; requirement: string; status: 'compliant' | 'at-risk' | 'non-compliant'; action: string }[] = []

    data.states.forEach(stateCode => {
      if (regulatedStates.includes(stateCode)) {
        const stateReq = stateRequirements.find(s => s.code === stateCode)
        if (stateReq) {
          riskScore += 20
          
          // Check for high-risk usages
          const highRiskUsages = ['screening', 'ranking', 'interview-analysis', 'termination']
          const hasHighRisk = data.usages.some(u => highRiskUsages.includes(u))
          
          findings.push({
            state: stateReq.name,
            requirement: `${stateReq.law} - Disclosure Required`,
            status: 'non-compliant',
            action: 'Generate disclosure notice for candidates/employees'
          })

          if (stateCode === 'CO') {
            findings.push({
              state: stateReq.name,
              requirement: 'Impact Assessment Required',
              status: 'non-compliant',
              action: 'Complete impact assessment template'
            })
          }

          if (stateCode === 'NYC') {
            findings.push({
              state: stateReq.name,
              requirement: 'Annual Bias Audit Required',
              status: 'at-risk',
              action: 'Schedule bias audit with independent auditor'
            })
          }

          if (hasHighRisk) {
            riskScore += 15
            findings.push({
              state: stateReq.name,
              requirement: 'High-risk AI usage detected',
              status: 'at-risk',
              action: 'Review AI usage for potential discrimination'
            })
          }
        }
      }
    })

    riskScore = Math.min(riskScore, 100)
    return { riskScore, findings }
  }

  const { riskScore, findings } = calculateResults()

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Compliance Audit</h1>
          <p className="text-gray-600">Assess your AI hiring tools against state regulations</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {['states', 'tools', 'usage', 'results'].map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  ['states', 'tools', 'usage', 'results'].indexOf(step) >= i
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {i + 1}
                </div>
                {i < 3 && (
                  <div className={`w-24 h-1 mx-2 ${
                    ['states', 'tools', 'usage', 'results'].indexOf(step) > i
                      ? 'bg-blue-600'
                      : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>States</span>
            <span>Tools</span>
            <span>Usage</span>
            <span>Results</span>
          </div>
        </div>

        {/* Step 1: States */}
        {step === 'states' && (
          <Card>
            <CardHeader>
              <CardTitle>Where do you hire employees?</CardTitle>
              <CardDescription>Select all states where you have employees or conduct hiring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-6 max-h-96 overflow-y-auto">
                {allStates.map(state => (
                  <button
                    key={state.code}
                    onClick={() => toggleItem('states', state.code)}
                    className={`p-2 text-sm rounded-lg border transition-colors text-left ${
                      data.states.includes(state.code)
                        ? 'bg-blue-50 border-blue-600 text-blue-700'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
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
                    {data.states.filter(s => regulatedStates.includes(s)).length} state(s) with active AI hiring regulations selected
                  </p>
                </div>
              )}
              <Button onClick={() => setStep('tools')} disabled={data.states.length === 0}>
                Continue <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Tools */}
        {step === 'tools' && (
          <Card>
            <CardHeader>
              <CardTitle>What AI hiring tools do you use?</CardTitle>
              <CardDescription>Select all tools used in your recruiting and hiring process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-2 mb-6">
                {aiHiringTools.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => toggleItem('tools', tool.id)}
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
                <Button onClick={() => setStep('usage')} disabled={data.tools.length === 0}>
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
              <CardTitle>How are these tools used?</CardTitle>
              <CardDescription>Select all ways AI influences your employment decisions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-6">
                {usageTypes.map(usage => (
                  <button
                    key={usage.id}
                    onClick={() => toggleItem('usages', usage.id)}
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
                <Button onClick={() => setStep('results')} disabled={data.usages.length === 0}>
                  View Results <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Results */}
        {step === 'results' && (
          <div className="space-y-6">
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Audit Results</CardTitle>
                <CardDescription>Based on your selections, here are your compliance findings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{data.states.filter(s => regulatedStates.includes(s)).length}</div>
                    <div className="text-sm text-gray-500">Regulated States</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{data.tools.length}</div>
                    <div className="text-sm text-gray-500">AI Tools</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600">{findings.length}</div>
                    <div className="text-sm text-gray-500">Action Items</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className={`text-3xl font-bold ${riskScore > 50 ? 'text-red-600' : 'text-yellow-600'}`}>{riskScore}</div>
                    <div className="text-sm text-gray-500">Risk Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Findings */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Findings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {findings.map((finding, i) => (
                    <div key={i} className={`p-4 rounded-lg border-l-4 ${
                      finding.status === 'non-compliant' ? 'bg-red-50 border-red-500' :
                      finding.status === 'at-risk' ? 'bg-orange-50 border-orange-500' :
                      'bg-green-50 border-green-500'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium">{finding.state}</div>
                          <div className="text-sm text-gray-600">{finding.requirement}</div>
                          <div className="text-sm mt-2">
                            <span className="font-medium">Action: </span>{finding.action}
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          finding.status === 'non-compliant' ? 'bg-red-100 text-red-700' :
                          finding.status === 'at-risk' ? 'bg-orange-100 text-orange-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {finding.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button className="h-auto py-4" variant="outline">
                    <div className="flex items-center gap-3">
                      <Download className="w-5 h-5" />
                      <div className="text-left">
                        <div className="font-medium">Download Report</div>
                        <div className="text-xs text-gray-500">PDF audit summary</div>
                      </div>
                    </div>
                  </Button>
                  <Button className="h-auto py-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5" />
                      <div className="text-left">
                        <div className="font-medium">Generate Documents</div>
                        <div className="text-xs text-gray-500">Create compliance documents</div>
                      </div>
                    </div>
                  </Button>
                </div>
                <div className="mt-4">
                  <Button variant="outline" onClick={() => setStep('states')}>
                    <ArrowLeft className="mr-2 w-4 h-4" /> Run New Audit
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
