import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { stripe, PRICES } from '@/lib/stripe'

// Use admin client to create users
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { email, company, states, tools, riskScore } = await req.json()

    if (!email || !company) {
      return NextResponse.json({ error: 'Email and company required' }, { status: 400 })
    }

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email === email)

    let userId: string

    if (existingUser) {
      // User exists - just redirect to login
      return NextResponse.json({ 
        error: 'Account already exists',
        redirect: '/login?message=Account exists, please sign in'
      }, { status: 409 })
    }

    // Create user with a temporary random password (they'll set it after checkout)
    const tempPassword = crypto.randomUUID()
    
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true, // Auto-confirm email since they just gave it to us
      user_metadata: {
        company_name: company,
        source: 'scorecard',
        needs_password_reset: true,
      },
    })

    if (authError || !authData.user) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
    }

    userId = authData.user.id

    // Create organization
    const { error: orgError } = await supabaseAdmin
      .from('organizations')
      .insert({
        id: userId,
        name: company,
        states: states || [],
        plan: 'free',
      })

    if (orgError) {
      console.error('Org error:', orgError)
      // Continue anyway - org will be created on first login if needed
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

    // Update lead with user_id if exists
    await supabaseAdmin
      .from('leads')
      .update({ user_id: userId, converted_at: new Date().toISOString() })
      .eq('email', email)

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email,
      name: company,
      metadata: {
        supabase_user_id: userId,
      },
    })

    // Save Stripe customer ID to org
    await supabaseAdmin
      .from('organizations')
      .update({ stripe_customer_id: customer.id })
      .eq('id', userId)

    // Create checkout session for trial
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: PRICES.PILOT,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          supabase_user_id: userId,
        },
      },
      success_url: `${req.nextUrl.origin}/set-password?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/scorecard?checkout=cancelled`,
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Scorecard signup error:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}
