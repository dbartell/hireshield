import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { trackServerEvent } from '@/lib/analytics'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { email, company, states, tools, usages, employeeCount, industry, riskScore } = await req.json()

    console.log('=== ONBOARD/LEAD API ===')
    console.log('Email:', email)
    console.log('Company:', company)
    console.log('States:', states)
    console.log('Tools:', tools)
    console.log('Risk Score:', riskScore)

    if (!email || !company) {
      console.log('Missing email or company')
      return NextResponse.json({ error: 'Email and company required' }, { status: 400 })
    }

    // Upsert lead - update if email exists, insert if new
    const leadData = {
      email: email.toLowerCase(),
      company_name: company,
      states: states || [],
      tools: tools || [],
      usages: usages || [],
      employee_count: employeeCount || null,
      industry: industry || null,
      risk_score: riskScore,
      source: 'onboard',
    }
    console.log('Upserting lead:', leadData)

    const { error: leadError } = await supabaseAdmin
      .from('leads')
      .upsert(leadData, {
        onConflict: 'email',
      })

    if (leadError) {
      console.error('Lead upsert error:', leadError)
      // Don't fail - still let them continue
    } else {
      console.log('Lead upserted successfully')
    }

    // Track event
    trackServerEvent('lead_captured', { 
      source: 'onboard',
      riskScore,
      statesCount: states?.length || 0,
      toolsCount: tools?.length || 0,
      employeeCount,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Lead capture error:', error)
    // Still return success - don't block the user
    return NextResponse.json({ success: true })
  }
}
