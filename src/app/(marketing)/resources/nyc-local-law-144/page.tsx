import { ArticleLayout } from "@/components/marketing/ArticleLayout"
import Link from "next/link"

export default function NYCLocalLaw144Page() {
  return (
    <ArticleLayout
      title="NYC Local Law 144: Complete Employer Compliance Guide"
      description="How to comply with New York City's automated employment decision tool (AEDT) law. Bias audits, public disclosures, candidate notices, and annual requirements explained."
      category="Local Law"
      readTime="9 min read"
      publishedDate="January 20, 2026"
    >
      <p>
        New York City Local Law 144 was one of the first laws in the United States to specifically 
        regulate AI in hiring. If you use automated tools to screen candidates or employees in NYC, 
        this law imposes strict bias audit and disclosure requirements that are already in effect.
      </p>

      <h2>Key Facts</h2>
      <ul>
        <li><strong>Effective Date:</strong> July 5, 2023 (already in effect)</li>
        <li><strong>Enforced By:</strong> NYC Department of Consumer and Worker Protection (DCWP)</li>
        <li><strong>Applies To:</strong> Employers and employment agencies using AEDTs in NYC</li>
        <li><strong>Penalties:</strong> $500-$1,500 per violation</li>
      </ul>

      <h2>What is an AEDT?</h2>
      <p>
        An Automated Employment Decision Tool (AEDT) is any computational process, derived from 
        machine learning, statistical modeling, data analytics, or artificial intelligence, that 
        issues a simplified output (score, classification, recommendation) to substantially assist 
        or replace discretionary decision-making for employment decisions.
      </p>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
        <p className="font-semibold text-blue-800">Key Definition: "Substantially Assist"</p>
        <p className="text-blue-700">
          An AEDT "substantially assists" a decision when it's used to: (1) overweight or change 
          the weight of certain criteria, (2) replace or modify human discretionary decisions, 
          or (3) is used as one of a set of criteria where the recommendation is given significant 
          weight. Resume screening tools, video interview AI, and candidate ranking systems typically qualify.
        </p>
      </div>

      <h3>Examples of AEDTs</h3>
      <ul>
        <li>Resume screening software that ranks or scores candidates</li>
        <li>Video interview platforms that analyze responses, tone, or expressions</li>
        <li>Chatbots that screen candidates and make advancement recommendations</li>
        <li>Skills assessment tools with AI-powered scoring</li>
        <li>ATS features that automatically filter or prioritize applications</li>
      </ul>

      <h3>What's NOT an AEDT</h3>
      <ul>
        <li>Simple keyword searches without machine learning</li>
        <li>Basic yes/no eligibility filters (e.g., work authorization)</li>
        <li>Calendar scheduling tools</li>
        <li>Communication platforms without analytical features</li>
      </ul>

      <h2>Requirements Overview</h2>

      <h3>1. Independent Bias Audit</h3>
      <p>
        Before using an AEDT, you must have it audited by an independent auditor. The audit must:
      </p>
      <ul>
        <li>Be conducted within the past year (audits must be annual)</li>
        <li>Analyze the AEDT's selection or scoring rates by sex, race/ethnicity categories</li>
        <li>Calculate impact ratios comparing outcomes across demographic groups</li>
        <li>Be conducted by an entity that exercises objective, impartial judgment</li>
      </ul>

      <h3>2. Public Disclosure (Website Posting)</h3>
      <p>
        You must publish a summary of the bias audit on your website. The summary must include:
      </p>
      <ul>
        <li>The date of the most recent bias audit</li>
        <li>The distribution date of the AEDT (when it was provided to you)</li>
        <li>The selection rates and impact ratios for all categories</li>
        <li>For each category, the number of individuals assessed</li>
      </ul>

      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 my-6">
        <p className="font-semibold text-orange-800">Historical Data Requirements</p>
        <p className="text-orange-700">
          If you've used the AEDT on NYC residents/applicants, the audit should use your actual 
          historical data. If you haven't (new tool or new to NYC), you may use the vendor's 
          test data or data from other employers. Document which data source you're using.
        </p>
      </div>

      <h3>3. Candidate Notice</h3>
      <p>
        You must notify candidates residing in NYC at least 10 business days before the AEDT is 
        used on them. The notice must include:
      </p>
      <ul>
        <li>That an AEDT will be used</li>
        <li>What job qualifications and characteristics the AEDT will assess</li>
        <li>Information about the data sources (what data the AEDT uses)</li>
        <li>Instructions for requesting an alternative selection process or accommodation (if available)</li>
      </ul>

      <h3>Notice Delivery Methods</h3>
      <p>The notice can be provided via:</p>
      <ul>
        <li>Email or written correspondence</li>
        <li>The job posting itself</li>
        <li>A conspicuous and clear link in the job posting</li>
      </ul>

      <h2>Bias Audit Requirements in Detail</h2>

      <h3>What Must Be Tested</h3>
      <p>The audit must calculate impact ratios for:</p>
      <ul>
        <li><strong>Sex categories:</strong> Male, Female, Unknown</li>
        <li><strong>Race/Ethnicity categories:</strong> Hispanic/Latino, White, Black/African American, 
        Native Hawaiian/Pacific Islander, Asian, Native American/Alaska Native, Two or More Races</li>
        <li><strong>Intersectional categories:</strong> Sex combined with race/ethnicity</li>
      </ul>

      <h3>Impact Ratio Calculation</h3>
      <p>
        For each category, the impact ratio is calculated as:
      </p>
      <div className="bg-gray-50 border rounded-lg p-4 my-4">
        <code className="text-sm">
          Impact Ratio = Selection Rate for Category ÷ Selection Rate for Most Selected Category
        </code>
      </div>
      <p>
        A ratio below 0.8 (the "four-fifths rule") may indicate adverse impact, though the law 
        doesn't specify a threshold. You should monitor low ratios and document explanations.
      </p>

      <h3>Who Can Conduct Audits?</h3>
      <p>
        The auditor must be independent — meaning they exercise objective, impartial judgment on 
        all issues within their scope. Your AEDT vendor cannot audit their own tool. Many employers 
        use third-party firms specializing in algorithmic auditing or employment testing validation.
      </p>

      <h2>Step-by-Step Compliance Checklist</h2>

      <h3>Initial Setup (Before Using AEDT)</h3>
      <ul>
        <li>☐ Identify all AEDTs used in hiring NYC candidates</li>
        <li>☐ Contact vendors to obtain bias audit (or commission independent audit)</li>
        <li>☐ Review audit results for adverse impact indicators</li>
        <li>☐ Create public summary document from audit results</li>
        <li>☐ Post summary on career site/company website</li>
        <li>☐ Create candidate notification language</li>
        <li>☐ Integrate notice into application process</li>
      </ul>

      <h3>Ongoing Compliance</h3>
      <ul>
        <li>☐ Provide notice to all NYC candidates 10+ business days before AEDT use</li>
        <li>☐ Track that notices were delivered</li>
        <li>☐ Conduct new bias audit annually</li>
        <li>☐ Update public summary after each audit</li>
        <li>☐ Re-audit if AEDT is significantly modified</li>
        <li>☐ Monitor for enforcement updates from DCWP</li>
      </ul>

      <h2>Sample Candidate Notice</h2>
      <div className="bg-gray-50 border rounded-lg p-6 my-6">
        <p className="font-semibold mb-3">Notice of Use of Automated Employment Decision Tool</p>
        <p className="text-gray-700 mb-3">
          [Company Name] uses an automated employment decision tool (AEDT) to assist in evaluating 
          candidates for this position. The tool analyzes your application materials to assess:
        </p>
        <ul className="text-gray-700 mb-3">
          <li>Relevant work experience and skills match</li>
          <li>Educational background alignment</li>
          <li>Qualifications for the role</li>
        </ul>
        <p className="text-gray-700 mb-3">
          <strong>Data Sources:</strong> The AEDT analyzes information you provide in your resume 
          and application. No external data sources are used.
        </p>
        <p className="text-gray-700 mb-3">
          <strong>Bias Audit:</strong> A summary of our most recent independent bias audit is 
          available at [link to audit summary].
        </p>
        <p className="text-gray-700">
          <strong>Alternative Process:</strong> If you wish to request an alternative selection 
          process or a reasonable accommodation, please contact [HR contact information].
        </p>
      </div>

      <h2>Penalties and Enforcement</h2>
      <p>
        The NYC Department of Consumer and Worker Protection (DCWP) enforces Local Law 144:
      </p>
      <ul>
        <li><strong>First violation:</strong> $500 civil penalty</li>
        <li><strong>Subsequent violations:</strong> $500-$1,500 per violation</li>
        <li>Each day of use without a bias audit counts as a separate violation</li>
        <li>Each candidate not notified counts as a separate violation</li>
      </ul>

      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 my-6">
        <p className="font-semibold text-orange-800">Violation Math</p>
        <p className="text-orange-700">
          If you've been using an AEDT without an audit for 90 days, that's potentially 90 violations 
          ($45,000-$135,000). If you processed 500 NYC candidates without notice during that time, 
          add another 500 violations ($250,000-$750,000). Compliance is far cheaper than penalties.
        </p>
      </div>

      <h2>Frequently Asked Questions</h2>

      <h3>Does this apply to remote positions?</h3>
      <p>
        If you're evaluating candidates who reside in NYC, or for positions based in NYC, the law 
        likely applies. The safest approach is to comply for any role that might attract NYC applicants.
      </p>

      <h3>Can my vendor provide the bias audit?</h3>
      <p>
        The vendor cannot audit their own tool. However, many vendors work with third-party auditors 
        and can provide audit results. Review the audit to ensure it meets NYC requirements and was 
        conducted by an independent party.
      </p>

      <h3>What if my AEDT shows adverse impact?</h3>
      <p>
        The law doesn't prohibit using an AEDT with adverse impact — it requires transparency. 
        However, adverse impact may create liability under other employment discrimination laws. 
        Consider working with your vendor to improve the tool or implementing additional safeguards.
      </p>

      <h3>Do I need a new audit every year?</h3>
      <p>
        Yes. The bias audit must have been conducted within one year of using the AEDT. Set a 
        calendar reminder to commission a new audit before your current one expires.
      </p>

      <h2>Related Resources</h2>
      <ul>
        <li><Link href="/compliance/nyc" className="text-blue-600 hover:underline">NYC Compliance Page</Link></li>
        <li><Link href="/resources/what-counts-as-ai-hiring" className="text-blue-600 hover:underline">What Counts as AI in Hiring?</Link></li>
        <li><Link href="/resources/vendor-assessment-guide" className="text-blue-600 hover:underline">Vendor Assessment Guide</Link></li>
        <li><Link href="/resources/ai-disclosure-notice-template" className="text-blue-600 hover:underline">AI Disclosure Notice Template</Link></li>
        <li><Link href="/scorecard" className="text-blue-600 hover:underline">Free Compliance Scorecard</Link></li>
      </ul>
    </ArticleLayout>
  )
}
