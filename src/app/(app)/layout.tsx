import Link from "next/link"
import { redirect } from "next/navigation"
import { Shield, LayoutDashboard, ClipboardCheck, FileText, GraduationCap, Users, Settings, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { SignOutButton } from "@/components/auth/sign-out-button"

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

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-800 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">HireShield</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4">
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
            <div className="text-sm font-medium text-white truncate">{org?.name || 'Your Company'}</div>
            <div className="text-xs text-gray-400 truncate">{user.email}</div>
          </div>
          <SignOutButton />
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
    </div>
  )
}
