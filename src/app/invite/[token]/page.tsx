'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, CheckCircle, XCircle, Loader2, LogIn, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { getRoleLabel, getRoleDescription } from '@/lib/permissions'
import type { MemberRole } from '@/types'

interface InviteDetails {
  email: string
  role: Exclude<MemberRole, 'owner'>
  expires_at: string
  organization?: {
    name: string
  }
}

export default function InviteAcceptPage({ 
  params 
}: { 
  params: Promise<{ token: string }> 
}) {
  const { token } = use(params)
  const router = useRouter()
  const [invite, setInvite] = useState<InviteDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [errorCode, setErrorCode] = useState('')

  useEffect(() => {
    async function fetchInvite() {
      try {
        const res = await fetch(`/api/invite/${token}`)
        const data = await res.json()
        
        if (!res.ok) {
          setError(data.error || 'Invalid invite')
          return
        }
        
        setInvite(data.invite)
      } catch (err) {
        setError('Failed to load invite')
      } finally {
        setLoading(false)
      }
    }
    
    fetchInvite()
  }, [token])

  const handleAccept = async () => {
    setAccepting(true)
    setError('')
    setErrorCode('')

    try {
      const res = await fetch(`/api/invite/${token}`, {
        method: 'POST',
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to accept invite')
        setErrorCode(data.code || '')
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push(data.redirect || '/dashboard')
      }, 2000)
    } catch (err) {
      setError('Failed to accept invite')
    } finally {
      setAccepting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading invite...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error && !invite) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <XCircle className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Invite</h2>
            <p className="text-gray-600 text-center mb-6">{error}</p>
            <Link href="/login">
              <Button>Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to the team!</h2>
            <p className="text-gray-600 text-center mb-2">
              You&apos;ve successfully joined {invite?.organization?.name || 'the organization'}.
            </p>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <CardTitle className="text-2xl">You&apos;re Invited!</CardTitle>
          <CardDescription>
            Join {invite?.organization?.name || 'the team'} on HireShield
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Invite Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Organization</div>
                <div className="font-medium text-gray-900">
                  {invite?.organization?.name || 'Unknown Organization'}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Your Role</div>
                <div className="font-medium text-gray-900">{getRoleLabel(invite?.role || 'member')}</div>
                <div className="text-sm text-gray-500">{getRoleDescription(invite?.role || 'member')}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Invited Email</div>
                <div className="font-medium text-gray-900">{invite?.email}</div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
              {error}
              
              {/* Special handling for auth errors */}
              {errorCode === 'UNAUTHORIZED' && (
                <div className="mt-3 flex gap-2">
                  <Link href={`/login?redirect=/invite/${token}`}>
                    <Button size="sm" variant="outline" className="gap-1">
                      <LogIn className="w-4 h-4" />
                      Log In
                    </Button>
                  </Link>
                  <Link href={`/signup?redirect=/invite/${token}&email=${encodeURIComponent(invite?.email || '')}`}>
                    <Button size="sm" variant="outline" className="gap-1">
                      <UserPlus className="w-4 h-4" />
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
              
              {errorCode === 'EMAIL_MISMATCH' && (
                <div className="mt-3">
                  <Link href={`/login?redirect=/invite/${token}`}>
                    <Button size="sm" variant="outline">
                      Log in with {invite?.email}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Accept Button */}
          <Button
            onClick={handleAccept}
            disabled={accepting}
            className="w-full"
            size="lg"
          >
            {accepting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Joining...
              </>
            ) : (
              'Accept Invite'
            )}
          </Button>

          <p className="text-center text-sm text-gray-500 mt-4">
            By accepting, you agree to our{' '}
            <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
