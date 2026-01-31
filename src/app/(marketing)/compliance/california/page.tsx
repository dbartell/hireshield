import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, ArrowRight, Calendar, DollarSign, Building, FileText } from "lucide-react"

export default function CaliforniaCompliancePage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <AlertTriangle className="w-4 h-4" />
            Effective January 1, 2026 / January 1, 2027
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            California CCPA ADMT Regulations
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Complete guide to California's Automated Decision-Making Technology regulations under the California Consumer Privacy Act.
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
              <div className="text-gray-600">Jan 2026 / Jan 2027</div>
            </div>
            <div className="text-center">
              <Building className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold">Who's Covered</div>
              <div className="text-gray-600">CCPA businesses</div>
            </div>
            <div className="text-center">
              <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold">Penalties</div>
              <div className="text-gray-600">$2,500 - $7,500/violation</div>
            </div>
            <div className="text-center">
              <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold">Enforcement</div>
              <div className="text-gray-600">CPPA & AG</div>
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
              California's CCPA regulations on Automated Decision-Making Technology (ADMT) are among the most detailed in the nation. They require businesses to provide pre-use notices, allow opt-outs, and conduct risk assessments for AI used in significant decisions.
            </p>

            <h3>What is ADMT?</h3>
            <p>
              Automated Decision-Making Technology is defined as "any technology that processes personal information and uses computation to replace or substantially replace human decision-making." This includes:
            </p>
            <ul>
              <li>AI hiring tools that screen or rank candidates</li>
              <li>Algorithms that determine interview eligibility</li>
              <li>Systems that assess job performance</li>
              <li>Tools that influence compensation decisions</li>
              <li>Any AI that "substantially replaces" human judgment</li>
            </ul>

            <h3>Phased Implementation</h3>
            <div className="bg-gray-50 p-6 rounded-lg my-6">
              <h4 className="font-semibold mb-4">January 1, 2026</h4>
              <ul>
                <li>Cybersecurity audit requirements</li>
                <li>Initial risk assessment requirements</li>
                <li>Pre-use notice requirements begin</li>
              </ul>
              <h4 className="font-semibold mb-4 mt-6">January 1, 2027</h4>
              <ul>
                <li>Full ADMT provisions in effect</li>
                <li>Opt-out requirements fully enforced</li>
                <li>Complete risk assessment obligations</li>
              </ul>
            </div>

            <h3>Key Requirements</h3>
            <ul>
              <li><strong>Pre-Use Notice:</strong> Explain the purpose of ADMT, describe opt-out rights, and explain how the technology works before using it</li>
              <li><strong>Consumer Opt-Out:</strong> Allow consumers to opt out of ADMT for significant decisions (limited exceptions for safety, security, and fraud prevention)</li>
              <li><strong>Human Oversight:</strong> Human reviewers must be able to interpret ADMT outputs and have authority to change or correct final decisions</li>
              <li><strong>Risk Assessments:</strong> Required when using ADMT in employment contexts or for profiling</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Risk Assessment Triggers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">When Risk Assessments Are Required</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Selling or sharing personal information",
              "Processing sensitive personal information",
              "Using ADMT for significant decisions about consumers",
              "Using personal information to train ADMT",
              "Using automated processing to infer attributes during hiring",
              "Using ADMT in employment decisions",
              "Profiling consumers in employment contexts",
              "Using facial or emotion recognition technology"
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-lg border">
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
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
              <CardTitle className="text-red-800">$2,500 - $7,500 Per Violation</CardTitle>
            </CardHeader>
            <CardContent className="text-red-900">
              <ul className="list-disc list-inside space-y-2">
                <li><strong>$2,500</strong> per unintentional violation</li>
                <li><strong>$7,500</strong> per intentional violation</li>
                <li>Each affected consumer counts as a separate violation</li>
                <li>Enforced by California Privacy Protection Agency (CPPA) and Attorney General</li>
              </ul>
              <div className="mt-4 p-4 bg-red-100 rounded-lg">
                <p className="font-semibold">Example Exposure</p>
                <p className="text-sm mt-1">
                  A company that fails to provide proper ADMT notices to 1,000 job applicants could face up to $7.5 million in penalties ($7,500 × 1,000 applicants) for intentional violations.
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
              <h3 className="font-semibold text-lg mb-2">Pre-Use Notice Generator</h3>
              <p className="text-blue-100">
                Create California-compliant ADMT notices explaining your AI tools and opt-out rights.
              </p>
            </div>
            <div className="bg-blue-700 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Risk Assessment Templates</h3>
              <p className="text-blue-100">
                Complete required risk assessments with guided workflows and documentation.
              </p>
            </div>
            <div className="bg-blue-700 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Opt-Out Management</h3>
              <p className="text-blue-100">
                Track and manage consumer opt-out requests for ADMT processing.
              </p>
            </div>
            <div className="bg-blue-700 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Human Oversight Documentation</h3>
              <p className="text-blue-100">
                Document your human review processes to demonstrate compliance.
              </p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link href="/scorecard">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Check Your California Compliance <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">California Sets the Standard</h2>
          <p className="text-xl text-gray-600 mb-8">
            California's regulations often become the de facto national standard. Get compliant now.
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
