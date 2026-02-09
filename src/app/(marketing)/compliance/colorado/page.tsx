import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, ArrowRight, Calendar, DollarSign, Building, FileText } from "lucide-react"

export default function ColoradoCompliancePage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <AlertTriangle className="w-4 h-4" />
            Effective June 30, 2026
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Colorado AI Act (SB24-205)
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Complete guide to the Colorado Artificial Intelligence Act for employers using high-risk AI systems in employment decisions.
          </p>
          <Link href="/scorecard">
            <Button size="lg" variant="cta">
              Check Your Compliance <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="py-12 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold">Effective Date</div>
              <div className="text-gray-600">June 30, 2026</div>
            </div>
            <div className="text-center">
              <Building className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold">Who's Covered</div>
              <div className="text-gray-600">High-risk AI deployers</div>
            </div>
            <div className="text-center">
              <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold">Penalties</div>
              <div className="text-gray-600">Up to $20,000/violation</div>
            </div>
            <div className="text-center">
              <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold">Enforcement</div>
              <div className="text-gray-600">CO Attorney General</div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Need to Know */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">What You Need to Know</h2>
          
          <div className="prose prose-lg max-w-none">
            <h3>Overview</h3>
            <p>
              The Colorado AI Act is one of the most comprehensive AI regulations in the United States. It requires businesses using "high-risk AI systems" to implement risk management programs, conduct impact assessments, and provide extensive consumer notifications.
            </p>

            <h3>What is a "High-Risk AI System"?</h3>
            <p>
              Any AI system that makes or is a "substantial factor" in making a "consequential decision." In employment, this includes decisions about:
            </p>
            <ul>
              <li>Hiring and recruiting</li>
              <li>Promotions and demotions</li>
              <li>Termination</li>
              <li>Compensation</li>
              <li>Work assignments</li>
              <li>Performance evaluation</li>
            </ul>

            <h3>Key Requirements</h3>
            <ul>
              <li><strong>Reasonable Care Standard:</strong> Use reasonable care to protect consumers from algorithmic discrimination</li>
              <li><strong>Risk Management Program:</strong> Implement programs aligned with NIST AI Risk Management Framework</li>
              <li><strong>Impact Assessments:</strong> Complete annually or within 90 days of substantial modification</li>
              <li><strong>Consumer Notifications:</strong> Notify before making consequential decisions using AI</li>
              <li><strong>Adverse Decision Requirements:</strong> Provide statement of reasons, opportunity to correct data, and appeal with human review</li>
            </ul>

            <h3>Small Business Exemption</h3>
            <p>
              Businesses with fewer than 50 full-time employees may qualify for a limited exemption if they:
            </p>
            <ul>
              <li>Do not use their own data to train AI systems</li>
              <li>Use AI systems only as intended by the developer</li>
              <li>Make available the developer's impact assessment</li>
            </ul>
            <p>
              <strong>Note:</strong> Even small businesses must still notify consumers of AI use.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Assessment Requirements */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Impact Assessment Requirements</h2>
          <p className="text-gray-600 mb-6">
            Impact assessments must be completed annually and include:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Purpose and intended use cases of the AI system",
              "Analysis of whether the system poses algorithmic discrimination risk",
              "Categories of data processed as inputs",
              "Outputs generated by the system",
              "How outputs are used in decisions",
              "Safeguards to address discrimination risks",
              "How the system is evaluated for performance",
              "Transparency measures for affected individuals"
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-lg border">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Penalties */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Penalties for Non-Compliance</h2>
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Up to $20,000 Per Violation</CardTitle>
            </CardHeader>
            <CardContent className="text-red-900">
              <p className="mb-4">
                Violations are treated as unfair or deceptive trade practices under Colorado law. The Attorney General has exclusive enforcement authority.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>$20,000 maximum per violation</li>
                <li>Each affected consumer may constitute a separate violation</li>
                <li>No private right of action (individuals cannot sue directly)</li>
                <li>Injunctive relief may be sought</li>
              </ul>
              <div className="mt-4 p-4 bg-green-100 rounded-lg text-green-900">
                <p className="font-semibold">Affirmative Defense Available</p>
                <p className="text-sm mt-1">
                  Businesses may have a defense if they discover and cure violations through internal review or external feedback AND comply with recognized frameworks like NIST AI RMF or ISO/IEC 42001.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How AIHireLaw Helps */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">How AIHireLaw Helps</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-700 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Impact Assessment Generator</h3>
              <p className="text-blue-100">
                Create Colorado-compliant impact assessments with our guided workflow and templates.
              </p>
            </div>
            <div className="bg-blue-700 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Risk Management Documentation</h3>
              <p className="text-blue-100">
                Document your risk management program with NIST AI RMF-aligned templates.
              </p>
            </div>
            <div className="bg-blue-700 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Consumer Notification Templates</h3>
              <p className="text-blue-100">
                Generate compliant notification language for candidates and employees.
              </p>
            </div>
            <div className="bg-blue-700 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Adverse Decision Process</h3>
              <p className="text-blue-100">
                Set up compliant workflows for appeals and human review of AI decisions.
              </p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link href="/scorecard">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Check Your Colorado Compliance <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Colorado Compliance Pricing</h2>
            <p className="text-gray-600">Impact assessments, notifications, and ongoing support</p>
          </div>
          
          <div className="max-w-lg mx-auto">
            <Card className="border-blue-600 border-2 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                Multi-State Plan
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Full Compliance Platform</CardTitle>
                <p className="text-gray-500">Colorado + Illinois + California + NYC</p>
                <div className="mt-4">
                  <span className="text-5xl font-bold">$199</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Annual impact assessment generator</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Risk management documentation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Consumer notification templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Adverse decision workflow tools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Team training + certificates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Multi-state disclosure templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Annual renewal reminders</span>
                  </li>
                </ul>
                <Link href="/quiz?state=CO">
                  <Button className="w-full h-12 text-base" variant="cta">
                    Start Free Trial
                  </Button>
                </Link>
                <p className="text-xs text-center text-gray-500 mt-4">
                  14-day free trial. No credit card required.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* IL-only callout */}
          <div className="mt-10 text-center">
            <p className="text-gray-600 mb-2">Only hiring in Illinois?</p>
            <Link href="/compliance/illinois" className="text-blue-600 hover:underline font-medium">
              Get the $199 one-time Illinois kit →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Get Ahead of the June Deadline</h2>
          <p className="text-xl text-gray-600 mb-8">
            Colorado's requirements are extensive. Start your compliance journey today.
          </p>
          <Link href="/scorecard">
            <Button size="xl" variant="cta">
              Get Free Compliance Score <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
