"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  PlayCircle, CheckCircle, Clock, Award, Lock, User, Users,
  ArrowRight, Loader2, GraduationCap, Download, Mail, X, Plus, Trash2
} from "lucide-react"
import { getTrackData, TRACK_LABELS, type TrainingTrack } from "@/lib/training-data"
import { TaskHeader } from "@/components/task-header"

interface Assignment {
  id: string
  track: TrainingTrack
  status: 'pending' | 'in_progress' | 'completed'
  user_name: string
  completed_at: string | null
  certificate_id: string | null
  progress: {
    section_number: number
    completed_at: string | null
  }[]
  certificate?: {
    certificate_number: string
    issued_at: string
    expires_at: string
    pdf_url: string | null
  }
}

interface TeamMember {
  name: string
  email: string
}

type PathChoice = null | 'just-me' | 'my-team'

export default function TrainingPage() {
  const router = useRouter()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pathChoice, setPathChoice] = useState<PathChoice>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([{ name: '', email: '' }])
  const [sending, setSending] = useState(false)
  const [showTeamForm, setShowTeamForm] = useState(false)

  useEffect(() => {
    loadAssignments()
  }, [])

  const loadAssignments = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/training/my-assignments')
      if (!res.ok) throw new Error('Failed to load assignments')
      const data = await res.json()
      setAssignments(data.assignments || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  const handleStartSoloTraining = async () => {
    setSending(true)
    try {
      const res = await fetch('/api/training/assign-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          assignments: [{ name: 'Self', email: '', track: 'admin', selfAssign: true }]
        })
      })
      if (!res.ok) throw new Error('Failed to start training')
      await loadAssignments()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start')
    } finally {
      setSending(false)
    }
  }

  const handleInviteTeam = async () => {
    const validMembers = teamMembers.filter(m => m.name.trim() && m.email.trim())
    if (validMembers.length === 0) {
      setError('Please add at least one team member')
      return
    }

    setSending(true)
    try {
      const res = await fetch('/api/training/assign-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          assignments: validMembers.map(m => ({ ...m, track: 'recruiter' }))
        })
      })
      if (!res.ok) throw new Error('Failed to send invitations')
      setShowTeamForm(false)
      setTeamMembers([{ name: '', email: '' }])
      await loadAssignments()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send')
    } finally {
      setSending(false)
    }
  }

  const addTeamMember = () => {
    setTeamMembers(prev => [...prev, { name: '', email: '' }])
  }

  const removeTeamMember = (index: number) => {
    if (teamMembers.length <= 1) return
    setTeamMembers(prev => prev.filter((_, i) => i !== index))
  }

  const updateTeamMember = (index: number, field: 'name' | 'email', value: string) => {
    setTeamMembers(prev => prev.map((m, i) => 
      i === index ? { ...m, [field]: value } : m
    ))
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  // No assignments - show path selection
  if (assignments.length === 0 && !showTeamForm) {
    return (
      <>
        <TaskHeader
          title="Team Training"
          description="AI Hiring Compliance Certification"
          estimatedTime="~15 min each"
        />
        <div className="p-6 md:p-8 max-w-3xl mx-auto">

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Who needs training?</h2>
          <p className="text-gray-600">
            Our 15-minute certification covers AI hiring compliance essentials.
          </p>
        </div>

        {/* Path Selection */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Just Me */}
          <Card 
            className={`cursor-pointer transition-all hover:border-blue-300 ${
              pathChoice === 'just-me' ? 'ring-2 ring-blue-500 border-blue-500' : ''
            }`}
            onClick={() => setPathChoice('just-me')}
          >
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-1">Just me</h3>
              <p className="text-sm text-gray-600">
                I'm the only one handling hiring
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>15 min certification</span>
              </div>
            </CardContent>
          </Card>

          {/* My Team */}
          <Card 
            className={`cursor-pointer transition-all hover:border-blue-300 ${
              pathChoice === 'my-team' ? 'ring-2 ring-blue-500 border-blue-500' : ''
            }`}
            onClick={() => setPathChoice('my-team')}
          >
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-1">My team</h3>
              <p className="text-sm text-gray-600">
                Multiple people involved in hiring
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                <Mail className="w-4 h-4" />
                <span>Invite via email</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        {pathChoice === 'just-me' && (
          <Button 
            className="w-full" 
            size="lg"
            onClick={handleStartSoloTraining}
            disabled={sending}
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <PlayCircle className="w-4 h-4 mr-2" />
                Start My Training Now
              </>
            )}
          </Button>
        )}

        {pathChoice === 'my-team' && (
          <Button 
            className="w-full" 
            size="lg"
            onClick={() => setShowTeamForm(true)}
          >
            <Users className="w-4 h-4 mr-2" />
            Add Team Members
          </Button>
        )}

        {/* Info */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">What's included:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>✓ Understanding AI hiring laws by state</li>
            <li>✓ Disclosure requirements for candidates</li>
            <li>✓ Best practices for fair AI use</li>
            <li>✓ Certificate of completion (1 year validity)</li>
          </ul>
        </div>
        </div>
      </>
    )
  }

  // Team invitation form
  if (showTeamForm) {
    return (
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Invite Your Team</h1>
              <p className="text-gray-600 mt-1">Send training invitations via email</p>
            </div>
            <Button variant="ghost" onClick={() => setShowTeamForm(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Full name"
                      value={member.name}
                      onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={member.email}
                      onChange={(e) => updateTeamMember(index, 'email', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {teamMembers.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTeamMember(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              <Button variant="outline" onClick={addTeamMember} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add another person
              </Button>
            </div>

            <div className="mt-6 pt-4 border-t flex gap-3">
              <Button variant="outline" onClick={() => setShowTeamForm(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleInviteTeam} 
                disabled={sending}
                className="flex-1"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Invitations
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-sm text-gray-500 text-center mt-4">
          Each person will receive an email with a link to start their training.
        </p>
      </div>
    )
  }

  // Has assignments - show progress
  const completedCount = assignments.filter(a => a.status === 'completed').length
  const totalCount = assignments.length

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Training</h1>
          <p className="text-gray-600 mt-1">
            {completedCount} of {totalCount} certified
          </p>
        </div>
        <Button variant="outline" onClick={() => setShowTeamForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add People
        </Button>
      </div>

      {/* Progress Summary */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
              completedCount === totalCount ? 'bg-green-100' : 'bg-blue-100'
            }`}>
              {completedCount === totalCount ? (
                <Award className="w-7 h-7 text-green-600" />
              ) : (
                <GraduationCap className="w-7 h-7 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Team Completion</span>
                <span className="text-sm text-gray-600">{completedCount}/{totalCount}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    completedCount === totalCount ? 'bg-green-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${(completedCount / totalCount) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignment Cards */}
      <div className="space-y-4">
        {assignments.map(assignment => {
          const track = getTrackData(assignment.track)
          const totalSections = track.sections.length
          const completedSections = assignment.progress.filter(p => p.completed_at).length
          const progressPercent = Math.round((completedSections / totalSections) * 100)
          
          // Find next incomplete section
          const nextSection = track.sections.find(
            s => !assignment.progress.find(p => p.section_number === s.number && p.completed_at)
          )

          return (
            <Card key={assignment.id} className={assignment.status === 'completed' ? 'border-green-200 bg-green-50' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    assignment.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {assignment.status === 'completed' ? (
                      <Award className="w-6 h-6 text-green-600" />
                    ) : (
                      <User className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{assignment.user_name || 'You'}</h3>
                        <p className="text-sm text-gray-500">{track.title}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        assignment.status === 'completed' ? 'bg-green-100 text-green-700' :
                        assignment.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {assignment.status === 'completed' ? 'Certified' :
                         assignment.status === 'in_progress' ? 'In Progress' :
                         'Not Started'}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    {assignment.status !== 'completed' && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">Progress</span>
                          <span className="text-xs text-gray-500">{progressPercent}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Certificate Info */}
                    {assignment.status === 'completed' && assignment.certificate && (
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-green-700">
                          Certificate #{assignment.certificate.certificate_number} • 
                          Expires {new Date(assignment.certificate.expires_at).toLocaleDateString()}
                        </span>
                        <Link href={`/training/certificate/${assignment.certificate.certificate_number}`}>
                          <Button variant="outline" size="sm">
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        </Link>
                      </div>
                    )}

                    {/* Continue/Start Button */}
                    {assignment.status !== 'completed' && nextSection && (
                      <div className="mt-4">
                        <Link href={`/training/${assignment.track}/${nextSection.number}?a=${assignment.id}`}>
                          <Button size="sm">
                            {assignment.status === 'pending' ? 'Start' : 'Continue'}
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Invite More */}
      <Card className="mt-6 border-dashed">
        <CardContent className="pt-6">
          <button 
            onClick={() => setShowTeamForm(true)}
            className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700"
          >
            <Plus className="w-5 h-5" />
            <span>Invite more team members</span>
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
