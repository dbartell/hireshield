// AI Hiring Tools (for programmatic SEO pages)
export const AI_TOOLS = [
  { slug: 'hirevue', name: 'HireVue', category: 'Video Interview' },
  { slug: 'workday', name: 'Workday', category: 'ATS/HCM' },
  { slug: 'pymetrics', name: 'Pymetrics', category: 'Assessment' },
  { slug: 'harver', name: 'Harver', category: 'Assessment' },
  { slug: 'eightfold', name: 'Eightfold AI', category: 'Talent Intelligence' },
  { slug: 'paradox', name: 'Paradox (Olivia)', category: 'Chatbot' },
  { slug: 'phenom', name: 'Phenom', category: 'Talent Experience' },
  { slug: 'beamery', name: 'Beamery', category: 'CRM' },
  { slug: 'seekout', name: 'SeekOut', category: 'Sourcing' },
  { slug: 'hiredscore', name: 'HiredScore', category: 'Screening' },
  { slug: 'humanly', name: 'Humanly', category: 'Chatbot' },
  { slug: 'spark-hire', name: 'Spark Hire', category: 'Video Interview' },
  { slug: 'vidcruiter', name: 'VidCruiter', category: 'Video Interview' },
  { slug: 'greenhouse', name: 'Greenhouse', category: 'ATS' },
  { slug: 'lever', name: 'Lever', category: 'ATS' },
  { slug: 'icims', name: 'iCIMS', category: 'ATS' },
  { slug: 'jobvite', name: 'Jobvite', category: 'ATS' },
  { slug: 'taleo', name: 'Taleo', category: 'ATS' },
  { slug: 'sap-successfactors', name: 'SAP SuccessFactors', category: 'HCM' },
  { slug: 'linkedin-recruiter', name: 'LinkedIn Recruiter', category: 'Sourcing' },
  { slug: 'indeed', name: 'Indeed', category: 'Job Board' },
  { slug: 'ziprecruiter', name: 'ZipRecruiter', category: 'Job Board' },
  { slug: 'criteria', name: 'Criteria Corp', category: 'Assessment' },
  { slug: 'shl', name: 'SHL', category: 'Assessment' },
  { slug: 'wonderlic', name: 'Wonderlic', category: 'Assessment' },
  { slug: 'mya', name: 'Mya', category: 'Chatbot' },
  { slug: 'textio', name: 'Textio', category: 'Job Description' },
  { slug: 'fetcher', name: 'Fetcher', category: 'Sourcing' },
  { slug: 'gem', name: 'Gem', category: 'CRM' },
  { slug: 'entelo', name: 'Entelo', category: 'Sourcing' },
] as const

// States with AI hiring laws
export const STATES_WITH_LAWS = [
  { 
    slug: 'illinois', 
    name: 'Illinois', 
    code: 'IL',
    laws: ['AIVI', 'BIPA'],
    effectiveDate: '2020-01-01',
    summary: 'Requires consent before AI video analysis, biometric consent under BIPA'
  },
  { 
    slug: 'colorado', 
    name: 'Colorado', 
    code: 'CO',
    laws: ['Colorado AI Act'],
    effectiveDate: '2026-02-01',
    summary: 'High-risk AI systems in employment require impact assessments, disclosures'
  },
  { 
    slug: 'new-york-city', 
    name: 'New York City', 
    code: 'NYC',
    laws: ['Local Law 144'],
    effectiveDate: '2023-07-05',
    summary: 'Annual bias audits required for automated employment decision tools'
  },
  { 
    slug: 'maryland', 
    name: 'Maryland', 
    code: 'MD',
    laws: ['HB 1202'],
    effectiveDate: '2020-10-01',
    summary: 'Requires consent before using facial recognition in job interviews'
  },
  { 
    slug: 'california', 
    name: 'California', 
    code: 'CA',
    laws: ['CCPA', 'CPRA', 'Proposed AB 331'],
    effectiveDate: '2020-01-01',
    summary: 'Data privacy rights, automated decision-making regulations pending'
  },
  { 
    slug: 'texas', 
    name: 'Texas', 
    code: 'TX',
    laws: ['CUBI'],
    effectiveDate: '2009-09-01',
    summary: 'Biometric data capture requires consent'
  },
  { 
    slug: 'washington', 
    name: 'Washington', 
    code: 'WA',
    laws: ['My Health My Data Act'],
    effectiveDate: '2024-03-31',
    summary: 'Health and biometric data consent requirements'
  },
  { 
    slug: 'new-jersey', 
    name: 'New Jersey', 
    code: 'NJ',
    laws: ['Proposed S-1943'],
    effectiveDate: 'pending',
    summary: 'AI hiring disclosure and bias audit requirements (proposed)'
  },
] as const

// All 50 states for general compliance pages
export const ALL_STATES = [
  { slug: 'alabama', name: 'Alabama', code: 'AL' },
  { slug: 'alaska', name: 'Alaska', code: 'AK' },
  { slug: 'arizona', name: 'Arizona', code: 'AZ' },
  { slug: 'arkansas', name: 'Arkansas', code: 'AR' },
  { slug: 'california', name: 'California', code: 'CA' },
  { slug: 'colorado', name: 'Colorado', code: 'CO' },
  { slug: 'connecticut', name: 'Connecticut', code: 'CT' },
  { slug: 'delaware', name: 'Delaware', code: 'DE' },
  { slug: 'florida', name: 'Florida', code: 'FL' },
  { slug: 'georgia', name: 'Georgia', code: 'GA' },
  { slug: 'hawaii', name: 'Hawaii', code: 'HI' },
  { slug: 'idaho', name: 'Idaho', code: 'ID' },
  { slug: 'illinois', name: 'Illinois', code: 'IL' },
  { slug: 'indiana', name: 'Indiana', code: 'IN' },
  { slug: 'iowa', name: 'Iowa', code: 'IA' },
  { slug: 'kansas', name: 'Kansas', code: 'KS' },
  { slug: 'kentucky', name: 'Kentucky', code: 'KY' },
  { slug: 'louisiana', name: 'Louisiana', code: 'LA' },
  { slug: 'maine', name: 'Maine', code: 'ME' },
  { slug: 'maryland', name: 'Maryland', code: 'MD' },
  { slug: 'massachusetts', name: 'Massachusetts', code: 'MA' },
  { slug: 'michigan', name: 'Michigan', code: 'MI' },
  { slug: 'minnesota', name: 'Minnesota', code: 'MN' },
  { slug: 'mississippi', name: 'Mississippi', code: 'MS' },
  { slug: 'missouri', name: 'Missouri', code: 'MO' },
  { slug: 'montana', name: 'Montana', code: 'MT' },
  { slug: 'nebraska', name: 'Nebraska', code: 'NE' },
  { slug: 'nevada', name: 'Nevada', code: 'NV' },
  { slug: 'new-hampshire', name: 'New Hampshire', code: 'NH' },
  { slug: 'new-jersey', name: 'New Jersey', code: 'NJ' },
  { slug: 'new-mexico', name: 'New Mexico', code: 'NM' },
  { slug: 'new-york', name: 'New York', code: 'NY' },
  { slug: 'new-york-city', name: 'New York City', code: 'NYC' },
  { slug: 'north-carolina', name: 'North Carolina', code: 'NC' },
  { slug: 'north-dakota', name: 'North Dakota', code: 'ND' },
  { slug: 'ohio', name: 'Ohio', code: 'OH' },
  { slug: 'oklahoma', name: 'Oklahoma', code: 'OK' },
  { slug: 'oregon', name: 'Oregon', code: 'OR' },
  { slug: 'pennsylvania', name: 'Pennsylvania', code: 'PA' },
  { slug: 'rhode-island', name: 'Rhode Island', code: 'RI' },
  { slug: 'south-carolina', name: 'South Carolina', code: 'SC' },
  { slug: 'south-dakota', name: 'South Dakota', code: 'SD' },
  { slug: 'tennessee', name: 'Tennessee', code: 'TN' },
  { slug: 'texas', name: 'Texas', code: 'TX' },
  { slug: 'utah', name: 'Utah', code: 'UT' },
  { slug: 'vermont', name: 'Vermont', code: 'VT' },
  { slug: 'virginia', name: 'Virginia', code: 'VA' },
  { slug: 'washington', name: 'Washington', code: 'WA' },
  { slug: 'west-virginia', name: 'West Virginia', code: 'WV' },
  { slug: 'wisconsin', name: 'Wisconsin', code: 'WI' },
  { slug: 'wyoming', name: 'Wyoming', code: 'WY' },
] as const

export type AITool = (typeof AI_TOOLS)[number]
export type StateWithLaw = (typeof STATES_WITH_LAWS)[number]
export type State = (typeof ALL_STATES)[number]

// Generate all tool + state combinations
export function getAllToolStateCombos() {
  const combos: { tool: AITool; state: StateWithLaw }[] = []
  for (const tool of AI_TOOLS) {
    for (const state of STATES_WITH_LAWS) {
      combos.push({ tool, state })
    }
  }
  return combos
}

// Get tool by slug
export function getToolBySlug(slug: string) {
  return AI_TOOLS.find(t => t.slug === slug)
}

// Get state by slug
export function getStateBySlug(slug: string) {
  return STATES_WITH_LAWS.find(s => s.slug === slug) || ALL_STATES.find(s => s.slug === slug)
}
