// State-specific compliance requirements
// Maps each regulated state to exactly what's needed

export type TaskPhase = 'today' | 'this_week' | 'setup_once'

export interface ComplianceRequirement {
  id: string
  title: string
  description: string
  type: 'document' | 'action' | 'ongoing'
  docType?: string // links to document type if applicable
  href: string
  estimatedTime?: string // Human-readable time estimate
  estimatedMinutes?: number // Machine-readable for calculations
  phase?: TaskPhase // Grouping for dashboard display
  priority?: number // Lower = higher priority within phase
}

export interface StateCompliance {
  code: string
  name: string
  law: string
  effectiveDate: string
  isActive: boolean
  requirements: ComplianceRequirement[]
}

export const stateCompliance: StateCompliance[] = [
  {
    code: 'IL',
    name: 'Illinois',
    law: 'HB 3773',
    effectiveDate: '2026-01-01',
    isActive: true,
    requirements: [
      {
        id: 'il-disclosure',
        title: 'Candidate Disclosure Notice',
        description: 'Notify candidates that AI is used in hiring decisions',
        type: 'document',
        docType: 'disclosure-candidate',
        href: '/disclosures',
        estimatedTime: '~5 min',
        estimatedMinutes: 5,
        phase: 'today',
        priority: 2,
      },
      {
        id: 'il-employee-notice',
        title: 'Employee Notification',
        description: 'Notify employees when AI affects employment decisions',
        type: 'document',
        docType: 'disclosure-employee',
        href: '/documents?generate=disclosure-employee',
        estimatedTime: '~5 min',
        estimatedMinutes: 5,
        phase: 'this_week',
        priority: 3,
      },
    ],
  },
  {
    code: 'CO',
    name: 'Colorado',
    law: 'AI Act (SB24-205)',
    effectiveDate: '2026-02-01',
    isActive: false, // becomes active Feb 1
    requirements: [
      {
        id: 'co-impact',
        title: 'Impact Assessment',
        description: 'Annual assessment of AI system risks and safeguards',
        type: 'document',
        docType: 'impact-assessment',
        href: '/documents/impact-assessment',
        estimatedTime: '~20 min',
        estimatedMinutes: 20,
        phase: 'today',
        priority: 1,
      },
      {
        id: 'co-disclosure',
        title: 'Candidate Disclosure Notice',
        description: 'Pre-decision notification to candidates',
        type: 'document',
        docType: 'disclosure-candidate',
        href: '/disclosures',
        estimatedTime: '~5 min',
        estimatedMinutes: 5,
        phase: 'today',
        priority: 2,
      },
      {
        id: 'co-consent',
        title: 'Consent Collection',
        description: 'Collect and track candidate consent',
        type: 'ongoing',
        href: '/consent',
        estimatedTime: '~10 min setup',
        estimatedMinutes: 10,
        phase: 'setup_once',
        priority: 1,
      },
    ],
  },
  {
    code: 'NYC',
    name: 'New York City',
    law: 'Local Law 144',
    effectiveDate: '2023-07-05',
    isActive: true,
    requirements: [
      {
        id: 'nyc-audit',
        title: 'Annual Bias Audit',
        description: 'Independent auditor must analyze tool for bias',
        type: 'action',
        href: '/audit',
        estimatedTime: 'varies',
        phase: 'setup_once',
        priority: 2,
      },
      {
        id: 'nyc-disclosure',
        title: 'Bias Audit Disclosure',
        description: 'Publish audit results on your website',
        type: 'document',
        docType: 'bias-audit-disclosure',
        href: '/disclosures',
        estimatedTime: '~5 min',
        estimatedMinutes: 5,
        phase: 'this_week',
        priority: 2,
      },
      {
        id: 'nyc-notice',
        title: 'Candidate Notice (10 days)',
        description: 'Notify candidates 10 business days before AI use',
        type: 'document',
        docType: 'disclosure-candidate',
        href: '/disclosures',
        estimatedTime: '~5 min',
        estimatedMinutes: 5,
        phase: 'today',
        priority: 2,
      },
    ],
  },
  {
    code: 'CA',
    name: 'California',
    law: 'CCPA ADMT Rules',
    effectiveDate: '2026-01-01',
    isActive: true,
    requirements: [
      {
        id: 'ca-disclosure',
        title: 'Pre-Use Notice',
        description: 'Explain ADMT purpose and opt-out rights',
        type: 'document',
        docType: 'disclosure-candidate',
        href: '/disclosures',
        estimatedTime: '~5 min',
        estimatedMinutes: 5,
        phase: 'today',
        priority: 2,
      },
      {
        id: 'ca-consent',
        title: 'Opt-Out Mechanism',
        description: 'Allow candidates to opt out of AI processing',
        type: 'ongoing',
        href: '/consent',
        estimatedTime: '~10 min setup',
        estimatedMinutes: 10,
        phase: 'setup_once',
        priority: 1,
      },
    ],
  },
  {
    code: 'MD',
    name: 'Maryland',
    law: 'HB 1202',
    effectiveDate: '2020-10-01',
    isActive: true,
    requirements: [
      {
        id: 'md-consent',
        title: 'Facial Recognition Consent',
        description: 'Get consent before using facial recognition in interviews',
        type: 'document',
        docType: 'consent-form',
        href: '/documents?generate=consent-form',
        estimatedTime: '~5 min',
        estimatedMinutes: 5,
        phase: 'today',
        priority: 2,
      },
    ],
  },
]

// General requirements for all users
export const generalRequirements: ComplianceRequirement[] = [
  {
    id: 'training',
    title: 'Train Your Team',
    description: 'Certify recruiters and hiring managers on AI compliance',
    type: 'action',
    href: '/training',
    estimatedTime: '~15 min each',
    estimatedMinutes: 15,
    phase: 'this_week',
    priority: 1,
  },
  {
    id: 'disclosure-page',
    title: 'Public Disclosure Page',
    description: 'Publish your AI use disclosure on your careers site',
    type: 'action',
    href: '/disclosures',
    estimatedTime: '~5 min',
    estimatedMinutes: 5,
    phase: 'this_week',
    priority: 2,
  },
  {
    id: 'handbook',
    title: 'Employee Handbook Policy',
    description: 'Add AI use policy to your employee handbook',
    type: 'document',
    docType: 'handbook-policy',
    href: '/documents?generate=handbook-policy',
    estimatedTime: '~5 min',
    estimatedMinutes: 5,
    phase: 'setup_once',
    priority: 3,
  },
]

// Get requirements for a list of state codes
export function getRequirementsForStates(stateCodes: string[]): {
  stateRequirements: { state: StateCompliance; requirements: ComplianceRequirement[] }[]
  generalRequirements: ComplianceRequirement[]
} {
  const stateReqs = stateCodes
    .map(code => stateCompliance.find(s => s.code === code))
    .filter((s): s is StateCompliance => s !== undefined)
    .map(state => ({
      state,
      requirements: state.requirements,
    }))

  return {
    stateRequirements: stateReqs,
    generalRequirements,
  }
}

// Phase display configuration
export const PHASE_CONFIG: Record<TaskPhase, { label: string; sublabel: string; color: string }> = {
  today: { 
    label: 'TODAY', 
    sublabel: 'Complete first',
    color: 'text-red-600 bg-red-50 border-red-200'
  },
  this_week: { 
    label: 'THIS WEEK', 
    sublabel: 'Important tasks',
    color: 'text-amber-600 bg-amber-50 border-amber-200'
  },
  setup_once: { 
    label: 'SET UP ONCE', 
    sublabel: 'Configure and forget',
    color: 'text-blue-600 bg-blue-50 border-blue-200'
  },
}

// Group requirements by phase for dashboard display
export function getRequirementsByPhase(
  stateRequirements: { state: StateCompliance; requirements: ComplianceRequirement[] }[],
  general: ComplianceRequirement[]
): Record<TaskPhase, { requirement: ComplianceRequirement; state?: StateCompliance }[]> {
  const grouped: Record<TaskPhase, { requirement: ComplianceRequirement; state?: StateCompliance }[]> = {
    today: [],
    this_week: [],
    setup_once: [],
  }

  // Add state requirements
  for (const { state, requirements } of stateRequirements) {
    for (const req of requirements) {
      const phase = req.phase || 'setup_once'
      grouped[phase].push({ requirement: req, state })
    }
  }

  // Add general requirements
  for (const req of general) {
    const phase = req.phase || 'setup_once'
    grouped[phase].push({ requirement: req })
  }

  // Sort each phase by priority
  for (const phase of Object.keys(grouped) as TaskPhase[]) {
    grouped[phase].sort((a, b) => (a.requirement.priority || 99) - (b.requirement.priority || 99))
  }

  // Deduplicate by requirement ID (keep first occurrence)
  for (const phase of Object.keys(grouped) as TaskPhase[]) {
    const seen = new Set<string>()
    grouped[phase] = grouped[phase].filter(item => {
      if (seen.has(item.requirement.id)) return false
      seen.add(item.requirement.id)
      return true
    })
  }

  return grouped
}

// Calculate total time estimate for a phase
export function getPhaseTimeEstimate(
  items: { requirement: ComplianceRequirement }[]
): string {
  const totalMinutes = items.reduce((sum, item) => {
    return sum + (item.requirement.estimatedMinutes || 0)
  }, 0)

  if (totalMinutes === 0) return ''
  if (totalMinutes < 60) return `~${totalMinutes} min`
  const hours = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60
  if (mins === 0) return `~${hours}h`
  return `~${hours}h ${mins}m`
}

// Calculate total requirements count
export function getTotalRequirements(stateCodes: string[]): number {
  const { stateRequirements, generalRequirements } = getRequirementsForStates(stateCodes)
  const stateCount = stateRequirements.reduce((sum, s) => sum + s.requirements.length, 0)
  return stateCount + generalRequirements.length
}
