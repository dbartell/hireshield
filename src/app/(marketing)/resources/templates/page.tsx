import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, Download, FileText, Lock } from "lucide-react"

const templates = [
  {
    title: "AI Disclosure Notice - Multi-State",
    description: "Candidate notification template that covers Illinois, Colorado, California, and NYC requirements.",
    format: "PDF",
    free: true,
    downloadSlug: "ai-disclosure-notice",
  },
  {
    title: "Candidate Consent Form",
    description: "Signature-ready consent form for candidates acknowledging AI use in the hiring process.",
    format: "PDF",
    free: true,
    downloadSlug: "candidate-consent-form",
  },
  {
    title: "Employee Handbook AI Policy Section",
    description: "Ready-to-insert policy language for your employee handbook covering AI in HR decisions.",
    format: "PDF",
    free: true,
    downloadSlug: "handbook-ai-policy",
  },
  {
    title: "Colorado Impact Assessment Template",
    description: "Pre-structured template for completing the impact assessment required under Colorado's AI Act.",
    format: "PDF",
    free: false,
    downloadSlug: null,
  },
  {
    title: "NYC Bias Audit Summary Template",
    description: "Template for publishing your bias audit results as required by NYC Local Law 144.",
    format: "PDF",
    free: false,
    downloadSlug: null,
  },
  {
    title: "AI Tool Inventory Worksheet",
    description: "Track all AI-powered tools in your hiring process with this comprehensive inventory template.",
    format: "PDF",
    free: true,
    downloadSlug: "ai-tool-inventory",
  },
  {
    title: "Vendor Due Diligence Questionnaire",
    description: "Questions to ask your hiring technology vendors about AI use and compliance support.",
    format: "PDF",
    free: false,
    downloadSlug: null,
  },
  {
    title: "Annual Compliance Review Checklist",
    description: "Yearly checklist to ensure ongoing compliance with all AI hiring regulations.",
    format: "PDF",
    free: false,
    downloadSlug: null,
  },
]

export default function TemplatesPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/resources" className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Resources
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Templates</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl">
            Ready-to-use compliance documents. Download, customize with your company info, and deploy.
          </p>
        </div>

        {/* Free Templates */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span className="bg-green-100 text-green-700 text-sm px-2 py-1 rounded">Free</span>
            Free Templates
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {templates.filter(t => t.free).map((template) => (
              <Card key={template.title} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">{template.format}</span>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                      Free Download
                    </span>
                  </div>
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <CardDescription className="mb-4">{template.description}</CardDescription>
                  <a href={`/api/templates/${template.downloadSlug}`} download>
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Template
                    </Button>
                  </a>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Pro Templates */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded">Pro</span>
            Pro Templates
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {templates.filter(t => !t.free).map((template) => (
              <Card key={template.title} className="hover:shadow-lg transition-shadow relative">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">{template.format}</span>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Pro Plan
                    </span>
                  </div>
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <CardDescription className="mb-4">{template.description}</CardDescription>
                  <Link href="/pricing">
                    <Button className="w-full">
                      Upgrade to Access
                    </Button>
                  </Link>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">
            Want templates that auto-fill with your company info?
          </h2>
          <p className="text-blue-100 mb-6">
            AIHireLaw's document generator creates customized compliance documents in seconds.
          </p>
          <Link href="/scorecard">
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              Try It Free <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
