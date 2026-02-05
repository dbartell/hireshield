// Paywall logic for trial users
// Triggers after first document generated OR trial day 3

export interface PaywallStatus {
  shouldShowPaywall: boolean
  reason: 'document_generated' | 'trial_day_3' | null
  trialDaysRemaining: number
  documentsGenerated: number
  isSubscribed: boolean
}

// Check if user should see the paywall
export function checkPaywallStatus(params: {
  trialStartedAt: Date | null
  documentsGenerated: number
  subscriptionStatus: string | null
}): PaywallStatus {
  const { trialStartedAt, documentsGenerated, subscriptionStatus } = params

  // Only active subscribers get access - no trial
  if (subscriptionStatus === 'active') {
    return {
      shouldShowPaywall: false,
      reason: null,
      trialDaysRemaining: 0,
      documentsGenerated,
      isSubscribed: true,
    }
  }

  // Not subscribed = show paywall (no trial)
  return {
    shouldShowPaywall: true,
    reason: null,
    trialDaysRemaining: 0,
    documentsGenerated,
    isSubscribed: false,
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
    title: 'Subscribe to Get Compliant',
    description: 'Unlock your compliance dashboard, generate documents, and track your progress.',
    ctaText: 'Subscribe Now',
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
