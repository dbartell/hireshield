import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { stripe } from '@/lib/stripe'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { sessionId, password } = await req.json()

    if (!sessionId || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    // Get checkout session to find user
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session.customer) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 400 })
    }

    // Get customer to find user ID
    const customer = await stripe.customers.retrieve(session.customer as string)
    
    if (customer.deleted) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 400 })
    }

    const userId = customer.metadata?.supabase_user_id

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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Set password error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
