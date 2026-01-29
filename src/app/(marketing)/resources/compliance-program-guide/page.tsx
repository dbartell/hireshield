import { ArticleLayout } from "@/components/marketing/ArticleLayout"
import Link from "next/link"

export default function ComplianceProgramGuidePage() {
  return (
    <ArticleLayout
      title="Building an AI Hiring Compliance Program: Complete Guide"
      description="Step-by-step guide to establishing and maintaining AI hiring compliance across your organization. Program setup, policies, documentation, and ongoing monitoring."
      category="Guide"
      readTime="15 min read"
      publishedDate="January 22, 2026"
    >
      <p>
        With AI hiring regulations proliferating across states and cities, ad-hoc compliance isn't 
        sustainable. This guide walks you through building a comprehensive compliance program that 
        scales with your organization and adapts to new requirements.
      </p>

      <h2>Why You Need a Formal Program</h2>
      <p>
        A structured compliance program provides:
      </p>
      <ul>
        <li><strong>Consistency:</strong> Same standards applied across all hiring</li>
        <li><strong>Documentation:</strong> Evidence of good faith compliance efforts</li>
        <li><strong>Scalability:</strong> Processes that work whether you're hiring 10 or 10,000</li>
        <li><strong>Adaptability:</strong> Framework to incorporate new regulations</li>
        <li><strong>Risk Mitigation:</strong> Reduced liability through proactive measures</li>
      </ul>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
        <p className="font-semibold text-blue-800">Affirmative Defense</p>
        <p className="text-blue-700">
          Several AI hiring laws (including Colorado's) provide affirmative defenses for employers 
          who discover and cure violations quickly, act in good faith, and have reasonable compliance 
          programs. A documented program is your best evidence of good faith.
        </p>
      </div>

      <h2>Phase 1: Foundation (Weeks 1-2)</h2>

      <h3>1.1 Assign Ownership</h3>
      <p>
        Designate a compliance owner who will be responsible for the program. This person should:
      </p>
      <ul>
        <li>Have authority to implement changes across HR and recruiting</li>
        <li>Understand both legal requirements and hiring operations</li>
        <li>Report to leadership on compliance status</li>
        <li>Coordinate with legal, IT, and vendor management</li>
      </ul>
      <p>
        For smaller organizations, this might be the HR Director. Larger organizations may need 
        a dedicated compliance officer or team.
      </p>

      <h3>1.2 Inventory Your AI Tools</h3>
      <p>
        Create a comprehensive inventory of all technology used in hiring. For each tool, document:
      </p>
      <ul>
        <li><strong>Tool name and vendor</strong></li>
        <li><strong>Purpose:</strong> What hiring decisions does it support?</li>
        <li><strong>AI features:</strong> Does it use ML, AI, automated scoring, or ranking?</li>
        <li><strong>Data inputs:</strong> What data does it analyze?</li>
        <li><strong>Data outputs:</strong> What does it produce (scores, rankings, recommendations)?</li>
        <li><strong>Human oversight:</strong> How do humans review AI outputs?</li>
        <li><strong>Geographic scope:</strong> Where is it used?</li>
      </ul>

      <div className="bg-gray-50 border rounded-lg p-6 my-6">
        <p className="font-semibold mb-3">Sample Inventory Entry</p>
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b">
              <td className="py-2 font-medium">Tool</td>
              <td className="py-2">HireRight Pro ATS</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-medium">Vendor</td>
              <td className="py-2">HireRight Technologies</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-medium">Purpose</td>
              <td className="py-2">Resume screening, candidate ranking</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-medium">AI Features</td>
              <td className="py-2">ML-powered job matching, skills extraction</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-medium">Inputs</td>
              <td className="py-2">Resume text, application responses</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-medium">Outputs</td>
              <td className="py-2">Match score (0-100), skill tags</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 font-medium">Human Review</td>
              <td className="py-2">Recruiters review all candidates scoring 60+</td>
            </tr>
            <tr>
              <td className="py-2 font-medium">Geography</td>
              <td className="py-2">All US locations</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>1.3 Map Regulatory Requirements</h3>
      <p>
        Based on where you hire, identify which regulations apply:
      </p>
      <ul>
        <li>☐ NYC Local Law 144 (NYC candidates/positions)</li>
        <li>☐ Illinois HB 3773 (Illinois hiring, effective Jan 2026)</li>
        <li>☐ Colorado AI Act (Colorado hiring, effective Feb 2026)</li>
        <li>☐ California CCPA ADMT (California hiring, if meeting thresholds)</li>
        <li>☐ Maryland HB 1202 (Video interview AI)</li>
        <li>☐ Other state/local laws</li>
      </ul>
      <p>
        Create a matrix mapping each tool to applicable regulations and their specific requirements.
      </p>

      <h2>Phase 2: Policy Development (Weeks 3-4)</h2>

      <h3>2.1 AI Hiring Policy</h3>
      <p>
        Create an internal policy document covering:
      </p>
      <ul>
        <li><strong>Scope:</strong> What tools and decisions the policy covers</li>
        <li><strong>Approval Process:</strong> How new AI tools are evaluated and approved</li>
        <li><strong>Documentation Requirements:</strong> What must be documented for each tool</li>
        <li><strong>Disclosure Standards:</strong> When and how to notify candidates</li>
        <li><strong>Human Oversight:</strong> Requirements for human review of AI decisions</li>
        <li><strong>Bias Monitoring:</strong> How AI tools are tested for discriminatory impact</li>
        <li><strong>Vendor Requirements:</strong> Compliance standards for AI vendors</li>
        <li><strong>Incident Response:</strong> What to do if issues are discovered</li>
      </ul>

      <h3>2.2 Disclosure Notices</h3>
      <p>
        Create template notices for each applicable regulation:
      </p>
      <ul>
        <li><strong>General AI disclosure:</strong> For all candidates in regulated jurisdictions</li>
        <li><strong>NYC AEDT notice:</strong> Meeting Local Law 144 specific requirements</li>
        <li><strong>Colorado pre-use notice:</strong> Meeting Colorado AI Act requirements</li>
        <li><strong>California ADMT notice:</strong> Including opt-out information</li>
        <li><strong>Adverse decision explanation:</strong> For candidates not selected</li>
      </ul>
      <p>
        See our <Link href="/resources/ai-disclosure-notice-template" className="text-blue-600 hover:underline">AI Disclosure Notice Template</Link> for examples.
      </p>

      <h3>2.3 Candidate Rights Procedures</h3>
      <p>
        Document how you will handle:
      </p>
      <ul>
        <li><strong>Opt-out requests:</strong> Process for human-only review</li>
        <li><strong>Access requests:</strong> How candidates can learn about AI use in their application</li>
        <li><strong>Appeals:</strong> How candidates can challenge AI-influenced decisions</li>
        <li><strong>Data correction:</strong> How candidates can correct inaccurate data</li>
      </ul>

      <h2>Phase 3: Implementation (Weeks 5-8)</h2>

      <h3>3.1 Integrate Disclosures</h3>
      <p>
        Work with IT and recruiting to integrate notices into the hiring flow:
      </p>
      <ul>
        <li>Add disclosure to job postings (or linked from postings)</li>
        <li>Include notice in application confirmation emails</li>
        <li>Display notice before AI-powered assessments</li>
        <li>Update career site privacy policy</li>
        <li>Configure ATS to track notice delivery</li>
      </ul>

      <h3>3.2 Train Your Team</h3>
      <p>
        All hiring-involved staff need training on:
      </p>
      <ul>
        <li>What AI tools are used and why they're regulated</li>
        <li>When and how disclosures are provided</li>
        <li>How to handle candidate questions about AI</li>
        <li>Process for opt-out and alternative review requests</li>
        <li>Documentation requirements</li>
      </ul>
      <p>
        See our <Link href="/resources/hr-training-guide" className="text-blue-600 hover:underline">HR Training Guide</Link> for curriculum details.
      </p>

      <h3>3.3 Establish Monitoring</h3>
      <p>
        Set up systems to monitor AI tool performance:
      </p>
      <ul>
        <li><strong>Selection rate tracking:</strong> Monitor outcomes by demographic group</li>
        <li><strong>Impact ratio calculations:</strong> Regular analysis of adverse impact</li>
        <li><strong>Disclosure delivery:</strong> Confirm notices are being delivered</li>
        <li><strong>Request tracking:</strong> Log opt-out and access requests</li>
        <li><strong>Audit scheduling:</strong> Calendar bias audits and renewals</li>
      </ul>

      <h2>Phase 4: Documentation System (Weeks 9-10)</h2>

      <h3>4.1 Central Repository</h3>
      <p>
        Create a central location for all compliance documentation:
      </p>
      <ul>
        <li>Tool inventory and assessments</li>
        <li>Bias audit reports and summaries</li>
        <li>Impact assessments (Colorado)</li>
        <li>Risk assessments (California)</li>
        <li>Policy documents and procedures</li>
        <li>Training records</li>
        <li>Disclosure templates and delivery logs</li>
        <li>Candidate request logs</li>
      </ul>

      <h3>4.2 Record Retention</h3>
      <p>
        Establish retention periods for compliance records:
      </p>
      <ul>
        <li><strong>Bias audits:</strong> Maintain for at least 4 years</li>
        <li><strong>Impact assessments:</strong> Maintain for 3 years after last use</li>
        <li><strong>Candidate notices:</strong> Maintain for duration of employment law statutes (typically 2-4 years)</li>
        <li><strong>Training records:</strong> Maintain for employee tenure plus 3 years</li>
        <li><strong>Opt-out requests:</strong> Maintain indefinitely or per state requirements</li>
      </ul>

      <h2>Phase 5: Vendor Management (Weeks 11-12)</h2>

      <h3>5.1 Vendor Assessment</h3>
      <p>
        Evaluate each AI vendor's compliance support:
      </p>
      <ul>
        <li>Do they provide bias audit support?</li>
        <li>What documentation do they offer about AI functionality?</li>
        <li>Can they support candidate disclosure requirements?</li>
        <li>What data do they provide for your monitoring needs?</li>
        <li>How do they handle opt-out requests?</li>
      </ul>
      <p>
        See our <Link href="/resources/vendor-assessment-guide" className="text-blue-600 hover:underline">Vendor Assessment Guide</Link> for detailed evaluation criteria.
      </p>

      <h3>5.2 Contract Updates</h3>
      <p>
        Review and update vendor contracts to include:
      </p>
      <ul>
        <li>Compliance cooperation requirements</li>
        <li>Data access for bias monitoring</li>
        <li>Audit support obligations</li>
        <li>Notification of material changes</li>
        <li>Indemnification for compliance failures</li>
      </ul>

      <h2>Ongoing Operations</h2>

      <h3>Monthly Tasks</h3>
      <ul>
        <li>☐ Review selection rate data for anomalies</li>
        <li>☐ Process any pending opt-out or access requests</li>
        <li>☐ Address any disclosure delivery failures</li>
        <li>☐ Update documentation for any process changes</li>
      </ul>

      <h3>Quarterly Tasks</h3>
      <ul>
        <li>☐ Calculate and review impact ratios</li>
        <li>☐ Conduct abbreviated compliance audit</li>
        <li>☐ Review new regulatory developments</li>
        <li>☐ Update training materials if needed</li>
        <li>☐ Report to leadership on compliance status</li>
      </ul>

      <h3>Annual Tasks</h3>
      <ul>
        <li>☐ Conduct or renew bias audits (NYC)</li>
        <li>☐ Update impact assessments (Colorado)</li>
        <li>☐ Refresh risk assessments (California)</li>
        <li>☐ Complete annual employee training</li>
        <li>☐ Full policy review and update</li>
        <li>☐ Vendor reassessment</li>
        <li>☐ Tool inventory refresh</li>
      </ul>

      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 my-6">
        <p className="font-semibold text-orange-800">Staying Current</p>
        <p className="text-orange-700">
          AI hiring regulation is evolving rapidly. Subscribe to legal updates, join HR compliance 
          groups, and monitor the <Link href="https://www.eeoc.gov" className="underline">EEOC</Link>, 
          state agencies, and local regulators for new guidance. Build flexibility into your program 
          to adapt quickly.
        </p>
      </div>

      <h2>Measuring Success</h2>
      <p>
        Track these metrics to evaluate your compliance program:
      </p>
      <ul>
        <li><strong>Disclosure rate:</strong> % of candidates receiving proper notice</li>
        <li><strong>Request response time:</strong> Days to respond to opt-out/access requests</li>
        <li><strong>Audit currency:</strong> Days since last bias audit (target: &lt;365)</li>
        <li><strong>Training completion:</strong> % of hiring staff trained</li>
        <li><strong>Impact ratios:</strong> Tracking toward 0.8+ for all groups</li>
        <li><strong>Incident count:</strong> Number of compliance issues identified</li>
      </ul>

      <h2>Related Resources</h2>
      <ul>
        <li><Link href="/resources/hr-training-guide" className="text-blue-600 hover:underline">Training HR Teams on AI Compliance</Link></li>
        <li><Link href="/resources/vendor-assessment-guide" className="text-blue-600 hover:underline">Vendor Assessment Guide</Link></li>
        <li><Link href="/resources/ai-disclosure-notice-template" className="text-blue-600 hover:underline">AI Disclosure Notice Template</Link></li>
        <li><Link href="/resources/compliance-checklist-2026" className="text-blue-600 hover:underline">2026 Compliance Checklist</Link></li>
        <li><Link href="/scorecard" className="text-blue-600 hover:underline">Free Compliance Scorecard</Link></li>
      </ul>
    </ArticleLayout>
  )
}
