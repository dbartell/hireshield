import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, FileText, HelpCircle, Clock } from "lucide-react"

const featuredPosts = [
  {
    title: "What Counts as AI in Hiring? A Complete Guide",
    description: "LinkedIn Recruiter, Indeed assessments, HireVue — do they trigger compliance requirements? Here's how to know.",
    category: "Guide",
    readTime: "8 min read",
    href: "/resources/what-counts-as-ai-hiring",
    featured: true,
  },
  {
    title: "Illinois AI Hiring Law: AIVIA Compliance Guide 2026",
    description: "Everything you need to know about AIVIA compliance — disclosure requirements, consent rules, penalties, and a step-by-step checklist.",
    category: "Compliance Guide",
    readTime: "10 min read",
    href: "/resources/illinois-aivia-compliance-guide",
  },
  {
    title: "Illinois AI Hiring Law (HB 3773): Everything Employers Need to Know",
    description: "Effective January 1, 2026. Here's what Illinois employers must do to stay compliant.",
    category: "State Law",
    readTime: "12 min read",
    href: "/resources/illinois-ai-hiring-law",
  },
  {
    title: "Colorado AI Act: Employer Requirements Explained",
    description: "Impact assessments, consumer notifications, and opt-outs. Breaking down what Colorado requires.",
    category: "State Law",
    readTime: "10 min read",
    href: "/resources/colorado-ai-act-employers",
  },
  {
    title: "How to Write an AI Disclosure Notice for Candidates",
    description: "Template and best practices for notifying candidates about AI use in your hiring process.",
    category: "Template",
    readTime: "5 min read",
    href: "/resources/ai-disclosure-notice-template",
  },
  {
    title: "AI Hiring Compliance Checklist for 2026",
    description: "A step-by-step checklist to ensure your company is compliant with all major AI hiring laws.",
    category: "Checklist",
    readTime: "6 min read",
    href: "/resources/compliance-checklist-2026",
  },
  {
    title: "Do I Need to Disclose AI in Hiring? Decision Tree",
    description: "Use this simple flowchart to determine if your company needs to disclose AI use to candidates.",
    category: "Tool",
    readTime: "3 min read",
    href: "/resources/ai-disclosure-decision-tree",
  },
]

const categories = [
  {
    name: "Guides",
    description: "In-depth explanations of compliance requirements",
    icon: BookOpen,
    href: "/resources/guides",
    count: 12,
  },
  {
    name: "Templates",
    description: "Ready-to-use compliance documents",
    icon: FileText,
    href: "/resources/templates",
    count: 8,
  },
  {
    name: "FAQ",
    description: "Common questions answered",
    icon: HelpCircle,
    href: "/resources/faq",
    count: 24,
  },
]

export default function ResourcesPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Resources
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Guides, templates, and insights to help you navigate AI hiring compliance.
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {categories.map((category) => (
            <Link key={category.name} href={category.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <category.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="flex items-center justify-between">
                    {category.name}
                    <span className="text-sm font-normal text-gray-500">{category.count} items</span>
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {/* Featured Post */}
        {featuredPosts.filter(p => p.featured).map((post) => (
          <Card key={post.href} className="mb-12 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <span className="inline-block bg-white/20 text-white text-sm px-3 py-1 rounded-full mb-4">
                    Featured
                  </span>
                  <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                  <p className="text-blue-100 mb-4">{post.description}</p>
                  <div className="flex items-center gap-4 text-blue-200 text-sm">
                    <span>{post.category}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
                <Link href={post.href}>
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 whitespace-nowrap">
                    Read Article <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Blog Posts */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.filter(p => !p.featured).map((post) => (
              <Link key={post.href} href={post.href}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <CardDescription>{post.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-gray-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Not sure if you're compliant?
          </h2>
          <p className="text-gray-600 mb-6">
            Take our free 2-minute assessment and get a personalized compliance report.
          </p>
          <Link href="/scorecard">
            <Button variant="cta" size="lg">
              Get Your Free Score <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
