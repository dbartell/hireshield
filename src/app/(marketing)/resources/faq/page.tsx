"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, HelpCircle, ChevronDown } from "lucide-react"
import { useState } from "react"

const faqCategories = [
  {
    name: "General",
    questions: [
      {
        q: "What is AI in hiring?",
        a: "AI in hiring refers to any automated system that uses algorithms, machine learning, or artificial intelligence to make or assist in employment decisions. This includes resume screening tools, video interview analysis, skills assessments, candidate ranking systems, and chatbots that interact with applicants."
      },
      {
        q: "Do I need to comply with AI hiring laws?",
        a: "If you hire in Illinois, Colorado, California, or New York City AND use any AI-powered tools in your hiring process (including common tools like LinkedIn Recruiter, Indeed, or HireVue), you likely need to comply. Take our free scorecard to find out."
      },
      {
        q: "What counts as an 'automated employment decision tool'?",
        a: "Generally, any software that uses computation to substantially assist or replace human decision-making in hiring. This includes ATS systems with AI features, video interview platforms that analyze responses, skills assessment tools, and resume screening software."
      },
      {
        q: "When do these laws take effect?",
        a: "NYC Local Law 144 is already in effect. Illinois HB 3773 takes effect January 1, 2026. Colorado's AI Act takes effect February 1, 2026. California's CCPA ADMT regulations take effect January 1, 2026 with some provisions in 2027."
      },
    ]
  },
  {
    name: "State-Specific",
    questions: [
      {
        q: "What does Illinois require?",
        a: "Illinois HB 3773 requires employers to: (1) notify applicants when AI is used in hiring decisions, (2) provide information about what data the AI collects and how it's used, and (3) ensure the AI doesn't discriminate based on protected characteristics."
      },
      {
        q: "What does Colorado require?",
        a: "Colorado's AI Act requires: (1) impact assessments for high-risk AI systems, (2) consumer notifications before AI is used in consequential decisions, (3) the ability for consumers to opt out in some cases, and (4) documentation of risk management practices."
      },
      {
        q: "What does NYC Local Law 144 require?",
        a: "NYC requires: (1) an annual independent bias audit of automated employment decision tools, (2) public posting of audit results on your website, (3) candidate notification at least 10 days before use, and (4) information about what data is collected."
      },
      {
        q: "What does California require?",
        a: "California's CCPA ADMT regulations require: (1) pre-use notice to individuals, (2) the right to opt out of automated decision-making, (3) access to information about automated decisions, and (4) risk assessments for certain uses."
      },
    ]
  },
  {
    name: "Compliance",
    questions: [
      {
        q: "What are the penalties for non-compliance?",
        a: "Penalties vary by state. NYC can fine $500-$1,500 per violation per day. Colorado penalties can reach $20,000 per violation. California CCPA violations can result in $2,500-$7,500 per violation. Class action lawsuits are also possible."
      },
      {
        q: "Do I need a bias audit?",
        a: "NYC requires an annual independent bias audit for automated employment decision tools. Other states don't specifically require audits but do require impact assessments (Colorado) or risk assessments (California) that serve similar purposes."
      },
      {
        q: "How do I notify candidates about AI use?",
        a: "Notification requirements vary by state but generally include: telling candidates AI will be used, what data is collected, how the AI works, and any available alternatives. AIHireLaw generates compliant disclosure notices automatically."
      },
      {
        q: "Do candidates have the right to opt out?",
        a: "It depends on the state. Colorado gives consumers the right to opt out of profiling for consequential decisions in some cases. California provides opt-out rights for automated decision-making. Illinois and NYC focus on disclosure rather than opt-out."
      },
    ]
  },
  {
    name: "AIHireLaw",
    questions: [
      {
        q: "What does AIHireLaw do?",
        a: "AIHireLaw is a compliance platform that helps companies audit their AI hiring tools, generate required disclosures and policies, train HR teams, and track candidate consent—all in one place."
      },
      {
        q: "Do I need to integrate AIHireLaw with my ATS?",
        a: "No. AIHireLaw works alongside your existing tools without requiring integrations. You can manually track compliance, generate documents, and manage training without connecting any systems."
      },
      {
        q: "How much does AIHireLaw cost?",
        a: "AIHireLaw offers three plans: Starter ($199/mo) for small teams, Pro ($499/mo) for growing companies, and Enterprise ($1,999/mo) for large organizations. All plans include a 14-day free trial."
      },
      {
        q: "Is there a free trial?",
        a: "Yes! All plans include a 14-day free trial. You can also take our free compliance scorecard to assess your risk level before signing up."
      },
    ]
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left"
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-6 pb-5 text-gray-600 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <HelpCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">FAQ</h1>
          </div>
          <p className="text-xl text-gray-600">
            Common questions about AI hiring compliance, answered.
          </p>
        </div>

        {/* FAQ Categories */}
        {faqCategories.map((category) => (
          <div key={category.name} className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{category.name}</h2>
            <div className="bg-white rounded-lg border">
              {category.questions.map((faq, index) => (
                <FAQItem key={index} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="text-center bg-gray-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-6">
            Take our free assessment to get personalized guidance for your situation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/scorecard">
              <Button variant="cta" size="lg">
                Free Compliance Score <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
