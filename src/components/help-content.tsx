"use client"

import { HelpModal } from "@/components/ui/tooltip"
import { CheckCircle, AlertTriangle } from "lucide-react"

// Pre-built help modals for common questions

export function ComplianceScoreHelp() {
  return (
    <HelpModal
      title="What is the Compliance Score?"
      content={
        <div className="space-y-4 text-sm">
          <p>
            Your compliance score (0-100) measures how prepared you are for AI hiring regulations. 
            It's calculated based on:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <span><strong>Audit completion</strong> — Have you assessed your AI tools?</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <span><strong>Required documents</strong> — Are your disclosure notices ready?</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <span><strong>Training status</strong> — Has your team completed required training?</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <span><strong>Consent tracking</strong> — Are you collecting required consent?</span>
            </li>
          </ul>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="font-medium text-blue-900">Score meanings:</p>
            <ul className="mt-2 space-y-1 text-blue-800">
              <li>• <strong>80-100:</strong> Good standing, maintain current practices</li>
              <li>• <strong>60-79:</strong> Fair, some gaps to address</li>
              <li>• <strong>40-59:</strong> At risk, action needed soon</li>
              <li>• <strong>0-39:</strong> Critical, immediate action required</li>
            </ul>
          </div>
        </div>
      }
    />
  )
}

export function StateLawsHelp() {
  return (
    <HelpModal
      title="Understanding State AI Hiring Laws"
      content={
        <div className="space-y-4 text-sm">
          <p>
            Several states have enacted laws regulating AI in hiring. Here's what each requires:
          </p>
          
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-orange-50 p-3 border-b">
              <p className="font-medium text-orange-900">Illinois (HB 3773) — Active</p>
              <ul className="mt-2 text-orange-800 space-y-1">
                <li>• Notify candidates AI is used in video interviews</li>
                <li>• Get consent before AI analysis</li>
                <li>• Explain how AI evaluates them</li>
              </ul>
            </div>
            <div className="bg-purple-50 p-3 border-b">
              <p className="font-medium text-purple-900">Colorado (AI Act) — Feb 1, 2026</p>
              <ul className="mt-2 text-purple-800 space-y-1">
                <li>• Complete impact assessments</li>
                <li>• Disclose AI use to affected individuals</li>
                <li>• Implement risk management policies</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-3 border-b">
              <p className="font-medium text-blue-900">NYC (Local Law 144) — Active</p>
              <ul className="mt-2 text-blue-800 space-y-1">
                <li>• Annual bias audits required</li>
                <li>• Publish audit results publicly</li>
                <li>• 10-day advance notice to candidates</li>
              </ul>
            </div>
            <div className="bg-green-50 p-3">
              <p className="font-medium text-green-900">Maryland (HB 1202) — Active</p>
              <ul className="mt-2 text-green-800 space-y-1">
                <li>• Consent for facial recognition in interviews</li>
                <li>• Provide waiver before video interview</li>
              </ul>
            </div>
          </div>
        </div>
      }
    />
  )
}

export function AuditResultsHelp() {
  return (
    <HelpModal
      title="Understanding Your Audit Results"
      content={
        <div className="space-y-4 text-sm">
          <p>
            Your audit identifies compliance gaps and prioritizes what to fix first.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Non-Compliant</p>
                <p className="text-red-700">Missing required elements. Address immediately to avoid penalties.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <p className="font-medium text-orange-900">At Risk</p>
                <p className="text-orange-700">Partially compliant but gaps exist. Should be addressed soon.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Compliant</p>
                <p className="text-green-700">Meets current requirements. Continue monitoring for law changes.</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="font-medium text-blue-900">Recommended order:</p>
            <ol className="mt-2 text-blue-800 space-y-1 list-decimal list-inside">
              <li>Fix all "Non-Compliant" items first</li>
              <li>Address "At Risk" items before deadlines</li>
              <li>Review quarterly to maintain compliance</li>
            </ol>
          </div>
        </div>
      }
    />
  )
}

export function DocumentsHelp() {
  return (
    <HelpModal
      title="Which Documents Do I Need?"
      content={
        <div className="space-y-4 text-sm">
          <p>
            The documents you need depend on which states you hire in. Here's a quick guide:
          </p>
          
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">🔔 Candidate Disclosure Notice</p>
              <p className="text-gray-600 mt-1">Required in: IL, CA, CO, NYC</p>
              <p className="text-gray-500 text-xs mt-1">Notifies job applicants that AI is used in hiring decisions.</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">✍️ Consent Form</p>
              <p className="text-gray-600 mt-1">Required in: CA, CO, IL (for video)</p>
              <p className="text-gray-500 text-xs mt-1">Collects explicit consent before AI processing.</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">📋 Impact Assessment</p>
              <p className="text-gray-600 mt-1">Required in: CO</p>
              <p className="text-gray-500 text-xs mt-1">Documents risks and safeguards of your AI systems.</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">📊 Bias Audit Disclosure</p>
              <p className="text-gray-600 mt-1">Required in: NYC</p>
              <p className="text-gray-500 text-xs mt-1">Public page showing results of required annual bias audit.</p>
            </div>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <p className="font-medium text-green-900">💡 Tip:</p>
            <p className="text-green-700">Start with the Candidate Disclosure Notice — it's required in the most states and takes 5 minutes to generate.</p>
          </div>
        </div>
      }
    />
  )
}

export function RiskScoreHelp() {
  return (
    <HelpModal
      title="What is Risk Score?"
      content={
        <div className="space-y-4 text-sm">
          <p>
            Your Risk Score (0-100) estimates your legal exposure based on:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="font-bold text-gray-500">+20</span>
              <span>Each regulated state you hire in</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-gray-500">+15</span>
              <span>High-risk AI usage (screening, ranking, termination)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-gray-500">+10</span>
              <span>Missing required documents</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-gray-500">+10</span>
              <span>Pending compliance deadlines</span>
            </li>
          </ul>
          <div className="bg-red-50 p-3 rounded-lg">
            <p className="font-medium text-red-900">Higher score = more risk</p>
            <p className="text-red-700 mt-1">
              Fines can range from $500-$5,000 per violation (Illinois BIPA) to 
              $10,000+ per violation (NYC Local Law 144).
            </p>
          </div>
        </div>
      }
    />
  )
}
