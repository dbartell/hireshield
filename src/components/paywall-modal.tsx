"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { X, Sparkles, Check, Loader2, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PaywallStatus, getPaywallMessage, getPricingInfo, isIllinoisOnly } from "@/lib/paywall"
import { PRICES } from "@/lib/stripe"
import { trackEvent } from "@/components/GoogleAnalytics"

interface PaywallModalProps {
  status: PaywallStatus
  onClose?: () => void
  onUpgrade?: () => void
  isGuest?: boolean
}

// Features for IL-only (one-time)
const IL_FEATURES = [
  "All required disclosure notices",
  "Job posting templates",
  "Employee handbook policy",
  "4-year recordkeeping system",
  "Downloadable compliance packet",
  "1 year of regulatory updates",
  "30-day email support",
]

// Features for multi-state (subscription)
const MULTI_STATE_FEATURES = [
  "Unlimited compliance documents",
  "IL + CO + CA + NYC coverage",
  "Impact assessments (Colorado)",
  "Team training & certificates",
  "Consent tracking",
  "Annual renewal reminders",
  "Priority support",
]

const ONBOARD_STORAGE_KEY = 'hireshield_onboard_data'

export function PaywallModal({ status, onClose, onUpgrade, isGuest }: PaywallModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [guestEmail, setGuestEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const message = getPaywallMessage(status)
  
  // Get pricing based on selected states
  const states = status.states || []
  const pricing = getPricingInfo(states)
  const features = isIllinoisOnly(states) ? IL_FEATURES : MULTI_STATE_FEATURES

  // Pre-fill email from localStorage for guests
  useEffect(() => {
    if (isGuest) {
      const storedData = localStorage.getItem(ONBOARD_STORAGE_KEY)
      if (storedData) {
        try {
          const data = JSON.parse(storedData)
          if (data.email) setGuestEmail(data.email)
        } catch (e) {
          // ignore
        }
      }
    }
  }, [isGuest])

  const handleUpgrade = async () => {
    setLoading(true)
    setError(null)

    // Guest checkout flow
    if (isGuest) {
      if (!guestEmail) {
        setError('Please enter your email')
        setLoading(false)
        return
      }

      try {
        // Get quiz data from localStorage to pass along
        const storedQuizData = localStorage.getItem(ONBOARD_STORAGE_KEY)
        let quizData: { states?: string[], tools?: string[], riskScore?: number, company?: string } = {}
        if (storedQuizData) {
          try {
            const parsed = JSON.parse(storedQuizData)
            quizData = {
              states: parsed.states,
              tools: parsed.tools,
              riskScore: parsed.riskScore,
              company: parsed.company,
            }
          } catch (e) { /* ignore */ }
        }

        // Use the correct price ID based on state selection
        const priceId = pricing.priceId === 'IL_ONLY' ? PRICES.IL_ONLY : PRICES.STARTER

        const res = await fetch('/api/checkout/guest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: guestEmail, priceId, ...quizData }),
        })

        const data = await res.json()

        if (!res.ok) {
          if (data.existingUser) {
            setError('Account exists. Please sign in first.')
            setLoading(false)
            return
          }
          setError(data.error || 'Failed to start checkout')
          setLoading(false)
          return
        }

        // Track checkout initiation
        trackEvent('begin_checkout', 'conversion', 'guest_checkout')
        
        // Redirect to Stripe checkout
        window.location.href = data.url
      } catch (err) {
        setError('Something went wrong. Please try again.')
        setLoading(false)
      }
      return
    }
    
    if (onUpgrade) {
      onUpgrade()
    } else {
      // Default: go to billing page
      router.push('/settings/billing?upgrade=true')
    }
  }

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  // Determine if modal is dismissable
  const canDismiss = status.trialDaysRemaining > 0 && status.documentsGenerated < 3

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className={`px-6 py-8 text-center ${
          message.urgency === 'high' 
            ? 'bg-gradient-to-br from-orange-500 to-red-600' 
            : 'bg-gradient-to-br from-blue-600 to-indigo-700'
        } text-white relative`}>
          {canDismiss && (
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            {status.reason === 'document_generated' ? (
              <Sparkles className="w-8 h-8" />
            ) : (
              <Shield className="w-8 h-8" />
            )}
          </div>
          
          <h2 className="text-2xl font-bold mb-2">{message.title}</h2>
          <p className="text-white/90">{message.description}</p>
        </div>

        {/* Pricing */}
        <div className="px-6 pt-6 pb-2 text-center border-b">
          <div className="text-4xl font-bold text-gray-900">
            {pricing.price}
            <span className="text-lg font-normal text-gray-500 ml-1">{pricing.label}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{pricing.description}</p>
        </div>

        {/* Features */}
        <div className="px-6 py-4">
          <p className="text-sm font-medium text-gray-700 mb-3">What's included:</p>
          <ul className="space-y-2">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="px-6 pb-6 space-y-3">
          {isGuest && (
            <div className="space-y-2">
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
            </div>
          )}

          <Button
            onClick={handleUpgrade}
            disabled={loading || (isGuest && !guestEmail)}
            className="w-full h-12 text-base"
            variant="cta"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : pricing.isOneTime ? (
              `Get Compliant — ${pricing.price}`
            ) : (
              `Start Now — ${pricing.price}${pricing.label}`
            )}
          </Button>

          {canDismiss && (
            <button
              onClick={handleClose}
              className="w-full text-sm text-gray-500 hover:text-gray-700"
            >
              Maybe later
            </button>
          )}

          <p className="text-xs text-center text-gray-500">
            {isGuest ? (
              "Create your account after checkout"
            ) : status.trialDaysRemaining > 0 ? (
              `${status.trialDaysRemaining} days left in your trial`
            ) : (
              "Your compliance progress will be saved"
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

// Hook to manage paywall state
export function usePaywall() {
  const [showPaywall, setShowPaywall] = useState(false)
  const [paywallStatus, setPaywallStatus] = useState<PaywallStatus | null>(null)

  const triggerPaywall = (status: PaywallStatus) => {
    setPaywallStatus(status)
    setShowPaywall(true)
  }

  const dismissPaywall = () => {
    setShowPaywall(false)
  }

  return {
    showPaywall,
    paywallStatus,
    triggerPaywall,
    dismissPaywall,
  }
}
