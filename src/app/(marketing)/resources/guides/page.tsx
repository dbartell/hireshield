import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, Clock, BookOpen } from "lucide-react"

const guides = [
  {
    title: "What Counts as AI in Hiring?",
    description: "A comprehensive guide to identifying which tools and processes trigger AI hiring compliance requirements.",
    readTime: "8 min read",
    href: "/resources/what-counts-as-ai-hiring",
    topics: ["Definitions", "Tool Categories", "Decision Framework"],
  },
  {
    title: "Complete Guide to Illinois HB 3773",
    description: "Everything employers need to know about Illinois's AI hiring law, effective January 1, 2026.",
    readTime: "12 min read",
    href: "/resources/illinois-ai-hiring-law",
    topics: ["Requirements", "Penalties", "Implementation"],
  },
  {
    title: "Colorado AI Act for Employers",
    description: "Breaking down impact assessments, notifications, and opt-out requirements under Colorado's AI Act.",
    readTime: "10 min read",
    href: "/resources/colorado-ai-act-employers",
    topics: ["Impact Assessments", "Consumer Rights", "Documentation"],
  },
  {
    title: "California CCPA ADMT Regulations",
    description: "Understanding California's automated decision-making technology requirements for hiring.",
    readTime: "11 min read",
    href: "/resources/california-ccpa-admt",
    topics: ["Pre-Use Notice", "Opt-Outs", "Risk Assessments"],
  },
  {
    title: "NYC Local Law 144 Compliance",
    description: "How to comply with New York City's bias audit and disclosure requirements for automated hiring tools.",
    readTime: "9 min read",
    href: "/resources/nyc-local-law-144",
    topics: ["Bias Audits", "Public Disclosure", "Annual Requirements"],
  },
  {
    title: "Building an AI Hiring Compliance Program",
    description: "Step-by-step guide to establishing and maintaining compliance across your organization.",
    readTime: "15 min read",
    href: "/resources/compliance-program-guide",
    topics: ["Program Setup", "Policies", "Ongoing Monitoring"],
  },
  {
    title: "Training HR Teams on AI Compliance",
    description: "How to educate your HR team on AI hiring regulations and best practices.",
    readTime: "7 min read",
    href: "/resources/hr-training-guide",
    topics: ["Training Content", "Documentation", "Certification"],
  },
  {
    title: "Vendor Assessment for AI Hiring Tools",
    description: "How to evaluate your hiring technology vendors for compliance support and transparency.",
    readTime: "8 min read",
    href: "/resources/vendor-assessment-guide",
    topics: ["Vendor Questions", "Due Diligence", "Contracts"],
  },
]

export default function GuidesPage() {
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
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Guides</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl">
            In-depth explanations of AI hiring compliance requirements, state-by-state breakdowns, and implementation best practices.
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {guides.map((guide) => (
            <Link key={guide.href} href={guide.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Clock className="w-4 h-4" />
                    {guide.readTime}
                  </div>
                  <CardTitle className="text-xl mb-2">{guide.title}</CardTitle>
                  <CardDescription className="mb-4">{guide.description}</CardDescription>
                  <div className="flex flex-wrap gap-2">
                    {guide.topics.map((topic) => (
                      <span 
                        key={topic}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center bg-blue-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Need help implementing compliance?
          </h2>
          <p className="text-gray-600 mb-6">
            AIHireLaw automates document generation, training, and tracking so you can focus on hiring.
          </p>
          <Link href="/scorecard">
            <Button variant="cta" size="lg">
              Start Free Assessment <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
