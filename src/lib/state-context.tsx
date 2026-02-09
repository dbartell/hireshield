'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { allStates } from '@/data/states'

interface StateContextType {
  currentState: string
  setCurrentState: (state: string) => void
  availableStates: string[]
  stateName: string
  isLoading: boolean
}

const StateContext = createContext<StateContextType | undefined>(undefined)

// Map state codes to full names
export function getStateName(code: string): string {
  const state = allStates.find(s => s.code === code)
  return state?.name || code
}

interface StateProviderProps {
  children: ReactNode
  initialState?: string
  initialAvailableStates?: string[]
}

export function StateProvider({ 
  children, 
  initialState = 'IL',
  initialAvailableStates = ['IL']
}: StateProviderProps) {
  const [currentState, setCurrentState] = useState(initialState)
  const [availableStates, setAvailableStates] = useState<string[]>(initialAvailableStates)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStateFromOrg() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: org } = await supabase
          .from('organizations')
          .select('primary_state, active_states')
          .eq('id', user.id)
          .single()
        
        if (org) {
          // Set current state from org's primary_state or first active state
          const primaryState = org.primary_state || org.active_states?.[0] || 'IL'
          setCurrentState(primaryState)
          
          // Set available states from org's active_states
          const states = org.active_states || ['IL']
          setAvailableStates(states)
        }
      }
      
      setIsLoading(false)
    }
    
    loadStateFromOrg()
  }, [])

  const stateName = getStateName(currentState)

  return (
    <StateContext.Provider value={{ 
      currentState, 
      setCurrentState, 
      availableStates,
      stateName,
      isLoading
    }}>
      {children}
    </StateContext.Provider>
  )
}

export function useStateContext() {
  const context = useContext(StateContext)
  if (context === undefined) {
    throw new Error('useStateContext must be used within a StateProvider')
  }
  return context
}
