'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Pilot',
    price: '$99',
    period: '/month',
    description: 'For early adopters. Limited to first 10 customers.',
    badge: '🔥 Early Bird',
    priceId: 'pilot',
    features: [
      'Full compliance dashboard',
      'All state law tracking (IL, CO, NYC, MD)',
      'Consent management tools',
      'Audit trail & documentation',
      'Training completion tracking',
      'Email alerts for law changes',
      'Export compliance reports (PDF)',
      'Priority support',
    ],
    cta: 'Get Started',
    highlighted: true,
  },
  {
    name: 'Standard',
    price: '$199',
    period: '/month',
    description: 'Full platform access for growing teams.',
    priceId: 'monthly',
    features: [
      'Everything in Pilot',
      'Unlimited team members',
      'API access',
      'Custom integrations',
      'Dedicated account manager',
      'Quarterly compliance reviews',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations with complex needs.',
    priceId: 'enterprise',
    features: [
      'Everything in Standard',
      'Multi-location support',
      'SSO / SAML integration',
      'Custom SLA',
      'On-site training',
      'Legal review support',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (priceId: string) => {
    if (priceId === 'enterprise' || priceId === 'monthly') {
      window.location.href = 'mailto:hello@aihirelaw.com?subject=AIHireLaw Enterprise Inquiry'
      return
    }

    setLoading(priceId)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      const { url, error } = await res.json()
      if (error) {
        // Not logged in - redirect to signup
        window.location.href = '/signup?redirect=/pricing'
        return
      }
      if (url) {
        window.location.href = url
      }
    } catch (err) {
      console.error('Checkout error:', err)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            🛡️ AIHireLaw
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-slate-300 hover:text-white">
              Log in
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Get compliant before the Feb 1 Colorado deadline. No hidden fees.
            Cancel anytime.
          </p>
        </div>

        {/* Urgency Banner */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-12 text-center">
          <p className="text-amber-300">
            ⏰ <strong>Colorado AI Act</strong> goes into effect{' '}
            <strong>February 1, 2026</strong>. Only{' '}
            <strong>
              {Math.ceil(
                (new Date('2026-02-01').getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24)
              )}{' '}
              days
            </strong>{' '}
            to get compliant.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 ${
                plan.highlighted
                  ? 'bg-blue-600 ring-2 ring-blue-400 scale-105'
                  : 'bg-slate-800 border border-slate-700'
              }`}
            >
              {plan.badge && (
                <span className="inline-block bg-amber-500 text-black text-sm font-semibold px-3 py-1 rounded-full mb-4">
                  {plan.badge}
                </span>
              )}
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-slate-300 mb-4">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-slate-300">{plan.period}</span>
              </div>

              <button
                onClick={() => handleCheckout(plan.priceId)}
                disabled={loading === plan.priceId}
                className={`w-full py-3 px-4 rounded-lg font-semibold mb-8 transition ${
                  plan.highlighted
                    ? 'bg-white text-blue-600 hover:bg-slate-100'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } disabled:opacity-50`}
              >
                {loading === plan.priceId ? 'Loading...' : plan.cta}
              </button>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      className={`w-5 h-5 mt-0.5 ${
                        plan.highlighted ? 'text-white' : 'text-green-400'
                      }`}
                    />
                    <span
                      className={plan.highlighted ? 'text-white' : 'text-slate-300'}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                What's included in the pilot pricing?
              </h3>
              <p className="text-slate-300">
                Everything. Full platform access, all features, priority support.
                We're offering $99/mo (normally $199) to our first 10 customers
                who help us refine the product.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-slate-300">
                Yes. No contracts, no cancellation fees. Cancel from your dashboard
                anytime and you won't be charged again.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Do I need this if I already use HireVue/Workday?
              </h3>
              <p className="text-slate-300">
                Yes. Those tools audit themselves, but you're responsible for your
                process: collecting consent, posting notices, keeping records.
                That's what AIHireLaw handles.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                What if I'm not sure I need this?
              </h3>
              <p className="text-slate-300">
                Take our free{' '}
                <Link href="/scorecard" className="text-blue-400 hover:underline">
                  compliance scorecard
                </Link>
                . It takes 2 minutes and tells you exactly where you stand.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get compliant?
          </h2>
          <p className="text-slate-300 mb-8">
            Start with our free scorecard or jump straight in.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/scorecard"
              className="bg-slate-700 text-white px-6 py-3 rounded-lg hover:bg-slate-600"
            >
              Free Scorecard
            </Link>
            <button
              onClick={() => handleCheckout('pilot')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Start Pilot ($99/mo)
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
