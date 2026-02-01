/**
 * Test data for HireShield E2E tests
 */

// Generate unique identifiers for test isolation
const timestamp = () => Date.now()
const randomString = () => Math.random().toString(36).substring(2, 8)

export const testData = {
  // Test user credentials
  testUser: {
    email: `test-${randomString()}@hireshield-e2e.test`,
    password: 'TestPassword123!',
    companyName: `Test Company ${randomString()}`,
    name: 'Test User',
  },

  // Existing test user for login tests (pre-seeded in DB if needed)
  existingUser: {
    email: process.env.TEST_USER_EMAIL || 'e2e-test@hireshield.test',
    password: process.env.TEST_USER_PASSWORD || 'TestPassword123!',
  },

  // Company data
  company: {
    name: 'Acme Corp E2E',
    size: 'medium',
    industry: 'Technology',
  },

  // Jurisdiction selections
  jurisdictions: {
    nyc: 'NYC',
    colorado: 'Colorado',
    illinois: 'Illinois',
    california: 'California',
  },

  // AI Tools
  aiTools: [
    {
      name: 'HireVue',
      purpose: 'Video interview analysis',
      evaluates: 'Communication skills, personality traits',
      stages: 'Initial screening',
    },
    {
      name: 'Resume Screener AI',
      purpose: 'Resume parsing and ranking',
      evaluates: 'Skills match, experience relevance',
      stages: 'Application review',
    },
  ],

  // Team members for onboarding
  teamMembers: {
    recruiter: {
      name: 'Jane Recruiter',
      email: `recruiter-${randomString()}@test.com`,
    },
    hiringManager: {
      name: 'John Manager',
      email: `manager-${randomString()}@test.com`,
    },
    hrAdmin: {
      name: 'Sarah Admin',
      email: `admin-${randomString()}@test.com`,
    },
  },

  // Document types
  documentTypes: {
    candidateDisclosure: 'disclosure-candidate',
    employeeDisclosure: 'disclosure-employee',
    consentForm: 'consent-form',
    impactAssessment: 'impact-assessment',
    biasAuditDisclosure: 'bias-audit-disclosure',
    handbookPolicy: 'handbook-policy',
  },

  // Disclosure page settings
  disclosurePage: {
    slug: `test-company-${randomString()}`,
    headerText: 'How Acme Corp Uses AI in Hiring',
    introText: 'At Acme Corp, we are committed to transparent and responsible use of AI in our hiring process. This page explains how we use AI tools and what rights you have as a candidate.',
    contactEmail: 'hr@acme-test.com',
    brandColor: '#3B82F6',
    rightsText: '• You may request an alternative selection process\n• You may request human review of decisions\n• You may contact us with questions about AI use',
  },

  // Compliance document data
  complianceDocument: {
    type: 'bias_audit',
    name: 'Annual Bias Audit Report 2024',
    issueDate: new Date().toISOString().split('T')[0],
    auditor: 'CertifiedAuditors LLC',
    notes: 'Annual bias audit completed successfully',
  },

  // Training quiz answers (correct answers for each section)
  trainingQuizAnswers: {
    // These would be the correct answers for each quiz question
    // Structure depends on the actual quiz implementation
  },

  // Team invite data
  teamInvite: {
    email: `invite-${randomString()}@test.com`,
    role: 'member' as const,
  },
}

/**
 * Generate fresh test user data
 */
export function generateTestUser() {
  const id = randomString()
  return {
    email: `test-${id}@hireshield-e2e.test`,
    password: 'TestPassword123!',
    companyName: `Test Company ${id}`,
    name: `Test User ${id}`,
  }
}

/**
 * Generate fresh team member
 */
export function generateTeamMember(role: 'recruiter' | 'manager' | 'admin') {
  const id = randomString()
  const names: Record<string, string> = {
    recruiter: 'Jane Recruiter',
    manager: 'John Manager',
    admin: 'Sarah Admin',
  }
  return {
    name: `${names[role]} ${id}`,
    email: `${role}-${id}@test.com`,
  }
}

export default testData
