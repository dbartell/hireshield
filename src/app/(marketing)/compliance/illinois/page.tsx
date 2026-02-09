import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, ArrowRight, Calendar, DollarSign, Building, FileText } from "lucide-react"

export default function IllinoisCompliancePage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <AlertTriangle className="w-4 h-4" />
            Effective January 1, 2026
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Illinois AI Hiring Law (HB 3773)
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Complete guide to the Illinois Artificial Intelligence Video Interview Act and HB 3773 amendments for employers.
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
              <div className="text-gray-600">January 1, 2026</div>
            </div>
            <div className="text-center">
              <Building className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold">Who's Covered</div>
              <div className="text-gray-600">All IL employers</div>
            </div>
            <div className="text-center">
              <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold">Penalties</div>
              <div className="text-gray-600">Civil rights violation</div>
            </div>
            <div className="text-center">
              <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold">Enforcement</div>
              <div className="text-gray-600">IL Human Rights Commission</div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Need to Know */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">What You Need to Know</h2>
          
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Illinois HB 3773 amends the Illinois Human Rights Act to regulate the use of artificial intelligence in employment decisions. The law prohibits employers from using AI in ways that discriminate against employees based on protected characteristics.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">Notice Requirement</div>
                      <div className="text-gray-600">Employers must notify employees when AI is used for employment decisions including hiring, promotion, discipline, or termination.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">Non-Discrimination</div>
                      <div className="text-gray-600">AI systems cannot be used in ways that discriminate based on race, color, religion, national origin, ancestry, age, sex, marital status, disability, military status, sexual orientation, or other protected classes.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">Zip Code Prohibition</div>
                      <div className="text-gray-600">Employers cannot use zip code as a proxy for protected characteristics in AI hiring tools.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">Disclosure Requirements</div>
                      <div className="text-gray-600">Must disclose the AI system's name, purpose, and what data is collected.</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Who Must Comply</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                The law applies to any employer with one or more employees in Illinois during 20 or more calendar weeks. This means virtually every business operating in Illinois is covered.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What Counts as "AI"</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  The law defines AI broadly to include any machine-based system that makes predictions, recommendations, or decisions influencing real or virtual environments. This includes:
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  {["Resume screening software", "Candidate ranking algorithms", "Video interview analysis tools", "Skills assessment platforms", "Chatbot screening tools", "Any ATS with AI-powered features"].map((item) => (
                    <div key={item} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Compliance Checklist */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Compliance Checklist</h2>
          <div className="space-y-4">
            {[
              "Inventory all AI tools used in hiring and employment decisions",
              "Create employee notification templates for AI use",
              "Review AI tools for potential discriminatory outcomes",
              "Ensure zip codes are not used as proxies for protected classes",
              "Develop disclosure documents explaining AI system purposes",
              "Train HR team on new requirements",
              "Update employee handbook with AI use policies",
              "Establish process for handling employee questions about AI",
              "Document compliance efforts for potential audits",
              "Set up ongoing monitoring for AI tool fairness"
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
          
          {/* Per-Employee Warning Callout */}
          <div className="bg-red-600 text-white rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold mb-2">Fined Per Employee</h3>
                <p className="text-red-100">
                  Each affected employee can file a separate complaint. A company with 100 employees in Illinois could face 100+ individual civil rights charges—exposure scales directly with your headcount.
                </p>
              </div>
            </div>
          </div>

          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Civil Rights Violations</CardTitle>
            </CardHeader>
            <CardContent className="text-red-900">
              <p className="mb-4">
                Violations of HB 3773 are treated as civil rights violations under the Illinois Human Rights Act. Affected individuals can:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>File charges with the Illinois Human Rights Commission</li>
                <li>Pursue civil complaints in Illinois Circuit Court</li>
                <li>Seek compensatory damages</li>
                <li>Request injunctive relief</li>
                <li>Recover attorney's fees</li>
              </ul>
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
              <h3 className="font-semibold text-lg mb-2">AI Tool Audit</h3>
              <p className="text-blue-100">
                Identify which of your hiring tools trigger Illinois compliance requirements and assess your risk level.
              </p>
            </div>
            <div className="bg-blue-700 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Disclosure Templates</h3>
              <p className="text-blue-100">
                Generate Illinois-compliant employee notification templates customized for your specific AI tools.
              </p>
            </div>
            <div className="bg-blue-700 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Policy Generator</h3>
              <p className="text-blue-100">
                Create employee handbook policies that meet Illinois disclosure requirements.
              </p>
            </div>
            <div className="bg-blue-700 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Training Module</h3>
              <p className="text-blue-100">
                Train your HR team on Illinois requirements with our video courses and certification quizzes.
              </p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link href="/scorecard">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Check Your Illinois Compliance <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Illinois Compliance — One Simple Price</h2>
            <p className="text-gray-600">Get compliant today. No subscription required.</p>
          </div>
          
          <div className="max-w-lg mx-auto">
            <Card className="border-blue-600 border-2 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                One-Time Payment
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Illinois Compliance Kit</CardTitle>
                <p className="text-gray-500">Everything you need to comply with HB 3773</p>
                <div className="mt-4">
                  <span className="text-5xl font-bold">$199</span>
                  <span className="text-gray-600 ml-2">one-time</span>
                </div>
                <p className="text-sm text-green-600 mt-2">No monthly fees. No subscriptions. Just compliance.</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>All required disclosure notices (employee + candidate)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Job posting disclosure templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Employee handbook AI policy</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>4-year recordkeeping system</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>Downloadable compliance packet (PDF)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>1 year of regulatory update emails</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>30-day email support</span>
                  </li>
                </ul>
                <Link href="/quiz?state=IL">
                  <Button className="w-full h-12 text-base" variant="cta">
                    Get Illinois Compliant — $199
                  </Button>
                </Link>
                <p className="text-xs text-center text-gray-500 mt-4">
                  Takes about 30 minutes. No credit card until checkout.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Multi-state upsell */}
          <div className="mt-10 text-center">
            <p className="text-gray-600 mb-2">Hiring in multiple states?</p>
            <Link href="/quiz" className="text-blue-600 hover:underline font-medium">
              See multi-state plans starting at $199/month →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="border-b pb-6">
              <h3 className="font-semibold text-lg mb-2">Does this apply to remote employees in Illinois?</h3>
              <p className="text-gray-600">Yes. If you have employees working in Illinois, even remotely, the law applies to employment decisions affecting them.</p>
            </div>
            <div className="border-b pb-6">
              <h3 className="font-semibold text-lg mb-2">What if my ATS vendor says they're compliant?</h3>
              <p className="text-gray-600">The compliance obligation falls on the employer, not the vendor. You are responsible for ensuring proper notices and non-discriminatory use, regardless of vendor claims.</p>
            </div>
            <div className="border-b pb-6">
              <h3 className="font-semibold text-lg mb-2">Do I need to notify every candidate?</h3>
              <p className="text-gray-600">The law focuses on employees, but best practice is to notify candidates as well if AI is used in the hiring process. This also helps with compliance in other states like NYC.</p>
            </div>
            <div className="border-b pb-6">
              <h3 className="font-semibold text-lg mb-2">How detailed does the AI disclosure need to be?</h3>
              <p className="text-gray-600">You must disclose the name of the AI system, its purpose in employment decisions, and what data it collects. AIHireLaw can generate compliant disclosure language for your specific tools.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't Wait Until January</h2>
          <p className="text-xl text-gray-600 mb-8">
            Get your free compliance assessment and see exactly what you need to do before the deadline.
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
