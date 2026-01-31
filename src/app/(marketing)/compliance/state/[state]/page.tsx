import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AI_TOOLS, STATES_WITH_LAWS, getStateBySlug } from '@/lib/seo-data'

interface Props {
  params: Promise<{ state: string }>
}

export async function generateStaticParams() {
  return STATES_WITH_LAWS.map(state => ({ state: state.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state: stateSlug } = await params
  const state = getStateBySlug(stateSlug) as typeof STATES_WITH_LAWS[number] | undefined
  if (!state || !('laws' in state)) return {}

  const title = `${state.name} AI Hiring Laws | Compliance Requirements`
  const description = `${state.name} AI hiring compliance requirements. ${state.laws.join(', ')}. Learn what you need to do to stay compliant.`

  return { title, description, openGraph: { title, description } }
}

export default async function StatePage({ params }: Props) {
  const { state: stateSlug } = await params
  const state = getStateBySlug(stateSlug) as typeof STATES_WITH_LAWS[number] | undefined

  if (!state || !('laws' in state)) notFound()

  const daysUntil = state.effectiveDate !== 'pending'
    ? Math.ceil((new Date(state.effectiveDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

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
          <span className="text-slate-700">{state.name}</span>
        </nav>

        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          {state.name} AI Hiring Laws
        </h1>
        <p className="text-xl text-slate-600 mb-8">
          {state.summary}
        </p>

        {daysUntil !== null && daysUntil > 0 && daysUntil < 365 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
            <p className="text-amber-800">
              ⏰ Goes into effect in <strong>{daysUntil} days</strong> ({state.effectiveDate})
            </p>
          </div>
        )}

        <section className="bg-white rounded-xl border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Key Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
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
              <p className="font-medium">{state.effectiveDate === 'pending' ? 'Pending' : state.effectiveDate}</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Tools Affected in {state.name}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {AI_TOOLS.map(tool => (
              <Link
                key={tool.slug}
                href={`/compliance/${tool.slug}/${state.slug}`}
                className="bg-white rounded-lg border p-4 hover:border-blue-300 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-slate-900">{tool.name}</h3>
                <p className="text-sm text-slate-500">{tool.category}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Check Your {state.name} Compliance</h2>
          <p className="text-blue-100 mb-6">Take our free 2-minute scorecard to see where you stand.</p>
          <Link href="/scorecard" className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50">
            Free Compliance Scorecard →
          </Link>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Other States with AI Hiring Laws</h2>
          <div className="flex flex-wrap gap-2">
            {STATES_WITH_LAWS.filter(s => s.slug !== state.slug).map(s => (
              <Link
                key={s.slug}
                href={`/compliance/state/${s.slug}`}
                className="bg-white border rounded-lg px-3 py-2 text-sm text-slate-600 hover:border-blue-300 hover:text-blue-600"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
