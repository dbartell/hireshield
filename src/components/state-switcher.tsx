'use client'

import { Building2, MapPin } from 'lucide-react'
import { useStateContext, getStateName } from '@/lib/state-context'

interface StateSwitcherProps {
  variant?: 'badge' | 'full'
  className?: string
}

export function StateSwitcher({ variant = 'badge', className = '' }: StateSwitcherProps) {
  const { currentState, stateName, availableStates, isLoading } = useStateContext()

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-gray-700 rounded-lg h-8 w-24 ${className}`} />
    )
  }

  // Simple badge display - will become dropdown when multi-state is added
  if (variant === 'badge') {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg ${className}`}>
        <MapPin className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-medium text-white">{stateName}</span>
        {availableStates.length === 1 && (
          <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">Active</span>
        )}
      </div>
    )
  }

  // Full display with state icon
  return (
    <div className={`flex items-center gap-3 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg ${className}`}>
      <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
        <Building2 className="w-4 h-4 text-blue-400" />
      </div>
      <div>
        <div className="text-sm font-medium text-white">{stateName}</div>
        <div className="text-xs text-gray-400">Active State</div>
      </div>
    </div>
  )
}

// Minimal badge for sidebar
export function StateBadge() {
  const { currentState, stateName, isLoading } = useStateContext()

  if (isLoading) {
    return null
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-300">
      <span className="text-lg">🏛️</span>
      <span className="text-sm font-medium">{stateName}</span>
    </div>
  )
}
