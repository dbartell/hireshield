"use client"

import { Suspense } from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertCircle, CheckCircle, PartyPopper } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

function SetPasswordForm() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isTrial, setIsTrial] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    const trialParam = searchParams.get('trial')
    const userIdParam = searchParams.get('user_id')

    // New trial flow - no Stripe checkout required
    if (trialParam === 'true' && userIdParam) {
      setIsTrial(true)
      setUserId(userIdParam)
      // Get user email from API
      fetch(`/api/verify-user?user_id=${userIdParam}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setError(data.error)
          } else {
            setUserEmail(data.email)
          }
          setVerifying(false)
        })
        .catch(() => {
          setError('Failed to verify user')
          setVerifying(false)
        })
    } else if (sessionId) {
      // Legacy Stripe checkout flow
      fetch(`/api/verify-checkout?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setError(data.error)
          } else {
            setUserEmail(data.email)
          }
          setVerifying(false)
        })
        .catch(() => {
          setError('Failed to verify checkout')
          setVerifying(false)
        })
    } else {
      setError('No session found')
      setVerifying(false)
    }
  }, [searchParams])

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      setLoading(false)
      return
    }

    try {
      const sessionId = searchParams.get('session_id')
      const res = await fetch('/api/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId,
          userId: userId,
          password,
          isTrial,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to set password')
        setLoading(false)
        return
      }

      // Existing user - redirect to login
      if (data.existingUser) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/login?email=' + encodeURIComponent(userEmail || '') + '&message=Account exists. Please sign in.')
        }, 1500)
        return
      }

      // New user from guest checkout - sign them in
      if (data.newUser && userEmail) {
        const supabase = createClient()
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: userEmail,
          password,
        })
        
        if (signInError) {
          console.error('Auto sign-in failed:', signInError)
          setTimeout(() => {
            router.push('/login?email=' + encodeURIComponent(userEmail) + '&message=Account created! Please sign in.')
          }, 1500)
          return
        }
        
        setSuccess(true)
        setTimeout(() => {
          router.push('/dashboard?welcome=true')
        }, 1500)
        return
      }

      setSuccess(true)
      
      // For trial users, sign them in and go to dashboard
      if (isTrial && userEmail) {
        const supabase = createClient()
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: userEmail,
          password,
        })
        
        if (signInError) {
          console.error('Auto sign-in failed:', signInError)
          // Fall back to login page
          setTimeout(() => {
            router.push('/login?email=' + encodeURIComponent(userEmail) + '&message=Password set! Please sign in.')
          }, 1500)
          return
        }
        
        // Successfully signed in - go to dashboard
        setTimeout(() => {
          router.push('/dashboard?welcome=true')
        }, 1500)
      } else {
        // Non-trial flow - redirect to login
        setTimeout(() => {
          router.push('/login?message=Password set! Please sign in.')
        }, 2000)
      }
    } catch {
      setError('Something went wrong')
      setLoading(false)
    }
  }

  if (verifying) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">
            {isTrial ? 'Setting up your account...' : 'Verifying your payment...'}
          </p>
        </CardContent>
      </Card>
    )
  }

  if (success) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PartyPopper className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">You&apos;re all set!</h2>
          <p className="text-gray-600 mb-4">
            {isTrial ? 'Taking you to your dashboard...' : 'Redirecting you to login...'}
          </p>
          <Loader2 className="w-5 h-5 animate-spin mx-auto text-gray-400" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className={`w-16 h-16 ${isTrial ? 'bg-blue-100' : 'bg-green-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
          {isTrial ? (
            <PartyPopper className="w-8 h-8 text-blue-600" />
          ) : (
            <CheckCircle className="w-8 h-8 text-green-600" />
          )}
        </div>
        <CardTitle>{isTrial ? 'Almost there!' : 'Payment successful!'}</CardTitle>
        <CardDescription>
          {userEmail ? (
            <>Set a password for <strong>{userEmail}</strong></>
          ) : (
            'Create your password to access your account'
          )}
          {/* Trial messaging removed - paid only */}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && !userEmail ? (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
            <Link href="/login">
              <Button variant="outline">Go to login</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSetPassword} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Setting password...
                </>
              ) : (
                'Set password & continue'
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

function LoadingFallback() {
  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-6 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-gray-600">Loading...</p>
      </CardContent>
    </Card>
  )
}

export default function SetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <Suspense fallback={<LoadingFallback />}>
        <SetPasswordForm />
      </Suspense>
    </div>
  )
}
