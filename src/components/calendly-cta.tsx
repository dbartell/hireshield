"use client"

import { Calendar, MessageCircle, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CalendlyCTAProps {
  variant?: "inline" | "banner" | "floating" | "card"
  title?: string
  description?: string
  calendlyUrl?: string
}

// Default Calendly URL - update this when you have one
const DEFAULT_CALENDLY_URL = "https://calendly.com/aihirelaw/compliance-review"

export function CalendlyCTA({ 
  variant = "inline",
  title = "Need help?",
  description = "Book a free 15-minute compliance review with our team.",
  calendlyUrl = DEFAULT_CALENDLY_URL
}: CalendlyCTAProps) {
  const handleClick = () => {
    // Open Calendly in a new tab or use Calendly's popup widget
    window.open(calendlyUrl, '_blank')
  }

  if (variant === "floating") {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={handleClick}
          className="rounded-full w-14 h-14 shadow-lg bg-blue-600 hover:bg-blue-700"
          title="Book a call"
        >
          <Calendar className="w-6 h-6" />
        </Button>
      </div>
    )
  }

  if (variant === "banner") {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="font-medium">{title}</div>
            <div className="text-sm text-blue-100">{description}</div>
          </div>
        </div>
        <Button
          onClick={handleClick}
          variant="secondary"
          className="bg-white text-blue-600 hover:bg-blue-50"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Book Call
        </Button>
      </div>
    )
  }

  if (variant === "card") {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <Button onClick={handleClick} className="w-full">
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Free Review
        </Button>
        <p className="text-xs text-gray-500 mt-3">
          No obligation • 15 minutes • Get clarity
        </p>
      </div>
    )
  }

  // Default: inline
  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline"
    >
      <Calendar className="w-4 h-4" />
      {title}
    </button>
  )
}

// Contextual help CTA for specific confusion points
interface ContextualHelpProps {
  context: "audit-results" | "document-choice" | "compliance-score" | "state-laws" | "general"
}

export function ContextualHelp({ context }: ContextualHelpProps) {
  const messages = {
    "audit-results": {
      title: "Not sure what these findings mean?",
      description: "Let's walk through your results and prioritize next steps together.",
    },
    "document-choice": {
      title: "Not sure which documents you need?",
      description: "We'll help you identify exactly what's required for your situation.",
    },
    "compliance-score": {
      title: "Want to improve your score?",
      description: "Get a personalized action plan to reach full compliance.",
    },
    "state-laws": {
      title: "Confused about state requirements?",
      description: "We'll explain exactly what applies to your business.",
    },
    "general": {
      title: "Have questions?",
      description: "Book a free call with our compliance team.",
    },
  }

  const { title, description } = messages[context]

  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-start gap-3">
        <MessageCircle className="w-5 h-5 text-blue-600 mt-0.5" />
        <div className="flex-1">
          <p className="font-medium text-blue-900">{title}</p>
          <p className="text-sm text-blue-700 mt-1">{description}</p>
          <Button
            onClick={() => window.open(DEFAULT_CALENDLY_URL, '_blank')}
            size="sm"
            className="mt-3"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Book Free Call
          </Button>
        </div>
      </div>
    </div>
  )
}
