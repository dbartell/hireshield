"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronUp, Plus, Loader2 } from "lucide-react"
import { StateOutline, getStateName } from "@/components/state-outline"
import { getHiringStatesWithProgress, type HiringStateWithProgress } from "@/lib/actions/compliance"

interface SidebarStatesProps {
  onNavigate?: () => void
}

export function SidebarStates({ onNavigate }: SidebarStatesProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [states, setStates] = useState<HiringStateWithProgress[]>([])
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    loadStates()
  }, [])

  const loadStates = async () => {
    setLoading(true)
    const data = await getHiringStatesWithProgress()
    // Only show regulated states in the sidebar
    setStates(data.filter(s => s.is_regulated))
    setLoading(false)
  }

  // Determine if we're on a state page
  const activeStateCode = pathname.startsWith('/state/') 
    ? pathname.split('/')[2]?.toUpperCase() 
    : null

  return (
    <div className="mt-2">
      {/* Accordion Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 text-gray-400 hover:text-white transition-colors"
      >
        <span className="text-xs font-semibold uppercase tracking-wider">
          Your States {states.length > 0 && `(${states.length})`}
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {/* State List */}
      {isExpanded && (
        <div className="space-y-0.5 mt-1">
          {loading ? (
            <div className="px-3 py-4 flex justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
            </div>
          ) : states.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              No regulated states selected
            </div>
          ) : (
            states.map((state) => {
              const isActive = activeStateCode === state.state_code
              const progressText = state.total > 0 
                ? `${state.completed}/${state.total} complete`
                : 'Not started'
              const isComplete = state.completed === state.total && state.total > 0

              return (
                <Link
                  key={state.state_code}
                  href={`/state/${state.state_code.toLowerCase()}`}
                  onClick={onNavigate}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  <StateOutline 
                    stateCode={state.state_code} 
                    size={20}
                    highlighted={isActive || isComplete}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {state.state_name}
                    </div>
                    <div className={`text-xs ${
                      isActive 
                        ? 'text-blue-200' 
                        : isComplete 
                          ? 'text-green-400' 
                          : 'text-gray-500'
                    }`}>
                      {isComplete ? '✓ Compliant' : progressText}
                    </div>
                  </div>
                </Link>
              )
            })
          )}

          {/* Add/Remove States Link */}
          <Link
            href="/states"
            onClick={onNavigate}
            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
              ${pathname === '/states' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }
            `}
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm">Add/Remove States</span>
          </Link>
        </div>
      )}
    </div>
  )
}
