import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AI_TOOLS, STATES_WITH_LAWS, getToolBySlug } from '@/lib/seo-data'

interface Props {
  params: Promise<{ tool: string }>
}

export async function generateStaticParams() {
  return AI_TOOLS.map(tool => ({ tool: tool.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool: toolSlug } = await params
  const tool = getToolBySlug(toolSlug)
  if (!tool) return {}

  const title = `${tool.name} AI Hiring Compliance | All States`
  const description = `Is ${tool.name} compliant? Learn AI hiring compliance requirements for ${tool.name} (${tool.category}) across all states including Illinois, Colorado, NYC, and Maryland.`

  return { title, description, openGraph: { title, description } }
}

export default async function ToolPage({ params }: Props) {
  const { tool: toolSlug } = await params
  const tool = getToolBySlug(toolSlug)

  if (!tool) notFound()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-slate-900">🛡️ AIHireLaw</Link>
          <Link href="/scorecard" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
            Free Compliance Check
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <nav className="text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-slate-700">Home</Link>
          {' → '}
          <Link href="/compliance" className="hover:text-slate-700">Compliance</Link>
          {' → '}
          <span className="text-slate-700">{tool.name}</span>
        </nav>

        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          {tool.name} Compliance Guide
        </h1>
        <p className="text-xl text-slate-600 mb-8">
          AI hiring compliance requirements for {tool.name} ({tool.category}) by state.
        </p>

        <section className="bg-white rounded-xl border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">About {tool.name}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">Tool Type</p>
              <p className="font-medium">{tool.category}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Compliance Risk</p>
              <p className="font-medium">
                {['Video Interview', 'Assessment'].includes(tool.category) ? (
                  <span className="text-red-600">High</span>
                ) : ['ATS', 'ATS/HCM', 'HCM', 'Screening'].includes(tool.category) ? (
                  <span className="text-amber-600">Medium</span>
                ) : (
                  <span className="text-green-600">Low-Medium</span>
                )}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            {tool.name} Compliance by State
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {STATES_WITH_LAWS.map(state => {
              const daysUntil = state.effectiveDate !== 'pending'
                ? Math.ceil((new Date(state.effectiveDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                : null

              return (
                <Link
                  key={state.slug}
                  href={`/compliance/${tool.slug}/${state.slug}`}
                  className="bg-white rounded-lg border p-4 hover:border-blue-300 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-slate-900">{state.name}</h3>
                    {daysUntil !== null && daysUntil > 0 && daysUntil < 365 && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                        {daysUntil} days
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{state.laws.join(', ')}</p>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Check Your {tool.name} Compliance</h2>
          <p className="text-blue-100 mb-6">Take our free 2-minute scorecard to see where you stand.</p>
          <Link href="/scorecard" className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50">
            Free Compliance Scorecard →
          </Link>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Other AI Hiring Tools</h2>
          <div className="flex flex-wrap gap-2">
            {AI_TOOLS.filter(t => t.slug !== tool.slug).map(t => (
              <Link
                key={t.slug}
                href={`/compliance/${t.slug}`}
                className="bg-white border rounded-lg px-3 py-2 text-sm text-slate-600 hover:border-blue-300 hover:text-blue-600"
              >
                {t.name}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
