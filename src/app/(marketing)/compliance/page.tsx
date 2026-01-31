import { Metadata } from 'next'
import Link from 'next/link'
import { AI_TOOLS, STATES_WITH_LAWS } from '@/lib/seo-data'

export const metadata: Metadata = {
  title: 'AI Hiring Compliance by Tool & State | AIHireLaw',
  description: 'Find compliance requirements for AI hiring tools like HireVue, Workday, Pymetrics in every state. Illinois, Colorado, NYC, Maryland and more.',
}

export default function CompliancePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
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

      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          AI Hiring Compliance Guide
        </h1>
        <p className="text-xl text-slate-600 mb-12">
          Find compliance requirements by tool and state. Click any combination to learn what you need to do.
        </p>

        {/* States with Laws */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            States with AI Hiring Laws
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {STATES_WITH_LAWS.map(state => {
              const daysUntil = state.effectiveDate !== 'pending'
                ? Math.ceil((new Date(state.effectiveDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                : null

              return (
                <Link
                  key={state.slug}
                  href={`/compliance/state/${state.slug}`}
                  className="bg-white rounded-lg border p-4 hover:border-blue-300 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-slate-900">{state.name}</h3>
                    {daysUntil !== null && daysUntil > 0 && daysUntil < 365 && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                        {daysUntil}d
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{state.laws.join(', ')}</p>
                  <p className="text-xs text-slate-400 mt-2">{state.summary}</p>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Tools by Category */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            AI Hiring Tools
          </h2>

          {/* Group by category */}
          {['Video Interview', 'Assessment', 'ATS', 'ATS/HCM', 'HCM', 'Chatbot', 'Sourcing', 'CRM', 'Talent Intelligence', 'Talent Experience', 'Job Board', 'Job Description', 'Screening'].map(category => {
            const toolsInCategory = AI_TOOLS.filter(t => t.category === category)
            if (toolsInCategory.length === 0) return null

            return (
              <div key={category} className="mb-8">
                <h3 className="text-lg font-semibold text-slate-700 mb-3">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {toolsInCategory.map(tool => (
                    <Link
                      key={tool.slug}
                      href={`/compliance/${tool.slug}`}
                      className="bg-white border rounded-lg px-4 py-2 text-slate-700 hover:border-blue-300 hover:text-blue-600"
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </section>

        {/* Matrix Table */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Full Compliance Matrix
          </h2>
          <p className="text-slate-600 mb-4">
            Click any cell to see detailed compliance requirements.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg border text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold text-slate-700">Tool</th>
                  {STATES_WITH_LAWS.map(state => (
                    <th key={state.slug} className="text-center p-3 font-semibold text-slate-700">
                      {state.code}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {AI_TOOLS.slice(0, 15).map(tool => (
                  <tr key={tool.slug} className="border-b hover:bg-slate-50">
                    <td className="p-3 font-medium text-slate-900">{tool.name}</td>
                    {STATES_WITH_LAWS.map(state => (
                      <td key={state.slug} className="text-center p-2">
                        <Link
                          href={`/compliance/${tool.slug}/${state.slug}`}
                          className="inline-block w-8 h-8 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 flex items-center justify-center"
                          title={`${tool.name} in ${state.name}`}
                        >
                          →
                        </Link>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-slate-500 mt-4">
            Showing 15 of {AI_TOOLS.length} tools. {AI_TOOLS.length * STATES_WITH_LAWS.length} total combinations.
          </p>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-center text-white mt-16">
          <h2 className="text-2xl font-bold mb-4">
            Not Sure Where to Start?
          </h2>
          <p className="text-blue-100 mb-6">
            Take our free 2-minute scorecard. We'll tell you exactly what you need to do.
          </p>
          <Link
            href="/scorecard"
            className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50"
          >
            Free Compliance Scorecard →
          </Link>
        </section>
      </main>
    </div>
  )
}
