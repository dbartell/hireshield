"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, UserPlus, Briefcase, Shield, Eye, 
  ArrowRight, ArrowLeft, Check, Loader2, X, Trash2
} from "lucide-react"

interface TeamMember {
  name: string
  email: string
}

interface TeamRoles {
  recruiters: TeamMember[]
  managers: TeamMember[]
  admins: TeamMember[]
  executives: TeamMember[]
}

const STEPS = [
  {
    key: 'recruiters' as const,
    title: 'Who handles recruiting at your company?',
    description: 'Add recruiters and talent acquisition specialists who use AI tools to source and screen candidates.',
    icon: Users,
    placeholder: { name: 'Jane Smith', email: 'jane@company.com' },
    required: true
  },
  {
    key: 'managers' as const,
    title: 'Who makes hiring decisions?',
    description: 'Add hiring managers who review AI-screened candidates and make employment decisions.',
    icon: Briefcase,
    placeholder: { name: 'John Doe', email: 'john@company.com' },
    required: true
  },
  {
    key: 'admins' as const,
    title: 'Who manages HR compliance?',
    description: 'Add HR directors or compliance officers who oversee your AI hiring program.',
    icon: Shield,
    placeholder: { name: 'Sarah Johnson', email: 'sarah@company.com' },
    required: true
  },
  {
    key: 'executives' as const,
    title: 'Any executives who should have visibility?',
    description: 'Add C-suite or leadership who need high-level awareness of AI compliance. This is optional.',
    icon: Eye,
    placeholder: { name: 'Mike CEO', email: 'mike@company.com' },
    required: false
  }
]

export default function TeamSetupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [roles, setRoles] = useState<TeamRoles>({
    recruiters: [{ name: '', email: '' }],
    managers: [{ name: '', email: '' }],
    admins: [{ name: '', email: '' }],
    executives: []
  })

  const step = STEPS[currentStep]
  const StepIcon = step.icon
  const currentMembers = roles[step.key]

  const updateMember = (index: number, field: 'name' | 'email', value: string) => {
    setRoles(prev => ({
      ...prev,
      [step.key]: prev[step.key].map((m, i) => 
        i === index ? { ...m, [field]: value } : m
      )
    }))
  }

  const addMember = () => {
    setRoles(prev => ({
      ...prev,
      [step.key]: [...prev[step.key], { name: '', email: '' }]
    }))
  }

  const removeMember = (index: number) => {
    if (currentMembers.length <= 1 && step.required) return
    setRoles(prev => ({
      ...prev,
      [step.key]: prev[step.key].filter((_, i) => i !== index)
    }))
  }

  const getValidMembers = (members: TeamMember[]) => {
    return members.filter(m => m.name.trim() && m.email.trim())
  }

  const canProceed = () => {
    if (!step.required) return true
    return getValidMembers(currentMembers).length > 0
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      // Prepare assignments
      const assignments = [
        ...getValidMembers(roles.recruiters).map(m => ({ ...m, track: 'recruiter' })),
        ...getValidMembers(roles.managers).map(m => ({ ...m, track: 'manager' })),
        ...getValidMembers(roles.admins).map(m => ({ ...m, track: 'admin' })),
        ...getValidMembers(roles.executives).map(m => ({ ...m, track: 'executive' }))
      ]

      if (assignments.length === 0) {
        setError('Please add at least one team member')
        setLoading(false)
        return
      }

      const res = await fetch('/api/training/assign-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignments })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to assign training')
      }

      // Success! Redirect to training management
      router.push('/settings/training?setup=complete')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const totalAssigned = 
    getValidMembers(roles.recruiters).length +
    getValidMembers(roles.managers).length +
    getValidMembers(roles.admins).length +
    getValidMembers(roles.executives).length

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Set Up Team Training</h1>
          <p className="text-gray-600">
            Assign AI hiring compliance training to your team members
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${i < currentStep ? 'bg-green-500 text-white' : ''}
                ${i === currentStep ? 'bg-blue-600 text-white' : ''}
                ${i > currentStep ? 'bg-gray-200 text-gray-500' : ''}
              `}>
                {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-12 h-1 mx-1 rounded ${i < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <StepIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentMembers.map((member, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Full name"
                      value={member.name}
                      onChange={(e) => updateMember(index, 'name', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={member.email}
                      onChange={(e) => updateMember(index, 'email', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {(currentMembers.length > 1 || !step.required) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMember(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              <Button variant="outline" onClick={addMember} className="w-full">
                <UserPlus className="w-4 h-4 mr-2" />
                Add another {step.key.slice(0, -1)}
              </Button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        {totalAssigned > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-blue-900">Training Summary</div>
                <div className="text-sm text-blue-700">
                  {totalAssigned} team member{totalAssigned !== 1 ? 's' : ''} will be assigned training
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">{totalAssigned}</div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed() || loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Assigning...
              </>
            ) : currentStep === STEPS.length - 1 ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Assign Training
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Skip option */}
        {!step.required && currentStep < STEPS.length - 1 && (
          <div className="text-center mt-4">
            <button
              onClick={() => setCurrentStep(s => s + 1)}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Skip this step
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
