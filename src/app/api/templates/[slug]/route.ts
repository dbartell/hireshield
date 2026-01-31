import { NextRequest, NextResponse } from 'next/server'
import { jsPDF } from 'jspdf'

interface TemplateSection {
  type: 'title' | 'heading' | 'subheading' | 'paragraph' | 'list' | 'signature' | 'divider'
  content?: string
  items?: string[]
}

interface Template {
  filename: string
  title: string
  sections: TemplateSection[]
}

const templates: Record<string, Template> = {
  'ai-disclosure-notice': {
    filename: 'AI-Disclosure-Notice-Template.pdf',
    title: 'AI IN HIRING DISCLOSURE NOTICE',
    sections: [
      { type: 'title', content: 'AI IN HIRING DISCLOSURE NOTICE' },
      { type: 'paragraph', content: '[COMPANY NAME]' },
      { type: 'paragraph', content: '[ADDRESS]' },
      { type: 'paragraph', content: '[DATE]' },
      { type: 'divider' },
      { type: 'heading', content: 'NOTICE OF ARTIFICIAL INTELLIGENCE USE IN HIRING' },
      { type: 'paragraph', content: 'Dear Applicant,' },
      { type: 'paragraph', content: '[Company Name] is committed to transparency in our hiring process. This notice is to inform you that we use artificial intelligence (AI) technology as part of our candidate evaluation process.' },
      { type: 'heading', content: 'WHAT AI TOOLS WE USE' },
      { type: 'paragraph', content: 'We use the following AI-powered tools in our hiring process:' },
      { type: 'list', items: ['[Tool Name 1] - [Brief description of purpose]', '[Tool Name 2] - [Brief description of purpose]', '[Add additional tools as needed]'] },
      { type: 'heading', content: 'HOW AI IS USED' },
      { type: 'paragraph', content: 'These tools assist us in:' },
      { type: 'list', items: ['[Describe specific use, e.g., "Screening resumes for relevant qualifications"]', '[Describe specific use, e.g., "Analyzing video interview responses"]', '[Describe specific use, e.g., "Assessing skills through automated testing"]'] },
      { type: 'heading', content: 'WHAT DATA IS COLLECTED' },
      { type: 'paragraph', content: 'The AI tools may collect and analyze the following information:' },
      { type: 'list', items: ['Resume and application content', '[List other data types as applicable]', '[e.g., "Video and audio from recorded interviews"]', '[e.g., "Responses to skills assessments"]'] },
      { type: 'heading', content: 'HOW AI INFLUENCES DECISIONS' },
      { type: 'paragraph', content: 'The output from these AI tools is one factor among many that our hiring team considers. AI-generated scores or recommendations are reviewed by human decision-makers before any employment decision is made.' },
      { type: 'heading', content: 'YOUR RIGHTS' },
      { type: 'paragraph', content: 'You have the right to:' },
      { type: 'list', items: ['Request additional information about how AI was used in evaluating your application', '[Include state-specific rights as applicable]', 'Contact us with questions about this notice'] },
      { type: 'paragraph', content: 'If you have questions or concerns about our use of AI in hiring, please contact:' },
      { type: 'paragraph', content: '[HR Contact Name]\n[Email Address]\n[Phone Number]' },
      { type: 'divider' },
      { type: 'paragraph', content: '[Company Name] is an equal opportunity employer. Our AI tools are regularly monitored to ensure they do not discriminate based on race, color, religion, sex, national origin, age, disability, genetic information, or any other protected characteristic.' },
      { type: 'divider' },
      { type: 'paragraph', content: 'By continuing with your application, you acknowledge receipt of this notice.' },
      { type: 'signature' },
    ],
  },
  'candidate-consent-form': {
    filename: 'Candidate-Consent-Form-Template.pdf',
    title: 'CANDIDATE CONSENT FORM',
    sections: [
      { type: 'title', content: 'CANDIDATE CONSENT FORM' },
      { type: 'subheading', content: 'AI-Assisted Hiring Process' },
      { type: 'paragraph', content: '[COMPANY NAME]' },
      { type: 'paragraph', content: '[DATE]' },
      { type: 'divider' },
      { type: 'heading', content: 'CONSENT FOR AI-ASSISTED EVALUATION' },
      { type: 'paragraph', content: 'I, _________________________________ (Candidate Name), acknowledge and consent to the following:' },
      { type: 'heading', content: '1. ACKNOWLEDGMENT OF AI USE' },
      { type: 'paragraph', content: 'I have received and reviewed [Company Name]\'s AI Disclosure Notice explaining the use of artificial intelligence in their hiring process.' },
      { type: 'heading', content: '2. CONSENT TO DATA PROCESSING' },
      { type: 'paragraph', content: 'I consent to [Company Name] using AI-powered tools to process the following information as part of my job application:' },
      { type: 'list', items: ['☐ Resume and application materials', '☐ Video interview recordings', '☐ Skills assessment responses', '☐ [Other data types as applicable]'] },
      { type: 'heading', content: '3. UNDERSTANDING OF AI\'S ROLE' },
      { type: 'paragraph', content: 'I understand that:' },
      { type: 'list', items: ['AI tools will assist in evaluating my candidacy', 'AI-generated outputs are reviewed by human decision-makers', 'AI analysis is one factor among many in hiring decisions', 'I may request information about how AI was used in my evaluation'] },
      { type: 'heading', content: '4. VOLUNTARY CONSENT' },
      { type: 'paragraph', content: 'I provide this consent voluntarily. I understand that:' },
      { type: 'list', items: ['I may withdraw this consent at any time by contacting [HR Contact]', 'Withdrawing consent may affect the company\'s ability to process my application', '[Include any state-specific opt-out rights]'] },
      { type: 'heading', content: '5. NON-DISCRIMINATION STATEMENT' },
      { type: 'paragraph', content: 'I understand that [Company Name] is committed to ensuring their AI tools do not discriminate based on protected characteristics and regularly monitors for bias.' },
      { type: 'divider' },
      { type: 'heading', content: 'CANDIDATE SIGNATURE' },
      { type: 'signature' },
      { type: 'paragraph', content: 'Position Applied For: _________________________________' },
    ],
  },
  'handbook-ai-policy': {
    filename: 'Employee-Handbook-AI-Policy-Template.pdf',
    title: 'EMPLOYEE HANDBOOK - AI POLICY',
    sections: [
      { type: 'title', content: 'EMPLOYEE HANDBOOK SECTION' },
      { type: 'subheading', content: 'Artificial Intelligence in Human Resources' },
      { type: 'paragraph', content: '[COMPANY NAME]' },
      { type: 'paragraph', content: 'Effective Date: [DATE]' },
      { type: 'divider' },
      { type: 'heading', content: '1. PURPOSE' },
      { type: 'paragraph', content: 'This policy describes [Company Name]\'s use of artificial intelligence (AI) and automated decision-making technology in human resources processes, including hiring, performance evaluation, and other employment decisions.' },
      { type: 'heading', content: '2. SCOPE' },
      { type: 'paragraph', content: 'This policy applies to all applicants, employees, and contractors of [Company Name] in all locations where AI-powered HR tools are used.' },
      { type: 'heading', content: '3. OUR COMMITMENT' },
      { type: 'paragraph', content: '[Company Name] is committed to:' },
      { type: 'list', items: ['Transparency about our use of AI in employment decisions', 'Ensuring AI tools do not discriminate against any protected group', 'Maintaining human oversight of AI-assisted decisions', 'Complying with all applicable laws and regulations'] },
      { type: 'heading', content: '4. AI TOOLS WE USE' },
      { type: 'paragraph', content: 'We currently use AI-powered tools in the following HR processes:' },
      { type: 'subheading', content: 'HIRING AND RECRUITING' },
      { type: 'list', items: ['[Tool Name] for [purpose]', '[Tool Name] for [purpose]'] },
      { type: 'subheading', content: 'PERFORMANCE MANAGEMENT' },
      { type: 'list', items: ['[Tool Name] for [purpose]'] },
      { type: 'heading', content: '5. NON-DISCRIMINATION' },
      { type: 'paragraph', content: '[Company Name] is committed to equal employment opportunity. Our AI tools are regularly tested for bias and discriminatory outcomes, monitored to ensure fair treatment across all demographic groups, and subject to human review and override.' },
      { type: 'heading', content: '6. EMPLOYEE RIGHTS' },
      { type: 'paragraph', content: 'Employees and applicants have the right to:' },
      { type: 'list', items: ['Be informed when AI is used in decisions affecting them', 'Request information about how AI was used in their evaluation', 'Raise concerns about AI decisions without fear of retaliation'] },
      { type: 'heading', content: '7. REPORTING CONCERNS' },
      { type: 'paragraph', content: 'If you believe an AI tool has produced an unfair or discriminatory outcome, report your concern to [HR Contact or Ethics Hotline]. All reports will be investigated promptly and confidentially.' },
      { type: 'divider' },
      { type: 'paragraph', content: 'Last Updated: [DATE]' },
      { type: 'paragraph', content: 'Approved By: [NAME/TITLE]' },
    ],
  },
  'ai-tool-inventory': {
    filename: 'AI-Tool-Inventory-Template.pdf',
    title: 'AI TOOL INVENTORY',
    sections: [
      { type: 'title', content: 'AI TOOL INVENTORY' },
      { type: 'subheading', content: 'Hiring Technology Audit Worksheet' },
      { type: 'paragraph', content: '[COMPANY NAME]' },
      { type: 'paragraph', content: 'Last Updated: [DATE]' },
      { type: 'divider' },
      { type: 'heading', content: 'INSTRUCTIONS' },
      { type: 'paragraph', content: 'Use this worksheet to document all AI-powered tools used in your hiring process. Review and update quarterly.' },
      { type: 'heading', content: 'TOOL INVENTORY' },
      { type: 'paragraph', content: 'For each tool, document:' },
      { type: 'divider' },
      { type: 'subheading', content: 'Tool #1' },
      { type: 'list', items: ['Tool Name: _________________________________', 'Vendor: _________________________________', 'Category: ☐ ATS  ☐ Video Interview  ☐ Assessment  ☐ Sourcing  ☐ Other', 'Purpose: _________________________________', 'Data Collected: _________________________________', 'AI Features Used: _________________________________', 'States Affected: ☐ IL  ☐ CO  ☐ CA  ☐ NYC  ☐ Other: _____', 'Disclosure Required: ☐ Yes  ☐ No  ☐ Under Review', 'Last Reviewed: _________________________________'] },
      { type: 'divider' },
      { type: 'subheading', content: 'Tool #2' },
      { type: 'list', items: ['Tool Name: _________________________________', 'Vendor: _________________________________', 'Category: ☐ ATS  ☐ Video Interview  ☐ Assessment  ☐ Sourcing  ☐ Other', 'Purpose: _________________________________', 'Data Collected: _________________________________', 'AI Features Used: _________________________________', 'States Affected: ☐ IL  ☐ CO  ☐ CA  ☐ NYC  ☐ Other: _____', 'Disclosure Required: ☐ Yes  ☐ No  ☐ Under Review', 'Last Reviewed: _________________________________'] },
      { type: 'divider' },
      { type: 'subheading', content: 'Tool #3' },
      { type: 'list', items: ['Tool Name: _________________________________', 'Vendor: _________________________________', 'Category: ☐ ATS  ☐ Video Interview  ☐ Assessment  ☐ Sourcing  ☐ Other', 'Purpose: _________________________________', 'Data Collected: _________________________________', 'AI Features Used: _________________________________', 'States Affected: ☐ IL  ☐ CO  ☐ CA  ☐ NYC  ☐ Other: _____', 'Disclosure Required: ☐ Yes  ☐ No  ☐ Under Review', 'Last Reviewed: _________________________________'] },
      { type: 'divider' },
      { type: 'heading', content: 'REVIEW CHECKLIST' },
      { type: 'list', items: ['☐ All hiring tools identified and documented', '☐ AI features confirmed with each vendor', '☐ State compliance requirements determined', '☐ Disclosure notices created for required tools', '☐ Review scheduled for next quarter'] },
      { type: 'paragraph', content: 'Reviewed By: _________________________________' },
      { type: 'paragraph', content: 'Date: _________________________________' },
    ],
  },
}

function generatePDF(template: Template): Buffer {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const contentWidth = pageWidth - 2 * margin
  let y = margin

  const checkNewPage = (needed: number) => {
    if (y + needed > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage()
      y = margin
    }
  }

  // Add footer to each page
  const addFooter = () => {
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(128, 128, 128)
      doc.text(
        'Generated by AIHireLaw - aihirelaw.com | Customize this template for your organization',
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      )
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth - margin,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'right' }
      )
    }
  }

  template.sections.forEach((section) => {
    switch (section.type) {
      case 'title':
        checkNewPage(15)
        doc.setFontSize(18)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(0, 0, 0)
        doc.text(section.content || '', pageWidth / 2, y, { align: 'center' })
        y += 12
        break

      case 'heading':
        checkNewPage(12)
        y += 4
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(0, 0, 0)
        doc.text(section.content || '', margin, y)
        y += 8
        break

      case 'subheading':
        checkNewPage(10)
        y += 2
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(60, 60, 60)
        doc.text(section.content || '', margin, y)
        y += 7
        break

      case 'paragraph':
        checkNewPage(10)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(0, 0, 0)
        const lines = doc.splitTextToSize(section.content || '', contentWidth)
        lines.forEach((line: string) => {
          checkNewPage(6)
          doc.text(line, margin, y)
          y += 5
        })
        y += 2
        break

      case 'list':
        if (section.items) {
          doc.setFontSize(10)
          doc.setFont('helvetica', 'normal')
          doc.setTextColor(0, 0, 0)
          section.items.forEach((item) => {
            checkNewPage(6)
            const itemLines = doc.splitTextToSize(`• ${item}`, contentWidth - 5)
            itemLines.forEach((line: string, idx: number) => {
              checkNewPage(6)
              doc.text(idx === 0 ? line : `  ${line}`, margin + 3, y)
              y += 5
            })
          })
          y += 2
        }
        break

      case 'signature':
        checkNewPage(25)
        y += 5
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text('Signature: _________________________________', margin, y)
        y += 8
        doc.text('Printed Name: _________________________________', margin, y)
        y += 8
        doc.text('Date: _________________________________', margin, y)
        y += 10
        break

      case 'divider':
        checkNewPage(8)
        y += 3
        doc.setDrawColor(200, 200, 200)
        doc.line(margin, y, pageWidth - margin, y)
        y += 5
        break
    }
  })

  addFooter()

  return Buffer.from(doc.output('arraybuffer'))
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const template = templates[slug]

  if (!template) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 })
  }

  const pdfBuffer = generatePDF(template)
  const uint8Array = new Uint8Array(pdfBuffer)

  return new NextResponse(uint8Array, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${template.filename}"`,
    },
  })
}
