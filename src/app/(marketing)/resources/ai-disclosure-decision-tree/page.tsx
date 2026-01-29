import { ArticleLayout } from "@/components/marketing/ArticleLayout"
import Link from "next/link"

export default function AIDisclosureDecisionTreePage() {
  return (
    <ArticleLayout
      title="Do I Need to Disclose AI in Hiring? Decision Tree"
      description="Use this simple flowchart to determine if your company needs to disclose AI use to candidates, and which regulations apply to your hiring process."
      category="Tool"
      readTime="3 min read"
      publishedDate="February 1, 2026"
    >
      <p>
        Not sure if your hiring tools require candidate disclosure? This decision tree walks you 
        through the key questions to determine your obligations. Answer each question to identify 
        which regulations apply and what actions you need to take.
      </p>

      <h2>Start Here: The Main Question</h2>
      
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 my-6 text-center">
        <p className="text-lg font-bold text-blue-900 mb-2">
          Do you use any technology in hiring that uses AI, machine learning, 
          automated scoring, or algorithmic decision-making?
        </p>
        <div className="flex justify-center gap-8 mt-4">
          <div className="text-green-700 font-bold">YES → Continue below</div>
          <div className="text-gray-500 font-bold">NO → No disclosure required*</div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-8">
        *If you're unsure whether your tools use AI, see our guide: 
        <Link href="/resources/what-counts-as-ai-hiring" className="text-blue-600 hover:underline"> What Counts as AI in Hiring?</Link>
      </p>

      <h2>Question 1: Where Are Your Positions?</h2>
      <p className="mb-4">
        Check all locations where you have open positions or may hire employees:
      </p>

      <div className="bg-gray-50 border rounded-lg p-6 my-6">
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-xl">☐</span>
            <div>
              <strong>New York City</strong>
              <p className="text-sm text-gray-600">→ NYC Local Law 144 applies (already in effect)</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">☐</span>
            <div>
              <strong>Illinois</strong>
              <p className="text-sm text-gray-600">→ HB 3773 applies (effective January 1, 2026)</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">☐</span>
            <div>
              <strong>Colorado</strong>
              <p className="text-sm text-gray-600">→ Colorado AI Act applies (effective February 1, 2026)</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">☐</span>
            <div>
              <strong>California</strong>
              <p className="text-sm text-gray-600">→ CCPA ADMT rules apply (if meeting business thresholds)</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">☐</span>
            <div>
              <strong>Maryland</strong>
              <p className="text-sm text-gray-600">→ HB 1202 applies if using video interview AI</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">☐</span>
            <div>
              <strong>Remote positions (work from anywhere)</strong>
              <p className="text-sm text-gray-600">→ All above may apply depending on candidate location</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-xl">☐</span>
            <div>
              <strong>None of the above</strong>
              <p className="text-sm text-gray-600">→ Currently no specific disclosure law, but best practice to disclose</p>
            </div>
          </li>
        </ul>
      </div>

      <h2>Question 2: What Type of AI Do You Use?</h2>
      
      <h3>Resume Screening / Candidate Ranking</h3>
      <div className="bg-gray-50 border rounded-lg p-4 my-4">
        <p className="font-medium mb-2">Do you use AI to screen, score, or rank resumes?</p>
        <ul className="text-sm space-y-1">
          <li><strong>YES →</strong> Disclosure required (NYC, IL, CO, CA)</li>
          <li><strong>Examples:</strong> LinkedIn Recruiter matching, Indeed recommendations, AI-powered ATS screening</li>
        </ul>
      </div>

      <h3>Video Interview Analysis</h3>
      <div className="bg-gray-50 border rounded-lg p-4 my-4">
        <p className="font-medium mb-2">Do you use AI to analyze video interviews?</p>
        <ul className="text-sm space-y-1">
          <li><strong>YES →</strong> Disclosure required (NYC, IL, CO, CA, MD)</li>
          <li><strong>Examples:</strong> HireVue, Pymetrics, facial expression or tone analysis</li>
        </ul>
      </div>

      <h3>AI-Scored Assessments</h3>
      <div className="bg-gray-50 border rounded-lg p-4 my-4">
        <p className="font-medium mb-2">Do you use AI-powered skills tests or assessments?</p>
        <ul className="text-sm space-y-1">
          <li><strong>YES →</strong> Disclosure required (NYC, IL, CO, CA)</li>
          <li><strong>Examples:</strong> Cognitive assessments, personality tests with ML scoring, game-based assessments</li>
        </ul>
      </div>

      <h3>Chatbots / Virtual Assistants</h3>
      <div className="bg-gray-50 border rounded-lg p-4 my-4">
        <p className="font-medium mb-2">Do you use chatbots that screen or evaluate candidates?</p>
        <ul className="text-sm space-y-1">
          <li><strong>YES (if it influences decisions) →</strong> Disclosure required</li>
          <li><strong>NO (if scheduling only) →</strong> Typically not required</li>
        </ul>
      </div>

      <h3>Background Check AI</h3>
      <div className="bg-gray-50 border rounded-lg p-4 my-4">
        <p className="font-medium mb-2">Do you use AI for background screening beyond verification?</p>
        <ul className="text-sm space-y-1">
          <li><strong>YES (if predictive/scoring) →</strong> Likely disclosure required</li>
          <li><strong>NO (basic verification only) →</strong> May not require AI disclosure (but FCRA applies)</li>
        </ul>
      </div>

      <h2>Decision Summary</h2>

      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 my-6">
        <p className="font-semibold text-orange-800 mb-2">If you checked ANY box in Questions 1 AND 2:</p>
        <p className="text-orange-700">
          You likely need to provide AI disclosure notices to candidates. The specific requirements 
          depend on which jurisdictions apply.
        </p>
      </div>

      <h2>What You Need to Do by Jurisdiction</h2>

      <h3>NYC (Local Law 144) — Already Required</h3>
      <ul>
        <li>☐ Independent bias audit (annually)</li>
        <li>☐ Post audit summary on website</li>
        <li>☐ Notify candidates 10 business days before AEDT use</li>
        <li>☐ Explain what AI evaluates and data sources</li>
        <li>☐ Offer alternative process if available</li>
      </ul>

      <h3>Illinois (HB 3773) — January 1, 2026</h3>
      <ul>
        <li>☐ Notify candidates before or at time of AI use</li>
        <li>☐ Explain what AI is used for</li>
        <li>☐ Explain data inputs and how outputs influence decisions</li>
        <li>☐ Ensure AI doesn't discriminate on protected characteristics</li>
      </ul>

      <h3>Colorado (AI Act) — February 1, 2026</h3>
      <ul>
        <li>☐ Complete impact assessment before deployment</li>
        <li>☐ Notify candidates before AI is used</li>
        <li>☐ Explain purpose and decision type</li>
        <li>☐ Offer opt-out from AI profiling</li>
        <li>☐ Provide appeal process for adverse decisions</li>
        <li>☐ Send adverse decision statement if not selected</li>
      </ul>

      <h3>California (CCPA ADMT) — Already Required</h3>
      <ul>
        <li>☐ Pre-use notice explaining ADMT</li>
        <li>☐ Describe logic, inputs, and outputs</li>
        <li>☐ Offer opt-out from ADMT processing</li>
        <li>☐ Respond to access requests within 45 days</li>
        <li>☐ Complete risk assessment</li>
      </ul>

      <h3>Maryland (HB 1202) — If Using Video AI</h3>
      <ul>
        <li>☐ Obtain consent before using facial recognition in interviews</li>
        <li>☐ Provide notice that video AI will be used</li>
      </ul>

      <h2>Still Not Sure?</h2>

      <p>Here are some common scenarios:</p>

      <h3>"We just use LinkedIn Recruiter"</h3>
      <p>
        LinkedIn Recruiter uses AI for matching and recommendations. If you're hiring in regulated 
        jurisdictions and using these AI features to inform decisions, disclosure is likely required.
      </p>

      <h3>"Our ATS does automatic screening, but it's not really AI"</h3>
      <p>
        If the ATS uses machine learning, natural language processing, or algorithmic scoring to 
        filter or rank candidates, it's probably covered. Check with your vendor.
      </p>

      <h3>"We only use AI to source candidates, not decide on them"</h3>
      <p>
        The laws generally apply when AI is used to make or substantially assist employment decisions. 
        If AI helps determine who gets contacted or considered, disclosure may still apply.
      </p>

      <h3>"We're a small company"</h3>
      <p>
        NYC and Illinois apply regardless of company size. Colorado applies to "deployers" of high-risk 
        AI. California CCPA has business size thresholds. Check each law's scope carefully.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
        <p className="font-semibold text-blue-800">When in Doubt, Disclose</p>
        <p className="text-blue-700">
          Disclosing AI use when not strictly required has minimal downside. Failing to disclose when 
          required can result in fines and legal liability. Transparency builds trust.
        </p>
      </div>

      <h2>Next Steps</h2>
      <ol>
        <li><strong>Audit your tools:</strong> Confirm which tools use AI and how</li>
        <li><strong>Map your jurisdictions:</strong> Determine which laws apply</li>
        <li><strong>Create your notices:</strong> Use our <Link href="/resources/ai-disclosure-notice-template" className="text-blue-600 hover:underline">disclosure templates</Link></li>
        <li><strong>Get compliant:</strong> Take our <Link href="/scorecard" className="text-blue-600 hover:underline">free scorecard</Link> to assess your readiness</li>
      </ol>

      <h2>Related Resources</h2>
      <ul>
        <li><Link href="/resources/what-counts-as-ai-hiring" className="text-blue-600 hover:underline">What Counts as AI in Hiring?</Link></li>
        <li><Link href="/resources/ai-disclosure-notice-template" className="text-blue-600 hover:underline">AI Disclosure Notice Template</Link></li>
        <li><Link href="/resources/compliance-checklist-2026" className="text-blue-600 hover:underline">2026 Compliance Checklist</Link></li>
        <li><Link href="/resources/compliance-program-guide" className="text-blue-600 hover:underline">Building a Compliance Program</Link></li>
        <li><Link href="/scorecard" className="text-blue-600 hover:underline">Free Compliance Scorecard</Link></li>
      </ul>
    </ArticleLayout>
  )
}
