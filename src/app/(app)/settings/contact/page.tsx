"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, Save, Phone } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function ContactSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    hr_email: '',
    candidate_email: '',
    hr_phone: '',
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    const { data: org } = await supabase
      .from('organizations')
      .select('hr_email, candidate_email, hr_phone')
      .eq('id', user.id)
      .single()

    if (org) {
      setFormData({
        hr_email: org.hr_email || '',
        candidate_email: org.candidate_email || '',
        hr_phone: org.hr_phone || '',
      })
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    await supabase
      .from('organizations')
      .update({
        hr_email: formData.hr_email || null,
        candidate_email: formData.candidate_email || null,
        hr_phone: formData.hr_phone || null,
      })
      .eq('id', user.id)

    setSaving(false)
    router.push('/settings')
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/settings" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Settings
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Contact Settings</h1>
          <p className="text-gray-600">Configure HR contact information for templates and candidate communications</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Contact Information
            </CardTitle>
            <CardDescription>
              These contacts will be used in disclosure pages, consent forms, and other candidate-facing documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HR Department Email
              </label>
              <input
                type="email"
                value={formData.hr_email}
                onChange={(e) => setFormData(prev => ({ ...prev, hr_email: e.target.value }))}
                placeholder="hr@company.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Primary HR contact for compliance-related inquiries
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Candidate Inquiries Email
              </label>
              <input
                type="email"
                value={formData.candidate_email}
                onChange={(e) => setFormData(prev => ({ ...prev, candidate_email: e.target.value }))}
                placeholder="careers@company.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Where candidates can reach out about AI in your hiring process
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HR Phone Number (optional)
              </label>
              <input
                type="tel"
                value={formData.hr_phone}
                onChange={(e) => setFormData(prev => ({ ...prev, hr_phone: e.target.value }))}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Optional phone contact for urgent compliance matters
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link href="/settings">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Usage Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Where these contacts appear</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Public disclosure page contact section</li>
            <li>• Candidate consent forms</li>
            <li>• Generated compliance documents</li>
            <li>• Email templates for candidate communications</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
