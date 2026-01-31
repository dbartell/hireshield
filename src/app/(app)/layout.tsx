import Link from "next/link"
import { redirect } from "next/navigation"
import { Shield, LayoutDashboard, ClipboardCheck, FileText, GraduationCap, Users, Settings } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { MobileSidebar } from "@/components/layout/mobile-sidebar"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get organization info
  const { data: org } = await supabase
    .from('organizations')
    .select('name')
    .eq('id', user.id)
    .single()

  const orgName = org?.name || 'Your Company'
  const userEmail = user.email || ''

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile sidebar (hamburger menu) */}
      <MobileSidebar orgName={orgName} userEmail={userEmail} />

      {/* Desktop sidebar - hidden on mobile */}
      <aside className="hidden md:flex w-64 bg-gray-900 text-white flex-col fixed inset-y-0 left-0">
        <div className="p-4 border-b border-gray-800">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">AIHireLaw</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
            <Link 
              href="/audit" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            >
              <ClipboardCheck className="w-5 h-5" />
              Compliance Audit
            </Link>
            <Link 
              href="/documents" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            >
              <FileText className="w-5 h-5" />
              Documents
            </Link>
            <Link 
              href="/training" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            >
              <GraduationCap className="w-5 h-5" />
              Training
            </Link>
            <Link 
              href="/consent" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            >
              <Users className="w-5 h-5" />
              Consent Tracking
            </Link>
          </div>
          
          <div className="mt-8 pt-4 border-t border-gray-800">
            <Link 
              href="/settings" 
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </div>
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <div className="mb-3 px-3">
            <div className="text-sm font-medium text-white truncate">{orgName}</div>
            <div className="text-xs text-gray-400 truncate">{userEmail}</div>
          </div>
          <SignOutButton />
        </div>
      </aside>
      
      {/* Main content - offset for desktop sidebar */}
      <main className="flex-1 bg-gray-50 md:ml-64">
        {children}
      </main>
    </div>
  )
}
