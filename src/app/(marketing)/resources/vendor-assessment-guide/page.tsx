import { ArticleLayout } from "@/components/marketing/ArticleLayout"
import Link from "next/link"

export default function VendorAssessmentGuidePage() {
  return (
    <ArticleLayout
      title="Vendor Assessment for AI Hiring Tools: Due Diligence Guide"
      description="How to evaluate your hiring technology vendors for compliance support and transparency. Questions to ask, red flags to watch for, and contract considerations."
      category="Guide"
      readTime="8 min read"
      publishedDate="January 26, 2026"
    >
      <p>
        Your AI hiring vendors are partners in compliance — or liabilities waiting to happen. 
        Before adopting new AI tools or renewing existing contracts, conduct thorough due diligence 
        to ensure vendors can support your compliance obligations.
      </p>

      <h2>Why Vendor Assessment Matters</h2>
      <p>
        Under most AI hiring laws, the employer is ultimately responsible for compliance, not the 
        vendor. However, vendors control critical information and capabilities you need:
      </p>
      <ul>
        <li>Access to bias audit data and results</li>
        <li>Documentation of AI functionality</li>
        <li>Data for impact assessments</li>
        <li>Support for candidate disclosure requirements</li>
        <li>Ability to implement opt-outs</li>
      </ul>

      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 my-6">
        <p className="font-semibold text-orange-800">Key Insight</p>
        <p className="text-orange-700">
          If your vendor can't or won't provide the information you need for compliance, you have 
          two choices: replace the vendor or accept significant legal risk. Assess this before 
          signing contracts, not after.
        </p>
      </div>

      <h2>Assessment Framework</h2>
      <p>
        Evaluate vendors across four dimensions:
      </p>
      <ol>
        <li><strong>Transparency:</strong> Do they explain how their AI works?</li>
        <li><strong>Compliance Support:</strong> Do they provide tools and data for compliance?</li>
        <li><strong>Testing:</strong> Have they tested for bias and discrimination?</li>
        <li><strong>Responsiveness:</strong> Can they support opt-outs and candidate requests?</li>
      </ol>

      <h2>Questions to Ask Vendors</h2>

      <h3>AI Functionality & Transparency</h3>
      <ul>
        <li>Does your product use AI, machine learning, or automated decision-making?</li>
        <li>What specific AI techniques are used (e.g., NLP, computer vision, ML ranking)?</li>
        <li>What data does the AI analyze to generate outputs?</li>
        <li>What outputs does the AI produce (scores, rankings, classifications, recommendations)?</li>
        <li>How should humans interpret and use these outputs?</li>
        <li>Can you provide documentation explaining the AI logic for candidate disclosures?</li>
        <li>What are the known limitations of your AI?</li>
      </ul>

      <h3>Bias Testing & Audits</h3>
      <ul>
        <li>Has your AI been tested for bias or adverse impact?</li>
        <li>Can you provide bias audit results compliant with NYC Local Law 144?</li>
        <li>Who conducted the audit? Was it independent?</li>
        <li>What demographic groups were tested?</li>
        <li>What were the impact ratios for each group?</li>
        <li>If adverse impact was found, what mitigation steps were taken?</li>
        <li>How often do you conduct bias audits?</li>
        <li>Can you support audits using our historical data?</li>
      </ul>

      <h3>Compliance Documentation</h3>
      <ul>
        <li>Do you provide documentation for Colorado AI Act impact assessments?</li>
        <li>Do you provide documentation for California CCPA risk assessments?</li>
        <li>Can you provide plain-language explanations for candidate disclosures?</li>
        <li>What records do you maintain that we can access?</li>
        <li>How long do you retain data?</li>
        <li>Can you provide data exports for our compliance records?</li>
      </ul>

      <h3>Candidate Rights Support</h3>
      <ul>
        <li>Can candidates opt out of AI processing?</li>
        <li>How would an opt-out be implemented technically?</li>
        <li>Can you identify which candidates were processed by AI?</li>
        <li>If a candidate requests information about AI use in their application, what can you provide?</li>
        <li>Can the AI decision be reversed or reconsidered?</li>
        <li>What human override capabilities exist?</li>
      </ul>

      <h3>Data & Training</h3>
      <ul>
        <li>What data was used to train your AI model?</li>
        <li>Was the training data tested for demographic representativeness?</li>
        <li>Is our data used to train or improve your AI?</li>
        <li>Do you use candidate data for purposes other than our hiring process?</li>
        <li>How do you ensure training data quality?</li>
      </ul>

      <h2>Red Flags</h2>
      <p>
        Be cautious if a vendor:
      </p>
      <ul>
        <li><strong>Claims no AI:</strong> If they use ML, NLP, or algorithmic scoring, it's likely AI</li>
        <li><strong>Won't share bias testing:</strong> Either they haven't tested or results are concerning</li>
        <li><strong>Can't explain outputs:</strong> "Black box" AI is a compliance risk</li>
        <li><strong>Refuses documentation:</strong> You need this for impact assessments</li>
        <li><strong>Can't support opt-outs:</strong> Required under California and Colorado laws</li>
        <li><strong>Has no independent audit:</strong> Especially problematic for NYC compliance</li>
        <li><strong>Vague about data use:</strong> Could indicate broader data sharing</li>
        <li><strong>Unresponsive to compliance questions:</strong> Support won't improve post-contract</li>
      </ul>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
        <p className="font-semibold text-blue-800">Best Practice</p>
        <p className="text-blue-700">
          Request compliance documentation before contract signing, not after. Vendors are more 
          responsive during the sales process. Get commitments in writing before you're locked in.
        </p>
      </div>

      <h2>Vendor Assessment Scorecard</h2>
      <p>
        Rate each vendor on a 1-5 scale (1=Poor, 5=Excellent):
      </p>

      <div className="bg-gray-50 border rounded-lg p-6 my-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Criterion</th>
              <th className="text-center py-2">Weight</th>
              <th className="text-center py-2">Score (1-5)</th>
              <th className="text-center py-2">Weighted</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">AI functionality transparency</td>
              <td className="text-center">15%</td>
              <td className="text-center">___</td>
              <td className="text-center">___</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Bias audit availability</td>
              <td className="text-center">20%</td>
              <td className="text-center">___</td>
              <td className="text-center">___</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Bias testing results</td>
              <td className="text-center">15%</td>
              <td className="text-center">___</td>
              <td className="text-center">___</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Documentation quality</td>
              <td className="text-center">15%</td>
              <td className="text-center">___</td>
              <td className="text-center">___</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Opt-out capability</td>
              <td className="text-center">10%</td>
              <td className="text-center">___</td>
              <td className="text-center">___</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Data access for monitoring</td>
              <td className="text-center">10%</td>
              <td className="text-center">___</td>
              <td className="text-center">___</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Responsiveness to questions</td>
              <td className="text-center">10%</td>
              <td className="text-center">___</td>
              <td className="text-center">___</td>
            </tr>
            <tr>
              <td className="py-2">Data privacy practices</td>
              <td className="text-center">5%</td>
              <td className="text-center">___</td>
              <td className="text-center">___</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="border-t font-bold">
              <td className="py-2">Total</td>
              <td className="text-center">100%</td>
              <td className="text-center"></td>
              <td className="text-center">___</td>
            </tr>
          </tfoot>
        </table>
        <p className="text-sm text-gray-500 mt-4">
          Score interpretation: 4.0+ Excellent | 3.0-3.9 Acceptable | 2.0-2.9 Concerning | &lt;2.0 Avoid
        </p>
      </div>

      <h2>Contract Provisions</h2>
      <p>
        Include these provisions in vendor agreements:
      </p>

      <h3>Documentation & Audit Rights</h3>
      <ul>
        <li>Vendor will provide documentation sufficient for employer's disclosure obligations</li>
        <li>Vendor will conduct or support annual bias audits compliant with NYC Local Law 144</li>
        <li>Vendor will provide data access for employer's impact assessments</li>
        <li>Vendor will maintain and provide records for at least 4 years</li>
        <li>Employer has right to audit vendor compliance</li>
      </ul>

      <h3>Notification & Changes</h3>
      <ul>
        <li>Vendor will notify employer 60 days before material changes to AI functionality</li>
        <li>Vendor will provide updated documentation following changes</li>
        <li>Vendor will notify employer of adverse bias audit results within 5 days</li>
      </ul>

      <h3>Support Obligations</h3>
      <ul>
        <li>Vendor will support employer in responding to candidate access requests</li>
        <li>Vendor will provide technical capability to implement opt-outs</li>
        <li>Vendor will cooperate with regulatory inquiries</li>
      </ul>

      <h3>Representations & Warranties</h3>
      <ul>
        <li>Vendor represents AI has been tested for bias with results provided to employer</li>
        <li>Vendor warrants it will comply with applicable AI regulations</li>
        <li>Vendor will indemnify employer for compliance failures caused by vendor</li>
      </ul>

      <h2>Ongoing Vendor Management</h2>

      <h3>Annual Review</h3>
      <ul>
        <li>☐ Request updated bias audit results</li>
        <li>☐ Review any AI functionality changes</li>
        <li>☐ Update your impact assessment documentation</li>
        <li>☐ Verify data retention practices</li>
        <li>☐ Reassess vendor scorecard</li>
      </ul>

      <h3>Trigger-Based Review</h3>
      <p>Reassess vendors when:</p>
      <ul>
        <li>New regulations take effect</li>
        <li>Vendor releases major updates</li>
        <li>Bias issues are discovered</li>
        <li>Candidate complaints arise</li>
        <li>Contract renewal approaches</li>
      </ul>

      <h2>Sample Request Letter</h2>
      <div className="bg-gray-50 border rounded-lg p-6 my-6">
        <p className="font-semibold mb-3">Subject: AI Hiring Compliance Documentation Request</p>
        <p className="text-gray-700 mb-3">Dear [Vendor Contact],</p>
        <p className="text-gray-700 mb-3">
          As part of our AI hiring compliance program, we are requesting the following documentation 
          for [Product Name]:
        </p>
        <ol className="text-gray-700 mb-3 list-decimal ml-4">
          <li>Description of AI/ML functionality and how outputs are generated</li>
          <li>Most recent independent bias audit results</li>
          <li>Plain-language disclosure template for candidates</li>
          <li>Information about data inputs and how they influence outputs</li>
          <li>Documentation for impact/risk assessment purposes</li>
          <li>Technical specifications for implementing candidate opt-outs</li>
        </ol>
        <p className="text-gray-700 mb-3">
          This information is needed to support our compliance with NYC Local Law 144, Illinois HB 3773, 
          Colorado AI Act, and California CCPA ADMT requirements.
        </p>
        <p className="text-gray-700">
          Please provide the requested documentation by [date]. Contact me if you have questions.
        </p>
      </div>

      <h2>Related Resources</h2>
      <ul>
        <li><Link href="/resources/compliance-program-guide" className="text-blue-600 hover:underline">Building a Compliance Program</Link></li>
        <li><Link href="/resources/what-counts-as-ai-hiring" className="text-blue-600 hover:underline">What Counts as AI in Hiring?</Link></li>
        <li><Link href="/resources/nyc-local-law-144" className="text-blue-600 hover:underline">NYC Local Law 144 Guide</Link></li>
        <li><Link href="/resources/colorado-ai-act-employers" className="text-blue-600 hover:underline">Colorado AI Act Guide</Link></li>
        <li><Link href="/scorecard" className="text-blue-600 hover:underline">Free Compliance Scorecard</Link></li>
      </ul>
    </ArticleLayout>
  )
}
