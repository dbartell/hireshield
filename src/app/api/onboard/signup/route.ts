import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { trackServerEvent } from '@/lib/analytics'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { email, company, states, tools, usages, employeeCount, riskScore } = await req.json()

    if (!email || !company) {
      return NextResponse.json({ error: 'Email and company required' }, { status: 400 })
    }

    // Check if user already exists
    const { data: existingUserData, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = existingUserData?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase())
    
    console.log('Checking for existing user:', email, 'Found:', existingUser?.id || 'none', 'Total users:', existingUserData?.users?.length)

    if (existingUser) {
      // Send magic link for passwordless sign-in
      const { error: otpError } = await supabaseAdmin.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: `${req.nextUrl.origin}/auth/callback?redirect=/dashboard`,
        },
      })

      if (otpError) {
        console.error('Magic link error:', otpError)
        // Fall back to asking them to sign in
        return NextResponse.json({ 
          existingUser: true,
          email: email,
          magicLinkFailed: true,
        }, { status: 200 })
      }

      return NextResponse.json({ 
        existingUser: true,
        email: email,
        magicLinkSent: true,
      }, { status: 200 })
    }

    // Create user with a temp password (we'll return it for auto-login)
    const tempPassword = crypto.randomUUID()
    
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        company_name: company,
        source: 'onboard',
        needs_password_setup: true, // They should set a real password later
        quiz_risk_score: riskScore,
      },
    })

    if (authError || !authData.user) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
    }

    const userId = authData.user.id

    // Create organization with onboarding data
    const { error: orgError } = await supabaseAdmin
      .from('organizations')
      .insert({
        id: userId,
        name: company,
        states: states || [],
        quiz_tools: tools || [],
        quiz_usages: usages || [],
        quiz_risk_score: riskScore,
        employee_count: employeeCount || null,
        plan: 'trial',
        trial_started_at: new Date().toISOString(),
        documents_generated: 0,
      })

    if (orgError) {
      console.error('Org error:', orgError)
      // Continue anyway
    }

    // Create user record
    await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        org_id: userId,
        email: email,
        role: 'admin',
      })

    // Convert lead if exists
    await supabaseAdmin
      .from('leads')
      .update({ user_id: userId, converted_at: new Date().toISOString() })
      .eq('email', email)

    // Track signup
    trackServerEvent('signup_completed', { 
      source: 'onboard',
      riskScore,
      statesCount: states?.length || 0,
      toolsCount: tools?.length || 0,
    }, userId, userId)

    // Return email and temp password for client-side auto-login
    return NextResponse.json({ 
      success: true,
      email: email,
      tempPassword: tempPassword,
      userId: userId,
    })
  } catch (error) {
    console.error('Onboard signup error:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}
