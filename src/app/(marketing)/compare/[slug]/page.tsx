import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, CheckCircle, AlertTriangle, XCircle, Scale, Shield } from "lucide-react"
import { AI_TOOLS, getToolBySlug } from "@/lib/seo-data"
import { generateComparisons, parseComparisonSlug, getToolDetails, TOOL_DETAILS } from "@/lib/comparison-data"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const comparisons = generateComparisons()
  return comparisons.map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const parsed = parseComparisonSlug(slug)
  if (!parsed) return { title: 'Comparison Not Found' }
  
  const tool1 = getToolBySlug(parsed.tool1Slug)
  const tool2 = getToolBySlug(parsed.tool2Slug)
  if (!tool1 || !tool2) return { title: 'Comparison Not Found' }
  
  return {
    title: `${tool1.name} vs ${tool2.name}: AI Hiring Compliance Comparison`,
    description: `Compare ${tool1.name} and ${tool2.name} for AI hiring compliance. Which tool is easier to comply with under NYC Local Law 144, Colorado AI Act, and Illinois laws?`,
    openGraph: {
      title: `${tool1.name} vs ${tool2.name} Compliance Comparison`,
      description: `Side-by-side compliance comparison of ${tool1.name} and ${tool2.name} for AI hiring regulations.`,
    }
  }
}

function RiskBadge({ level }: { level: 'Low' | 'Medium' | 'High' }) {
  const colors = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800',
  }
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[level]}`}>
      {level} Risk
    </span>
  )
}

export default async function ComparisonPage({ params }: Props) {
  const { slug } = await params
  const parsed = parseComparisonSlug(slug)
  if (!parsed) notFound()
  
  const tool1 = getToolBySlug(parsed.tool1Slug)
  const tool2 = getToolBySlug(parsed.tool2Slug)
  if (!tool1 || !tool2) notFound()
  
  const details1 = getToolDetails(tool1.slug)
  const details2 = getToolDetails(tool2.slug)
  
  // Fallback details for tools without full details
  const d1 = details1 || {
    description: `${tool1.name} is a ${tool1.category} tool used in hiring processes.`,
    aiFeatures: ['AI-powered features', 'Automated processing'],
    complianceConsiderations: ['Review for AEDT classification', 'Check state-specific requirements'],
    biasRiskLevel: 'Medium' as const,
    dataCollected: ['Application data', 'Assessment data'],
    laws: ['NYC Local Law 144', 'Colorado AI Act'],
  }
  
  const d2 = details2 || {
    description: `${tool2.name} is a ${tool2.category} tool used in hiring processes.`,
    aiFeatures: ['AI-powered features', 'Automated processing'],
    complianceConsiderations: ['Review for AEDT classification', 'Check state-specific requirements'],
    biasRiskLevel: 'Medium' as const,
    dataCollected: ['Application data', 'Assessment data'],
    laws: ['NYC Local Law 144', 'Colorado AI Act'],
  }

  // Get other comparisons for related links
  const allComparisons = generateComparisons()
  const relatedComparisons = allComparisons
    .filter(c => 
      c.slug !== slug && 
      (c.tool1.slug === tool1.slug || c.tool2.slug === tool1.slug || 
       c.tool1.slug === tool2.slug || c.tool2.slug === tool2.slug)
    )
    .slice(0, 6)

  return (
    <div>
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Scale className="w-4 h-4" />
            Compliance Comparison
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {tool1.name} vs {tool2.name}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Compare compliance requirements for these {tool1.category === tool2.category ? tool1.category : 'AI hiring'} tools under NYC Local Law 144, Colorado AI Act, and other state regulations.
          </p>
          <Link href="/scorecard">
            <Button size="lg" variant="cta">
              Check Your Tool's Compliance <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Quick Comparison */}
      <section className="py-12 border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Tool 1 */}
            <Card>
              <CardHeader className="bg-gray-50">
                <CardTitle className="flex items-center justify-between">
                  <span>{tool1.name}</span>
                  <RiskBadge level={d1.biasRiskLevel} />
                </CardTitle>
                <p className="text-sm text-gray-500">{tool1.category}</p>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">{d1.description}</p>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-2">AI Features</h4>
                    <ul className="space-y-1">
                      {d1.aiFeatures.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-2">Applicable Laws</h4>
                    <div className="flex flex-wrap gap-2">
                      {d1.laws.map((law, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {law}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tool 2 */}
            <Card>
              <CardHeader className="bg-gray-50">
                <CardTitle className="flex items-center justify-between">
                  <span>{tool2.name}</span>
                  <RiskBadge level={d2.biasRiskLevel} />
                </CardTitle>
                <p className="text-sm text-gray-500">{tool2.category}</p>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">{d2.description}</p>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-2">AI Features</h4>
                    <ul className="space-y-1">
                      {d2.aiFeatures.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-2">Applicable Laws</h4>
                    <div className="flex flex-wrap gap-2">
                      {d2.laws.map((law, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {law}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Compliance Requirements Comparison */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Compliance Requirements</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left py-4 px-4 font-semibold">Requirement</th>
                  <th className="text-center py-4 px-4 font-semibold">{tool1.name}</th>
                  <th className="text-center py-4 px-4 font-semibold">{tool2.name}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 px-4">
                    <div className="font-medium">NYC Bias Audit Required</div>
                    <div className="text-sm text-gray-500">Annual third-party audit under Local Law 144</div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {d1.biasRiskLevel === 'High' || d1.biasRiskLevel === 'Medium' ? (
                      <span className="text-red-600 font-medium">Likely Yes</span>
                    ) : (
                      <span className="text-green-600 font-medium">Likely No</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {d2.biasRiskLevel === 'High' || d2.biasRiskLevel === 'Medium' ? (
                      <span className="text-red-600 font-medium">Likely Yes</span>
                    ) : (
                      <span className="text-green-600 font-medium">Likely No</span>
                    )}
                  </td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="font-medium">Colorado Impact Assessment</div>
                    <div className="text-sm text-gray-500">Annual assessment for high-risk AI systems</div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {d1.biasRiskLevel === 'High' ? (
                      <span className="text-red-600 font-medium">Required</span>
                    ) : d1.biasRiskLevel === 'Medium' ? (
                      <span className="text-yellow-600 font-medium">Likely Required</span>
                    ) : (
                      <span className="text-green-600 font-medium">May Not Apply</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {d2.biasRiskLevel === 'High' ? (
                      <span className="text-red-600 font-medium">Required</span>
                    ) : d2.biasRiskLevel === 'Medium' ? (
                      <span className="text-yellow-600 font-medium">Likely Required</span>
                    ) : (
                      <span className="text-green-600 font-medium">May Not Apply</span>
                    )}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4">
                    <div className="font-medium">Illinois Consent Required</div>
                    <div className="text-sm text-gray-500">AIVI/BIPA consent for video/biometric analysis</div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {d1.laws.some(l => l.includes('Illinois') || l.includes('AIVI')) ? (
                      <span className="text-red-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-gray-500">Check Configuration</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    {d2.laws.some(l => l.includes('Illinois') || l.includes('AIVI')) ? (
                      <span className="text-red-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-gray-500">Check Configuration</span>
                    )}
                  </td>
                </tr>
                <tr className="border-b bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="font-medium">Candidate Notifications</div>
                    <div className="text-sm text-gray-500">Disclosure that AI is being used</div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-red-600 font-medium">Required</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-red-600 font-medium">Required</span>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4">
                    <div className="font-medium">Data Collected</div>
                    <div className="text-sm text-gray-500">Types of candidate data processed</div>
                  </td>
                  <td className="py-4 px-4">
                    <ul className="text-sm space-y-1">
                      {d1.dataCollected.map((data, i) => (
                        <li key={i} className="text-gray-600">• {data}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-4 px-4">
                    <ul className="text-sm space-y-1">
                      {d2.dataCollected.map((data, i) => (
                        <li key={i} className="text-gray-600">• {data}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Compliance Considerations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Key Compliance Considerations</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">{tool1.name}</h3>
              <ul className="space-y-3">
                {d1.complianceConsiderations.map((consideration, i) => (
                  <li key={i} className="flex items-start gap-3 bg-white p-4 rounded-lg border">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span>{consideration}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">{tool2.name}</h3>
              <ul className="space-y-3">
                {d2.complianceConsiderations.map((consideration, i) => (
                  <li key={i} className="flex items-start gap-3 bg-white p-4 rounded-lg border">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span>{consideration}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Recommendation */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Our Recommendation</h2>
          
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Both Tools Require Compliance Attention</h3>
                  <p className="text-gray-700 mb-4">
                    {d1.biasRiskLevel === 'High' && d2.biasRiskLevel === 'High' ? (
                      `Both ${tool1.name} and ${tool2.name} are high-risk tools under most AI hiring regulations. You'll need bias audits, impact assessments, and comprehensive candidate notifications regardless of which tool you choose.`
                    ) : d1.biasRiskLevel !== d2.biasRiskLevel ? (
                      `${d1.biasRiskLevel === 'High' || (d1.biasRiskLevel === 'Medium' && d2.biasRiskLevel === 'Low') ? tool2.name : tool1.name} has a lower compliance burden, but both tools require attention to AI hiring regulations depending on how you use them.`
                    ) : (
                      `Both tools have similar compliance requirements. The key difference is in how you configure and use them, which will determine your specific obligations.`
                    )}
                  </p>
                  <p className="text-gray-700">
                    <strong>Key steps for either tool:</strong>
                  </p>
                  <ul className="mt-2 space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Document how AI influences employment decisions
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Implement candidate notification workflows
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Schedule bias audits if using in NYC
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Complete impact assessments for Colorado compliance
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Related Comparisons */}
      {relatedComparisons.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8">Related Comparisons</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedComparisons.map(comp => (
                <Link 
                  key={comp.slug} 
                  href={`/compare/${comp.slug}`}
                  className="bg-white p-4 rounded-lg border hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="font-medium text-gray-900">
                    {comp.tool1.name} vs {comp.tool2.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {comp.tool1.category === comp.tool2.category ? comp.tool1.category : 'Cross-category'}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Help With Compliance?</h2>
          <p className="text-xl text-blue-100 mb-8">
            AIHireLaw helps you navigate compliance for any AI hiring tool you use.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/scorecard">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Get Free Compliance Score <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/quiz">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-blue-700">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
