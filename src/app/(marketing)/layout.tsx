import Link from "next/link"
import { Button } from "@/components/ui/button"

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
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="font-bold text-xl">HireShield</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/compliance/illinois" className="text-gray-600 hover:text-gray-900">
                State Laws
              </Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
              <Link href="/resources" className="text-gray-600 hover:text-gray-900">
                Resources
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/scorecard">
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
                <li><Link href="/scorecard" className="hover:text-white">Free Assessment</Link></li>
                <li><Link href="/demo" className="hover:text-white">Request Demo</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Compliance</h3>
              <ul className="space-y-2">
                <li><Link href="/compliance/illinois" className="hover:text-white">Illinois</Link></li>
                <li><Link href="/compliance/colorado" className="hover:text-white">Colorado</Link></li>
                <li><Link href="/compliance/california" className="hover:text-white">California</Link></li>
                <li><Link href="/compliance/nyc" className="hover:text-white">NYC</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/resources" className="hover:text-white">Blog</Link></li>
                <li><Link href="/resources/guides" className="hover:text-white">Guides</Link></li>
                <li><Link href="/resources/templates" className="hover:text-white">Templates</Link></li>
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
            <p>© 2026 HireShield. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
