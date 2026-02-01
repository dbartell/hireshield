// Training track content data
// Each track has sections with videos and quizzes

export type TrainingTrack = 'recruiter' | 'manager' | 'admin' | 'executive'

export interface TrainingSection {
  number: number
  title: string
  description: string
  videoId?: string // Synthesia video ID (placeholder for now)
  videoDuration: number // seconds
  content: string // Text content for when video isn't available
  quiz: QuizQuestion[]
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number // 0-indexed
  explanation: string
}

export interface TrainingTrackData {
  id: TrainingTrack
  title: string
  description: string
  targetAudience: string
  estimatedTime: string
  sections: TrainingSection[]
}

export const PASSING_SCORE = 80 // 80% required to pass

export const TRAINING_TRACKS: Record<TrainingTrack, TrainingTrackData> = {
  recruiter: {
    id: 'recruiter',
    title: 'Recruiter Compliance Training',
    description: 'Essential training for recruiters using AI tools in the hiring process',
    targetAudience: 'Recruiters, Talent Acquisition Specialists',
    estimatedTime: '45 minutes',
    sections: [
      {
        number: 1,
        title: 'Understanding AI in Recruitment',
        description: 'Learn what counts as AI in the hiring process and why it matters',
        videoDuration: 480,
        content: `
AI in recruitment includes any automated or algorithmic system that processes candidate information. This includes:

• Resume screening tools (ATS with auto-filtering)
• Chatbots for candidate screening
• Video interview analysis (sentiment, keywords)
• Skills assessments with algorithmic scoring
• Predictive hiring analytics

As a recruiter, you're often the first point of contact with candidates and the primary user of these tools. Understanding what qualifies as AI helps you:

1. Properly notify candidates before AI processing
2. Document consent when required
3. Provide alternatives when requested
4. Maintain compliance records
        `,
        quiz: [
          {
            id: 'r1q1',
            question: 'Which of the following is considered AI in hiring under most state laws?',
            options: [
              'Manual resume review by a human',
              'Automated resume screening that filters candidates',
              'Phone calls to schedule interviews',
              'Sending job offer letters'
            ],
            correctAnswer: 1,
            explanation: 'Automated resume screening that filters candidates without human review is considered AI/AEDT under most state laws.'
          },
          {
            id: 'r1q2',
            question: 'When must candidates be notified about AI use?',
            options: [
              'After they\'re hired',
              'Only if they ask',
              'Before AI processing occurs',
              'Never, it\'s optional'
            ],
            correctAnswer: 2,
            explanation: 'Most state laws require notification BEFORE AI processing occurs, giving candidates time to understand and potentially opt-out.'
          },
          {
            id: 'r1q3',
            question: 'What should you do if a candidate requests an alternative to AI screening?',
            options: [
              'Tell them it\'s not possible',
              'Ignore the request',
              'Document the request and provide a human review alternative',
              'Reject their application'
            ],
            correctAnswer: 2,
            explanation: 'Several state laws require providing alternatives when candidates request them. Always document these requests and route to human review.'
          }
        ]
      },
      {
        number: 2,
        title: 'Disclosure Requirements',
        description: 'How to properly notify candidates about AI use',
        videoDuration: 420,
        content: `
Proper disclosure is critical for compliance. Here's what you need to know:

## When to Disclose
- Before any AI tool processes candidate data
- At application start (job posting or application portal)
- Before video interviews using AI analysis
- Before any automated assessment

## What to Include
1. That AI/automated tools will be used
2. What data will be collected
3. How AI affects hiring decisions
4. How to request alternatives (where required)
5. How to access their data (CCPA states)

## Disclosure Methods
- Job posting language
- Application portal notices
- Email before AI-analyzed interviews
- Consent forms for specific tools

## Documentation
Always maintain records of:
- When disclosure was provided
- What was disclosed
- Candidate acknowledgment (if applicable)
        `,
        quiz: [
          {
            id: 'r2q1',
            question: 'What must be included in an AI disclosure notice?',
            options: [
              'Company revenue information',
              'Names of all hiring managers',
              'How AI affects hiring decisions and how to request alternatives',
              'Salary ranges for all positions'
            ],
            correctAnswer: 2,
            explanation: 'Disclosures must explain how AI affects decisions and, in many jurisdictions, how candidates can request alternatives.'
          },
          {
            id: 'r2q2',
            question: 'When should AI disclosure be provided to candidates?',
            options: [
              'After they accept a job offer',
              'Before any AI processing of their data',
              'Only during the final interview',
              'When they ask for it'
            ],
            correctAnswer: 1,
            explanation: 'Disclosure must occur BEFORE AI processing to give candidates informed choice about proceeding.'
          }
        ]
      },
      {
        number: 3,
        title: 'Consent & Documentation',
        description: 'Recording and maintaining compliance records',
        videoDuration: 360,
        content: `
## Consent Requirements

Some states (like Illinois for video interviews) require explicit consent before AI analysis. Here's how to handle it:

### Illinois Video Interview Requirements
- Written notice before interview
- Consent to AI analysis
- Right to request deletion within 30 days
- Cannot share without consent

### Maryland Audio/Video Analysis
- Written consent required
- Must explain data collected
- Applicant can decline without penalty

### Documentation Best Practices

1. **Track Everything**
   - Date/time of disclosure
   - Method of disclosure
   - Candidate response/acknowledgment

2. **Centralized Records**
   - Use your ATS or compliance tool
   - Keep for at least 4 years
   - Make records easily retrievable

3. **Alternative Requests**
   - Log all opt-out requests
   - Document how alternatives were provided
   - Track outcomes for reporting
        `,
        quiz: [
          {
            id: 'r3q1',
            question: 'In Illinois, when is explicit consent required for AI video analysis?',
            options: [
              'Never',
              'Before the video interview is recorded',
              'After the interview is completed',
              'Only for executive positions'
            ],
            correctAnswer: 1,
            explanation: 'Illinois AIPA requires written consent BEFORE video interviews that will be analyzed by AI.'
          },
          {
            id: 'r3q2',
            question: 'How long should you retain consent records?',
            options: [
              '30 days',
              '1 year',
              'At least 4 years',
              'Forever'
            ],
            correctAnswer: 2,
            explanation: 'Best practice is to retain records for at least 4 years to cover statute of limitations in most jurisdictions.'
          },
          {
            id: 'r3q3',
            question: 'What should you do when a candidate opts out of AI screening?',
            options: [
              'Reject their application',
              'Document the request and ensure human review occurs',
              'Tell them AI is mandatory',
              'Ignore the request'
            ],
            correctAnswer: 1,
            explanation: 'Always document opt-out requests and provide the human review alternative as required by law.'
          }
        ]
      }
    ]
  },

  manager: {
    id: 'manager',
    title: 'Hiring Manager Compliance Training',
    description: 'Training for managers who make hiring decisions using AI-assisted tools',
    targetAudience: 'Hiring Managers, Department Heads',
    estimatedTime: '40 minutes',
    sections: [
      {
        number: 1,
        title: 'Your Role in AI Compliance',
        description: 'Understanding your responsibilities as a hiring decision-maker',
        videoDuration: 420,
        content: `
As a hiring manager, you're the final decision-maker in the hiring process. Here's what you need to know about AI compliance:

## Your Responsibilities

1. **Understand the Tools**
   - Know which AI tools screen candidates before they reach you
   - Understand how AI scores or ranks candidates
   - Recognize AI-generated insights vs. raw candidate data

2. **Don't Over-rely on AI**
   - AI recommendations are inputs, not decisions
   - Apply human judgment to every hiring decision
   - Consider context AI might miss

3. **Document Your Decisions**
   - Record why you selected/rejected candidates
   - Note when you overrode AI recommendations
   - Keep records for potential audits

## Key Compliance Points

- AI screening must not be the sole basis for adverse decisions
- Human review is required for final employment decisions
- You must be able to explain your hiring decisions
        `,
        quiz: [
          {
            id: 'm1q1',
            question: 'What is your primary responsibility regarding AI in hiring?',
            options: [
              'Accept all AI recommendations without question',
              'Apply human judgment and document decisions',
              'Avoid using AI tools entirely',
              'Let HR handle all AI decisions'
            ],
            correctAnswer: 1,
            explanation: 'Hiring managers must apply human judgment to AI recommendations and document their decision-making process.'
          },
          {
            id: 'm1q2',
            question: 'Can AI be the sole basis for rejecting a candidate?',
            options: [
              'Yes, if the AI is accurate',
              'Yes, for initial screening only',
              'No, human review is required for adverse decisions',
              'Yes, if documented properly'
            ],
            correctAnswer: 2,
            explanation: 'Most laws require human review before making adverse employment decisions, even when AI is used in screening.'
          }
        ]
      },
      {
        number: 2,
        title: 'Bias Prevention',
        description: 'How to identify and prevent algorithmic bias',
        videoDuration: 480,
        content: `
## Understanding AI Bias

AI systems can perpetuate or amplify bias in several ways:

### Sources of Bias

1. **Training Data Bias**
   - Historical hiring data reflects past discrimination
   - Underrepresentation of certain groups
   - Biased labels or outcomes

2. **Proxy Discrimination**
   - AI finds patterns correlated with protected classes
   - Zip codes → race/ethnicity
   - Names → gender/ethnicity
   - Education → socioeconomic status

3. **Feedback Loop Bias**
   - AI learns from biased human decisions
   - Reinforces existing patterns
   - Gets worse over time without correction

## What You Can Do

1. **Question AI recommendations that seem off**
   - Ask: "Why did AI rank this candidate lower?"
   - Look for patterns in who gets filtered out

2. **Review demographic patterns**
   - Are certain groups consistently screened out?
   - Compare AI selections to human selections

3. **Report concerns**
   - Tell HR/compliance if you notice patterns
   - Document specific examples
        `,
        quiz: [
          {
            id: 'm2q1',
            question: 'How can AI systems perpetuate hiring bias?',
            options: [
              'By using random selection',
              'By learning from historical data that reflects past discrimination',
              'By always preferring the most qualified candidate',
              'AI cannot be biased'
            ],
            correctAnswer: 1,
            explanation: 'AI trained on historical hiring data can learn and perpetuate past discriminatory patterns.'
          },
          {
            id: 'm2q2',
            question: 'What is proxy discrimination?',
            options: [
              'Discrimination through a staffing agency',
              'When AI uses factors correlated with protected classes',
              'Hiring someone to discriminate for you',
              'Temporary bias'
            ],
            correctAnswer: 1,
            explanation: 'Proxy discrimination occurs when AI uses seemingly neutral factors (like zip code) that correlate with protected characteristics.'
          },
          {
            id: 'm2q3',
            question: 'What should you do if you notice patterns in AI screening?',
            options: [
              'Ignore it, AI knows best',
              'Document concerns and report to HR/compliance',
              'Manually adjust AI scores',
              'Stop using AI entirely'
            ],
            correctAnswer: 1,
            explanation: 'Document specific examples and report concerns to HR or compliance for investigation.'
          }
        ]
      },
      {
        number: 3,
        title: 'Adverse Action Compliance',
        description: 'Requirements when not hiring a candidate',
        videoDuration: 360,
        content: `
## Adverse Action Requirements

When you decide not to hire a candidate, there may be additional requirements:

### What is Adverse Action?

- Not hiring/selecting a candidate
- Demoting or terminating an employee
- Any negative employment decision

### Legal Requirements

1. **NYC Local Law 144**
   - If AEDT was used, notify candidate
   - Allow 10 business days to request info
   - Provide access to data/results if requested

2. **FCRA Requirements**
   - If background check AI was used
   - Pre-adverse action notice required
   - Final adverse action notice required

3. **State-Specific Rules**
   - Colorado: Explanation of AI role in decision
   - Illinois: Disclose AI factors considered
   - CCPA states: Right to access their data

### Documentation Requirements

For every adverse action involving AI:
- Record the AI tools used
- Note AI recommendations/scores
- Document human review process
- Keep records 4+ years
        `,
        quiz: [
          {
            id: 'm3q1',
            question: 'Under NYC Local Law 144, what must you provide after adverse action?',
            options: [
              'Nothing, it\'s optional',
              'Notice and ability to request information about AI use',
              'Only a rejection email',
              'Full explanation of all decisions'
            ],
            correctAnswer: 1,
            explanation: 'NYC LL144 requires notifying candidates and providing information about AI use upon request.'
          },
          {
            id: 'm3q2',
            question: 'What should be documented for every AI-assisted adverse action?',
            options: [
              'Only the final decision',
              'AI tools used, recommendations, and human review process',
              'Just the candidate\'s name',
              'Nothing, unless requested'
            ],
            correctAnswer: 1,
            explanation: 'Complete documentation includes AI tools, recommendations, scores, and the human review process.'
          }
        ]
      }
    ]
  },

  admin: {
    id: 'admin',
    title: 'HR Admin Compliance Training',
    description: 'Comprehensive training for HR professionals managing AI compliance',
    targetAudience: 'HR Directors, Compliance Officers, HR Business Partners',
    estimatedTime: '60 minutes',
    sections: [
      {
        number: 1,
        title: 'Regulatory Landscape',
        description: 'Overview of AI hiring laws across jurisdictions',
        videoDuration: 600,
        content: `
## Current AI Hiring Regulations

### Federal Level
- EEOC guidance on AI and Title VII
- OFCCP scrutiny for federal contractors
- FTC enforcement actions for deceptive AI

### State Laws

**Illinois (AIPA)**
- Video interview consent required
- AI decision disclosure
- Data retention requirements

**NYC Local Law 144**
- Annual bias audits for AEDTs
- Public disclosure requirements
- Candidate notification

**Colorado AI Act (2026)**
- High-risk AI designation
- Impact assessments required
- Algorithmic discrimination protection

**Maryland (HB 1202)**
- Facial recognition consent
- Must allow declination without penalty

**California (CCPA/CPRA)**
- Right to know about automated processing
- Right to opt-out of automated decisions
- Access to data used

### Emerging Legislation
- Multiple states considering similar laws
- EU AI Act influence
- Expect more regulation 2025-2027
        `,
        quiz: [
          {
            id: 'a1q1',
            question: 'Which jurisdiction requires annual bias audits for AI hiring tools?',
            options: [
              'Illinois',
              'NYC',
              'Maryland',
              'Federal law'
            ],
            correctAnswer: 1,
            explanation: 'NYC Local Law 144 requires annual independent bias audits for automated employment decision tools.'
          },
          {
            id: 'a1q2',
            question: 'What does Colorado\'s AI Act require for high-risk AI in hiring?',
            options: [
              'Nothing, it\'s not covered',
              'Impact assessments and algorithmic discrimination protections',
              'Only disclosure',
              'Annual training only'
            ],
            correctAnswer: 1,
            explanation: 'Colorado requires impact assessments and provides protections against algorithmic discrimination for high-risk AI.'
          },
          {
            id: 'a1q3',
            question: 'What right does CCPA provide regarding AI in hiring?',
            options: [
              'No relevant rights',
              'Right to know and opt-out of automated decision-making',
              'Only the right to sue',
              'The right to a human interview'
            ],
            correctAnswer: 1,
            explanation: 'CCPA provides the right to know about automated processing and opt-out of automated decisions affecting employment.'
          }
        ]
      },
      {
        number: 2,
        title: 'Building a Compliance Program',
        description: 'Creating policies and procedures for AI compliance',
        videoDuration: 540,
        content: `
## Compliance Program Components

### 1. AI Tool Inventory
- Catalog all AI tools in hiring
- Document what each tool does
- Map to regulatory requirements
- Review vendor compliance

### 2. Policies & Procedures
- AI use policy
- Disclosure templates
- Consent procedures
- Alternative accommodation process
- Adverse action procedures
- Data retention policy

### 3. Training Program
- Role-based training (this!)
- Annual recertification
- New hire onboarding
- Tool-specific training

### 4. Audit & Assessment
- Internal compliance audits
- Bias audits (NYC)
- Impact assessments (CO)
- Vendor assessments

### 5. Documentation System
- Centralized record-keeping
- Consent tracking
- Disclosure logs
- Audit trails

### 6. Incident Response
- Complaint procedures
- Investigation process
- Remediation steps
- Regulatory reporting
        `,
        quiz: [
          {
            id: 'a2q1',
            question: 'What is the first step in building an AI compliance program?',
            options: [
              'Writing policies',
              'Training employees',
              'Creating an inventory of all AI tools used',
              'Hiring a consultant'
            ],
            correctAnswer: 2,
            explanation: 'You must first know what AI tools you\'re using before you can build policies and procedures around them.'
          },
          {
            id: 'a2q2',
            question: 'How often should compliance training be renewed?',
            options: [
              'Only when laws change',
              'Every 5 years',
              'Annually',
              'Never, once is enough'
            ],
            correctAnswer: 2,
            explanation: 'Annual recertification ensures staff stays current with evolving regulations and best practices.'
          },
          {
            id: 'a2q3',
            question: 'What should your documentation system track?',
            options: [
              'Only rejected candidates',
              'Consents, disclosures, and audit trails',
              'Only successful hires',
              'Nothing, it\'s optional'
            ],
            correctAnswer: 1,
            explanation: 'A comprehensive documentation system tracks consents, disclosures, and complete audit trails for compliance defense.'
          }
        ]
      },
      {
        number: 3,
        title: 'Bias Audits & Assessments',
        description: 'Conducting required audits and impact assessments',
        videoDuration: 480,
        content: `
## NYC Bias Audit Requirements

### What Must Be Audited
- Any AEDT used for employment decisions
- Both screening and scoring tools
- Must be independent auditor

### Audit Methodology
- Selection rate analysis by demographics
- Impact ratio calculations
- Statistical significance testing
- Historical data (12+ months preferred)

### Public Disclosure
- Results summary on website
- Distribution date required
- Before using AEDT on candidates

## Colorado Impact Assessments

### Components
- System description and purpose
- Data inputs and outputs
- Intended benefits and limitations
- Risk of algorithmic discrimination
- Mitigation measures
- Ongoing monitoring plan

### When Required
- Before deploying high-risk AI
- Updated when material changes
- Retained for duration of use + 3 years

## Internal Auditing

### Regular Reviews
- Quarterly outcome analysis
- Demographic impact monitoring
- Complaint tracking
- Process compliance checks
        `,
        quiz: [
          {
            id: 'a3q1',
            question: 'Who can conduct a NYC bias audit?',
            options: [
              'Anyone in the company',
              'An independent auditor',
              'The AI vendor',
              'The hiring manager'
            ],
            correctAnswer: 1,
            explanation: 'NYC LL144 requires bias audits to be conducted by an independent auditor to ensure objectivity.'
          },
          {
            id: 'a3q2',
            question: 'Where must NYC bias audit results be published?',
            options: [
              'Internal memo only',
              'Company website',
              'Nowhere, they\'re private',
              'Only sent to NYC'
            ],
            correctAnswer: 1,
            explanation: 'NYC requires public disclosure of bias audit results on the employer\'s website.'
          },
          {
            id: 'a3q3',
            question: 'How long must Colorado impact assessments be retained?',
            options: [
              '1 year',
              '2 years',
              'Duration of use + 3 years',
              'Forever'
            ],
            correctAnswer: 2,
            explanation: 'Colorado requires retention for the duration of AI use plus an additional 3 years.'
          }
        ]
      },
      {
        number: 4,
        title: 'Managing Training & Certification',
        description: 'Running your organization\'s training program',
        videoDuration: 360,
        content: `
## Training Program Management

### Assigning Training
- Identify all roles that interact with AI hiring tools
- Assign appropriate tracks
- Set completion deadlines
- Track progress

### Certification Requirements
- All relevant staff must complete training
- Annual recertification
- Track expiry dates
- Send reminders proactively

### Metrics to Track
- Completion rates by department
- Quiz scores and pass rates
- Time to complete
- Recertification compliance

### Enforcement
- Make training mandatory for hiring participation
- Include in performance reviews
- Escalate non-compliance

### Documentation
- Maintain completion records
- Store certificates
- Keep quiz results
- Audit trail for regulators
        `,
        quiz: [
          {
            id: 'a4q1',
            question: 'Who should receive AI hiring compliance training?',
            options: [
              'Only HR',
              'Only executives',
              'Everyone who interacts with AI hiring tools',
              'Only IT staff'
            ],
            correctAnswer: 2,
            explanation: 'Anyone who uses, oversees, or makes decisions based on AI hiring tools needs appropriate training.'
          },
          {
            id: 'a4q2',
            question: 'What should happen if an employee doesn\'t complete required training?',
            options: [
              'Nothing',
              'They should be restricted from hiring activities until complete',
              'Terminate them immediately',
              'Let them continue hiring anyway'
            ],
            correctAnswer: 1,
            explanation: 'Employees who haven\'t completed required training should not participate in hiring activities using AI tools.'
          }
        ]
      }
    ]
  },

  executive: {
    id: 'executive',
    title: 'Executive AI Governance Overview',
    description: 'High-level overview of AI hiring compliance for leadership',
    targetAudience: 'C-Suite, VPs, Directors',
    estimatedTime: '20 minutes',
    sections: [
      {
        number: 1,
        title: 'Why AI Compliance Matters',
        description: 'Business and legal risks of AI in hiring',
        videoDuration: 420,
        content: `
## The Stakes

### Regulatory Risk
- NYC fines: $500-$1,500 per violation
- EEOC enforcement actions increasing
- Class action litigation growing
- DOJ civil rights investigations

### Reputational Risk
- Public bias audit disclosures
- Media attention on AI hiring failures
- Employee and candidate trust
- Employer brand damage

### Operational Risk
- Hiring process disruptions
- Invalidated hiring decisions
- Remediation costs
- Executive time and attention

## Why Act Now

1. **Regulations are accelerating**
   - 15+ states considering AI laws
   - EU AI Act influence
   - Federal agency guidance

2. **Enforcement is increasing**
   - First NYC fines issued 2024
   - EEOC settlement actions
   - Private litigation rising

3. **Proactive compliance is cheaper**
   - Build it right from the start
   - Avoid remediation costs
   - Demonstrate good faith
        `,
        quiz: [
          {
            id: 'e1q1',
            question: 'What is the per-violation fine range for NYC AI hiring violations?',
            options: [
              '$100-$200',
              '$500-$1,500',
              '$10,000-$50,000',
              'No fines, just warnings'
            ],
            correctAnswer: 1,
            explanation: 'NYC can impose fines of $500-$1,500 per violation of Local Law 144, which can add up quickly.'
          },
          {
            id: 'e1q2',
            question: 'Why should companies prioritize AI compliance now?',
            options: [
              'It\'s optional',
              'Regulations are accelerating and enforcement is increasing',
              'Only large companies need to worry',
              'AI compliance won\'t matter for years'
            ],
            correctAnswer: 1,
            explanation: 'The regulatory landscape is evolving rapidly with more states passing laws and enforcement actions increasing.'
          }
        ]
      },
      {
        number: 2,
        title: 'Governance & Oversight',
        description: 'Leadership responsibilities for AI compliance',
        videoDuration: 360,
        content: `
## Executive Responsibilities

### Set the Tone
- Make compliance a priority
- Allocate adequate resources
- Support HR/Compliance initiatives
- Include in corporate strategy

### Governance Structure
- Designate AI compliance ownership
- Clear reporting lines
- Board-level visibility
- Regular status updates

### Risk Management
- Include AI in risk assessments
- Monitor key metrics
- Review audit findings
- Approve remediation plans

### Investment Priorities
1. Compliance tools and systems
2. Training programs
3. Legal/advisory support
4. Audit and assessment
5. Documentation systems

## Key Questions to Ask

- What AI tools are we using in hiring?
- Are we compliant in all jurisdictions we hire?
- When was our last bias audit?
- What's our training completion rate?
- How are we tracking consent/disclosure?
        `,
        quiz: [
          {
            id: 'e2q1',
            question: 'What is the executive\'s primary role in AI compliance?',
            options: [
              'Personally review every hire',
              'Set tone, allocate resources, and ensure governance',
              'Write all policies',
              'Conduct bias audits'
            ],
            correctAnswer: 1,
            explanation: 'Executives should set the tone from the top, allocate resources, and ensure proper governance structures exist.'
          },
          {
            id: 'e2q2',
            question: 'What question should executives regularly ask about AI hiring?',
            options: [
              'Why do we hire people?',
              'What AI tools are we using and are we compliant?',
              'Can we eliminate HR?',
              'How much does AI cost?'
            ],
            correctAnswer: 1,
            explanation: 'Executives should regularly verify what AI tools are in use and whether the organization is compliant in all hiring jurisdictions.'
          }
        ]
      }
    ]
  }
}

export const TRACK_LABELS: Record<TrainingTrack, string> = {
  recruiter: 'Recruiter',
  manager: 'Hiring Manager',
  admin: 'HR Admin',
  executive: 'Executive'
}

export const TRACK_DESCRIPTIONS: Record<TrainingTrack, string> = {
  recruiter: 'For recruiters and talent acquisition specialists who use AI tools to source and screen candidates',
  manager: 'For hiring managers who make employment decisions based on AI-assisted screening',
  admin: 'For HR professionals who manage AI compliance programs and policies',
  executive: 'For executives who need high-level understanding of AI governance and risk'
}

export function getTrackData(track: TrainingTrack): TrainingTrackData {
  return TRAINING_TRACKS[track]
}

export function getTotalSections(track: TrainingTrack): number {
  return TRAINING_TRACKS[track].sections.length
}

export function calculateQuizScore(answers: Record<string, number>, quiz: QuizQuestion[]): number {
  let correct = 0
  for (const question of quiz) {
    if (answers[question.id] === question.correctAnswer) {
      correct++
    }
  }
  return Math.round((correct / quiz.length) * 100)
}
