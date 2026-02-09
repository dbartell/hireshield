import { NextRequest, NextResponse } from 'next/server'
import { stripe, PRICES } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// One-time purchase status mapping
const ONE_TIME_STATUS_MAP: Record<string, string> = {
  [process.env.STRIPE_PRICE_IL_ONLY || '']: 'il_only',
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.supabase_user_id || 
          (await getCustomerUserId(session.customer as string))

        if (userId) {
          // Check if this is a one-time payment or subscription
          if (session.mode === 'payment') {
            // One-time payment (e.g., IL-only)
            const priceId = session.metadata?.price_id || ''
            const status = ONE_TIME_STATUS_MAP[priceId] || 'lifetime'
            
            // Calculate expiry (1 year from now for updates access)
            const expiresAt = new Date()
            expiresAt.setFullYear(expiresAt.getFullYear() + 1)
            
            await supabaseAdmin.from('organizations').update({
              subscription_status: status,
              subscription_started_at: new Date().toISOString(),
              one_time_purchase: true,
              one_time_expires_at: expiresAt.toISOString(),
            }).eq('id', userId)
          } else {
            // Subscription payment
            await supabaseAdmin.from('organizations').update({
              subscription_status: 'active',
              subscription_id: session.subscription as string,
              subscription_started_at: new Date().toISOString(),
            }).eq('id', userId)
          }
        }
        // Note: For guest checkout, user may not exist yet - set-password will handle org creation
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.supabase_user_id ||
          (await getCustomerUserId(subscription.customer as string))

        if (userId) {
          const periodEnd = (subscription as unknown as { current_period_end?: number }).current_period_end
          await supabaseAdmin.from('organizations').update({
            subscription_status: subscription.status,
            ...(periodEnd && { subscription_current_period_end: new Date(periodEnd * 1000).toISOString() }),
          }).eq('id', userId)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.supabase_user_id ||
          (await getCustomerUserId(subscription.customer as string))

        if (userId) {
          await supabaseAdmin.from('organizations').update({
            subscription_status: 'cancelled',
            subscription_ended_at: new Date().toISOString(),
          }).eq('id', userId)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const userId = await getCustomerUserId(invoice.customer as string)

        if (userId) {
          await supabaseAdmin.from('organizations').update({
            subscription_status: 'past_due',
          }).eq('id', userId)
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function getCustomerUserId(customerId: string): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from('organizations')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()
  return data?.id || null
}
