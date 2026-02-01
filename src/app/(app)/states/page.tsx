"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  Loader2, CheckCircle, AlertTriangle, X, Shield
} from "lucide-react"
import { StateOutline, getStateName } from "@/components/state-outline"
import { 
  getHiringStates, 
  addHiringState, 
  removeHiringState,
  stateHasComplianceWork,
  stateChecklists
} from "@/lib/actions/compliance"
import { allStates, regulatedStates } from "@/data/states"

interface RemovalModalProps {
  stateCode: string
  onConfirm: () => void
  onCancel: () => void
}

function RemovalModal({ stateCode, onConfirm, onCancel }: RemovalModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              Remove {getStateName(stateCode)}?
            </h3>
            <p className="text-gray-600 mt-2">
              You have compliance work for {getStateName(stateCode)}. Removing it won't delete your records, 
              but it will be hidden from your dashboard.
            </p>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={onConfirm}>
                Remove State
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function StatesPage() {
  const [loading, setLoading] = useState(true)
  const [selectedStates, setSelectedStates] = useState<Set<string>>(new Set())
  const [updating, setUpdating] = useState<string | null>(null)
  const [removalModal, setRemovalModal] = useState<string | null>(null)

  useEffect(() => {
    loadStates()
  }, [])

  const loadStates = async () => {
    setLoading(true)
    const states = await getHiringStates()
    setSelectedStates(new Set(states))
    setLoading(false)
  }

  const handleToggleState = async (stateCode: string) => {
    const isSelected = selectedStates.has(stateCode)
    
    if (isSelected) {
      // Check if state has compliance work
      const hasWork = await stateHasComplianceWork(stateCode)
      if (hasWork) {
        setRemovalModal(stateCode)
        return
      }
    }
    
    await toggleState(stateCode, isSelected)
  }

  const toggleState = async (stateCode: string, isCurrentlySelected: boolean) => {
    setUpdating(stateCode)
    
    if (isCurrentlySelected) {
      await removeHiringState(stateCode)
      setSelectedStates(prev => {
        const newSet = new Set(prev)
        newSet.delete(stateCode)
        return newSet
      })
    } else {
      await addHiringState(stateCode)
      setSelectedStates(prev => new Set([...prev, stateCode]))
    }
    
    setUpdating(null)
  }

  const handleConfirmRemoval = async () => {
    if (removalModal) {
      await toggleState(removalModal, true)
      setRemovalModal(null)
    }
  }

  // Sort states alphabetically, but show regulated states first
  const sortedStates = [...allStates].sort((a, b) => {
    const aRegulated = regulatedStates.includes(a.code)
    const bRegulated = regulatedStates.includes(b.code)
    if (aRegulated && !bRegulated) return -1
    if (!aRegulated && bRegulated) return 1
    return a.name.localeCompare(b.name)
  })

  const regulatedStatesList = sortedStates.filter(s => regulatedStates.includes(s.code))
  const otherStatesList = sortedStates.filter(s => !regulatedStates.includes(s.code))

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Hiring States</h1>
          <p className="text-gray-600">
            Select the states where you hire employees. Regulated states will show compliance requirements.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-gray-900">{selectedStates.size}</div>
              <div className="text-sm text-gray-500">States Selected</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600">
                {[...selectedStates].filter(s => regulatedStates.includes(s)).length}
              </div>
              <div className="text-sm text-gray-500">Regulated States</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600">
                {regulatedStates.length}
              </div>
              <div className="text-sm text-gray-500">Total Regulated States</div>
            </CardContent>
          </Card>
        </div>

        {/* Regulated States Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Regulated States
            </CardTitle>
            <CardDescription>
              These states have AI hiring laws that require compliance action
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {regulatedStatesList.map(state => {
                const isSelected = selectedStates.has(state.code)
                const isUpdating = updating === state.code
                const checklist = stateChecklists[state.code] || []
                const stepCount = checklist.length

                return (
                  <button
                    key={state.code}
                    onClick={() => handleToggleState(state.code)}
                    disabled={isUpdating}
                    className={`
                      relative p-4 rounded-lg border-2 transition-all text-left
                      ${isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                      }
                      ${isUpdating ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
                    `}
                  >
                    {isUpdating && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-lg">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                      </div>
                    )}
                    
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                      </div>
                    )}

                    <StateOutline 
                      stateCode={state.code} 
                      size={32}
                      highlighted={isSelected}
                    />
                    <div className="mt-2">
                      <div className="font-medium text-gray-900">{state.name}</div>
                      <div className="text-xs text-gray-500">
                        {stepCount} compliance steps
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div className="mt-2">
                        <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                          Active
                        </span>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Other States Section */}
        <Card>
          <CardHeader>
            <CardTitle>Other States</CardTitle>
            <CardDescription>
              States without current AI hiring regulations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {otherStatesList.map(state => {
                const isSelected = selectedStates.has(state.code)
                const isUpdating = updating === state.code

                return (
                  <button
                    key={state.code}
                    onClick={() => handleToggleState(state.code)}
                    disabled={isUpdating}
                    className={`
                      relative p-3 rounded-lg border transition-all text-center
                      ${isSelected 
                        ? 'border-gray-400 bg-gray-100' 
                        : 'border-gray-200 bg-white hover:border-gray-300 opacity-60 hover:opacity-100'
                      }
                      ${isUpdating ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
                    `}
                  >
                    {isUpdating && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-lg">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                      </div>
                    )}

                    <StateOutline 
                      stateCode={state.code} 
                      size={24}
                      highlighted={isSelected}
                      className="mx-auto"
                    />
                    <div className="mt-1 text-xs text-gray-700 truncate">
                      {state.code}
                    </div>
                    
                    {isSelected && (
                      <CheckCircle className="w-4 h-4 text-gray-500 mx-auto mt-1" />
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Help Card */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">AI Hiring Laws are Expanding</h3>
                <p className="text-sm text-blue-700 mt-1">
                  More states are introducing AI hiring regulations. We monitor legislative changes 
                  and will notify you when new laws affect your hiring states.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Removal Modal */}
      {removalModal && (
        <RemovalModal
          stateCode={removalModal}
          onConfirm={handleConfirmRemoval}
          onCancel={() => setRemovalModal(null)}
        />
      )}
    </div>
  )
}
