import { NextRequest, NextResponse } from 'next/server'
import { stripe, PRICES } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { email, priceId = PRICES.PILOT, states, tools, riskScore, company } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase())

    if (existingUser) {
      return NextResponse.json({ 
        error: 'An account with this email already exists. Please sign in.',
        existingUser: true 
      }, { status: 400 })
    }

    // Check for existing Stripe customer
    const existingCustomers = await stripe.customers.list({ email, limit: 1 })
    let customerId = existingCustomers.data[0]?.id

    if (!customerId) {
      // Get company name from leads table as fallback
      const { data: lead } = await supabaseAdmin
        .from('leads')
        .select('company_name')
        .eq('email', email.toLowerCase())
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      // Build metadata object (Stripe doesn't accept undefined values)
      const metadata: Record<string, string> = { source: 'guest_checkout' }
      if (states) metadata.quiz_states = JSON.stringify(states)
      if (tools) metadata.quiz_tools = JSON.stringify(tools)
      if (riskScore !== undefined && riskScore !== null) metadata.quiz_risk_score = String(riskScore)

      const customer = await stripe.customers.create({
        email,
        name: company || lead?.company_name || undefined,
        metadata,
      })
      customerId = customer.id
    } else {
      // Update existing customer with quiz data if provided
      if (states || tools || riskScore !== undefined) {
        const updateMetadata: Record<string, string> = {}
        if (states) updateMetadata.quiz_states = JSON.stringify(states)
        if (tools) updateMetadata.quiz_tools = JSON.stringify(tools)
        if (riskScore !== undefined && riskScore !== null) updateMetadata.quiz_risk_score = String(riskScore)
        
        if (Object.keys(updateMetadata).length > 0) {
          await stripe.customers.update(customerId, {
            metadata: updateMetadata,
          })
        }
      }
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.nextUrl.origin}/set-password?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/quiz?checkout=cancelled`,
      allow_promotion_codes: true,
      metadata: {
        source: 'guest_checkout',
        email: email,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Guest checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
