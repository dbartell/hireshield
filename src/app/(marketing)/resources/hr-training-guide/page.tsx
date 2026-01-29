import { ArticleLayout } from "@/components/marketing/ArticleLayout"
import Link from "next/link"

export default function HRTrainingGuidePage() {
  return (
    <ArticleLayout
      title="Training HR Teams on AI Hiring Compliance"
      description="How to educate your HR team on AI hiring regulations and best practices. Training content, delivery methods, documentation, and certification."
      category="Guide"
      readTime="7 min read"
      publishedDate="January 24, 2026"
    >
      <p>
        Your compliance program is only as strong as the people executing it. HR teams, recruiters, 
        and hiring managers need to understand AI hiring regulations, recognize when requirements 
        apply, and follow proper procedures. This guide covers what to train, who to train, and 
        how to document it.
      </p>

      <h2>Why Training Matters</h2>
      <ul>
        <li><strong>Compliance execution:</strong> Policies mean nothing if staff don't follow them</li>
        <li><strong>Risk reduction:</strong> Trained staff catch issues before they become violations</li>
        <li><strong>Candidate experience:</strong> Staff can answer questions confidently</li>
        <li><strong>Evidence of good faith:</strong> Documented training supports affirmative defenses</li>
        <li><strong>Consistency:</strong> Everyone applies the same standards</li>
      </ul>

      <h2>Who Needs Training</h2>

      <h3>Tier 1: Core Training (All HR/Recruiting)</h3>
      <p>Everyone involved in hiring needs foundational knowledge:</p>
      <ul>
        <li>Recruiters and sourcers</li>
        <li>HR generalists</li>
        <li>Talent acquisition specialists</li>
        <li>HR coordinators</li>
        <li>Interview schedulers</li>
      </ul>

      <h3>Tier 2: Enhanced Training (Decision Makers)</h3>
      <p>Those making hiring decisions need deeper understanding:</p>
      <ul>
        <li>Hiring managers</li>
        <li>HR business partners</li>
        <li>Recruiting leads</li>
        <li>Anyone reviewing AI outputs</li>
      </ul>

      <h3>Tier 3: Expert Training (Compliance Owners)</h3>
      <p>Compliance leads need comprehensive expertise:</p>
      <ul>
        <li>HR compliance officers</li>
        <li>Program administrators</li>
        <li>Legal/employment counsel</li>
        <li>HR leadership</li>
      </ul>

      <h2>Training Curriculum</h2>

      <h3>Module 1: AI in Hiring Overview (30 minutes)</h3>
      <p><strong>Learning objectives:</strong></p>
      <ul>
        <li>Define what AI/ADMT/AEDT means in hiring context</li>
        <li>Identify which tools your company uses that qualify as AI</li>
        <li>Understand why these tools are regulated</li>
        <li>Know which jurisdictions have requirements</li>
      </ul>
      <p><strong>Key content:</strong></p>
      <ul>
        <li>Types of AI in hiring (screening, scoring, video analysis, chatbots)</li>
        <li>Your company's specific AI tool inventory</li>
        <li>Overview of major regulations (NYC LL144, Illinois, Colorado, California)</li>
        <li>Timeline of requirements</li>
      </ul>

      <h3>Module 2: Disclosure Requirements (45 minutes)</h3>
      <p><strong>Learning objectives:</strong></p>
      <ul>
        <li>Know when candidates must be notified about AI use</li>
        <li>Understand what must be included in notices</li>
        <li>Recognize timing requirements (e.g., NYC's 10 business days)</li>
        <li>Know how to verify disclosures were delivered</li>
      </ul>
      <p><strong>Key content:</strong></p>
      <ul>
        <li>Jurisdiction-specific notice requirements</li>
        <li>Your company's disclosure templates</li>
        <li>Integration points (job postings, ATS, emails)</li>
        <li>How to check disclosure delivery status</li>
        <li>What to do if disclosure fails</li>
      </ul>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
        <p className="font-semibold text-blue-800">Practice Exercise</p>
        <p className="text-blue-700">
          Have trainees identify all points in your hiring process where disclosures should be 
          provided. This reinforces understanding and may identify gaps in your current process.
        </p>
      </div>

      <h3>Module 3: Handling Candidate Requests (30 minutes)</h3>
      <p><strong>Learning objectives:</strong></p>
      <ul>
        <li>Recognize different types of candidate requests</li>
        <li>Know the escalation process for each request type</li>
        <li>Understand response timeframes</li>
        <li>Document requests properly</li>
      </ul>
      <p><strong>Key content:</strong></p>
      <ul>
        <li><strong>Opt-out requests:</strong> How to process requests for human-only review</li>
        <li><strong>Access requests:</strong> What to share about AI use in their application</li>
        <li><strong>Appeals:</strong> Process for challenging AI-influenced decisions</li>
        <li><strong>Data correction:</strong> How candidates can fix inaccurate data</li>
        <li>Documentation requirements for each request type</li>
      </ul>

      <h3>Module 4: Human Oversight of AI (30 minutes)</h3>
      <p><strong>Learning objectives:</strong></p>
      <ul>
        <li>Understand why human oversight is required</li>
        <li>Know what meaningful review looks like</li>
        <li>Avoid "rubber stamping" AI decisions</li>
        <li>Document human decision-making</li>
      </ul>
      <p><strong>Key content:</strong></p>
      <ul>
        <li>The purpose of AI as a tool, not a decision-maker</li>
        <li>What to look for when reviewing AI recommendations</li>
        <li>When to override AI suggestions</li>
        <li>How to document your independent judgment</li>
        <li>Red flags that should trigger additional review</li>
      </ul>

      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 my-6">
        <p className="font-semibold text-orange-800">Key Message</p>
        <p className="text-orange-700">
          AI outputs are recommendations, not decisions. Every hiring decision requires human judgment. 
          If you can't explain why you made a decision beyond "the AI said so," that's a problem.
        </p>
      </div>

      <h3>Module 5: Documentation and Record-Keeping (20 minutes)</h3>
      <p><strong>Learning objectives:</strong></p>
      <ul>
        <li>Understand what must be documented</li>
        <li>Know where to store compliance records</li>
        <li>Follow consistent documentation practices</li>
      </ul>
      <p><strong>Key content:</strong></p>
      <ul>
        <li>What records to create (notices, requests, decisions)</li>
        <li>Your company's documentation systems</li>
        <li>Retention requirements</li>
        <li>Privacy considerations for sensitive records</li>
      </ul>

      <h3>Module 6: Bias Awareness (45 minutes) - Tier 2/3</h3>
      <p><strong>Learning objectives:</strong></p>
      <ul>
        <li>Understand how AI can perpetuate or amplify bias</li>
        <li>Recognize signs of potential adverse impact</li>
        <li>Know when to escalate concerns</li>
      </ul>
      <p><strong>Key content:</strong></p>
      <ul>
        <li>How AI models learn (and inherit) bias</li>
        <li>Types of bias in hiring AI (historical, sampling, proxy)</li>
        <li>The four-fifths rule and impact ratios</li>
        <li>Your company's bias monitoring process</li>
        <li>How to report potential bias concerns</li>
      </ul>

      <h2>Training Delivery Methods</h2>

      <h3>Initial Training</h3>
      <ul>
        <li><strong>Live sessions:</strong> Instructor-led for Q&A and discussion (recommended for Tier 2/3)</li>
        <li><strong>E-learning:</strong> Self-paced modules with knowledge checks</li>
        <li><strong>Hybrid:</strong> E-learning for basics, live for advanced topics</li>
      </ul>

      <h3>Ongoing Reinforcement</h3>
      <ul>
        <li><strong>Quick reference guides:</strong> Laminated cards or intranet pages with key procedures</li>
        <li><strong>Scenario exercises:</strong> Regular practice with realistic situations</li>
        <li><strong>Newsletter updates:</strong> Monthly compliance tips and regulatory updates</li>
        <li><strong>Team meetings:</strong> Brief compliance topics in existing HR meetings</li>
      </ul>

      <h3>Annual Refresher</h3>
      <ul>
        <li>Abbreviated version of core modules</li>
        <li>Updates on regulatory changes</li>
        <li>Lessons learned from the past year</li>
        <li>Recertification requirement</li>
      </ul>

      <h2>Knowledge Assessment</h2>
      <p>
        Verify comprehension with post-training assessments:
      </p>
      <ul>
        <li><strong>Quiz:</strong> Multiple choice covering key concepts (80% passing score)</li>
        <li><strong>Scenario response:</strong> How would you handle this situation?</li>
        <li><strong>Practical demonstration:</strong> Show me how you would process an opt-out request</li>
      </ul>

      <div className="bg-gray-50 border rounded-lg p-6 my-6">
        <p className="font-semibold mb-3">Sample Quiz Questions</p>
        <ol className="space-y-4 text-gray-700">
          <li>
            <p className="font-medium">1. Which of the following tools would be considered an AEDT under NYC Local Law 144?</p>
            <p className="text-sm">a) A calendar scheduling tool</p>
            <p className="text-sm">b) An AI-powered resume screening system that ranks candidates</p>
            <p className="text-sm">c) A basic keyword search in your ATS</p>
            <p className="text-sm">d) An email platform for contacting candidates</p>
          </li>
          <li>
            <p className="font-medium">2. How many business days before using an AEDT must NYC candidates be notified?</p>
            <p className="text-sm">a) 5 days b) 10 days c) 15 days d) 30 days</p>
          </li>
          <li>
            <p className="font-medium">3. A candidate requests human-only review of their application. What should you do?</p>
            <p className="text-sm">(Open response)</p>
          </li>
        </ol>
      </div>

      <h2>Documentation Requirements</h2>
      <p>
        Maintain records to demonstrate training completion:
      </p>
      <ul>
        <li><strong>Training attendance:</strong> Who attended which sessions</li>
        <li><strong>Assessment results:</strong> Quiz scores and pass/fail status</li>
        <li><strong>Completion certificates:</strong> Proof of training for each employee</li>
        <li><strong>Training materials:</strong> Version-controlled copies of all content</li>
        <li><strong>Sign-off acknowledgments:</strong> Employee confirmation they understood requirements</li>
      </ul>

      <h3>Sample Training Acknowledgment</h3>
      <div className="bg-gray-50 border rounded-lg p-6 my-6">
        <p className="italic text-gray-700">
          "I have completed AI Hiring Compliance Training and understand my responsibilities under 
          [Company]'s AI compliance program. I understand which tools used in our hiring process 
          are considered AI, when and how to provide disclosures to candidates, how to handle 
          candidate requests, and the importance of meaningful human oversight of AI recommendations. 
          I agree to follow company policies and procedures and to escalate compliance concerns to 
          [Compliance Contact]."
        </p>
        <p className="text-sm text-gray-500 mt-4">Employee signature and date</p>
      </div>

      <h2>Handling Questions</h2>
      <p>
        Prepare trainers and staff for common questions:
      </p>
      <ul>
        <li><strong>"Why do we have to do this?"</strong> — Explain legal requirements and risk mitigation</li>
        <li><strong>"Does this apply to all candidates?"</strong> — Explain geographic scope</li>
        <li><strong>"What if a candidate asks about the AI?"</strong> — Provide talking points</li>
        <li><strong>"Can we turn off the AI?"</strong> — Explain opt-out processes</li>
        <li><strong>"What happens if we make a mistake?"</strong> — Explain correction procedures</li>
      </ul>

      <h2>Measuring Training Effectiveness</h2>
      <p>
        Track these metrics:
      </p>
      <ul>
        <li><strong>Completion rate:</strong> % of target audience trained</li>
        <li><strong>Assessment scores:</strong> Average scores and pass rates</li>
        <li><strong>Time to completion:</strong> For e-learning modules</li>
        <li><strong>Compliance incidents:</strong> Training-preventable issues (should decrease)</li>
        <li><strong>Trainee feedback:</strong> Satisfaction and usefulness ratings</li>
      </ul>

      <h2>Related Resources</h2>
      <ul>
        <li><Link href="/resources/compliance-program-guide" className="text-blue-600 hover:underline">Building a Compliance Program</Link></li>
        <li><Link href="/resources/what-counts-as-ai-hiring" className="text-blue-600 hover:underline">What Counts as AI in Hiring?</Link></li>
        <li><Link href="/resources/ai-disclosure-notice-template" className="text-blue-600 hover:underline">AI Disclosure Notice Template</Link></li>
        <li><Link href="/resources/compliance-checklist-2026" className="text-blue-600 hover:underline">2026 Compliance Checklist</Link></li>
        <li><Link href="/scorecard" className="text-blue-600 hover:underline">Free Compliance Scorecard</Link></li>
      </ul>
    </ArticleLayout>
  )
}
