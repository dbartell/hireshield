import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, ArrowRight, Calendar, DollarSign, Building, FileText } from "lucide-react"

export default function NYCCompliancePage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <AlertTriangle className="w-4 h-4" />
            Currently Active - Enforcement Ongoing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            NYC Local Law 144
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Complete guide to New York City's Automated Employment Decision Tool (AEDT) law - the first of its kind in the United States.
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
              <div className="text-gray-600">July 5, 2023</div>
            </div>
            <div className="text-center">
              <Building className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold">Who's Covered</div>
              <div className="text-gray-600">NYC employers</div>
            </div>
            <div className="text-center">
              <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold">Penalties</div>
              <div className="text-gray-600">$500 - $1,500/day</div>
            </div>
            <div className="text-center">
              <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-semibold">Enforcement</div>
              <div className="text-gray-600">NYC DCWP</div>
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
              NYC Local Law 144 was the first law in the United States specifically regulating AI in hiring. It requires employers using automated employment decision tools (AEDT) to conduct annual bias audits and provide notice to candidates.
            </p>

            <h3>What is an AEDT?</h3>
            <p>
              An Automated Employment Decision Tool is any computational process derived from machine learning, statistical modeling, data analytics, or AI that issues a simplified output (score, classification, recommendation) used to substantially assist or replace discretionary decision making for employment decisions.
            </p>

            <h3>Key Requirements</h3>
            <ul>
              <li><strong>Annual Bias Audit:</strong> An independent auditor must conduct a bias audit within one year before using the AEDT</li>
              <li><strong>Public Disclosure:</strong> Results of the most recent bias audit must be publicly available on the employer's website</li>
              <li><strong>Candidate Notice:</strong> Notify candidates at least 10 business days before using an AEDT</li>
              <li><strong>Alternative Process:</strong> Allow candidates to request an alternative selection process or accommodation</li>
            </ul>

            <h3>Bias Audit Requirements</h3>
            <p>The bias audit must calculate:</p>
            <ul>
              <li>Selection rates for each category (race/ethnicity, sex)</li>
              <li>Impact ratios comparing selection rates between categories</li>
              <li>Scoring rates and impact ratios (if applicable)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Notice Requirements */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Notice Requirements</h2>
          <p className="text-gray-600 mb-6">
            Candidates must be notified at least 10 business days before AEDT use. The notice must include:
          </p>
          <div className="space-y-4">
            {[
              "That an AEDT will be used in the hiring process",
              "The job qualifications and characteristics the AEDT will assess",
              "Information about the data sources used",
              "Instructions for requesting an alternative selection process",
              "Instructions for requesting a reasonable accommodation"
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-lg border">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800">
              <strong>Tip:</strong> The notice can be provided via the job posting, email, or a dedicated web page. AIHireLaw can generate compliant notice language for your specific AEDT.
            </p>
          </div>
        </div>
      </section>

      {/* Penalties */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Penalties for Non-Compliance</h2>
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Daily Penalties Add Up Fast</CardTitle>
            </CardHeader>
            <CardContent className="text-red-900">
              <ul className="list-disc list-inside space-y-2">
                <li><strong>$500</strong> for the first violation</li>
                <li><strong>$500 - $1,500</strong> for each subsequent violation</li>
                <li>Each day of continued violation is a separate offense</li>
                <li>Use of AEDT without bias audit: each day is a violation</li>
                <li>Failure to provide notice: each instance is a violation</li>
              </ul>
              <div className="mt-4 p-4 bg-red-100 rounded-lg">
                <p className="font-semibold">Example Exposure</p>
                <p className="text-sm mt-1">
                  Using an AEDT without a bias audit for 30 days could result in penalties of $500 + ($1,500 × 29) = $44,000. Plus separate violations for each candidate not properly notified.
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
              <h3 className="font-semibold text-lg mb-2">Bias Audit Tracking</h3>
              <p className="text-blue-100">
                Track your bias audit status and get reminders when annual renewal is due.
              </p>
            </div>
            <div className="bg-blue-700 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Notice Generator</h3>
              <p className="text-blue-100">
                Create compliant candidate notices customized for your specific AEDT.
              </p>
            </div>
            <div className="bg-blue-700 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Disclosure Page Template</h3>
              <p className="text-blue-100">
                Generate the required public disclosure page for your website.
              </p>
            </div>
            <div className="bg-blue-700 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">Auditor Directory</h3>
              <p className="text-blue-100">
                Connect with independent auditors who can conduct your required bias audit.
              </p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link href="/scorecard">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Check Your NYC Compliance <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
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
              <h3 className="font-semibold text-lg mb-2">Do I need to hire an auditor?</h3>
              <p className="text-gray-600">Yes, the bias audit must be conducted by an independent auditor. The auditor cannot be involved in using or developing the AEDT being audited.</p>
            </div>
            <div className="border-b pb-6">
              <h3 className="font-semibold text-lg mb-2">Does this apply to remote hiring for NYC positions?</h3>
              <p className="text-gray-600">Yes. If you're hiring for a position that will be performed in NYC, or for a role at an NYC-based employer, the law applies regardless of where the hiring process takes place.</p>
            </div>
            <div className="border-b pb-6">
              <h3 className="font-semibold text-lg mb-2">What if my vendor provides a bias audit?</h3>
              <p className="text-gray-600">You can use a vendor-provided bias audit if it meets the law's requirements, was conducted within the past year, and the vendor makes it available to you for publication.</p>
            </div>
            <div className="border-b pb-6">
              <h3 className="font-semibold text-lg mb-2">Where do I publish the bias audit results?</h3>
              <p className="text-gray-600">On your careers page or any publicly accessible website page. AIHireLaw can generate a compliant disclosure page template for you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">NYC Is Actively Enforcing</h2>
          <p className="text-xl text-gray-600 mb-8">
            Unlike other states, NYC's law is already in effect. Make sure you're compliant today.
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
