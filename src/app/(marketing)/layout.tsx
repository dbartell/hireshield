"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ChevronDown, Shield } from "lucide-react"

const stateLaws = [
  { name: "Illinois", href: "/compliance/illinois", law: "HB 3773" },
  { name: "Colorado", href: "/compliance/colorado", law: "AI Act" },
  { name: "California", href: "/compliance/california", law: "CCPA ADMT" },
  { name: "New York City", href: "/compliance/nyc", law: "Local Law 144" },
]

const resources = [
  { name: "Blog", href: "/resources", description: "Latest insights on AI hiring compliance" },
  { name: "Guides", href: "/resources/guides", description: "Step-by-step compliance guides" },
  { name: "Templates", href: "/resources/templates", description: "Ready-to-use compliance documents" },
  { name: "Glossary", href: "/glossary", description: "Key terms and definitions" },
  { name: "Tool Comparisons", href: "/compare", description: "Compare AI hiring tools" },
  { name: "FAQ", href: "/resources/faq", description: "Common questions answered" },
]

function Dropdown({ 
  label, 
  items, 
  type = "simple" 
}: { 
  label: string
  items: typeof stateLaws | typeof resources
  type?: "simple" | "detailed"
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 py-2">
        {label}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 pt-2 z-50">
          <div className="bg-white rounded-lg shadow-lg border py-2 min-w-[220px]">
            {type === "simple" ? (
              items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between px-4 py-2 hover:bg-gray-50"
                >
                  <span className="text-gray-900">{item.name}</span>
                  {'law' in item && (
                    <span className="text-xs text-gray-500">{item.law}</span>
                  )}
                </Link>
              ))
            ) : (
              items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2 hover:bg-gray-50"
                >
                  <div className="text-gray-900 font-medium">{item.name}</div>
                  {'description' in item && (
                    <div className="text-xs text-gray-500">{item.description}</div>
                  )}
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-900 whitespace-nowrap">AI Hire Law</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Dropdown label="State Laws" items={stateLaws} type="simple" />
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
              <Dropdown label="Resources" items={resources} type="detailed" />
            </div>

            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/onboard">
                <Button variant="cta">Free Compliance Score</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/onboard" className="hover:text-white">Free Assessment</Link></li>
                <li><Link href="/demo" className="hover:text-white">Request Demo</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">State Laws</h3>
              <ul className="space-y-2">
                {stateLaws.map((state) => (
                  <li key={state.href}>
                    <Link href={state.href} className="hover:text-white">{state.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                {resources.map((resource) => (
                  <li key={resource.href}>
                    <Link href={resource.href} className="hover:text-white">{resource.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p>© 2026 AI Hire Law. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
