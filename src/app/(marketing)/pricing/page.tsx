import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, X } from "lucide-react"

const plans = [
  {
    name: "Starter",
    description: "For small teams getting started with compliance",
    price: 199,
    popular: false,
    features: [
      { name: "Compliance audit tool", included: true },
      { name: "Document generator", included: true },
      { name: "Compliance dashboard", included: true },
      { name: "Email support", included: true },
      { name: "Training module", included: false },
      { name: "Consent tracking", included: false },
      { name: "ATS integrations", included: false },
      { name: "Custom policies", included: false },
      { name: "Dedicated support", included: false },
    ],
    cta: "Start Free Trial",
    href: "/signup?plan=starter"
  },
  {
    name: "Pro",
    description: "For growing companies that need full compliance",
    price: 499,
    popular: true,
    features: [
      { name: "Everything in Starter", included: true },
      { name: "Training module", included: true },
      { name: "Consent tracking", included: true },
      { name: "Priority support", included: true },
      { name: "Unlimited users", included: true },
      { name: "ATS integrations", included: false },
      { name: "Custom policies", included: false },
      { name: "Dedicated support", included: false },
      { name: "SLA guarantee", included: false },
    ],
    cta: "Start Free Trial",
    href: "/signup?plan=pro"
  },
  {
    name: "Enterprise",
    description: "For large organizations with complex needs",
    price: 1999,
    popular: false,
    features: [
      { name: "Everything in Pro", included: true },
      { name: "ATS integrations", included: true },
      { name: "Custom policies", included: true },
      { name: "Dedicated support", included: true },
      { name: "SLA guarantee", included: true },
      { name: "Custom training content", included: true },
      { name: "API access", included: true },
      { name: "SSO/SAML", included: true },
      { name: "Audit log exports", included: true },
    ],
    cta: "Contact Sales",
    href: "/contact?plan=enterprise"
  }
]

const faqs = [
  {
    q: "What counts as AI in hiring?",
    a: "Any software that uses algorithms to screen, rank, score, or make recommendations about candidates. This includes LinkedIn Recruiter, Indeed, HireVue, most ATS systems, and many others."
  },
  {
    q: "Do I really need this?",
    a: "If you hire in Illinois, Colorado, California, or NYC and use any AI-powered hiring tools, yes. Penalties range from $500 to $7,500 per violation, and each candidate can count as a separate violation."
  },
  {
    q: "How long does setup take?",
    a: "Most companies complete their initial audit in under 30 minutes. Generating compliant documents takes seconds. Full implementation typically takes 1-2 weeks."
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, all plans are month-to-month with no long-term commitment. Annual plans receive a 17% discount (2 months free)."
  },
  {
    q: "Do you offer a free trial?",
    a: "Yes! All plans include a 14-day free trial with full access. No credit card required to start."
  },
  {
    q: "What if I need help?",
    a: "Starter plans include email support. Pro plans get priority support with faster response times. Enterprise plans include a dedicated customer success manager."
  }
]

export default function PricingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your company. All plans include a 14-day free trial.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm">
            <CheckCircle className="w-4 h-4" />
            Save 17% with annual billing
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative ${plan.popular ? 'border-blue-600 border-2 shadow-xl' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-5xl font-bold">${plan.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    ${Math.round(plan.price * 10 / 12)}/mo billed annually
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className={`flex items-center gap-2 text-sm ${!feature.included ? 'text-gray-400' : ''}`}>
                        {feature.included ? (
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-gray-300 flex-shrink-0" />
                        )}
                        {feature.name}
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.href}>
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? 'cta' : 'outline'}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Compare Plans</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4">Feature</th>
                  <th className="text-center py-4 px-4">Starter</th>
                  <th className="text-center py-4 px-4 bg-blue-50">Pro</th>
                  <th className="text-center py-4 px-4">Enterprise</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Compliance Audit</td>
                  <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-4 bg-blue-50"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Document Generator</td>
                  <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-4 bg-blue-50"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Training Module</td>
                  <td className="text-center py-4 px-4"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                  <td className="text-center py-4 px-4 bg-blue-50"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Consent Tracking</td>
                  <td className="text-center py-4 px-4"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                  <td className="text-center py-4 px-4 bg-blue-50"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">ATS Integrations</td>
                  <td className="text-center py-4 px-4"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                  <td className="text-center py-4 px-4 bg-blue-50"><X className="w-5 h-5 text-gray-300 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Users</td>
                  <td className="text-center py-4 px-4">Up to 5</td>
                  <td className="text-center py-4 px-4 bg-blue-50">Unlimited</td>
                  <td className="text-center py-4 px-4">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4 font-medium">Support</td>
                  <td className="text-center py-4 px-4">Email</td>
                  <td className="text-center py-4 px-4 bg-blue-50">Priority</td>
                  <td className="text-center py-4 px-4">Dedicated CSM</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b pb-6">
                <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get compliant?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your 14-day free trial today. No credit card required.
          </p>
          <Link href="/signup">
            <Button size="xl" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
