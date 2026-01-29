"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Shield, AlertTriangle, CheckCircle, Clock, FileText, 
  ClipboardCheck, GraduationCap, Users, ArrowRight, 
  TrendingUp, Calendar
} from "lucide-react"

// Mock data - would come from Supabase in production
const mockData = {
  companyName: "Acme Corp",
  complianceScore: 65,
  statesActive: ["IL", "CA", "CO"],
  toolsCount: 4,
  documentsGenerated: 3,
  trainingCompleted: 2,
  trainingTotal: 5,
  consentRecords: 47,
  lastAudit: "2026-01-15",
  upcomingDeadlines: [
    { state: "Illinois", law: "HB 3773", date: "2026-01-01", status: "passed" },
    { state: "Colorado", law: "AI Act", date: "2026-02-01", status: "upcoming" },
  ],
  recentActivity: [
    { action: "Generated disclosure notice", time: "2 hours ago" },
    { action: "Completed audit questionnaire", time: "1 day ago" },
    { action: "Added new AI tool: HireVue", time: "3 days ago" },
  ]
}

export default function DashboardPage() {
  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: "Good", color: "text-green-600", bg: "bg-green-100" }
    if (score >= 60) return { level: "Fair", color: "text-yellow-600", bg: "bg-yellow-100" }
    if (score >= 40) return { level: "At Risk", color: "text-orange-600", bg: "bg-orange-100" }
    return { level: "Critical", color: "text-red-600", bg: "bg-red-100" }
  }

  const risk = getRiskLevel(mockData.complianceScore)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your compliance overview.</p>
      </div>

      {/* Compliance Score Card */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Compliance Score</CardTitle>
            <CardDescription>Overall compliance status across all regulated states</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className={`w-32 h-32 rounded-full ${risk.bg} flex items-center justify-center`}>
                <div className="text-center">
                  <div className={`text-4xl font-bold ${risk.color}`}>{mockData.complianceScore}</div>
                  <div className={`text-sm font-medium ${risk.color}`}>{risk.level}</div>
                </div>
              </div>
              <div className="flex-1">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Audit Complete</span>
                      <span className="text-green-600">✓</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-green-500 rounded-full" style={{ width: "100%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Documents Generated</span>
                      <span>{mockData.documentsGenerated}/5</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-blue-500 rounded-full" style={{ width: "60%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Training Complete</span>
                      <span>{mockData.trainingCompleted}/{mockData.trainingTotal}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-purple-500 rounded-full" style={{ width: "40%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/audit">
              <Button variant="outline" className="w-full justify-start">
                <ClipboardCheck className="w-4 h-4 mr-2" />
                Run New Audit
              </Button>
            </Link>
            <Link href="/documents">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Generate Document
              </Button>
            </Link>
            <Link href="/training">
              <Button variant="outline" className="w-full justify-start">
                <GraduationCap className="w-4 h-4 mr-2" />
                Continue Training
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Regulated States</p>
                <p className="text-2xl font-bold">{mockData.statesActive.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {mockData.statesActive.join(", ")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">AI Tools Tracked</p>
                <p className="text-2xl font-bold">{mockData.toolsCount}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-green-600">
              All tools audited
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Documents</p>
                <p className="text-2xl font-bold">{mockData.documentsGenerated}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              2 pending review
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Consent Records</p>
                <p className="text-2xl font-bold">{mockData.consentRecords}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Last 30 days
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Compliance Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.upcomingDeadlines.map((deadline, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{deadline.state}</div>
                    <div className="text-sm text-gray-500">{deadline.law}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{deadline.date}</div>
                    {deadline.status === "passed" ? (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="text-xs text-orange-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Upcoming
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <div className="flex-1">
                    <div className="text-sm">{activity.action}</div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/audit">
              <Button variant="link" className="mt-4 p-0">
                View all activity <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Alert Banner */}
      {mockData.complianceScore < 80 && (
        <Card className="mt-6 border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-orange-800">Action Required</h3>
                <p className="text-orange-700 text-sm mt-1">
                  Your compliance score indicates gaps that could expose you to penalties. 
                  Complete the remaining documents and training to improve your score.
                </p>
                <Link href="/audit">
                  <Button size="sm" className="mt-3" variant="outline">
                    View Recommendations
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
