import { ArticleLayout } from "@/components/marketing/ArticleLayout"
import Link from "next/link"

export default function CaliforniaCCPAADMTPage() {
  return (
    <ArticleLayout
      title="California CCPA ADMT Regulations: Employer Guide"
      description="Everything employers need to know about California's Automated Decision-Making Technology (ADMT) requirements under CCPA. Pre-use notices, opt-outs, and risk assessments explained."
      category="State Law"
      readTime="11 min read"
      publishedDate="January 18, 2026"
    >
      <p>
        California's Consumer Privacy Rights Act (CPRA) amendments to the California Consumer Privacy 
        Act (CCPA) introduced significant new requirements for businesses using Automated Decision-Making 
        Technology (ADMT). For employers, this means enhanced obligations when using AI in hiring decisions.
      </p>

      <h2>Key Dates and Enforcement</h2>
      <ul>
        <li><strong>Effective:</strong> Currently in effect (regulations finalized 2024)</li>
        <li><strong>Enforced By:</strong> California Privacy Protection Agency (CPPA)</li>
        <li><strong>Applies To:</strong> Businesses meeting CCPA thresholds that use ADMT for employment decisions</li>
      </ul>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
        <p className="font-semibold text-blue-800">Who's Covered?</p>
        <p className="text-blue-700">
          The CCPA applies to for-profit businesses that: (1) have gross annual revenues over $25 million, 
          (2) buy, sell, or share personal information of 100,000+ consumers/households, or (3) derive 50%+ 
          of revenue from selling/sharing personal information.
        </p>
      </div>

      <h2>What is ADMT Under California Law?</h2>
      <p>
        Automated Decision-Making Technology (ADMT) is defined as any technology that processes personal 
        information to make decisions, or substantially facilitates human decision-making, without significant 
        human involvement. In hiring, this includes:
      </p>
      <ul>
        <li><strong>Profiling:</strong> Automated processing to analyze or predict job performance, reliability, or behavior</li>
        <li><strong>Automated Decision-Making:</strong> Technology-driven decisions with legal or significant effects on individuals</li>
        <li><strong>AI-Powered Screening:</strong> Resume parsers, video interview analysis, skills assessments</li>
        <li><strong>Algorithmic Scoring:</strong> Any system that scores or ranks candidates automatically</li>
      </ul>

      <h2>Core Requirements</h2>

      <h3>1. Pre-Use Notice (Before Using ADMT)</h3>
      <p>
        Before using ADMT to make decisions about a consumer (including job applicants), you must provide 
        meaningful information about:
      </p>
      <ul>
        <li>The logic involved in the decision-making process</li>
        <li>The types of personal information used as inputs</li>
        <li>The intended outputs and how they influence decisions</li>
        <li>How the consumer can exercise their opt-out rights</li>
        <li>How to access additional information about the ADMT</li>
      </ul>

      <h3>2. Right to Opt-Out</h3>
      <p>
        California consumers have the right to opt out of ADMT in certain contexts. For employment, this 
        means applicants may request that:
      </p>
      <ul>
        <li>Their application be reviewed by a human instead of (or in addition to) ADMT</li>
        <li>ADMT outputs not be the sole basis for employment decisions</li>
        <li>They receive human reconsideration of ADMT-influenced decisions</li>
      </ul>

      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 my-6">
        <p className="font-semibold text-orange-800">Opt-Out Exceptions</p>
        <p className="text-orange-700">
          Employers may not be required to provide opt-outs where human review is not feasible or where 
          the ADMT is necessary to complete the requested service. However, you must still provide the 
          notice and document your reasoning.
        </p>
      </div>

      <h3>3. Right to Access ADMT Information</h3>
      <p>
        Consumers can request information about how ADMT was used in decisions affecting them, including:
      </p>
      <ul>
        <li>Whether ADMT was used in making a decision</li>
        <li>The logic and data used in the process</li>
        <li>The output or decision reached</li>
        <li>How to challenge or appeal the decision</li>
      </ul>

      <h3>4. Risk Assessments</h3>
      <p>
        Before deploying ADMT that poses significant risk to consumers, businesses must complete a 
        cybersecurity audit and risk assessment. Employment decisions are considered significant risks. 
        Your risk assessment should evaluate:
      </p>
      <ul>
        <li>Categories of personal information processed</li>
        <li>Purpose and necessity of processing</li>
        <li>Benefits and risks to consumers and the business</li>
        <li>Safeguards to address identified risks</li>
        <li>Whether benefits outweigh risks</li>
      </ul>

      <h2>Implementation Checklist</h2>

      <h3>Notice Requirements</h3>
      <ul>
        <li>☐ Update privacy policy to disclose ADMT use in hiring</li>
        <li>☐ Create pre-use notice for job applicants</li>
        <li>☐ Include notice in job applications and career site</li>
        <li>☐ Explain opt-out rights and how to exercise them</li>
        <li>☐ Provide contact information for ADMT inquiries</li>
      </ul>

      <h3>Opt-Out Process</h3>
      <ul>
        <li>☐ Establish process for receiving opt-out requests</li>
        <li>☐ Train HR on handling opt-out requests</li>
        <li>☐ Document alternative review processes for opt-outs</li>
        <li>☐ Track and respond to requests within 45 days</li>
        <li>☐ Maintain records of opt-out requests and responses</li>
      </ul>

      <h3>Access Requests</h3>
      <ul>
        <li>☐ Create process for handling ADMT access requests</li>
        <li>☐ Prepare template responses explaining ADMT logic</li>
        <li>☐ Train staff on verifying requester identity</li>
        <li>☐ Respond to requests within 45 days (extendable to 90)</li>
      </ul>

      <h3>Risk Assessment</h3>
      <ul>
        <li>☐ Inventory all ADMT used in employment decisions</li>
        <li>☐ Complete risk assessment for each ADMT system</li>
        <li>☐ Document benefits, risks, and safeguards</li>
        <li>☐ Review and update assessments annually</li>
        <li>☐ Submit assessments to CPPA if requested</li>
      </ul>

      <h2>Sample Pre-Use Notice</h2>
      <p>
        Your notice should be clear, conspicuous, and provided before ADMT is used:
      </p>
      <div className="bg-gray-50 border rounded-lg p-6 my-6">
        <p className="font-semibold mb-3">AI Use Disclosure</p>
        <p className="text-gray-700 mb-3">
          [Company Name] uses automated decision-making technology (ADMT) to assist in evaluating 
          job applications. Our ADMT analyzes application materials to assess qualifications and 
          job fit.
        </p>
        <p className="font-semibold mb-2">What information is used:</p>
        <ul className="text-gray-700 mb-3">
          <li>Resume content (work history, skills, education)</li>
          <li>Application responses</li>
          <li>Assessment results (if applicable)</li>
        </ul>
        <p className="font-semibold mb-2">How ADMT influences decisions:</p>
        <p className="text-gray-700 mb-3">
          ADMT generates a compatibility assessment that helps recruiters prioritize candidates. 
          Human recruiters review all shortlisted applications before final decisions.
        </p>
        <p className="font-semibold mb-2">Your Rights:</p>
        <p className="text-gray-700">
          You may opt out of ADMT-based processing and request human-only review. You may also 
          request information about how ADMT was used in evaluating your application. To exercise 
          these rights, contact [privacy@company.com] or call [phone number].
        </p>
      </div>

      <h2>Penalties for Non-Compliance</h2>
      <p>
        The California Privacy Protection Agency (CPPA) can enforce CCPA violations with:
      </p>
      <ul>
        <li><strong>Administrative fines:</strong> Up to $2,500 per unintentional violation</li>
        <li><strong>Intentional violations:</strong> Up to $7,500 per violation</li>
        <li><strong>Violations involving minors:</strong> Up to $7,500 per violation</li>
        <li><strong>Private right of action:</strong> For certain data breach claims ($100-$750 per consumer per incident)</li>
      </ul>

      <h2>Overlap with Other Laws</h2>
      <p>
        California employers should be aware of related requirements:
      </p>
      <ul>
        <li><strong>California FEHA:</strong> Fair Employment and Housing Act protections against discrimination</li>
        <li><strong>AB 2930:</strong> Potential future legislation on algorithmic discrimination</li>
        <li><strong>Federal EEO:</strong> EEOC guidance on AI and employment discrimination</li>
      </ul>
      <p>
        HireShield helps you maintain compliance across all applicable regulations from a single platform.
      </p>

      <h2>Frequently Asked Questions</h2>

      <h3>Does this apply to all employers?</h3>
      <p>
        The CCPA applies to for-profit businesses meeting the thresholds (revenue, data processing, 
        or data sales). Non-profits and small businesses below thresholds may not be covered, but 
        should still follow best practices.
      </p>

      <h3>What if an applicant opts out of ADMT?</h3>
      <p>
        You must provide an alternative process — typically human review of their application. 
        Document that you received the request and how you processed their application without ADMT.
      </p>

      <h3>How detailed must my ADMT explanation be?</h3>
      <p>
        Detailed enough for a reasonable person to understand the process, but you don't need to 
        disclose trade secrets or proprietary algorithms. Focus on the types of data used, the 
        general logic, and how outputs influence decisions.
      </p>

      <h2>Related Resources</h2>
      <ul>
        <li><Link href="/compliance/california" className="text-blue-600 hover:underline">California Compliance Page</Link></li>
        <li><Link href="/resources/what-counts-as-ai-hiring" className="text-blue-600 hover:underline">What Counts as AI in Hiring?</Link></li>
        <li><Link href="/resources/ai-disclosure-notice-template" className="text-blue-600 hover:underline">AI Disclosure Notice Template</Link></li>
        <li><Link href="/resources/compliance-program-guide" className="text-blue-600 hover:underline">Building a Compliance Program</Link></li>
        <li><Link href="/scorecard" className="text-blue-600 hover:underline">Free Compliance Scorecard</Link></li>
      </ul>
    </ArticleLayout>
  )
}
