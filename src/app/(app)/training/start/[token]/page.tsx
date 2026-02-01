"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  GraduationCap, Clock, Award, ArrowRight, Loader2, 
  AlertTriangle, CheckCircle
} from "lucide-react"
import { getTrackData, TRACK_LABELS, type TrainingTrack } from "@/lib/training-data"

interface Assignment {
  id: string
  user_name: string
  user_email: string
  track: TrainingTrack
  status: string
  org_name: string
}

interface PageProps {
  params: Promise<{ token: string }>
}

export default function StartTrainingPage({ params }: PageProps) {
  const { token } = use(params)
  const router = useRouter()
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadAssignment()
  }, [token])

  const loadAssignment = async () => {
    try {
      const res = await fetch(`/api/training/start/${token}`)
      if (!res.ok) {
        if (res.status === 404) {
          setError('This training link is invalid or has expired.')
        } else {
          throw new Error('Failed to load assignment')
        }
        return
      }
      const data = await res.json()
      setAssignment(data.assignment)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  const startTraining = () => {
    if (!assignment) return
    router.push(`/training/${assignment.track}/1?t=${token}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error || !assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Link Invalid or Expired</h2>
            <p className="text-gray-600 mb-6">
              {error || 'This training link is no longer valid. Please contact your administrator for a new link.'}
            </p>
            <Link href="/login">
              <Button variant="outline">Sign In Instead</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const track = getTrackData(assignment.track)
  const totalSections = track.sections.length
  const estimatedTime = track.sections.reduce((acc, s) => acc + s.videoDuration, 0)
  const estimatedMinutes = Math.round(estimatedTime / 60)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Welcome, {assignment.user_name}!</CardTitle>
          <CardDescription>
            {assignment.org_name} has assigned you compliance training
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Track info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-lg mb-1">{track.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{track.description}</p>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{totalSections}</div>
                <div className="text-xs text-gray-500">Sections</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{estimatedMinutes}</div>
                <div className="text-xs text-gray-500">Minutes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-500">
                  <Award className="w-8 h-8 mx-auto" />
                </div>
                <div className="text-xs text-gray-500">Certificate</div>
              </div>
            </div>
          </div>

          {/* What's included */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">What you'll learn:</h4>
            <ul className="space-y-2">
              {track.sections.map(section => (
                <li key={section.number} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>{section.title}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <Button onClick={startTraining} className="w-full" size="lg">
            Start Training
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Your progress will be saved automatically. You can continue later from where you left off.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
