import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { stripe } from '@/lib/stripe'
import { trackServerEvent } from '@/lib/analytics'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { sessionId, userId: directUserId, password, isTrial } = await req.json()

    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    let userId: string | null = null

    // Trial flow - user ID provided directly
    if (isTrial && directUserId) {
      // Verify the user exists and needs password reset
      const { data: { user }, error } = await supabaseAdmin.auth.admin.getUserById(directUserId)
      
      if (error || !user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      if (!user.user_metadata?.needs_password_reset) {
        return NextResponse.json({ error: 'Password already set' }, { status: 400 })
      }

      userId = directUserId
    }
    // Stripe checkout flow (including guest checkout)
    else if (sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      console.log('Session retrieved:', { customer: session.customer, customer_email: session.customer_email })

      if (!session.customer) {
        return NextResponse.json({ error: 'Invalid session' }, { status: 400 })
      }

      const customer = await stripe.customers.retrieve(session.customer as string)
      console.log('Customer retrieved:', { id: customer.id, deleted: customer.deleted, email: 'email' in customer ? customer.email : 'N/A', metadata: 'metadata' in customer ? customer.metadata : 'N/A' })
      
      if (customer.deleted) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 400 })
      }

      // Get email from customer (type narrowing for non-deleted customer)
      const customerEmail = (customer as { email?: string | null }).email
      const customerMetadata = (customer as { metadata?: Record<string, string> }).metadata

      // Check if user already exists in metadata
      userId = customerMetadata?.supabase_user_id || null
      console.log('Initial userId from metadata:', userId)

      // Guest checkout - need to create user account
      if (!userId && customerEmail) {
        const email = customerEmail
        console.log('Guest checkout flow, email:', email)

        // Check if user exists by email (shouldn't, but just in case)
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
        const existingUser = existingUsers?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase())

        if (existingUser) {
          // User already exists - update their org subscription status and return
          await supabaseAdmin
            .from('organizations')
            .update({ subscription_status: 'active' })
            .eq('id', existingUser.id)

          // Update Stripe customer with user ID
          await stripe.customers.update(customer.id, {
            metadata: {
              ...customerMetadata,
              supabase_user_id: existingUser.id,
            },
          })

          return NextResponse.json({ 
            success: true, 
            existingUser: true,
            message: 'Account already exists. Please sign in.',
          })
        } else {
          // Get quiz data from leads table
          console.log('=== SET-PASSWORD: Looking up lead ===')
          console.log('Looking for lead with email:', email.toLowerCase())
          
          const { data: lead, error: leadError } = await supabaseAdmin
            .from('leads')
            .select('*')
            .eq('email', email.toLowerCase())
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

          console.log('Lead lookup result:', lead)
          console.log('Lead lookup error:', leadError)

          // Also try to get quiz data from Stripe metadata as fallback
          const stripeQuizStates = customerMetadata?.quiz_states ? JSON.parse(customerMetadata.quiz_states) : null
          const stripeQuizTools = customerMetadata?.quiz_tools ? JSON.parse(customerMetadata.quiz_tools) : null
          const stripeQuizRiskScore = customerMetadata?.quiz_risk_score ? parseInt(customerMetadata.quiz_risk_score) : null

          console.log('Stripe metadata quiz_states:', stripeQuizStates)
          console.log('Stripe metadata quiz_tools:', stripeQuizTools)
          console.log('Stripe metadata quiz_risk_score:', stripeQuizRiskScore)

          // Create user with password
          const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
              company_name: lead?.company_name || customer.name || undefined,
              source: 'guest_checkout',
            },
          })

          if (authError || !authData.user) {
            console.error('Create user error:', authError)
            return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
          }

          userId = authData.user.id
          console.log('Created user with ID:', userId)

          // Create organization with quiz data (prefer leads table, fallback to Stripe metadata)
          const orgData = {
            id: userId,
            name: lead?.company_name || customer.name || 'My Company',
            states: lead?.states || stripeQuizStates || [],
            quiz_tools: lead?.tools || stripeQuizTools || [],
            quiz_usages: lead?.usages || [],
            quiz_risk_score: lead?.risk_score ?? stripeQuizRiskScore ?? null,
            employee_count: lead?.employee_count || null,
            industry: lead?.industry || null,
            size: lead?.employee_count || null, // Also save as 'size' for settings display
            subscription_status: 'active',
          }
          console.log('=== SET-PASSWORD: Creating organization ===')
          console.log('Org data:', orgData)

          const { error: orgError } = await supabaseAdmin
            .from('organizations')
            .insert(orgData)

          if (orgError) {
            console.error('Create org error:', orgError)
            // Continue anyway - user is created
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

          // Mark lead as converted
          if (lead) {
            await supabaseAdmin
              .from('leads')
              .update({ user_id: userId, converted_at: new Date().toISOString() })
              .eq('email', email.toLowerCase())
          }

          // Update Stripe customer with user ID
          await stripe.customers.update(customer.id, {
            metadata: {
              ...customerMetadata,
              supabase_user_id: userId,
            },
          })

          // Track conversion
          trackServerEvent('guest_checkout_converted', { 
            source: 'guest_checkout',
            hasLeadData: !!lead,
          }, userId, userId)

          // User already has password set, return success
          return NextResponse.json({ success: true, newUser: true })
        }
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 })
    }

    // Update user password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password,
      user_metadata: {
        needs_password_reset: false,
      },
    })

    if (updateError) {
      console.error('Update password error:', updateError)
      return NextResponse.json({ error: 'Failed to set password' }, { status: 500 })
    }

    // Track trial started analytics
    if (isTrial) {
      trackServerEvent('trial_started', { source: 'scorecard' }, userId, userId)
    }

    // For trial users, sign them in automatically
    if (isTrial) {
      // Get user email for auto-login
      const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(userId)
      
      if (user?.email) {
        // Sign in the user
        const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
          email: user.email,
          password,
        })

        if (!signInError && signInData.session) {
          // Return session token for client-side authentication
          return NextResponse.json({ 
            success: true,
            session: signInData.session,
          })
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Set password error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
