"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, UserPlus, GraduationCap, Award, Clock, 
  CheckCircle, Mail, Download, RefreshCw, Loader2,
  AlertTriangle, MoreVertical, Trash2, Send
} from "lucide-react"
import { TRACK_LABELS, getTotalSections, type TrainingTrack } from "@/lib/training-data"

interface Assignment {
  id: string
  user_email: string
  user_name: string
  track: TrainingTrack
  status: 'pending' | 'in_progress' | 'completed'
  assigned_at: string
  completed_at: string | null
  progress_count: number
  certificate?: {
    certificate_number: string
    expires_at: string
  }
}

export default function TrainingSettingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const setupComplete = searchParams.get('setup') === 'complete'

  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    loadAssignments()
  }, [])

  const loadAssignments = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/training/assignments')
      if (!res.ok) throw new Error('Failed to load assignments')
      const data = await res.json()
      setAssignments(data.assignments || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  const sendReminder = async (assignmentId: string) => {
    setSending(assignmentId)
    try {
      const res = await fetch('/api/training/send-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId })
      })
      if (!res.ok) throw new Error('Failed to send reminder')
      // Show success (could add toast)
    } catch (err) {
      console.error('Failed to send reminder:', err)
    } finally {
      setSending(null)
    }
  }

  const deleteAssignment = async (assignmentId: string) => {
    if (!confirm('Are you sure you want to delete this training assignment?')) return
    
    try {
      const res = await fetch(`/api/training/assignments/${assignmentId}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('Failed to delete')
      loadAssignments()
    } catch (err) {
      console.error('Failed to delete:', err)
    }
  }

  // Stats
  const totalAssigned = assignments.length
  const completed = assignments.filter(a => a.status === 'completed').length
  const inProgress = assignments.filter(a => a.status === 'in_progress').length
  const pending = assignments.filter(a => a.status === 'pending').length
  const completionRate = totalAssigned > 0 ? Math.round((completed / totalAssigned) * 100) : 0

  // Group by track
  const byTrack = assignments.reduce((acc, a) => {
    acc[a.track] = acc[a.track] || []
    acc[a.track].push(a)
    return acc
  }, {} as Record<TrainingTrack, Assignment[]>)

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Setup complete banner */}
        {setupComplete && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium text-green-900">Team training assigned!</div>
                <div className="text-sm text-green-700">
                  Invite emails have been sent. Track progress below.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Training Management</h1>
            <p className="text-gray-600">Manage team training assignments and track progress</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={loadAssignments}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Link href="/onboarding/team-setup">
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Assign Training
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalAssigned}</div>
                  <div className="text-sm text-gray-600">Total Assigned</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{completed}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{inProgress + pending}</div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{completionRate}%</div>
                  <div className="text-sm text-gray-600">Completion Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* No assignments */}
        {assignments.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No Training Assigned Yet</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Get started by assigning compliance training to your team members.
              </p>
              <Link href="/onboarding/team-setup">
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Set Up Team Training
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Assignments by Track */}
        {Object.entries(byTrack).map(([track, trackAssignments]) => (
          <Card key={track} className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>{TRACK_LABELS[track as TrainingTrack]} Training</CardTitle>
                    <CardDescription>
                      {trackAssignments.length} assignee{trackAssignments.length !== 1 ? 's' : ''} • 
                      {getTotalSections(track as TrainingTrack)} sections
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Progress</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Assigned</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trackAssignments.map(assignment => {
                      const totalSections = getTotalSections(track as TrainingTrack)
                      const progressPercent = Math.round((assignment.progress_count / totalSections) * 100)

                      return (
                        <tr key={assignment.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <span className="font-medium">{assignment.user_name}</span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{assignment.user_email}</td>
                          <td className="py-3 px-4">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              assignment.status === 'completed' ? 'bg-green-100 text-green-700' :
                              assignment.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {assignment.status === 'completed' ? 'Completed' :
                               assignment.status === 'in_progress' ? 'In Progress' :
                               'Pending'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${assignment.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`}
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600">{progressPercent}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {new Date(assignment.assigned_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-2">
                              {assignment.status === 'completed' && assignment.certificate && (
                                <Link href={`/training/certificate/${assignment.certificate.certificate_number}`}>
                                  <Button variant="ghost" size="sm">
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </Link>
                              )}
                              {assignment.status !== 'completed' && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => sendReminder(assignment.id)}
                                  disabled={sending === assignment.id}
                                >
                                  {sending === assignment.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Mail className="w-4 h-4" />
                                  )}
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => deleteAssignment(assignment.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Expiring Certificates Warning */}
        {assignments.some(a => {
          if (!a.certificate?.expires_at) return false
          const daysUntilExpiry = Math.ceil(
            (new Date(a.certificate.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          )
          return daysUntilExpiry <= 30 && daysUntilExpiry > 0
        }) && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <div>
                  <div className="font-medium text-amber-900">Certificates Expiring Soon</div>
                  <div className="text-sm text-amber-700">
                    Some team members have certificates expiring within 30 days. They'll need to recertify.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
