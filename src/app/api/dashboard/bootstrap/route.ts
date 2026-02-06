import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Bootstrap endpoint: create organization if missing, using quiz data from localStorage
export async function POST(req: NextRequest) {
  try {
    const { userId, email, quizData } = await req.json()

    console.log('=== BOOTSTRAP API ===')
    console.log('User ID:', userId)
    console.log('Email:', email)
    console.log('Quiz data from localStorage:', quizData)

    if (!userId) {
      console.log('No user ID provided')
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Check if organization already exists
    const { data: existingOrg, error: orgCheckError } = await supabaseAdmin
      .from('organizations')
      .select('id')
      .eq('id', userId)
      .single()

    console.log('Existing org check:', existingOrg, 'Error:', orgCheckError)

    if (existingOrg) {
      // Org exists but might be missing data - update it if we have quiz data
      if (quizData?.states?.length > 0 || quizData?.riskScore || quizData?.industry || quizData?.employeeCount) {
        const updates: Record<string, unknown> = {}
        
        // Only update fields that are empty/null
        const { data: currentOrg } = await supabaseAdmin
          .from('organizations')
          .select('states, quiz_risk_score, industry, size')
          .eq('id', userId)
          .single()
        
        if ((!currentOrg?.states || currentOrg.states.length === 0) && quizData?.states?.length > 0) {
          updates.states = quizData.states
        }
        if (currentOrg?.quiz_risk_score === null && quizData?.riskScore !== undefined) {
          updates.quiz_risk_score = quizData.riskScore
        }
        if (quizData?.tools?.length > 0) {
          updates.quiz_tools = quizData.tools
        }
        if (quizData?.company) {
          updates.name = quizData.company
        }
        // Sync industry and size if missing
        if (!currentOrg?.industry && quizData?.industry) {
          updates.industry = quizData.industry
        }
        if (!currentOrg?.size && quizData?.employeeCount) {
          updates.size = quizData.employeeCount
          updates.employee_count = quizData.employeeCount
        }
        
        if (Object.keys(updates).length > 0) {
          await supabaseAdmin
            .from('organizations')
            .update(updates)
            .eq('id', userId)
        }
      }
      
      // Ensure organization_members record exists (fixes existing users missing membership)
      const { data: existingMembership } = await supabaseAdmin
        .from('organization_members')
        .select('id')
        .eq('user_id', userId)
        .single()

      if (!existingMembership) {
        console.log('Creating missing organization_members record for existing org')
        await supabaseAdmin
          .from('organization_members')
          .insert({
            organization_id: userId,
            user_id: userId,
            role: 'owner',
            joined_at: new Date().toISOString(),
          })
      }
      
      return NextResponse.json({ success: true, action: 'updated' })
    }

    // Organization doesn't exist - create it
    // First try to get data from leads table
    let leadData = null
    if (email) {
      const { data: lead } = await supabaseAdmin
        .from('leads')
        .select('*')
        .eq('email', email.toLowerCase())
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      leadData = lead
    }

    // Merge lead data with quiz data (quiz data takes precedence)
    const states = quizData?.states?.length > 0 ? quizData.states : (leadData?.states || [])
    const tools = quizData?.tools?.length > 0 ? quizData.tools : (leadData?.tools || [])
    const riskScore = quizData?.riskScore ?? leadData?.risk_score ?? null
    const companyName = quizData?.company || leadData?.company_name || 'My Company'
    const industry = quizData?.industry || leadData?.industry || null
    const employeeCount = quizData?.employeeCount || leadData?.employee_count || null

    console.log('=== BOOTSTRAP: Creating org ===')
    console.log('States (final):', states)
    console.log('Tools (final):', tools)
    console.log('Risk Score (final):', riskScore)
    console.log('Company Name (final):', companyName)

    // Create organization
    const orgData = {
      id: userId,
      name: companyName,
      states,
      quiz_tools: tools,
      quiz_risk_score: riskScore,
      industry,
      size: employeeCount,
      employee_count: employeeCount,
      plan: 'trial',
      subscription_status: 'trialing', // Allows access during trial
      trial_started_at: new Date().toISOString(),
    }
    console.log('Inserting org:', orgData)

    const { error: orgError } = await supabaseAdmin
      .from('organizations')
      .insert(orgData)

    if (orgError) {
      console.error('Bootstrap org creation error:', orgError)
      return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 })
    }
    
    console.log('Org created successfully')

    // Also create user record if missing
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', userId)
      .single()

    if (!existingUser && email) {
      await supabaseAdmin
        .from('users')
        .insert({
          id: userId,
          org_id: userId,
          email,
          role: 'admin',
        })
    }

    // Create organization_members record for owner
    const { data: existingMembership } = await supabaseAdmin
      .from('organization_members')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!existingMembership) {
      console.log('Creating organization_members record')
      const { error: memberError } = await supabaseAdmin
        .from('organization_members')
        .insert({
          organization_id: userId,
          user_id: userId,
          role: 'owner',
          joined_at: new Date().toISOString(),
        })
      
      if (memberError) {
        console.error('Failed to create membership:', memberError)
        // Don't fail the whole request, but log it
      }
    }

    // Update lead as converted if exists
    if (leadData && email) {
      await supabaseAdmin
        .from('leads')
        .update({ user_id: userId, converted_at: new Date().toISOString() })
        .eq('email', email.toLowerCase())
    }

    return NextResponse.json({ success: true, action: 'created' })
  } catch (error) {
    console.error('Bootstrap error:', error)
    return NextResponse.json({ error: 'Bootstrap failed' }, { status: 500 })
  }
}
