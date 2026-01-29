"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlayCircle, CheckCircle, Clock, Award, Lock, ArrowLeft, ArrowRight, Loader2, X } from "lucide-react"
import { getTrainingData, markCourseComplete, getCourseContent, Course } from "@/lib/actions/training"

interface Completion {
  id: string
  course_id: string
  completed_at: string
  score: number
}

export default function TrainingPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [completions, setCompletions] = useState<Completion[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCourse, setActiveCourse] = useState<Course | null>(null)
  const [activeModuleIndex, setActiveModuleIndex] = useState(0)
  const [completing, setCompleting] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const data = await getTrainingData()
    setCourses(data.courses)
    setCompletions(data.completions)
    setLoading(false)
  }

  const getCourseStatus = (courseId: string) => {
    const completion = completions.find(c => c.course_id === courseId)
    if (completion) return 'completed'

    const course = courses.find(c => c.id === courseId)
    if (course?.prerequisite) {
      const prereqComplete = completions.some(c => c.course_id === course.prerequisite)
      if (!prereqComplete) return 'locked'
    }

    return 'not-started'
  }

  const startCourse = async (courseId: string) => {
    const course = await getCourseContent(courseId)
    if (course) {
      setActiveCourse(course)
      setActiveModuleIndex(0)
    }
  }

  const handleCompleteCourse = async () => {
    if (!activeCourse) return
    
    setCompleting(true)
    await markCourseComplete(activeCourse.id)
    await loadData()
    setCompleting(false)
    setActiveCourse(null)
    setActiveModuleIndex(0)
  }

  const completedCount = completions.length
  const totalCourses = courses.length
  const progressPercent = totalCourses > 0 ? Math.round((completedCount / totalCourses) * 100) : 0
  const remainingTime = courses
    .filter(c => !completions.some(comp => comp.course_id === c.id))
    .reduce((acc, c) => acc + parseInt(c.duration), 0)

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  // Course viewer
  if (activeCourse) {
    const currentModule = activeCourse.content[activeModuleIndex]
    const isLastModule = activeModuleIndex === activeCourse.content.length - 1

    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Button variant="ghost" onClick={() => setActiveCourse(null)} className="mb-2">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">{activeCourse.title}</h1>
              <p className="text-gray-600">Module {activeModuleIndex + 1} of {activeCourse.content.length}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-blue-600 rounded-full transition-all" 
                style={{ width: `${((activeModuleIndex + 1) / activeCourse.content.length) * 100}%` }} 
              />
            </div>
          </div>

          {/* Content */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{currentModule.title}</CardTitle>
              <CardDescription>{currentModule.duration} • {currentModule.type}</CardDescription>
            </CardHeader>
            <CardContent>
              {currentModule.type === 'quiz' ? (
                <div className="text-center py-8">
                  <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Module Quiz</h3>
                  <p className="text-gray-600 mb-6">
                    Test your knowledge from this module.
                  </p>
                  {isLastModule ? (
                    <Button onClick={handleCompleteCourse} disabled={completing}>
                      {completing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Completing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Complete Course
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button onClick={() => setActiveModuleIndex(i => i + 1)}>
                      Pass Quiz & Continue <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {currentModule.content || 'Content coming soon...'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          {currentModule.type !== 'quiz' && (
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setActiveModuleIndex(i => i - 1)}
                disabled={activeModuleIndex === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Previous
              </Button>
              <Button onClick={() => setActiveModuleIndex(i => i + 1)}>
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Training</h1>
          <p className="text-gray-600">Complete training modules to ensure your team understands compliance requirements</p>
        </div>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{completedCount}/{totalCourses}</div>
                <div className="text-sm text-gray-600">Courses Completed</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{progressPercent}%</div>
                <div className="text-sm text-gray-600">Overall Progress</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{completedCount > 0 ? completedCount : 0}</div>
                <div className="text-sm text-gray-600">Certificates Earned</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{remainingTime}m</div>
                <div className="text-sm text-gray-600">Time Remaining</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Course List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Training Courses</CardTitle>
                <CardDescription>Complete all courses to earn your compliance certification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.map(course => {
                    const status = getCourseStatus(course.id)
                    const completion = completions.find(c => c.course_id === course.id)

                    return (
                      <div 
                        key={course.id} 
                        className={`p-4 border rounded-lg ${
                          status === 'locked' ? 'bg-gray-50 opacity-75' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            status === 'completed' ? 'bg-green-100' :
                            status === 'locked' ? 'bg-gray-100' :
                            'bg-blue-100'
                          }`}>
                            {status === 'completed' && <CheckCircle className="w-6 h-6 text-green-600" />}
                            {status === 'not-started' && <PlayCircle className="w-6 h-6 text-blue-600" />}
                            {status === 'locked' && <Lock className="w-6 h-6 text-gray-600" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold">{course.title}</h3>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                status === 'completed' ? 'bg-green-100 text-green-700' :
                                status === 'locked' ? 'bg-gray-100 text-gray-600' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {status === 'completed' && 'Completed'}
                                {status === 'not-started' && 'Not started'}
                                {status === 'locked' && 'Locked'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {course.duration}
                              </span>
                              <span>{course.modules} modules</span>
                            </div>
                            {status === 'locked' && course.prerequisite && (
                              <p className="text-xs text-orange-600 mt-2">
                                Requires: {courses.find(c => c.id === course.prerequisite)?.title}
                              </p>
                            )}
                          </div>
                          <div>
                            {status === 'completed' && (
                              <Button variant="outline" size="sm" onClick={() => startCourse(course.id)}>
                                Review
                              </Button>
                            )}
                            {status === 'not-started' && (
                              <Button size="sm" onClick={() => startCourse(course.id)}>
                                Start
                              </Button>
                            )}
                            {status === 'locked' && (
                              <Button variant="ghost" size="sm" disabled>
                                <Lock className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Certificates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Certificates</CardTitle>
              </CardHeader>
              <CardContent>
                {completions.length > 0 ? (
                  <div className="space-y-4">
                    {completions.map(completion => {
                      const course = courses.find(c => c.id === completion.course_id)
                      return (
                        <div key={completion.id} className="text-center py-4 border-b last:border-0">
                          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Award className="w-6 h-6 text-yellow-600" />
                          </div>
                          <div className="font-medium text-sm">{course?.title}</div>
                          <div className="text-xs text-gray-600">
                            {new Date(completion.completed_at).toLocaleDateString()}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Award className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Complete courses to earn certificates</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Help */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
                <p className="text-sm text-blue-700 mb-4">
                  Our compliance experts are available to answer questions about training content.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
