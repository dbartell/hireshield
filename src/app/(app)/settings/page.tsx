import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Mail, Users, Shield, ChevronRight, Phone } from "lucide-react"
import Link from "next/link"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', user?.id)
    .single()

  // Get user's membership info
  const { data: membership } = await supabase
    .from('organization_members')
    .select('role')
    .eq('user_id', user?.id)
    .single()

  // Get team member count
  const { count: memberCount } = await supabase
    .from('organization_members')
    .select('*', { count: 'exact', head: true })
    .eq('organization_id', membership?.role === 'owner' ? user?.id : null)

  const canManageTeam = ['owner', 'admin'].includes(membership?.role || '')
  const teamSize = memberCount || 1

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and organization settings</p>
        </div>

        <div className="space-y-6">
          {/* Team Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team
              </CardTitle>
              <CardDescription>Manage your team members and invitations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{teamSize}</div>
                  <div className="text-sm text-gray-500">Team member{teamSize !== 1 ? 's' : ''}</div>
                </div>
                <Link href="/settings/team">
                  <Button variant={canManageTeam ? "default" : "outline"} className="gap-2">
                    {canManageTeam ? 'Manage Team' : 'View Team'}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Organization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Organization
              </CardTitle>
              <CardDescription>Your organization details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Company Name</label>
                  <div className="text-lg">{org?.name || 'Not set'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Industry</label>
                  <div className="text-lg capitalize">{org?.industry || 'Not set'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Company Size</label>
                  <div className="text-lg capitalize">{org?.size || 'Not set'}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Account
              </CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <div className="text-lg">{user?.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Account ID</label>
                  <div className="text-sm text-gray-500 font-mono">{user?.id}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Settings
              </CardTitle>
              <CardDescription>HR contact information for templates and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">HR Email</label>
                  <div className="text-lg">{org?.hr_email || user?.email || 'Not set'}</div>
                  <p className="text-xs text-gray-500 mt-1">Used in candidate disclosure and consent templates</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Candidate Inquiries Email</label>
                  <div className="text-lg">{org?.candidate_email || org?.hr_email || 'Not set'}</div>
                  <p className="text-xs text-gray-500 mt-1">Where candidates can reach out about AI hiring</p>
                </div>
                <div className="pt-2">
                  <Link href="/settings/contact">
                    <Button variant="outline" size="sm" className="gap-2">
                      Edit Contact Settings
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Subscription
              </CardTitle>
              <CardDescription>Your current plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`flex items-center justify-between p-4 rounded-lg ${
                org?.subscription_status === 'active' 
                  ? 'bg-green-50' 
                  : 'bg-gray-50'
              }`}>
                <div>
                  <div className={`font-semibold ${
                    org?.subscription_status === 'active' 
                      ? 'text-green-900' 
                      : 'text-gray-900'
                  }`}>
                    {org?.subscription_status === 'active' ? 'Subscribed' : 'No active subscription'}
                  </div>
                  <div className={`text-sm ${
                    org?.subscription_status === 'active' 
                      ? 'text-green-700' 
                      : 'text-gray-600'
                  }`}>
                    {org?.subscription_status === 'active' 
                      ? 'Full access to all features' 
                      : 'Upgrade to unlock all features'}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  org?.subscription_status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {org?.subscription_status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
