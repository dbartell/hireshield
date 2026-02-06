"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { 
  getRequirementsForStates, 
  getRequirementsByPhase,
  ComplianceRequirement,
  StateCompliance,
  TaskPhase 
} from "@/data/compliance-requirements"

interface NextTask {
  title: string
  href: string
  description: string
  stateCode?: string
}

export function useNextTask(excludeTaskId?: string): {
  nextTask: NextTask | null
  loading: boolean
} {
  const [nextTask, setNextTask] = useState<NextTask | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function findNextTask() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      // Fetch org data to get states and completion status
      const [orgRes, docsRes, disclosureRes, trainingRes] = await Promise.all([
        supabase.from('organizations').select('states').eq('id', user.id).single(),
        supabase.from('documents').select('doc_type').eq('org_id', user.id),
        supabase.from('disclosure_pages').select('is_published').eq('organization_id', user.id).single(),
        supabase.from('training_assignments').select('status').eq('org_id', user.id).eq('status', 'completed').limit(1),
      ])

      const states = orgRes.data?.states || []
      const completedDocTypes = docsRes.data?.map(d => d.doc_type) || []
      const hasDisclosure = disclosureRes.data?.is_published || false
      const hasTraining = (trainingRes.data?.length || 0) > 0

      // Get requirements
      const { stateRequirements, generalRequirements } = getRequirementsForStates(states)
      const phasedRequirements = getRequirementsByPhase(stateRequirements, generalRequirements)

      // Check if a requirement is complete
      const isComplete = (reqId: string, docType?: string): boolean => {
        if (docType && completedDocTypes.includes(docType)) return true
        if (reqId === 'training' && hasTraining) return true
        if (reqId.includes('disclosure') && hasDisclosure) return true
        return false
      }

      // Find next incomplete task
      const phases: TaskPhase[] = ['today', 'this_week', 'setup_once']
      
      for (const phase of phases) {
        for (const { requirement, state } of phasedRequirements[phase]) {
          if (requirement.id === excludeTaskId) continue
          if (!isComplete(requirement.id, requirement.docType)) {
            setNextTask({
              title: requirement.title,
              href: requirement.href,
              description: requirement.description,
              stateCode: state?.code,
            })
            setLoading(false)
            return
          }
        }
      }

      setNextTask(null)
      setLoading(false)
    }

    findNextTask()
  }, [excludeTaskId])

  return { nextTask, loading }
}
