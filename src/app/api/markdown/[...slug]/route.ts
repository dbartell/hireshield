import { NextRequest, NextResponse } from 'next/server'
import { AI_TOOLS, STATES_WITH_LAWS, getToolBySlug, getStateBySlug } from '@/lib/seo-data'

// Generate markdown for tool + state compliance pages
function generateToolStateMarkdown(toolSlug: string, stateSlug: string): string | null {
  const tool = getToolBySlug(toolSlug)
  const state = getStateBySlug(stateSlug) as typeof STATES_WITH_LAWS[number] | undefined
  
  if (!tool || !state || !('laws' in state)) return null
  
  const laws = state.laws as readonly string[]
  
  let md = `# ${tool.name} Compliance in ${state.name}

Everything you need to know about using ${tool.name} for hiring in ${state.name}.

## Quick Summary

- **Tool:** ${tool.name} (${tool.category})
- **State:** ${state.name} (${state.code})
- **Applicable Laws:** ${laws.join(', ')}
- **Effective Date:** ${state.effectiveDate === 'pending' ? 'Pending' : state.effectiveDate}

## What You Need to Do

`

  if (laws.includes('AIVI')) {
    md += `### Illinois AIVI Compliance

- Notify candidates that AI will analyze their video interview
- Obtain written consent before the interview
- Explain how the AI works and what characteristics it evaluates
- Limit who can view the video (only those necessary for hiring)
- Delete videos within 30 days upon candidate request

`
  }
  
  if (laws.includes('BIPA')) {
    md += `### Illinois BIPA Compliance

- Obtain written consent before collecting biometric data (face, voice)
- Provide a written retention policy
- Never sell or profit from biometric data
- Store biometric data securely

⚠️ **Warning:** BIPA allows private lawsuits with damages of $1,000-$5,000 per violation

`
  }
  
  if (laws.includes('Local Law 144')) {
    md += `### NYC Local Law 144 Compliance

- Conduct annual bias audits of automated decision tools
- Publish audit results on your website
- Notify candidates 10+ days before using the tool
- Disclose what data is collected and analyzed
- Offer alternative selection process upon request

`
  }
  
  if (laws.includes('Colorado AI Act')) {
    md += `### Colorado AI Act Compliance

- Implement risk management policies for high-risk AI systems
- Conduct impact assessments before deployment
- Disclose AI use to candidates before decisions are made
- Provide opportunity for human review of AI decisions
- Document all AI systems used in employment decisions

`
  }
  
  if (laws.includes('HB 1202')) {
    md += `### Maryland HB 1202 Compliance

- Obtain consent before using facial recognition in interviews
- Provide signed waiver before video interview
- Cannot use facial recognition without explicit consent

`
  }

  md += `## Does This Apply to ${tool.name}?

`
  
  if (tool.category === 'Video Interview') {
    md += `**Yes.** ${tool.name} conducts video interviews which are explicitly covered by ${state.name}'s AI hiring regulations. You must obtain consent and provide disclosures before using ${tool.name} for candidates in ${state.name}.

`
  } else if (tool.category === 'Assessment') {
    md += `**Likely yes.** ${tool.name} uses AI-powered assessments to evaluate candidates. If these assessments substantially influence hiring decisions for ${state.name} candidates, compliance is required.

`
  } else if (['ATS', 'ATS/HCM', 'HCM'].includes(tool.category)) {
    md += `**It depends.** If ${tool.name}'s AI features (resume screening, candidate ranking) are used to filter ${state.name} candidates, compliance is likely required. Review which AI features you're using.

`
  } else {
    md += `**Potentially.** If ${tool.name} is used to screen, filter, or rank candidates from ${state.name} using AI, compliance may be required. Consult with legal counsel.

`
  }

  md += `---

*Source: [AIHireLaw](https://aihirelaw.com/compliance/${tool.slug}/${state.slug}) - This is for informational purposes only and does not constitute legal advice.*
`

  return md
}

// Generate markdown for tool overview pages
function generateToolMarkdown(toolSlug: string): string | null {
  const tool = getToolBySlug(toolSlug)
  if (!tool) return null
  
  let md = `# ${tool.name} AI Hiring Compliance Guide

${tool.name} is a ${tool.category} tool used in hiring. Here's what you need to know about compliance.

## States with AI Hiring Laws

The following states have specific laws that may apply when using ${tool.name}:

`
  
  for (const state of STATES_WITH_LAWS) {
    md += `### ${state.name}
- **Laws:** ${state.laws.join(', ')}
- **Effective:** ${state.effectiveDate === 'pending' ? 'Pending' : state.effectiveDate}
- **Summary:** ${state.summary}
- [View full ${tool.name} compliance guide for ${state.name}](/compliance/${tool.slug}/${state.slug})

`
  }

  md += `---

*Source: [AIHireLaw](https://aihirelaw.com/compliance/${tool.slug}) - This is for informational purposes only and does not constitute legal advice.*
`
  
  return md
}

// Generate markdown for state overview pages
function generateStateMarkdown(stateSlug: string): string | null {
  const state = getStateBySlug(stateSlug) as typeof STATES_WITH_LAWS[number] | undefined
  if (!state || !('laws' in state)) return null
  
  let md = `# ${state.name} AI Hiring Law Compliance

${state.summary}

## Overview

- **State:** ${state.name} (${state.code})
- **Laws:** ${state.laws.join(', ')}
- **Effective Date:** ${state.effectiveDate === 'pending' ? 'Pending' : state.effectiveDate}

## AI Tools Covered

These AI hiring tools may require compliance in ${state.name}:

`
  
  for (const tool of AI_TOOLS) {
    md += `- [${tool.name}](/compliance/${tool.slug}/${state.slug}) (${tool.category})\n`
  }

  md += `
---

*Source: [AIHireLaw](https://aihirelaw.com/compliance/state/${state.slug}) - This is for informational purposes only and does not constitute legal advice.*
`
  
  return md
}

// Generate main compliance overview
function generateComplianceOverview(): string {
  let md = `# AI Hiring Compliance Guide

Navigate AI hiring laws with confidence. AIHireLaw helps employers stay compliant with state and local regulations.

## States with AI Hiring Laws

`
  
  for (const state of STATES_WITH_LAWS) {
    md += `### ${state.name}
- **Laws:** ${state.laws.join(', ')}
- **Effective:** ${state.effectiveDate === 'pending' ? 'Pending' : state.effectiveDate}
- **Summary:** ${state.summary}

`
  }

  md += `## AI Tools We Cover

`
  
  const categories = [...new Set(AI_TOOLS.map(t => t.category))]
  for (const category of categories) {
    const tools = AI_TOOLS.filter(t => t.category === category)
    md += `### ${category}
${tools.map(t => `- [${t.name}](/compliance/${t.slug})`).join('\n')}

`
  }

  md += `---

*Source: [AIHireLaw](https://aihirelaw.com/compliance) - This is for informational purposes only and does not constitute legal advice.*
`
  
  return md
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params
  
  let markdown: string | null = null
  
  if (!slug || slug.length === 0) {
    // /api/markdown or /api/markdown/compliance
    markdown = generateComplianceOverview()
  } else if (slug[0] === 'compliance') {
    if (slug.length === 1) {
      // /api/markdown/compliance
      markdown = generateComplianceOverview()
    } else if (slug.length === 2) {
      // /api/markdown/compliance/[tool]
      markdown = generateToolMarkdown(slug[1])
    } else if (slug.length === 3) {
      if (slug[1] === 'state') {
        // /api/markdown/compliance/state/[state]
        markdown = generateStateMarkdown(slug[2])
      } else {
        // /api/markdown/compliance/[tool]/[state]
        markdown = generateToolStateMarkdown(slug[1], slug[2])
      }
    }
  } else if (slug.length === 1) {
    // Try as tool
    markdown = generateToolMarkdown(slug[0])
    if (!markdown) {
      // Try as state
      markdown = generateStateMarkdown(slug[0])
    }
  } else if (slug.length === 2) {
    // /api/markdown/[tool]/[state]
    markdown = generateToolStateMarkdown(slug[0], slug[1])
  }
  
  if (!markdown) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 })
  }
  
  return new NextResponse(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
