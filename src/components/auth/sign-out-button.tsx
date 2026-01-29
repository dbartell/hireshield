"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { LogOut } from "lucide-react"

export function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button 
      onClick={handleSignOut}
      className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
    >
      <LogOut className="w-5 h-5" />
      Sign Out
    </button>
  )
}
