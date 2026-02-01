"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  PlayCircle, CheckCircle, Clock, Award, Lock, 
  ArrowRight, Loader2, GraduationCap, Users,
  Download, ExternalLink
} from "lucide-react"
import { getTrainingData, markCourseComplete, getCourseContent, Course } from "@/lib/actions/training"
import { getTrackData, TRACK_LABELS, type TrainingTrack } from "@/lib/training-data"

interface Completion {
  id: string
  course_id: string
  completed_at: string
  score: number
}

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

export default function TrainingPage() {
  const router = useRouter()
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadAssignments}>Retry</Button>
        </div>
      </div>
    )
  }

  // No assignments - show info page
  if (assignments.length === 0) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Training</h1>
            <p className="text-gray-600">AI Hiring Compliance Training for your team</p>
          </div>

          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No Training Assigned</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You don't have any training assigned yet. If you're an admin, you can set up training for your team.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/settings/training">
                  <Button variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Training
                  </Button>
                </Link>
                <Link href="/onboarding/team-setup">
                  <Button>
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Set Up Team Training
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Training</h1>
          <p className="text-gray-600">Complete your assigned compliance training modules</p>
        </div>

        {/* Assignment Cards */}
        <div className="grid gap-6">
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
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                        assignment.status === 'completed' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {assignment.status === 'completed' ? (
                          <Award className="w-7 h-7 text-green-600" />
                        ) : (
                          <GraduationCap className="w-7 h-7 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <CardTitle>{track.title}</CardTitle>
                        <CardDescription>{track.description}</CardDescription>
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      assignment.status === 'completed' ? 'bg-green-100 text-green-700' :
                      assignment.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {assignment.status === 'completed' ? 'Completed' :
                       assignment.status === 'in_progress' ? 'In Progress' :
                       'Not Started'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium">{completedSections}/{totalSections} sections</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          assignment.status === 'completed' ? 'bg-green-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Sections list */}
                  <div className="space-y-3 mb-6">
                    {track.sections.map(section => {
                      const progress = assignment.progress.find(p => p.section_number === section.number)
                      const isComplete = !!progress?.completed_at
                      const isCurrent = nextSection?.number === section.number
                      const isLocked = !isComplete && !isCurrent && section.number !== 1

                      return (
                        <div 
                          key={section.number}
                          className={`flex items-center gap-4 p-3 rounded-lg border ${
                            isComplete ? 'bg-green-50 border-green-200' :
                            isCurrent ? 'bg-blue-50 border-blue-200' :
                            isLocked ? 'bg-gray-50 border-gray-200 opacity-60' :
                            'bg-white border-gray-200'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isComplete ? 'bg-green-500' :
                            isCurrent ? 'bg-blue-500' :
                            'bg-gray-300'
                          }`}>
                            {isComplete ? (
                              <CheckCircle className="w-5 h-5 text-white" />
                            ) : isLocked ? (
                              <Lock className="w-4 h-4 text-gray-500" />
                            ) : (
                              <span className="text-white font-medium text-sm">{section.number}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{section.title}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              {Math.round(section.videoDuration / 60)} min
                            </div>
                          </div>
                          {isCurrent && assignment.status !== 'completed' && (
                            <Link href={`/training/${assignment.track}/${section.number}?a=${assignment.id}`}>
                              <Button size="sm">
                                {progress ? 'Continue' : 'Start'}
                                <ArrowRight className="w-4 h-4 ml-1" />
                              </Button>
                            </Link>
                          )}
                          {isComplete && !isCurrent && (
                            <Link href={`/training/${assignment.track}/${section.number}?a=${assignment.id}`}>
                              <Button variant="ghost" size="sm">Review</Button>
                            </Link>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Certificate */}
                  {assignment.status === 'completed' && assignment.certificate && (
                    <div className="p-4 bg-white rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Award className="w-10 h-10 text-yellow-500" />
                          <div>
                            <div className="font-semibold">Certificate Earned</div>
                            <div className="text-sm text-gray-600">
                              #{assignment.certificate.certificate_number} • Expires {new Date(assignment.certificate.expires_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Link href={`/training/certificate/${assignment.certificate.certificate_number}`}>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* CTA for incomplete */}
                  {assignment.status !== 'completed' && nextSection && (
                    <Link href={`/training/${assignment.track}/${nextSection.number}?a=${assignment.id}`}>
                      <Button className="w-full">
                        {assignment.status === 'pending' ? 'Start Training' : 'Continue Training'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
