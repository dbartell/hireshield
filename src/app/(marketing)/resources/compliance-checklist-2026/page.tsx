import { ArticleLayout } from "@/components/marketing/ArticleLayout"
import Link from "next/link"

export default function ComplianceChecklist2026Page() {
  return (
    <ArticleLayout
      title="AI Hiring Compliance Checklist for 2026"
      description="A comprehensive step-by-step checklist to ensure your company is compliant with all major AI hiring laws taking effect in 2026."
      category="Checklist"
      readTime="6 min read"
      publishedDate="January 30, 2026"
    >
      <p>
        2026 is the year AI hiring compliance gets real. With Illinois, Colorado, and enhanced 
        California requirements taking effect, plus NYC's Local Law 144 already in force, employers 
        need a clear roadmap. This checklist covers everything you need to do, organized by deadline 
        and priority.
      </p>

      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 my-6">
        <p className="font-semibold text-orange-800">Key 2026 Dates</p>
        <ul className="text-orange-700 mt-2">
          <li><strong>Already in effect:</strong> NYC Local Law 144</li>
          <li><strong>January 1, 2026:</strong> Illinois HB 3773</li>
          <li><strong>February 1, 2026:</strong> Colorado AI Act</li>
          <li><strong>Ongoing:</strong> California CCPA ADMT (already in effect)</li>
        </ul>
      </div>

      <h2>Phase 1: Assessment (Complete by December 2025)</h2>

      <h3>Inventory Your AI Tools</h3>
      <ul>
        <li>☐ List all technology used in hiring (ATS, assessments, video platforms, etc.)</li>
        <li>☐ Identify which tools use AI, ML, or automated decision-making</li>
        <li>☐ Document what data each tool analyzes</li>
        <li>☐ Document what outputs each tool produces</li>
        <li>☐ Map tools to hiring process stages</li>
      </ul>

      <h3>Determine Geographic Scope</h3>
      <ul>
        <li>☐ Identify all states/cities where you have positions</li>
        <li>☐ Identify all states/cities where candidates may reside</li>
        <li>☐ Check if remote positions could attract candidates from regulated areas</li>
        <li>☐ Create matrix: which regulations apply to which positions</li>
      </ul>

      <h3>Gap Analysis</h3>
      <ul>
        <li>☐ Compare current practices against each applicable regulation</li>
        <li>☐ Identify missing disclosures, audits, or documentation</li>
        <li>☐ Prioritize gaps by deadline and risk</li>
        <li>☐ Create remediation plan with timeline</li>
      </ul>

      <h2>Phase 2: Documentation (Complete by January 2026)</h2>

      <h3>Bias Audits (NYC)</h3>
      <ul>
        <li>☐ Verify all AEDTs have current bias audit (within 1 year)</li>
        <li>☐ Obtain audit from vendor or commission independent audit</li>
        <li>☐ Review audit for adverse impact indicators</li>
        <li>☐ Prepare public summary of audit results</li>
        <li>☐ Post summary on company website/careers page</li>
        <li>☐ Set calendar reminder for annual audit renewal</li>
      </ul>

      <h3>Impact Assessments (Colorado)</h3>
      <ul>
        <li>☐ Create impact assessment template</li>
        <li>☐ Complete impact assessment for each AI tool</li>
        <li>☐ Document purpose, benefits, and risks</li>
        <li>☐ Document transparency measures</li>
        <li>☐ Document consumer feedback mechanisms</li>
        <li>☐ Store assessments securely for 3+ years</li>
      </ul>

      <h3>Risk Assessments (California)</h3>
      <ul>
        <li>☐ Identify ADMT used for employment decisions</li>
        <li>☐ Complete risk assessment for each ADMT</li>
        <li>☐ Document safeguards addressing identified risks</li>
        <li>☐ Maintain assessment documentation</li>
      </ul>

      <h2>Phase 3: Disclosure Notices (Complete by January 2026)</h2>

      <h3>Create Notice Templates</h3>
      <ul>
        <li>☐ Draft general AI disclosure notice</li>
        <li>☐ Draft NYC AEDT-specific notice</li>
        <li>☐ Draft Illinois-specific notice</li>
        <li>☐ Draft Colorado-specific notice (with rights info)</li>
        <li>☐ Draft California-specific notice (with opt-out info)</li>
        <li>☐ Review all notices with legal counsel</li>
      </ul>

      <h3>Integrate Notices into Hiring Process</h3>
      <ul>
        <li>☐ Update job posting templates to include notice or link</li>
        <li>☐ Update application confirmation emails</li>
        <li>☐ Configure ATS to display notice at appropriate points</li>
        <li>☐ Add disclosure before AI assessments</li>
        <li>☐ Update career site privacy policy</li>
        <li>☐ Test notice delivery for each candidate journey</li>
      </ul>

      <h3>Ensure Proper Timing</h3>
      <ul>
        <li>☐ NYC: Notice 10+ business days before AEDT use</li>
        <li>☐ Colorado: Notice before AI is used in decisions</li>
        <li>☐ Illinois: Notice before or at time of AI use</li>
        <li>☐ California: Pre-use notice required</li>
        <li>☐ Configure tracking to verify timing compliance</li>
      </ul>

      <h2>Phase 4: Rights & Processes (Complete by January 2026)</h2>

      <h3>Opt-Out Process</h3>
      <ul>
        <li>☐ Define process for receiving opt-out requests</li>
        <li>☐ Create alternative (human-only) review process</li>
        <li>☐ Establish response timeline (California: 45 days)</li>
        <li>☐ Train staff on handling opt-out requests</li>
        <li>☐ Create documentation templates for opt-outs</li>
        <li>☐ Test opt-out workflow end-to-end</li>
      </ul>

      <h3>Access Request Process</h3>
      <ul>
        <li>☐ Define process for ADMT access requests</li>
        <li>☐ Create response templates explaining AI use</li>
        <li>☐ Train staff on verifying requester identity</li>
        <li>☐ Establish response timeline</li>
      </ul>

      <h3>Appeal Process (Colorado)</h3>
      <ul>
        <li>☐ Create process for candidates to appeal AI decisions</li>
        <li>☐ Define human review procedures</li>
        <li>☐ Establish timeline for appeal response</li>
        <li>☐ Document how decisions can be corrected</li>
      </ul>

      <h3>Adverse Decision Notifications (Colorado)</h3>
      <ul>
        <li>☐ Create adverse decision notification template</li>
        <li>☐ Include statement that AI was used</li>
        <li>☐ Include principal reasons for decision</li>
        <li>☐ Include appeal/review instructions</li>
        <li>☐ Include data correction process</li>
      </ul>

      <h2>Phase 5: Training (Complete by January 2026)</h2>

      <h3>Develop Training Program</h3>
      <ul>
        <li>☐ Create training curriculum covering all requirements</li>
        <li>☐ Include company-specific tools and processes</li>
        <li>☐ Develop knowledge assessment</li>
        <li>☐ Create quick reference guides</li>
      </ul>

      <h3>Deliver Training</h3>
      <ul>
        <li>☐ Train all recruiters and HR staff</li>
        <li>☐ Train hiring managers</li>
        <li>☐ Train compliance/legal team</li>
        <li>☐ Document training completion</li>
        <li>☐ Obtain signed acknowledgments</li>
      </ul>

      <h2>Phase 6: Vendor Management (Complete by February 2026)</h2>

      <h3>Vendor Assessment</h3>
      <ul>
        <li>☐ Assess each AI vendor for compliance support</li>
        <li>☐ Request bias audit documentation</li>
        <li>☐ Request disclosure-ready explanations</li>
        <li>☐ Verify opt-out capabilities</li>
        <li>☐ Document vendor assessment results</li>
      </ul>

      <h3>Contract Updates</h3>
      <ul>
        <li>☐ Review vendor contracts for compliance terms</li>
        <li>☐ Add documentation requirements</li>
        <li>☐ Add audit support obligations</li>
        <li>☐ Add change notification requirements</li>
        <li>☐ Add compliance representations/warranties</li>
      </ul>

      <h2>Phase 7: Go-Live (January-February 2026)</h2>

      <h3>Pre-Launch Verification</h3>
      <ul>
        <li>☐ Verify all notices are deployed</li>
        <li>☐ Test disclosure delivery tracking</li>
        <li>☐ Verify bias audits are current and posted</li>
        <li>☐ Confirm training is complete</li>
        <li>☐ Test opt-out process</li>
        <li>☐ Test access request process</li>
      </ul>

      <h3>Launch Monitoring</h3>
      <ul>
        <li>☐ Monitor disclosure delivery rates</li>
        <li>☐ Track incoming requests</li>
        <li>☐ Log any issues or gaps</li>
        <li>☐ Address issues immediately</li>
        <li>☐ Daily check-ins during first week</li>
      </ul>

      <h2>Ongoing Compliance (2026 and Beyond)</h2>

      <h3>Monthly</h3>
      <ul>
        <li>☐ Review disclosure delivery metrics</li>
        <li>☐ Process any pending requests</li>
        <li>☐ Monitor for new regulatory guidance</li>
        <li>☐ Address any compliance issues</li>
      </ul>

      <h3>Quarterly</h3>
      <ul>
        <li>☐ Calculate and review impact ratios</li>
        <li>☐ Review selection rate data</li>
        <li>☐ Update documentation as needed</li>
        <li>☐ Report to leadership</li>
      </ul>

      <h3>Annually</h3>
      <ul>
        <li>☐ Renew bias audits (NYC)</li>
        <li>☐ Update impact assessments (Colorado)</li>
        <li>☐ Refresh risk assessments (California)</li>
        <li>☐ Complete annual training refresh</li>
        <li>☐ Full policy review</li>
        <li>☐ Vendor reassessment</li>
        <li>☐ Tool inventory update</li>
      </ul>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
        <p className="font-semibold text-blue-800">Pro Tip: Start Early</p>
        <p className="text-blue-700">
          Don't wait until December to begin. Bias audits can take 4-6 weeks. Vendor requests may 
          take longer. Training development needs time. Start now to avoid a compliance crunch.
        </p>
      </div>

      <h2>Quick Reference: Requirements by Jurisdiction</h2>

      <div className="bg-gray-50 border rounded-lg p-6 my-6 overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Requirement</th>
              <th className="text-center py-2">NYC</th>
              <th className="text-center py-2">IL</th>
              <th className="text-center py-2">CO</th>
              <th className="text-center py-2">CA</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">Pre-use disclosure</td>
              <td className="text-center">✓ (10 days)</td>
              <td className="text-center">✓</td>
              <td className="text-center">✓</td>
              <td className="text-center">✓</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Independent bias audit</td>
              <td className="text-center">✓ (annual)</td>
              <td className="text-center"></td>
              <td className="text-center"></td>
              <td className="text-center"></td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Public audit summary</td>
              <td className="text-center">✓</td>
              <td className="text-center"></td>
              <td className="text-center"></td>
              <td className="text-center"></td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Impact assessment</td>
              <td className="text-center"></td>
              <td className="text-center"></td>
              <td className="text-center">✓</td>
              <td className="text-center"></td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Risk assessment</td>
              <td className="text-center"></td>
              <td className="text-center"></td>
              <td className="text-center"></td>
              <td className="text-center">✓</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Opt-out right</td>
              <td className="text-center">*</td>
              <td className="text-center"></td>
              <td className="text-center">✓</td>
              <td className="text-center">✓</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Appeal right</td>
              <td className="text-center"></td>
              <td className="text-center"></td>
              <td className="text-center">✓</td>
              <td className="text-center"></td>
            </tr>
            <tr>
              <td className="py-2">Adverse decision notice</td>
              <td className="text-center"></td>
              <td className="text-center"></td>
              <td className="text-center">✓</td>
              <td className="text-center"></td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-2">* Must offer alternative if available</p>
      </div>

      <h2>Related Resources</h2>
      <ul>
        <li><Link href="/resources/compliance-program-guide" className="text-blue-600 hover:underline">Building a Compliance Program</Link></li>
        <li><Link href="/resources/ai-disclosure-notice-template" className="text-blue-600 hover:underline">AI Disclosure Notice Template</Link></li>
        <li><Link href="/resources/hr-training-guide" className="text-blue-600 hover:underline">Training HR Teams</Link></li>
        <li><Link href="/resources/vendor-assessment-guide" className="text-blue-600 hover:underline">Vendor Assessment Guide</Link></li>
        <li><Link href="/scorecard" className="text-blue-600 hover:underline">Free Compliance Scorecard</Link></li>
      </ul>
    </ArticleLayout>
  )
}
