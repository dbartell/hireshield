import { ArticleLayout } from "@/components/marketing/ArticleLayout"
import Link from "next/link"

export default function AIDisclosureNoticeTemplatePage() {
  return (
    <ArticleLayout
      title="How to Write an AI Disclosure Notice for Candidates"
      description="Templates and best practices for notifying candidates about AI use in your hiring process. Jurisdiction-specific examples and customization guidance."
      category="Template"
      readTime="5 min read"
      publishedDate="January 28, 2026"
    >
      <p>
        Multiple jurisdictions now require employers to disclose when AI is used in hiring decisions. 
        A well-crafted disclosure notice protects your organization, builds candidate trust, and 
        satisfies legal requirements. This guide provides templates you can customize for your needs.
      </p>

      <h2>Key Principles for Effective Disclosures</h2>
      <ul>
        <li><strong>Clear language:</strong> Avoid technical jargon; write for a general audience</li>
        <li><strong>Specific:</strong> Identify the actual tools and purposes, not vague generalities</li>
        <li><strong>Complete:</strong> Cover all required elements for applicable jurisdictions</li>
        <li><strong>Timely:</strong> Provide notice before AI is used on the candidate</li>
        <li><strong>Accessible:</strong> Make notices easy to find and save</li>
        <li><strong>Actionable:</strong> Include contact information and explain candidate rights</li>
      </ul>

      <h2>What Must Be Disclosed</h2>
      <p>
        Requirements vary by jurisdiction, but common elements include:
      </p>

      <div className="bg-gray-50 border rounded-lg p-6 my-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Element</th>
              <th className="text-center py-2">NYC</th>
              <th className="text-center py-2">IL</th>
              <th className="text-center py-2">CO</th>
              <th className="text-center py-2">CA</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">AI is being used</td>
              <td className="text-center">✓</td>
              <td className="text-center">✓</td>
              <td className="text-center">✓</td>
              <td className="text-center">✓</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Purpose of AI use</td>
              <td className="text-center">✓</td>
              <td className="text-center">✓</td>
              <td className="text-center">✓</td>
              <td className="text-center">✓</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Data/inputs used</td>
              <td className="text-center">✓</td>
              <td className="text-center">✓</td>
              <td className="text-center"></td>
              <td className="text-center">✓</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">What AI evaluates</td>
              <td className="text-center">✓</td>
              <td className="text-center">✓</td>
              <td className="text-center"></td>
              <td className="text-center">✓</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Right to opt-out</td>
              <td className="text-center">*</td>
              <td className="text-center"></td>
              <td className="text-center">✓</td>
              <td className="text-center">✓</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Right to appeal</td>
              <td className="text-center"></td>
              <td className="text-center"></td>
              <td className="text-center">✓</td>
              <td className="text-center"></td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Contact info</td>
              <td className="text-center">✓</td>
              <td className="text-center"></td>
              <td className="text-center">✓</td>
              <td className="text-center">✓</td>
            </tr>
            <tr>
              <td className="py-2">Link to bias audit</td>
              <td className="text-center">✓</td>
              <td className="text-center"></td>
              <td className="text-center"></td>
              <td className="text-center"></td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-2">* NYC requires notice of alternative process if available</p>
      </div>

      <h2>Universal Template</h2>
      <p>
        This template covers the most common requirements and can be customized for your organization:
      </p>

      <div className="bg-gray-50 border rounded-lg p-6 my-6">
        <p className="font-semibold text-lg mb-4">Notice of AI Use in Hiring</p>
        
        <p className="text-gray-700 mb-4">
          <strong>[Company Name]</strong> uses artificial intelligence (AI) technology to assist 
          in evaluating candidates for employment. This notice explains how AI is used and your 
          rights as an applicant.
        </p>

        <p className="font-semibold mb-2">What AI Tools We Use</p>
        <p className="text-gray-700 mb-4">
          We use <strong>[Tool Name(s)]</strong> to help evaluate job applications. This technology 
          assists our hiring team by <strong>[specific purpose, e.g., "analyzing resumes for 
          relevant qualifications" or "assessing skills through automated assessments"]</strong>.
        </p>

        <p className="font-semibold mb-2">What Data Is Analyzed</p>
        <p className="text-gray-700 mb-4">
          The AI analyzes information you provide, including:
        </p>
        <ul className="text-gray-700 mb-4 list-disc ml-6">
          <li>[e.g., Resume content including work history, skills, and education]</li>
          <li>[e.g., Your responses to application questions]</li>
          <li>[e.g., Assessment responses and results]</li>
        </ul>

        <p className="font-semibold mb-2">What the AI Evaluates</p>
        <p className="text-gray-700 mb-4">
          The AI helps assess factors such as:
        </p>
        <ul className="text-gray-700 mb-4 list-disc ml-6">
          <li>[e.g., Match between your qualifications and job requirements]</li>
          <li>[e.g., Relevant skills and experience]</li>
          <li>[e.g., Specific competencies required for the role]</li>
        </ul>

        <p className="font-semibold mb-2">How AI Influences Decisions</p>
        <p className="text-gray-700 mb-4">
          The AI generates <strong>[output type, e.g., "a compatibility score" or "a ranked list 
          of candidates"]</strong> that our hiring team uses as one factor in evaluation. 
          <strong>Human recruiters and hiring managers make all final hiring decisions.</strong>
        </p>

        <p className="font-semibold mb-2">Your Rights</p>
        <ul className="text-gray-700 mb-4 list-disc ml-6">
          <li><strong>Right to Alternative Review:</strong> You may request that your application 
          be evaluated without AI assistance. [If applicable: Contact us to request human-only review.]</li>
          <li><strong>Right to Information:</strong> You may request additional information about 
          how AI was used in evaluating your application.</li>
          <li><strong>Right to Appeal:</strong> If you are not selected, you may request information 
          about the decision and how to appeal.</li>
        </ul>

        <p className="font-semibold mb-2">Bias Testing</p>
        <p className="text-gray-700 mb-4">
          Our AI tools have been independently audited for bias. [For NYC: A summary of our most 
          recent bias audit is available at <span className="text-blue-600">[link]</span>.]
        </p>

        <p className="font-semibold mb-2">Contact Us</p>
        <p className="text-gray-700">
          Questions about our AI hiring practices? Contact us at:<br />
          Email: <strong>[email address]</strong><br />
          Phone: <strong>[phone number]</strong>
        </p>
      </div>

      <h2>NYC Local Law 144 Template</h2>
      <p>
        This template specifically addresses NYC's AEDT requirements:
      </p>

      <div className="bg-gray-50 border rounded-lg p-6 my-6">
        <p className="font-semibold text-lg mb-4">NYC Automated Employment Decision Tool Notice</p>
        
        <p className="text-gray-700 mb-4">
          [Company Name] uses an automated employment decision tool (AEDT) to assist in screening 
          or evaluating candidates for the <strong>[position title]</strong> position.
        </p>

        <p className="font-semibold mb-2">Job Qualifications Assessed</p>
        <p className="text-gray-700 mb-4">
          The AEDT is used to evaluate:
        </p>
        <ul className="text-gray-700 mb-4 list-disc ml-6">
          <li>[Specific qualification 1, e.g., "Relevant industry experience"]</li>
          <li>[Specific qualification 2, e.g., "Required technical skills"]</li>
          <li>[Specific qualification 3, e.g., "Educational background"]</li>
        </ul>

        <p className="font-semibold mb-2">Data Sources</p>
        <p className="text-gray-700 mb-4">
          The AEDT analyzes information from: <strong>[e.g., "your submitted resume and 
          application materials"]</strong>. No external data sources are used.
        </p>

        <p className="font-semibold mb-2">Bias Audit</p>
        <p className="text-gray-700 mb-4">
          In compliance with NYC Local Law 144, an independent bias audit of this AEDT has been 
          conducted. A summary of the audit results is publicly available at: 
          <span className="text-blue-600 underline">[URL to bias audit summary]</span>
        </p>

        <p className="font-semibold mb-2">Alternative Selection Process</p>
        <p className="text-gray-700 mb-4">
          [Option A:] If you wish to request an alternative selection process or a reasonable 
          accommodation, please contact [HR contact information].<br /><br />
          [Option B:] [Company Name] does not offer an alternative selection process. [Explain 
          reason if applicable.]
        </p>

        <p className="font-semibold mb-2">Questions</p>
        <p className="text-gray-700">
          For questions about our use of automated employment decision tools, contact: 
          <strong>[email/phone]</strong>
        </p>
      </div>

      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 my-6">
        <p className="font-semibold text-orange-800">NYC Timing Requirement</p>
        <p className="text-orange-700">
          NYC requires this notice be provided at least 10 business days before the AEDT is used 
          on a candidate. Include the notice in job postings or send via email immediately after 
          application submission.
        </p>
      </div>

      <h2>Colorado AI Act Template</h2>
      <p>
        Colorado requires more emphasis on consumer rights and appeal processes:
      </p>

      <div className="bg-gray-50 border rounded-lg p-6 my-6">
        <p className="font-semibold text-lg mb-4">Colorado AI Disclosure for Employment Decisions</p>
        
        <p className="text-gray-700 mb-4">
          <strong>[Company Name]</strong> uses artificial intelligence as part of our hiring 
          process for positions in Colorado. This notice is provided pursuant to the Colorado 
          Artificial Intelligence Act.
        </p>

        <p className="font-semibold mb-2">AI System Purpose</p>
        <p className="text-gray-700 mb-4">
          We use AI to <strong>[describe purpose]</strong>. This assists our hiring team in 
          making employment decisions, which are considered "consequential decisions" under 
          Colorado law.
        </p>

        <p className="font-semibold mb-2">Your Rights Under Colorado Law</p>
        <ul className="text-gray-700 mb-4 list-disc ml-6">
          <li><strong>Right to Opt Out:</strong> You may opt out of AI-based profiling used in 
          employment decisions. To opt out, contact [contact information].</li>
          <li><strong>Right to Human Review:</strong> If AI contributes to an adverse decision, 
          you may request human review of that decision.</li>
          <li><strong>Right to Explanation:</strong> You may request information about the 
          principal reasons for any AI-influenced decision.</li>
          <li><strong>Right to Correction:</strong> You may correct any inaccurate personal 
          information used by the AI system.</li>
        </ul>

        <p className="font-semibold mb-2">Exercising Your Rights</p>
        <p className="text-gray-700">
          To exercise any of these rights or ask questions about AI use in our hiring process:<br />
          Email: <strong>[email]</strong><br />
          Phone: <strong>[phone]</strong><br />
          We will respond to requests within 45 days.
        </p>
      </div>

      <h2>Where to Place Notices</h2>
      <p>
        Ensure candidates receive notices through multiple touchpoints:
      </p>
      <ul>
        <li><strong>Job postings:</strong> Include notice or link in every job posting</li>
        <li><strong>Career site:</strong> Prominent disclosure on careers/jobs page</li>
        <li><strong>Application confirmation:</strong> Email sent after application submission</li>
        <li><strong>Before assessments:</strong> Display notice before AI-powered tests</li>
        <li><strong>Privacy policy:</strong> Include in employment-related privacy disclosures</li>
      </ul>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
        <p className="font-semibold text-blue-800">Delivery Best Practice</p>
        <p className="text-blue-700">
          Use multiple delivery methods. A link in the job posting plus an email confirmation 
          creates redundancy. Configure your ATS to track that disclosures were delivered and 
          to which candidates.
        </p>
      </div>

      <h2>Customization Checklist</h2>
      <p>
        Before using these templates, customize for your organization:
      </p>
      <ul>
        <li>☐ Insert your company name</li>
        <li>☐ List specific AI tools by name</li>
        <li>☐ Describe actual purposes (don't use generic language)</li>
        <li>☐ Specify actual data inputs for your tools</li>
        <li>☐ Describe actual outputs (scores, rankings, etc.)</li>
        <li>☐ Add your contact information</li>
        <li>☐ Link to bias audit summary (NYC)</li>
        <li>☐ Confirm opt-out process is operational</li>
        <li>☐ Review with legal counsel</li>
      </ul>

      <h2>Related Resources</h2>
      <ul>
        <li><Link href="/resources/ai-disclosure-decision-tree" className="text-blue-600 hover:underline">Do I Need to Disclose AI? Decision Tree</Link></li>
        <li><Link href="/resources/what-counts-as-ai-hiring" className="text-blue-600 hover:underline">What Counts as AI in Hiring?</Link></li>
        <li><Link href="/resources/nyc-local-law-144" className="text-blue-600 hover:underline">NYC Local Law 144 Guide</Link></li>
        <li><Link href="/resources/illinois-ai-hiring-law" className="text-blue-600 hover:underline">Illinois HB 3773 Guide</Link></li>
        <li><Link href="/scorecard" className="text-blue-600 hover:underline">Free Compliance Scorecard</Link></li>
      </ul>
    </ArticleLayout>
  )
}
