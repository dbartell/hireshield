// State-specific compliance requirements
// Maps each regulated state to exactly what's needed

export interface ComplianceRequirement {
  id: string
  title: string
  description: string
  type: 'document' | 'action' | 'ongoing'
  docType?: string // links to document type if applicable
  href: string
  estimatedTime?: string
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
        href: '/documents?generate=disclosure-candidate',
        estimatedTime: '2 min',
      },
      {
        id: 'il-employee-notice',
        title: 'Employee Notification',
        description: 'Notify employees when AI affects employment decisions',
        type: 'document',
        docType: 'disclosure-employee',
        href: '/documents?generate=disclosure-employee',
        estimatedTime: '2 min',
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
        estimatedTime: '15 min',
      },
      {
        id: 'co-disclosure',
        title: 'Candidate Disclosure Notice',
        description: 'Pre-decision notification to candidates',
        type: 'document',
        docType: 'disclosure-candidate',
        href: '/documents?generate=disclosure-candidate',
        estimatedTime: '2 min',
      },
      {
        id: 'co-consent',
        title: 'Consent Collection',
        description: 'Collect and track candidate consent',
        type: 'ongoing',
        href: '/consent',
        estimatedTime: 'ongoing',
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
      },
      {
        id: 'nyc-disclosure',
        title: 'Bias Audit Disclosure',
        description: 'Publish audit results on your website',
        type: 'document',
        docType: 'bias-audit-disclosure',
        href: '/disclosures',
        estimatedTime: '5 min',
      },
      {
        id: 'nyc-notice',
        title: 'Candidate Notice (10 days)',
        description: 'Notify candidates 10 business days before AI use',
        type: 'document',
        docType: 'disclosure-candidate',
        href: '/documents?generate=disclosure-candidate',
        estimatedTime: '2 min',
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
        href: '/documents?generate=disclosure-candidate',
        estimatedTime: '2 min',
      },
      {
        id: 'ca-consent',
        title: 'Opt-Out Mechanism',
        description: 'Allow candidates to opt out of AI processing',
        type: 'ongoing',
        href: '/consent',
        estimatedTime: 'ongoing',
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
        estimatedTime: '2 min',
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
    estimatedTime: '15-30 min',
  },
  {
    id: 'handbook',
    title: 'Employee Handbook Policy',
    description: 'Add AI use policy to your employee handbook',
    type: 'document',
    docType: 'handbook-policy',
    href: '/documents?generate=handbook-policy',
    estimatedTime: '5 min',
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

// Calculate total requirements count
export function getTotalRequirements(stateCodes: string[]): number {
  const { stateRequirements, generalRequirements } = getRequirementsForStates(stateCodes)
  const stateCount = stateRequirements.reduce((sum, s) => sum + s.requirements.length, 0)
  return stateCount + generalRequirements.length
}
