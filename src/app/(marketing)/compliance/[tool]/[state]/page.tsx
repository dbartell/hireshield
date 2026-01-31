import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AI_TOOLS, STATES_WITH_LAWS, getToolBySlug, getStateBySlug, getAllToolStateCombos } from '@/lib/seo-data'

interface Props {
  params: Promise<{ tool: string; state: string }>
}

export async function generateStaticParams() {
  return getAllToolStateCombos().map(({ tool, state }) => ({
    tool: tool.slug,
    state: state.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool: toolSlug, state: stateSlug } = await params
  const tool = getToolBySlug(toolSlug)
  const state = getStateBySlug(stateSlug)

  if (!tool || !state) return {}

  const stateName = 'laws' in state ? state.name : state.name
  const title = `${tool.name} Compliance in ${stateName} | AI Hiring Laws`
  const description = `Is ${tool.name} compliant with ${stateName} AI hiring laws? Learn the requirements for using ${tool.name} (${tool.category}) in ${stateName} and how to stay compliant.`

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
  }
}

export default async function ToolStatePage({ params }: Props) {
  const { tool: toolSlug, state: stateSlug } = await params
  const tool = getToolBySlug(toolSlug)
  const state = getStateBySlug(stateSlug) as typeof STATES_WITH_LAWS[number] | undefined

  if (!tool || !state || !('laws' in state)) {
    notFound()
  }

  const laws = state.laws as readonly string[]
  const daysUntilDeadline = state.effectiveDate !== 'pending'
    ? Math.ceil((new Date(state.effectiveDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-slate-900">
            🛡️ AIHireLaw
          </Link>
          <Link
            href="/scorecard"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            Free Compliance Check
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <nav className="text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-slate-700">Home</Link>
          {' → '}
          <Link href="/compliance" className="hover:text-slate-700">Compliance</Link>
          {' → '}
          <Link href={`/compliance/${tool.slug}`} className="hover:text-slate-700">{tool.name}</Link>
          {' → '}
          <span className="text-slate-700">{state.name}</span>
        </nav>

        {/* Title */}
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          {tool.name} Compliance in {state.name}
        </h1>
        <p className="text-xl text-slate-600 mb-8">
          Everything you need to know about using {tool.name} for hiring in {state.name}.
        </p>

        {/* Urgency Banner */}
        {daysUntilDeadline !== null && daysUntilDeadline > 0 && daysUntilDeadline < 365 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
            <p className="text-amber-800">
              ⏰ <strong>{state.name}</strong> requirements go into effect in{' '}
              <strong>{daysUntilDeadline} days</strong> ({state.effectiveDate}).
              Make sure you're compliant before then.
            </p>
          </div>
        )}

        {/* Quick Summary */}
        <section className="bg-white rounded-xl border p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Quick Summary</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">Tool</p>
              <p className="font-medium">{tool.name} ({tool.category})</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">State</p>
              <p className="font-medium">{state.name} ({state.code})</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Applicable Laws</p>
              <p className="font-medium">{state.laws.join(', ')}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Effective Date</p>
              <p className="font-medium">
                {state.effectiveDate === 'pending' ? 'Pending' : state.effectiveDate}
              </p>
            </div>
          </div>
        </section>

        {/* What You Need to Do */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            What You Need to Do
          </h2>
          <div className="space-y-4">
            {laws.includes('AIVI') && (
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-semibold text-slate-900 mb-2">
                  ✅ Illinois AIVI Compliance
                </h3>
                <ul className="text-slate-600 space-y-2">
                  <li>• Notify candidates that AI will analyze their video interview</li>
                  <li>• Obtain written consent before the interview</li>
                  <li>• Explain how the AI works and what characteristics it evaluates</li>
                  <li>• Limit who can view the video (only those necessary for hiring)</li>
                  <li>• Delete videos within 30 days upon candidate request</li>
                </ul>
              </div>
            )}
            {laws.includes('BIPA') && (
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-semibold text-slate-900 mb-2">
                  ✅ Illinois BIPA Compliance
                </h3>
                <ul className="text-slate-600 space-y-2">
                  <li>• Obtain written consent before collecting biometric data (face, voice)</li>
                  <li>• Provide a written retention policy</li>
                  <li>• Never sell or profit from biometric data</li>
                  <li>• Store biometric data securely</li>
                </ul>
                <p className="text-sm text-amber-600 mt-2">
                  ⚠️ BIPA allows <strong>private lawsuits</strong> with damages of $1,000-$5,000 per violation
                </p>
              </div>
            )}
            {laws.includes('Local Law 144') && (
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-semibold text-slate-900 mb-2">
                  ✅ NYC Local Law 144 Compliance
                </h3>
                <ul className="text-slate-600 space-y-2">
                  <li>• Conduct annual bias audits of automated decision tools</li>
                  <li>• Publish audit results on your website</li>
                  <li>• Notify candidates 10+ days before using the tool</li>
                  <li>• Disclose what data is collected and analyzed</li>
                  <li>• Offer alternative selection process upon request</li>
                </ul>
              </div>
            )}
            {laws.includes('Colorado AI Act') && (
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-semibold text-slate-900 mb-2">
                  ✅ Colorado AI Act Compliance
                </h3>
                <ul className="text-slate-600 space-y-2">
                  <li>• Implement risk management policies for high-risk AI systems</li>
                  <li>• Conduct impact assessments before deployment</li>
                  <li>• Disclose AI use to candidates before decisions are made</li>
                  <li>• Provide opportunity for human review of AI decisions</li>
                  <li>• Document all AI systems used in employment decisions</li>
                </ul>
              </div>
            )}
            {laws.includes('HB 1202') && (
              <div className="bg-white rounded-lg border p-4">
                <h3 className="font-semibold text-slate-900 mb-2">
                  ✅ Maryland HB 1202 Compliance
                </h3>
                <ul className="text-slate-600 space-y-2">
                  <li>• Obtain consent before using facial recognition in interviews</li>
                  <li>• Provide signed waiver before video interview</li>
                  <li>• Cannot use facial recognition without explicit consent</li>
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* Does This Apply to Tool? */}
        <section className="bg-blue-50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Does This Apply to {tool.name}?
          </h2>
          <p className="text-slate-700 mb-4">
            {tool.category === 'Video Interview' && (
              <>
                <strong>Yes.</strong> {tool.name} conducts video interviews which are explicitly covered
                by {state.name}'s AI hiring regulations. You must obtain consent and provide disclosures
                before using {tool.name} for candidates in {state.name}.
              </>
            )}
            {tool.category === 'Assessment' && (
              <>
                <strong>Likely yes.</strong> {tool.name} uses AI-powered assessments to evaluate candidates.
                If these assessments substantially influence hiring decisions for {state.name} candidates,
                compliance is required.
              </>
            )}
            {(tool.category === 'ATS' || tool.category === 'ATS/HCM' || tool.category === 'HCM') && (
              <>
                <strong>It depends.</strong> If {tool.name}'s AI features (resume screening, candidate ranking)
                are used to filter {state.name} candidates, compliance is likely required. Review which
                AI features you're using.
              </>
            )}
            {(tool.category === 'Chatbot' || tool.category === 'Sourcing' || tool.category === 'CRM') && (
              <>
                <strong>Potentially.</strong> If {tool.name} is used to screen, filter, or rank
                candidates from {state.name} using AI, compliance may be required. Consult with legal counsel.
              </>
            )}
          </p>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">
            Check Your {tool.name} Compliance
          </h2>
          <p className="text-blue-100 mb-6">
            Take our free 2-minute scorecard to see if you're compliant with {state.name} requirements.
          </p>
          <Link
            href="/scorecard"
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50"
          >
            Free Compliance Scorecard →
          </Link>
        </section>

        {/* Related Tools */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Other Tools in {state.name}
          </h2>
          <div className="flex flex-wrap gap-2">
            {AI_TOOLS.filter(t => t.slug !== tool.slug).slice(0, 10).map(t => (
              <Link
                key={t.slug}
                href={`/compliance/${t.slug}/${state.slug}`}
                className="bg-white border rounded-lg px-3 py-2 text-sm text-slate-600 hover:border-blue-300 hover:text-blue-600"
              >
                {t.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Related States */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            {tool.name} in Other States
          </h2>
          <div className="flex flex-wrap gap-2">
            {STATES_WITH_LAWS.filter(s => s.slug !== state.slug).map(s => (
              <Link
                key={s.slug}
                href={`/compliance/${tool.slug}/${s.slug}`}
                className="bg-white border rounded-lg px-3 py-2 text-sm text-slate-600 hover:border-blue-300 hover:text-blue-600"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm">
            © 2026 AIHireLaw. This page is for informational purposes only and does not constitute legal advice.
          </p>
        </div>
      </footer>
    </div>
  )
}
