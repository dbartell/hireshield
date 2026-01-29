"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlayCircle, CheckCircle, Clock, Award, Lock } from "lucide-react"

const courses = [
  {
    id: "ai-hiring-101",
    title: "AI in Hiring 101",
    description: "Understanding what counts as AI in your hiring process",
    duration: "15 min",
    modules: 3,
    status: "completed",
    completedAt: "2026-01-12"
  },
  {
    id: "state-requirements",
    title: "State Law Requirements",
    description: "State-by-state breakdown of compliance requirements",
    duration: "25 min",
    modules: 4,
    status: "in-progress",
    progress: 50
  },
  {
    id: "disclosure-writing",
    title: "Writing Effective Disclosures",
    description: "Best practices for candidate and employee notifications",
    duration: "20 min",
    modules: 3,
    status: "not-started"
  },
  {
    id: "bias-prevention",
    title: "Preventing Algorithmic Bias",
    description: "How to identify and mitigate bias in AI hiring tools",
    duration: "30 min",
    modules: 5,
    status: "locked",
    prerequisite: "state-requirements"
  },
  {
    id: "audit-preparation",
    title: "Preparing for Compliance Audits",
    description: "Documentation and processes for regulatory review",
    duration: "20 min",
    modules: 3,
    status: "locked",
    prerequisite: "disclosure-writing"
  }
]

const teamMembers = [
  { name: "Sarah Johnson", role: "HR Director", completed: 3, total: 5 },
  { name: "Mike Chen", role: "Recruiter", completed: 1, total: 5 },
  { name: "Emily Davis", role: "HR Manager", completed: 2, total: 5 },
]

export default function TrainingPage() {
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
                <div className="text-3xl font-bold text-blue-600">2/5</div>
                <div className="text-sm text-gray-500">Courses Completed</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">40%</div>
                <div className="text-sm text-gray-500">Overall Progress</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">1</div>
                <div className="text-sm text-gray-500">Certificate Earned</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">55m</div>
                <div className="text-sm text-gray-500">Time Remaining</div>
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
                  {courses.map(course => (
                    <div 
                      key={course.id} 
                      className={`p-4 border rounded-lg ${
                        course.status === 'locked' ? 'bg-gray-50 opacity-75' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          course.status === 'completed' ? 'bg-green-100' :
                          course.status === 'in-progress' ? 'bg-blue-100' :
                          course.status === 'locked' ? 'bg-gray-100' :
                          'bg-gray-100'
                        }`}>
                          {course.status === 'completed' && <CheckCircle className="w-6 h-6 text-green-600" />}
                          {course.status === 'in-progress' && <PlayCircle className="w-6 h-6 text-blue-600" />}
                          {course.status === 'not-started' && <PlayCircle className="w-6 h-6 text-gray-400" />}
                          {course.status === 'locked' && <Lock className="w-6 h-6 text-gray-400" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{course.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              course.status === 'completed' ? 'bg-green-100 text-green-700' :
                              course.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                              course.status === 'locked' ? 'bg-gray-100 text-gray-500' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {course.status === 'completed' && 'Completed'}
                              {course.status === 'in-progress' && `${course.progress}% complete`}
                              {course.status === 'not-started' && 'Not started'}
                              {course.status === 'locked' && 'Locked'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{course.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {course.duration}
                            </span>
                            <span>{course.modules} modules</span>
                          </div>
                          {course.status === 'in-progress' && (
                            <div className="mt-2">
                              <div className="h-1.5 bg-gray-200 rounded-full">
                                <div 
                                  className="h-1.5 bg-blue-600 rounded-full" 
                                  style={{ width: `${course.progress}%` }} 
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                          {course.status === 'completed' && (
                            <Button variant="outline" size="sm">Review</Button>
                          )}
                          {course.status === 'in-progress' && (
                            <Button size="sm">Continue</Button>
                          )}
                          {course.status === 'not-started' && (
                            <Button variant="outline" size="sm">Start</Button>
                          )}
                          {course.status === 'locked' && (
                            <Button variant="ghost" size="sm" disabled>
                              <Lock className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Team Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map(member => (
                    <div key={member.name} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{member.name}</div>
                        <div className="text-xs text-gray-500">{member.role}</div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {member.completed}/{member.total}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certificates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Certificates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-8 h-8 text-yellow-600" />
                  </div>
                  <div className="font-medium">AI Hiring Basics</div>
                  <div className="text-xs text-gray-500 mb-3">Completed Jan 12, 2026</div>
                  <Button variant="outline" size="sm">Download Certificate</Button>
                </div>
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
