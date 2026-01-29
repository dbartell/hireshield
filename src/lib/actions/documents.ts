"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface DocumentTemplate {
  id: string
  name: string
  description: string
  states: string[]
  content: string
}

const documentTemplates: Record<string, DocumentTemplate> = {
  "disclosure-candidate": {
    id: "disclosure-candidate",
    name: "Candidate Disclosure Notice",
    description: "Notify job candidates that AI is used in the hiring process",
    states: ["IL", "CA", "CO", "NYC"],
    content: `NOTICE OF AI USE IN HIRING

[COMPANY_NAME] uses artificial intelligence (AI) technology as part of our hiring and employment decision-making process.

WHAT THIS MEANS:
AI-powered tools may be used to analyze your application materials, including but not limited to:
- Resume screening and parsing
- Skills assessment evaluation  
- Video interview analysis
- Background check processing

YOUR RIGHTS:
As a candidate, you have the right to:
1. Request information about how AI is used in our hiring process
2. Request an alternative selection process that does not rely solely on AI
3. Request a human review of any AI-generated decision

This notice is provided in compliance with applicable state and local laws including [APPLICABLE_LAWS].

If you have questions about our use of AI in hiring, please contact [CONTACT_EMAIL].

Date: [DATE]
[COMPANY_NAME]`
  },
  "disclosure-employee": {
    id: "disclosure-employee", 
    name: "Employee Disclosure Notice",
    description: "Notify employees about AI use in employment decisions",
    states: ["IL", "CA", "CO"],
    content: `EMPLOYEE NOTICE: AI IN EMPLOYMENT DECISIONS

Dear Employee,

[COMPANY_NAME] uses artificial intelligence (AI) systems that may factor into employment-related decisions. This notice informs you of this use in compliance with [APPLICABLE_LAWS].

AI SYSTEMS IN USE:
The following AI tools may influence employment decisions:
- Performance monitoring and evaluation tools
- Workforce planning and scheduling systems
- Training recommendation systems

TYPES OF DECISIONS:
AI may be used as a factor in decisions related to:
- Performance reviews
- Promotion considerations
- Work assignments
- Training recommendations

YOUR RIGHTS:
You have the right to:
1. Request information about AI systems that affect you
2. Request human review of significant AI-assisted decisions
3. Provide feedback on AI system impacts

CONTACT:
For questions, contact HR at [CONTACT_EMAIL].

Effective Date: [DATE]
[COMPANY_NAME]`
  },
  "consent-form": {
    id: "consent-form",
    name: "Candidate Consent Form",
    description: "Collect candidate consent for AI processing",
    states: ["CA", "CO"],
    content: `AI PROCESSING CONSENT FORM

CANDIDATE INFORMATION:
Name: _________________________
Position Applied For: _________________________
Date: _________________________

CONSENT STATEMENT:
I, the undersigned, acknowledge that I have received and read the Notice of AI Use in Hiring from [COMPANY_NAME].

I understand that:
1. AI technology will be used to process my application
2. AI may analyze my resume, assessments, and interview responses
3. I may request human review of AI-assisted decisions
4. I may withdraw this consent at any time

By signing below, I consent to the use of AI technology in evaluating my application for employment.

☐ I CONSENT to AI processing of my application
☐ I DO NOT CONSENT and request an alternative process

Signature: _________________________
Date: _________________________

For internal use:
Received by: _________________________
Date: _________________________`
  },
  "handbook-policy": {
    id: "handbook-policy",
    name: "Employee Handbook Policy",
    description: "AI use policy section for employee handbook",
    states: ["IL", "CA", "CO"],
    content: `EMPLOYEE HANDBOOK SECTION: ARTIFICIAL INTELLIGENCE USE POLICY

1. PURPOSE
This policy establishes guidelines for [COMPANY_NAME]'s use of artificial intelligence (AI) and automated decision-making tools in employment-related matters.

2. SCOPE
This policy applies to all employees and covers the use of AI in:
- Hiring and recruitment
- Performance management
- Workforce planning
- Employee development

3. TRANSPARENCY
We are committed to transparency about AI use:
- Employees will be notified when AI influences decisions affecting them
- Information about AI systems is available upon request
- Regular reviews ensure AI systems function as intended

4. HUMAN OVERSIGHT
All significant employment decisions involving AI include:
- Human review before final decisions
- Appeal process for affected employees
- Regular audits of AI system outputs

5. FAIRNESS & NON-DISCRIMINATION
Our AI systems are:
- Regularly tested for bias
- Designed to promote equal opportunity
- Subject to independent audits as required by law

6. EMPLOYEE RIGHTS
Employees may:
- Request information about AI systems affecting them
- Request human review of AI-influenced decisions
- Report concerns about AI system impacts

7. COMPLIANCE
This policy complies with all applicable federal, state, and local laws.

8. CONTACT
Questions about this policy: [CONTACT_EMAIL]

Effective Date: [DATE]
Last Updated: [DATE]`
  },
  "impact-assessment": {
    id: "impact-assessment",
    name: "Impact Assessment",
    description: "Document AI system impact for Colorado compliance",
    states: ["CO"],
    content: `COLORADO AI ACT IMPACT ASSESSMENT

COMPANY: [COMPANY_NAME]
ASSESSMENT DATE: [DATE]
AI SYSTEM: [SYSTEM_NAME]

1. SYSTEM DESCRIPTION
Purpose: [Describe the purpose of the AI system]
Vendor: [Vendor name if applicable]
Type: [Screening/Assessment/Ranking/Other]

2. DATA INPUTS
The system processes the following data:
- [ ] Resume/CV content
- [ ] Assessment scores
- [ ] Interview recordings
- [ ] Application responses
- [ ] Other: _____________

3. DECISION TYPES
This system influences:
- [ ] Hiring decisions
- [ ] Promotion decisions
- [ ] Compensation decisions
- [ ] Termination decisions
- [ ] Other: _____________

4. RISK ASSESSMENT
Potential harms identified:
- Discrimination risk: [Low/Medium/High]
- Privacy risk: [Low/Medium/High]
- Accuracy concerns: [Low/Medium/High]

5. MITIGATION MEASURES
Steps taken to reduce risks:
- [ ] Bias testing performed
- [ ] Human oversight implemented
- [ ] Appeal process established
- [ ] Regular audits scheduled

6. TESTING RESULTS
Bias testing date: _____________
Results: _____________
Corrective actions: _____________

7. ONGOING MONITORING
Review frequency: [Monthly/Quarterly/Annually]
Responsible party: _____________
Next review date: _____________

Completed by: _____________
Title: _____________
Signature: _____________
Date: _____________`
  },
  "bias-audit-disclosure": {
    id: "bias-audit-disclosure",
    name: "Bias Audit Disclosure",
    description: "Public disclosure page for NYC AEDT bias audit",
    states: ["NYC"],
    content: `NYC LOCAL LAW 144 BIAS AUDIT DISCLOSURE

EMPLOYER: [COMPANY_NAME]
PUBLICATION DATE: [DATE]
AUDIT PERIOD: [START_DATE] to [END_DATE]

AUTOMATED EMPLOYMENT DECISION TOOL (AEDT)
Tool Name: [TOOL_NAME]
Vendor: [VENDOR_NAME]
Purpose: [HIRING/PROMOTION/OTHER]

INDEPENDENT AUDITOR
Name: [AUDITOR_NAME]
Qualifications: [AUDITOR_CREDENTIALS]
Audit Date: [AUDIT_DATE]

SUMMARY OF RESULTS

The following metrics are provided in compliance with NYC Local Law 144:

IMPACT RATIO BY SEX/GENDER:
Male: [RATIO]
Female: [RATIO]

IMPACT RATIO BY RACE/ETHNICITY:
[Category 1]: [RATIO]
[Category 2]: [RATIO]
[Category 3]: [RATIO]
[Category 4]: [RATIO]

SELECTION/SCORING RATES:
[Include relevant metrics from bias audit]

INTERSECTIONAL ANALYSIS:
[Include intersectional impact ratios as required]

HISTORICAL DATA:
This audit was conducted using:
- [ ] Historical data from this employer
- [ ] Test data

DATA PERIOD: [DATE_RANGE]
SAMPLE SIZE: [NUMBER]

NOTICE TO CANDIDATES:
Candidates for positions at [COMPANY_NAME] may be subject to evaluation by an automated employment decision tool. To request an alternative selection process or accommodation, contact [CONTACT_EMAIL].

This disclosure will be updated annually or when a new bias audit is conducted.

Last Updated: [DATE]`
  }
}

export async function getDocuments() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('org_id', user.id)
    .order('created_at', { ascending: false })

  return documents || []
}

export async function createDocument(
  docType: string,
  title: string,
  content: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('documents')
    .insert({
      org_id: user.id,
      doc_type: docType.includes('disclosure') ? 'disclosure' : 
                docType.includes('consent') ? 'consent' :
                docType.includes('policy') || docType.includes('handbook') ? 'policy' :
                'assessment',
      title,
      content,
      version: 1,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/documents')
  revalidatePath('/dashboard')

  return { document: data }
}

export async function deleteDocument(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id)
    .eq('org_id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/documents')
  revalidatePath('/dashboard')

  return { success: true }
}

export async function getDocumentTemplate(templateId: string) {
  return documentTemplates[templateId] || null
}

export async function getOrganizationInfo() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', user.id)
    .single()

  return org
}
