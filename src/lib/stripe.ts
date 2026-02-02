import Stripe from 'stripe'

// Initialize lazily to avoid build-time errors
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }
    _stripe = new Stripe(key, {
      apiVersion: '2026-01-28.clover',
      typescript: true,
    })
  }
  return _stripe
}

// For backwards compatibility - use getStripe() in new code
export const stripe = {
  get checkout() { return getStripe().checkout },
  get customers() { return getStripe().customers },
  get subscriptions() { return getStripe().subscriptions },
  get billingPortal() { return getStripe().billingPortal },
  get webhooks() { return getStripe().webhooks },
}

// Price IDs from Stripe Dashboard
export const PRICES = {
  STARTER: process.env.STRIPE_PRICE_STARTER!,
  GROWTH: process.env.STRIPE_PRICE_GROWTH!,
  SCALE: process.env.STRIPE_PRICE_SCALE!,
  ENTERPRISE: process.env.STRIPE_PRICE_ENTERPRISE!,
  // Aliases for backwards compat
  PILOT: process.env.STRIPE_PRICE_STARTER!,
} as const

export type PriceId = (typeof PRICES)[keyof typeof PRICES]
