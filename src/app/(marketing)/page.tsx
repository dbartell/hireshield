import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, FileText, GraduationCap, ClipboardCheck, AlertTriangle, ArrowRight, CheckCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <AlertTriangle className="w-4 h-4" />
              New AI hiring laws now in effect
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              AI Hiring Compliance
              <span className="text-blue-600"> Made Simple</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Audit your tools. Generate disclosures. Train your team. Stay compliant with Illinois, Colorado, California, and NYC AI hiring laws.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/scorecard">
                <Button size="xl" variant="cta">
                  Get Your Free Compliance Score
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="xl" variant="secondary" className="bg-gray-900 text-white hover:bg-gray-800">
                  Request Demo
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              No credit card required • 5-minute assessment
            </p>
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-16 bg-red-50 border-y border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-red-600">Jan 1, 2026</div>
              <div className="text-gray-600">Illinois HB 3773</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600">Feb 1, 2026</div>
              <div className="text-gray-600">Colorado AI Act</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600">$7,500</div>
              <div className="text-gray-600">Per violation (CA)</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600">500K+</div>
              <div className="text-gray-600">Companies affected</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Are You Using AI in Hiring?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              If you use any of these tools, you may already be subject to new AI hiring laws.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {["LinkedIn Recruiter", "Indeed", "HireVue", "Greenhouse", "Lever", "Workday", "ZipRecruiter", "Any ATS with AI"].map((tool) => (
              <div key={tool} className="bg-white border border-gray-200 rounded-lg p-4 text-center shadow-sm">
                <CheckCircle className="w-6 h-6 text-blue-700 mx-auto mb-2" />
                <span className="font-semibold text-gray-900">{tool}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-8">
            ...and many more. AI is embedded in most modern hiring tools.
          </p>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              One Platform for Complete Compliance
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              AIHireLaw gives you everything you need to comply with AI hiring laws—no IT department required.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Audit</CardTitle>
                <CardDescription>
                  Identify which tools trigger which laws
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• AI tool inventory</li>
                  <li>• State-by-state analysis</li>
                  <li>• Risk scoring</li>
                  <li>• Gap identification</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Document</CardTitle>
                <CardDescription>
                  Generate required compliance documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Disclosure notices</li>
                  <li>• Consent forms</li>
                  <li>• Policy templates</li>
                  <li>• Impact assessments</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Train</CardTitle>
                <CardDescription>
                  Educate your HR team on requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Video courses</li>
                  <li>• Knowledge quizzes</li>
                  <li>• Certificates</li>
                  <li>• Annual re-certification</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <ClipboardCheck className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Track</CardTitle>
                <CardDescription>
                  Maintain audit trail for regulators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Consent records</li>
                  <li>• Disclosure tracking</li>
                  <li>• Audit log export</li>
                  <li>• Regulator-ready reports</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Get Compliant in 3 Steps
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Take the Assessment</h3>
              <p className="text-gray-600">
                Answer a few questions about your hiring tools and where you hire. Takes 5 minutes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Your Compliance Report</h3>
              <p className="text-gray-600">
                See your risk score, compliance gaps, and exactly what you need to fix.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Generate Your Documents</h3>
              <p className="text-gray-600">
                Create compliant disclosures, policies, and consent forms instantly.
              </p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/scorecard">
              <Button size="xl" variant="cta">
                Start Your Free Assessment
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Plans for every company size. No hidden fees.
            </p>
          </div>
          
          {/* Monthly plans */}
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <CardDescription>&lt;50 employees</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$149</span>
                  <span className="text-gray-600">/mo</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Compliance dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Training + certificates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Document generator
                  </li>
                </ul>
                <Link href="/pricing">
                  <Button className="w-full mt-6" variant="outline">Get Started</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="border-blue-600 border-2 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                Most Popular
              </div>
              <CardHeader>
                <CardTitle>Growth</CardTitle>
                <CardDescription>50-250 employees</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$349</span>
                  <span className="text-gray-600">/mo</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Everything in Starter
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    ATS integrations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Multi-state coverage
                  </li>
                </ul>
                <Link href="/pricing">
                  <Button className="w-full mt-6" variant="cta">Get Started</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Scale</CardTitle>
                <CardDescription>250-1000 employees</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$749</span>
                  <span className="text-gray-600">/mo</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Everything in Growth
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Unlimited states
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Dedicated CSM
                  </li>
                </ul>
                <Link href="/pricing">
                  <Button className="w-full mt-6" variant="outline">Get Started</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>1000+ employees</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$2,499</span>
                  <span className="text-gray-600">/mo</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Everything in Scale
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    SSO + custom SLA
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Dedicated team
                  </li>
                </ul>
                <Link href="/pricing">
                  <Button className="w-full mt-6" variant="outline">Contact Sales</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          <p className="text-center text-gray-600 mt-8">
            <Link href="/pricing" className="text-blue-600 hover:underline">View full pricing details →</Link>
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Don't Wait for a Violation
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get your free compliance score in 5 minutes. No credit card required.
          </p>
          <Link href="/scorecard">
            <Button size="xl" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Your Free Compliance Score
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
