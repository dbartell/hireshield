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
          
          <div className="prose prose-lg max-w-none">
            <h3>Overview</h3>
            <p>
              Illinois HB 3773 amends the Illinois Human Rights Act to regulate the use of artificial intelligence in employment decisions. The law prohibits employers from using AI in ways that discriminate against employees based on protected characteristics.
            </p>

            <h3>Key Requirements</h3>
            <ul>
              <li><strong>Notice Requirement:</strong> Employers must notify employees when AI is used for employment decisions including hiring, promotion, discipline, or termination.</li>
              <li><strong>Non-Discrimination:</strong> AI systems cannot be used in ways that discriminate based on race, color, religion, national origin, ancestry, age, sex, marital status, disability, military status, sexual orientation, or other protected classes.</li>
              <li><strong>Zip Code Prohibition:</strong> Employers cannot use zip code as a proxy for protected characteristics in AI hiring tools.</li>
              <li><strong>Disclosure Requirements:</strong> Must disclose the AI system's name, purpose, and what data is collected.</li>
            </ul>

            <h3>Who Must Comply</h3>
            <p>
              The law applies to any employer with one or more employees in Illinois during 20 or more calendar weeks. This means virtually every business operating in Illinois is covered.
            </p>

            <h3>What Counts as "AI"</h3>
            <p>
              The law defines AI broadly to include any machine-based system that makes predictions, recommendations, or decisions influencing real or virtual environments. This includes:
            </p>
            <ul>
              <li>Resume screening software</li>
              <li>Candidate ranking algorithms</li>
              <li>Video interview analysis tools</li>
              <li>Skills assessment platforms</li>
              <li>Chatbot screening tools</li>
              <li>Any ATS with AI-powered features</li>
            </ul>
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
              <p className="mt-4 font-semibold">
                Each affected employee can file a separate complaint, meaning exposure scales with company size.
              </p>
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
