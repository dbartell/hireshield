import { MetadataRoute } from 'next'
import { AI_TOOLS, STATES_WITH_LAWS } from '@/lib/seo-data'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://aihirelaw.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/scorecard`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/compliance`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/signup`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]

  // Tool pages
  const toolPages: MetadataRoute.Sitemap = AI_TOOLS.map(tool => ({
    url: `${BASE_URL}/compliance/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // State pages
  const statePages: MetadataRoute.Sitemap = STATES_WITH_LAWS.map(state => ({
    url: `${BASE_URL}/compliance/state/${state.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Tool + State combination pages (the big programmatic SEO play)
  const toolStatePages: MetadataRoute.Sitemap = AI_TOOLS.flatMap(tool =>
    STATES_WITH_LAWS.map(state => ({
      url: `${BASE_URL}/compliance/${tool.slug}/${state.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  )

  return [...staticPages, ...toolPages, ...statePages, ...toolStatePages]
}
