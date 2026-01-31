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

// Price IDs - set these after creating products in Stripe Dashboard
export const PRICES = {
  PILOT: process.env.STRIPE_PRICE_PILOT || 'price_pilot', // $99/mo for first 10
  MONTHLY: process.env.STRIPE_PRICE_MONTHLY || 'price_monthly', // $199/mo
  ANNUAL: process.env.STRIPE_PRICE_ANNUAL || 'price_annual', // $1,990/yr (save 2 months)
} as const

export type PriceId = (typeof PRICES)[keyof typeof PRICES]
