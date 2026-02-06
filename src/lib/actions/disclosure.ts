"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { stateRequirements, regulatedStates } from '@/data/states'
import { aiHiringTools } from '@/data/tools'

interface DisclosurePageData {
  slug?: string
  logo_url?: string
  brand_color?: string
  header_text?: string
  intro_text?: string
  contact_email?: string
  rights_section_enabled?: boolean
  rights_custom_text?: string
  bias_audit_section_enabled?: boolean
  bias_audit_url?: string
  bias_audit_date?: string
  bias_audit_auditor?: string
  custom_tools?: Array<{
    name: string
    purpose: string
    evaluates: string
    stages: string
  }>
  use_audit_tools?: boolean
  is_published?: boolean
}

// Generate a URL-safe slug from company name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50)
}

// Generate initial disclosure content from org's audit data
export async function generateDisclosureContent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const orgId = user.id

  // Get organization info including quiz_tools and states
  const { data: org } = await supabase
    .from('organizations')
    .select('name, quiz_tools, states')
    .eq('id', orgId)
    .single()

  // Get hiring tools from audit (if any)
  const { data: auditTools } = await supabase
    .from('hiring_tools')
    .select('*')
    .eq('org_id', orgId)

  // Get hiring states from hiring_states table (fallback)
  const { data: hiringStates } = await supabase
    .from('hiring_states')
    .select('state_code')
    .eq('org_id', orgId)

  const companyName = org?.name || 'Your Company'
  
  // Use org.states first, fall back to hiring_states table
  const orgStates = org?.states || []
  const stateCodes = orgStates.length > 0 
    ? orgStates 
    : (hiringStates?.map(s => s.state_code) || [])
  const regulatedStateCodes = stateCodes.filter((s: string) => regulatedStates.includes(s))

  // Generate intro text
  let introText = `At ${companyName}, we are committed to transparent and fair hiring practices. `
  introText += `We use artificial intelligence and automated tools to help us efficiently identify qualified candidates while ensuring compliance with all applicable regulations.`
  
  if (regulatedStateCodes.length > 0) {
    introText += `\n\nThis disclosure is provided in accordance with requirements in `
    introText += regulatedStateCodes.map((code: string) => {
      const state = stateRequirements.find(s => s.code === code)
      return state ? `${state.name} (${state.law})` : code
    }).join(', ')
    introText += '.'
  }

  // Generate rights text based on jurisdictions
  let rightsText = 'As a candidate, you have the following rights:\n\n'
  
  const allRights = new Set<string>()
  
  regulatedStateCodes.forEach((code: string) => {
    const state = stateRequirements.find(s => s.code === code)
    if (state) {
      state.requirements.forEach(req => {
        if (req.toLowerCase().includes('notify') || 
            req.toLowerCase().includes('allow') || 
            req.toLowerCase().includes('request') ||
            req.toLowerCase().includes('opportunity') ||
            req.toLowerCase().includes('opt out')) {
          allRights.add(req)
        }
      })
    }
  })

  // Default rights if no specific state requirements
  if (allRights.size === 0) {
    allRights.add('You may request information about how AI is used in our hiring process')
    allRights.add('You may request human review of AI-assisted decisions')
  }

  Array.from(allRights).forEach(right => {
    rightsText += `• ${right}\n`
  })

  // Map tools to custom tools format
  // First try audit tools, then fall back to quiz_tools from organization
  let toolsList: string[] = []
  
  if (auditTools && auditTools.length > 0) {
    toolsList = auditTools.map(t => t.tool_name)
  } else if (org?.quiz_tools && org.quiz_tools.length > 0) {
    toolsList = org.quiz_tools
  }
  
  const customTools = toolsList.map(toolId => {
    const toolInfo = aiHiringTools.find(t => t.id === toolId)
    return {
      name: toolInfo?.name || toolId,
      purpose: toolInfo?.description || 'Employment decision support',
      evaluates: toolInfo?.commonUses?.join(', ') || 'Various employment factors',
      stages: 'Multiple stages'
    }
  })

  return {
    slug: generateSlug(companyName),
    header_text: `How ${companyName} Uses AI in Hiring`,
    intro_text: introText,
    rights_custom_text: rightsText,
    custom_tools: customTools,
    contact_email: user.email || '',
  }
}

// Get or create disclosure page for organization
export async function getDisclosurePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated', page: null }
  }

  const { data: page } = await supabase
    .from('disclosure_pages')
    .select('*')
    .eq('organization_id', user.id)
    .single()

  return { page }
}

// Save disclosure page
export async function saveDisclosurePage(data: DisclosurePageData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const orgId = user.id

  // Check if page exists
  const { data: existing } = await supabase
    .from('disclosure_pages')
    .select('id')
    .eq('organization_id', orgId)
    .single()

  if (existing) {
    // Update existing page
    const { error } = await supabase
      .from('disclosure_pages')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
        ...(data.is_published && !existing ? { last_published_at: new Date().toISOString() } : {})
      })
      .eq('organization_id', orgId)

    if (error) {
      console.error('Error updating disclosure page:', error)
      return { error: error.message }
    }
  } else {
    // Create new page
    if (!data.slug || !data.contact_email) {
      return { error: 'Slug and contact email are required' }
    }

    const { error } = await supabase
      .from('disclosure_pages')
      .insert({
        organization_id: orgId,
        ...data,
      })

    if (error) {
      console.error('Error creating disclosure page:', error)
      return { error: error.message }
    }
  }

  revalidatePath('/settings/disclosure')
  return { success: true }
}

// Publish/unpublish disclosure page
export async function togglePublishDisclosurePage(publish: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const updateData: { is_published: boolean; last_published_at?: string } = {
    is_published: publish,
  }

  if (publish) {
    updateData.last_published_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('disclosure_pages')
    .update(updateData)
    .eq('organization_id', user.id)

  if (error) {
    console.error('Error toggling publish:', error)
    return { error: error.message }
  }

  revalidatePath('/settings/disclosure')
  return { success: true }
}

// Get disclosure page by slug (public)
export async function getDisclosureBySlug(slug: string) {
  const supabase = await createClient()

  const { data: page } = await supabase
    .from('disclosure_pages')
    .select(`
      *,
      organizations (
        id,
        name
      )
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!page) {
    return null
  }

  // Get hiring tools if use_audit_tools is enabled
  let tools = page.custom_tools || []
  
  if (page.use_audit_tools && page.organization_id) {
    // First try hiring_tools table
    const { data: hiringTools } = await supabase
      .from('hiring_tools')
      .select('*')
      .eq('org_id', page.organization_id)

    if (hiringTools && hiringTools.length > 0) {
      const auditTools = hiringTools.map(tool => {
        const toolInfo = aiHiringTools.find(t => t.id === tool.tool_name)
        return {
          name: toolInfo?.name || tool.tool_name,
          purpose: toolInfo?.description || tool.usage_description || 'Employment decision support',
          evaluates: toolInfo?.commonUses?.join(', ') || 'Various employment factors',
          stages: 'Multiple stages'
        }
      })
      tools = [...auditTools, ...tools]
    } else {
      // Fall back to quiz_tools from organization
      const { data: org } = await supabase
        .from('organizations')
        .select('quiz_tools')
        .eq('id', page.organization_id)
        .single()
      
      if (org?.quiz_tools && org.quiz_tools.length > 0) {
        const quizTools = org.quiz_tools.map((toolId: string) => {
          const toolInfo = aiHiringTools.find(t => t.id === toolId)
          return {
            name: toolInfo?.name || toolId,
            purpose: toolInfo?.description || 'Employment decision support',
            evaluates: toolInfo?.commonUses?.join(', ') || 'Various employment factors',
            stages: 'Multiple stages'
          }
        })
        tools = [...quizTools, ...tools]
      }
    }
  }

  return { ...page, tools }
}

// Track page view (public)
export async function trackDisclosurePageView(
  disclosurePageId: string,
  referrer?: string,
  userAgent?: string,
  embedType: string = 'direct'
) {
  const supabase = await createClient()

  // We don't track IP for privacy, just a random hash
  const ipHash = Math.random().toString(36).substring(2, 15)

  await supabase.from('disclosure_page_views').insert({
    disclosure_page_id: disclosurePageId,
    referrer,
    user_agent: userAgent,
    ip_hash: ipHash,
    embed_type: embedType,
  })
}

// Get analytics for disclosure page
export async function getDisclosureAnalytics() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated', analytics: null }
  }

  // Get the disclosure page
  const { data: page } = await supabase
    .from('disclosure_pages')
    .select('id')
    .eq('organization_id', user.id)
    .single()

  if (!page) {
    return { analytics: null }
  }

  // Get view counts
  const { data: views, count } = await supabase
    .from('disclosure_page_views')
    .select('*', { count: 'exact' })
    .eq('disclosure_page_id', page.id)
    .order('viewed_at', { ascending: false })
    .limit(100)

  // Calculate stats
  const now = new Date()
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const viewsLast7Days = views?.filter(v => new Date(v.viewed_at) > last7Days).length || 0
  const viewsLast30Days = views?.filter(v => new Date(v.viewed_at) > last30Days).length || 0

  // Top referrers
  const referrerCounts: Record<string, number> = {}
  views?.forEach(v => {
    const ref = v.referrer || 'Direct'
    referrerCounts[ref] = (referrerCounts[ref] || 0) + 1
  })

  const topReferrers = Object.entries(referrerCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([referrer, count]) => ({ referrer, count }))

  return {
    analytics: {
      totalViews: count || 0,
      viewsLast7Days,
      viewsLast30Days,
      topReferrers,
      recentViews: views?.slice(0, 10) || []
    }
  }
}

// Check if slug is available
export async function checkSlugAvailability(slug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated', available: false }
  }

  const { data: existing } = await supabase
    .from('disclosure_pages')
    .select('organization_id')
    .eq('slug', slug)
    .single()

  // Available if doesn't exist or belongs to current user
  const available = !existing || existing.organization_id === user.id

  return { available }
}
