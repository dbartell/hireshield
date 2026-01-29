import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Mail, Users, Shield } from "lucide-react"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', user?.id)
    .single()

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and organization settings</p>
        </div>

        <div className="space-y-6">
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
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <div className="font-semibold text-blue-900">Free Trial</div>
                  <div className="text-sm text-blue-700">14 days remaining</div>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
