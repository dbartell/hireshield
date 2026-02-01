import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Shield, AlertTriangle, CheckCircle, Clock, FileText, 
  ClipboardCheck, GraduationCap, Users, ArrowRight, 
  TrendingUp, Calendar
} from "lucide-react"
import { getDashboardData } from "@/lib/actions/dashboard"
import { OnboardingWizard } from "@/components/onboarding-wizard"
import { UrgencyAlerts } from "@/components/urgency-alerts"
import { generateAlerts } from "@/lib/alerts"
import { CalendlyCTA, ContextualHelp } from "@/components/calendly-cta"
import { ComplianceScoreHelp, StateLawsHelp } from "@/components/help-content"
import { UpcomingRenewals } from "@/components/upcoming-renewals"
import { DeleteAccountButton } from "@/components/admin/delete-account-button"

export default async function DashboardPage() {
  const data = await getDashboardData()

  if (!data) {
    return <div className="p-8">Loading...</div>
  }

  // Generate urgency alerts based on user state
  const alerts = generateAlerts({
    hiringStates: data.hiringStates,
    documentsCount: data.documentsCount,
    consentCount: data.consentCount,
    lastAuditDate: data.lastAuditDate,
    trainingExpired: data.trainingExpired,
  })

  const isNewUser = data.auditsCount === 0 && data.documentsCount === 0

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: "Good", color: "text-green-600", bg: "bg-green-100" }
    if (score >= 60) return { level: "Fair", color: "text-yellow-600", bg: "bg-yellow-100" }
    if (score >= 40) return { level: "At Risk", color: "text-orange-600", bg: "bg-orange-100" }
    return { level: "Critical", color: "text-red-600", bg: "bg-red-100" }
  }

  const risk = getRiskLevel(data.complianceScore)

  // State compliance deadlines
  const upcomingDeadlines = [
    { state: "Illinois", law: "HB 3773", date: "2026-01-01", status: "passed" },
    { state: "Colorado", law: "AI Act", date: "2026-02-01", status: "upcoming" },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back{data.userName ? `, ${data.userName}` : ''}! Here&apos;s your compliance overview.</p>
        </div>
        <DeleteAccountButton isSuperAdmin={data.isSuperAdmin} />
      </div>

      {/* Onboarding Wizard (for new users) */}
      {isNewUser && (
        <OnboardingWizard
          userName={data.userName}
          hasCompletedAudit={data.auditsCount > 0}
          hasGeneratedDoc={data.documentsCount > 0}
          leadData={data.leadData}
        />
      )}

      {/* Urgency Alerts */}
      <UrgencyAlerts alerts={alerts} />

      {/* Compliance Score Card */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Compliance Score
              <ComplianceScoreHelp />
            </CardTitle>
            <CardDescription>Overall compliance status across all regulated states</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className={`w-32 h-32 rounded-full ${risk.bg} flex items-center justify-center`}>
                <div className="text-center">
                  <div className={`text-4xl font-bold ${risk.color}`}>{data.complianceScore}</div>
                  <div className={`text-sm font-medium ${risk.color}`}>{risk.level}</div>
                </div>
              </div>
              <div className="flex-1">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Audit Complete</span>
                      <span className={data.latestAudit ? "text-green-600" : "text-gray-400"}>
                        {data.latestAudit ? "✓" : "—"}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-green-500 rounded-full" style={{ width: data.latestAudit ? "100%" : "0%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Documents Generated</span>
                      <span>{data.documentsCount}/5</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${Math.min(100, (data.documentsCount / 5) * 100)}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Training Complete</span>
                      <span>{data.trainingCompleted}/{data.trainingTotal}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-purple-500 rounded-full" style={{ width: `${(data.trainingCompleted / data.trainingTotal) * 100}%` }} />
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
                <p className="text-sm text-gray-600">Regulated States</p>
                <p className="text-2xl font-bold">{data.hiringStates.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              {data.hiringStates.length > 0 ? data.hiringStates.join(", ") : "None selected"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">AI Tools Tracked</p>
                <p className="text-2xl font-bold">{data.toolsCount}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-green-600">
              {data.toolsCount > 0 ? "Tools registered" : "Add your tools"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Documents</p>
                <p className="text-2xl font-bold">{data.documentsCount}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              Generated
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Consent Records</p>
                <p className="text-2xl font-bold">{data.consentCount}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              Last 30 days
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Renewals */}
        <UpcomingRenewals renewals={data.upcomingRenewals} />

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
              {upcomingDeadlines.map((deadline, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{deadline.state}</div>
                    <div className="text-sm text-gray-600">{deadline.law}</div>
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

        {/* Recent Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentDocs && data.recentDocs.length > 0 ? (
              <div className="space-y-4">
                {data.recentDocs.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{doc.title}</div>
                      <div className="text-xs text-gray-600">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No documents yet</p>
                <Link href="/documents">
                  <Button variant="link" size="sm">Generate your first document</Button>
                </Link>
              </div>
            )}
            {data.recentDocs && data.recentDocs.length > 0 && (
              <Link href="/documents">
                <Button variant="link" className="mt-4 p-0">
                  View all documents <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alert Banner */}
      {data.complianceScore < 80 && (
        <Card className="mt-6 border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-800">Action Required</h3>
                <p className="text-orange-700 text-sm mt-1">
                  Your compliance score indicates gaps that could expose you to penalties. 
                  Complete the remaining documents and training to improve your score.
                </p>
                <div className="flex gap-3 mt-3">
                  <Link href="/audit">
                    <Button size="sm" variant="outline">
                      View Recommendations
                    </Button>
                  </Link>
                  <CalendlyCTA 
                    variant="inline" 
                    title="Need help prioritizing?" 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendly Help CTA - shown for users who might be stuck */}
      {data.complianceScore < 60 && (
        <div className="mt-6">
          <CalendlyCTA
            variant="banner"
            title="Not sure where to start?"
            description="Book a free 15-minute compliance review. We'll create a prioritized action plan for you."
          />
        </div>
      )}

      {/* Floating Calendly Button */}
      <CalendlyCTA variant="floating" />
    </div>
  )
}
