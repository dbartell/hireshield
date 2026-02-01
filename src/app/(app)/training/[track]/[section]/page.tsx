"use client"

import { useState, useEffect, use } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  PlayCircle, CheckCircle, Clock, ArrowLeft, ArrowRight, 
  Loader2, BookOpen, Video, FileQuestion
} from "lucide-react"
import { Quiz } from "@/components/training/quiz"
import { getTrackData, type TrainingTrack } from "@/lib/training-data"

interface PageProps {
  params: Promise<{ track: string; section: string }>
}

export default function TrainingSectionPage({ params }: PageProps) {
  const { track: trackParam, section: sectionParam } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const assignmentId = searchParams.get('a')
  const token = searchParams.get('t')

  const [loading, setLoading] = useState(true)
  const [videoWatched, setVideoWatched] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [sectionComplete, setSectionComplete] = useState(false)

  const track = getTrackData(trackParam as TrainingTrack)
  const sectionNumber = parseInt(sectionParam)
  const section = track.sections.find(s => s.number === sectionNumber)
  const isLastSection = sectionNumber === track.sections.length
  const nextSection = sectionNumber + 1

  useEffect(() => {
    // Load progress for this section
    loadProgress()
  }, [])

  const loadProgress = async () => {
    try {
      const params = new URLSearchParams()
      if (assignmentId) params.set('assignmentId', assignmentId)
      if (token) params.set('token', token)
      params.set('section', sectionNumber.toString())

      const res = await fetch(`/api/training/section-progress?${params}`)
      if (res.ok) {
        const data = await res.json()
        if (data.completed) {
          setSectionComplete(true)
          setVideoWatched(true)
        } else if (data.videoComplete) {
          setVideoWatched(true)
        }
      }
    } catch (err) {
      console.error('Failed to load progress:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkVideoComplete = async () => {
    try {
      await fetch('/api/training/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId,
          token,
          sectionNumber,
          action: 'complete_video'
        })
      })
      setVideoWatched(true)
      setShowQuiz(true)
    } catch (err) {
      console.error('Failed to mark video complete:', err)
    }
  }

  const handleQuizSubmit = async (answers: Record<string, number>) => {
    const res = await fetch('/api/training/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assignmentId,
        token,
        sectionNumber,
        action: 'submit_quiz',
        quizAnswers: answers
      })
    })

    if (!res.ok) throw new Error('Failed to submit quiz')
    return res.json()
  }

  const handleContinue = () => {
    if (isLastSection) {
      // Go back to training overview
      router.push('/training')
    } else {
      // Go to next section
      const params = new URLSearchParams()
      if (assignmentId) params.set('a', assignmentId)
      if (token) params.set('t', token)
      router.push(`/training/${trackParam}/${nextSection}?${params}`)
    }
  }

  if (!section) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-red-600 mb-4">Section not found</p>
          <Link href="/training">
            <Button>Back to Training</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/training"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Training
          </Link>
          <div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
            <span className="font-medium">{track.title}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Section {sectionNumber}: {section.title}
          </h1>
          <p className="text-gray-600 mt-1">{section.description}</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-600">
              Section {sectionNumber} of {track.sections.length}
            </span>
            {sectionComplete && (
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                Completed
              </span>
            )}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all"
              style={{ width: `${(sectionNumber / track.sections.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        {showQuiz || (videoWatched && !sectionComplete) ? (
          <Quiz
            questions={section.quiz}
            sectionNumber={sectionNumber}
            onSubmit={handleQuizSubmit}
            onContinue={handleContinue}
          />
        ) : sectionComplete ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Section Complete!</h2>
                <p className="text-gray-600 mb-6">
                  You've already completed this section.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={() => {
                    setShowQuiz(false)
                    setVideoWatched(false)
                    setSectionComplete(false)
                  }}>
                    Review Content
                  </Button>
                  <Button onClick={handleContinue}>
                    {isLastSection ? 'View Certificate' : 'Next Section'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Video Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Video className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Video Content</CardTitle>
                    <CardDescription>
                      <Clock className="w-3 h-3 inline mr-1" />
                      {Math.round(section.videoDuration / 60)} minutes
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Video placeholder - will be Synthesia embed */}
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center text-white">
                    <PlayCircle className="w-16 h-16 mx-auto mb-4 opacity-75" />
                    <p className="text-lg font-medium">Video Coming Soon</p>
                    <p className="text-sm text-gray-400">Synthesia video will be embedded here</p>
                  </div>
                </div>
                
                {/* Text content fallback */}
                <details className="mb-4">
                  <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-700">
                    <BookOpen className="w-4 h-4 inline mr-1" />
                    Read text version
                  </summary>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700">
                      {section.content}
                    </div>
                  </div>
                </details>

                <Button onClick={handleMarkVideoComplete} className="w-full">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Complete & Take Quiz
                </Button>
              </CardContent>
            </Card>

            {/* Quiz preview */}
            <Card className="border-dashed">
              <CardContent className="py-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <FileQuestion className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Quiz: {section.quiz.length} Questions</h3>
                    <p className="text-sm text-gray-600">
                      Complete the video to unlock the quiz. You need 80% to pass.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation */}
        {!showQuiz && !sectionComplete && (
          <div className="flex justify-between mt-8">
            <Link href={sectionNumber > 1 
              ? `/training/${trackParam}/${sectionNumber - 1}?${new URLSearchParams(assignmentId ? { a: assignmentId } : {})}`
              : '/training'
            }>
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {sectionNumber > 1 ? 'Previous Section' : 'Back to Training'}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
