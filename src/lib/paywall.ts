// Paywall logic for trial users
// Triggers after first document generated OR trial day 3

export interface PaywallStatus {
  shouldShowPaywall: boolean
  reason: 'document_generated' | 'trial_day_3' | null
  trialDaysRemaining: number
  documentsGenerated: number
  isSubscribed: boolean
  states?: string[] // Selected states from quiz
}

// Regulated states that require subscriptions (more complex requirements)
export const SUBSCRIPTION_STATES = ['CO', 'CA', 'NYC', 'MD'] as const

// Check if user qualifies for one-time IL-only pricing
export function isIllinoisOnly(states: string[]): boolean {
  return states.length === 1 && states[0] === 'IL'
}

// Get pricing info based on states
export function getPricingInfo(states: string[]): {
  isOneTime: boolean
  price: string
  priceId: string
  label: string
  description: string
} {
  if (isIllinoisOnly(states)) {
    return {
      isOneTime: true,
      price: '$199',
      priceId: 'IL_ONLY',
      label: 'one-time',
      description: 'Illinois compliance kit with 1 year of updates',
    }
  }
  return {
    isOneTime: false,
    price: '$199',
    priceId: 'STARTER',
    label: '/month',
    description: 'Multi-state compliance with ongoing support',
  }
}

// Check if user should see the paywall
export function checkPaywallStatus(params: {
  trialStartedAt: Date | null
  documentsGenerated: number
  subscriptionStatus: string | null
  states?: string[]
}): PaywallStatus {
  const { trialStartedAt, documentsGenerated, subscriptionStatus, states = [] } = params

  // Active subscribers or one-time purchasers get access
  if (subscriptionStatus === 'active' || subscriptionStatus === 'il_only' || subscriptionStatus === 'lifetime') {
    return {
      shouldShowPaywall: false,
      reason: null,
      trialDaysRemaining: 0,
      documentsGenerated,
      isSubscribed: true,
      states,
    }
  }

  // Not subscribed = show paywall (no trial)
  return {
    shouldShowPaywall: true,
    reason: null,
    trialDaysRemaining: 0,
    documentsGenerated,
    isSubscribed: false,
    states,
  }
}

// Get paywall message based on status
export function getPaywallMessage(status: PaywallStatus): {
  title: string
  description: string
  ctaText: string
  urgency: 'low' | 'medium' | 'high'
} {
  return {
    title: 'Upgrade Now',
    description: 'Unlock your compliance dashboard, generate documents, and track your progress.',
    ctaText: 'Upgrade Now',
    urgency: 'high',
  }
}

// Check if a specific action requires paywall check
export function requiresPaywallCheck(action: string): boolean {
  const paywallActions = [
    'generate_document',
    'invite_team',
    'download_certificate',
    'export_audit',
  ]
  return paywallActions.includes(action)
}
