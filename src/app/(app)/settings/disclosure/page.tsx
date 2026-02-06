"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Globe, Eye, Save, Loader2, ExternalLink, Plus, Trash2, 
  Palette, FileText, Bot, CheckCircle, Link, Sparkles,
  BarChart3, Copy, Check
} from "lucide-react"
import { 
  getDisclosurePage, 
  saveDisclosurePage, 
  togglePublishDisclosurePage,
  generateDisclosureContent,
  checkSlugAvailability,
  getDisclosureAnalytics
} from "@/lib/actions/disclosure"

interface Tool {
  name: string
  purpose: string
  evaluates: string
  stages: string
}

interface DisclosurePage {
  id: string
  slug: string
  is_published: boolean
  logo_url: string | null
  brand_color: string
  header_text: string | null
  intro_text: string | null
  contact_email: string
  rights_section_enabled: boolean
  rights_custom_text: string | null
  bias_audit_section_enabled: boolean
  bias_audit_url: string | null
  bias_audit_date: string | null
  bias_audit_auditor: string | null
  custom_tools: Tool[]
  use_audit_tools: boolean
  last_published_at: string | null
  updated_at: string
}

interface Analytics {
  totalViews: number
  viewsLast7Days: number
  viewsLast30Days: number
  topReferrers: Array<{ referrer: string; count: number }>
}

export default function DisclosureSettingsPage() {
  const [page, setPage] = useState<DisclosurePage | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'content' | 'branding' | 'tools' | 'analytics'>('content')
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    slug: '',
    logo_url: '',
    brand_color: '#3B82F6',
    header_text: '',
    intro_text: '',
    contact_email: '',
    rights_section_enabled: true,
    rights_custom_text: '',
    bias_audit_section_enabled: true,
    bias_audit_url: '',
    bias_audit_date: '',
    bias_audit_auditor: '',
    custom_tools: [] as Tool[],
    use_audit_tools: true,
  })

  useEffect(() => {
    loadPage()
    loadAnalytics()
  }, [])

  const loadPage = async () => {
    setLoading(true)
    const { page: existingPage } = await getDisclosurePage()
    if (existingPage) {
      setPage(existingPage)
      setFormData({
        slug: existingPage.slug || '',
        logo_url: existingPage.logo_url || '',
        brand_color: existingPage.brand_color || '#3B82F6',
        header_text: existingPage.header_text || '',
        intro_text: existingPage.intro_text || '',
        contact_email: existingPage.contact_email || '',
        rights_section_enabled: existingPage.rights_section_enabled ?? true,
        rights_custom_text: existingPage.rights_custom_text || '',
        bias_audit_section_enabled: existingPage.bias_audit_section_enabled ?? true,
        bias_audit_url: existingPage.bias_audit_url || '',
        bias_audit_date: existingPage.bias_audit_date || '',
        bias_audit_auditor: existingPage.bias_audit_auditor || '',
        custom_tools: existingPage.custom_tools || [],
        use_audit_tools: existingPage.use_audit_tools ?? true,
      })
    }
    setLoading(false)
  }

  const loadAnalytics = async () => {
    const { analytics: data } = await getDisclosureAnalytics()
    if (data) {
      setAnalytics(data)
    }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    const generated = await generateDisclosureContent()
    if (!('error' in generated)) {
      setFormData(prev => ({
        ...prev,
        slug: generated.slug || prev.slug,
        header_text: generated.header_text || prev.header_text,
        intro_text: generated.intro_text || prev.intro_text,
        rights_custom_text: generated.rights_custom_text || prev.rights_custom_text,
        custom_tools: generated.custom_tools || prev.custom_tools,
        contact_email: generated.contact_email || prev.contact_email,
      }))
    }
    setGenerating(false)
  }

  const handleSave = async () => {
    setSaving(true)
    const result = await saveDisclosurePage(formData)
    if (!result.error) {
      await loadPage()
    }
    setSaving(false)
  }

  const handleTogglePublish = async () => {
    if (!page) return
    setPublishing(true)
    await togglePublishDisclosurePage(!page.is_published)
    await loadPage()
    setPublishing(false)
  }

  const checkSlug = useCallback(async (slug: string) => {
    if (!slug) {
      setSlugAvailable(null)
      return
    }
    const { available } = await checkSlugAvailability(slug)
    setSlugAvailable(available)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      checkSlug(formData.slug)
    }, 500)
    return () => clearTimeout(timer)
  }, [formData.slug, checkSlug])

  const addTool = () => {
    setFormData(prev => ({
      ...prev,
      custom_tools: [...prev.custom_tools, { name: '', purpose: '', evaluates: '', stages: '' }]
    }))
  }

  const removeTool = (index: number) => {
    setFormData(prev => ({
      ...prev,
      custom_tools: prev.custom_tools.filter((_, i) => i !== index)
    }))
  }

  const updateTool = (index: number, field: keyof Tool, value: string) => {
    setFormData(prev => ({
      ...prev,
      custom_tools: prev.custom_tools.map((tool, i) => 
        i === index ? { ...tool, [field]: value } : tool
      )
    }))
  }

  const copyUrl = () => {
    const url = `${window.location.origin}/d/${formData.slug}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const pageUrl = formData.slug ? `${typeof window !== 'undefined' ? window.location.origin : ''}/d/${formData.slug}` : ''

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Disclosure Page</h1>
            <p className="text-gray-600">Create a public page explaining your AI hiring practices</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleGenerate} disabled={generating} variant="outline">
              {generating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {page ? 'Re-generate' : 'Auto-Generate'}
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
            {page && (
              <Button 
                onClick={handleTogglePublish} 
                disabled={publishing}
                variant={page.is_published ? "outline" : "default"}
              >
                {publishing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : page.is_published ? (
                  <Eye className="w-4 h-4 mr-2" />
                ) : (
                  <Globe className="w-4 h-4 mr-2" />
                )}
                {page.is_published ? 'Unpublish' : 'Publish'}
              </Button>
            )}
          </div>
        </div>

        {/* Published URL Banner */}
        {page?.is_published && formData.slug && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Your disclosure page is live!</p>
                <a 
                  href={pageUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-green-700 hover:underline flex items-center gap-1"
                >
                  {pageUrl}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={copyUrl}>
              {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
              {copied ? 'Copied!' : 'Copy URL'}
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Panel */}
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex border-b">
              {[
                { id: 'content', label: 'Content', icon: FileText },
                { id: 'branding', label: 'Branding', icon: Palette },
                { id: 'tools', label: 'AI Tools', icon: Bot },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                    activeTab === tab.id 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Tab */}
            {activeTab === 'content' && (
              <Card>
                <CardHeader>
                  <CardTitle>Page Content</CardTitle>
                  <CardDescription>Customize your disclosure page text</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* URL Slug */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Page URL
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">/d/</span>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
                        className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          slugAvailable === false ? 'border-red-500' : 
                          slugAvailable === true ? 'border-green-500' : 'border-gray-300'
                        }`}
                        placeholder="your-company"
                      />
                    </div>
                    {slugAvailable === false && (
                      <p className="text-red-500 text-sm mt-1">This URL is already taken</p>
                    )}
                  </div>

                  {/* Header Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Header Text
                    </label>
                    <input
                      type="text"
                      value={formData.header_text}
                      onChange={(e) => setFormData(prev => ({ ...prev, header_text: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="How Your Company Uses AI in Hiring"
                    />
                  </div>

                  {/* Intro Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Introduction
                    </label>
                    <textarea
                      value={formData.intro_text}
                      onChange={(e) => setFormData(prev => ({ ...prev, intro_text: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Explain your commitment to transparent AI hiring..."
                    />
                  </div>

                  {/* Contact Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="hr@company.com"
                    />
                  </div>

                  {/* Rights Section */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Candidate Rights Section
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.rights_section_enabled}
                          onChange={(e) => setFormData(prev => ({ ...prev, rights_section_enabled: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    {formData.rights_section_enabled && (
                      <textarea
                        value={formData.rights_custom_text}
                        onChange={(e) => setFormData(prev => ({ ...prev, rights_custom_text: e.target.value }))}
                        rows={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="• You may request an alternative selection process&#10;• You may request human review of decisions&#10;• ..."
                      />
                    )}
                  </div>

                  {/* Bias Audit Section */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Bias Audit Section (NYC LL144)
                      </label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.bias_audit_section_enabled}
                          onChange={(e) => setFormData(prev => ({ ...prev, bias_audit_section_enabled: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    {formData.bias_audit_section_enabled && (
                      <div className="space-y-3">
                        <input
                          type="date"
                          value={formData.bias_audit_date}
                          onChange={(e) => setFormData(prev => ({ ...prev, bias_audit_date: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="text"
                          value={formData.bias_audit_auditor}
                          onChange={(e) => setFormData(prev => ({ ...prev, bias_audit_auditor: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Auditor name (e.g., CertifiedAuditors LLC)"
                        />
                        <input
                          type="url"
                          value={formData.bias_audit_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, bias_audit_url: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://example.com/bias-audit.pdf"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Branding Tab */}
            {activeTab === 'branding' && (
              <Card>
                <CardHeader>
                  <CardTitle>Branding</CardTitle>
                  <CardDescription>Customize colors and logo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Logo URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logo URL
                    </label>
                    <input
                      type="url"
                      value={formData.logo_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/logo.png"
                    />
                    <p className="text-xs text-gray-500 mt-1">Recommended: PNG or SVG, at least 200px wide</p>
                  </div>

                  {/* Brand Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={formData.brand_color}
                        onChange={(e) => setFormData(prev => ({ ...prev, brand_color: e.target.value }))}
                        className="w-12 h-12 rounded-lg cursor-pointer border-0"
                      />
                      <input
                        type="text"
                        value={formData.brand_color}
                        onChange={(e) => setFormData(prev => ({ ...prev, brand_color: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="#3B82F6"
                      />
                    </div>
                  </div>

                  {/* Preview */}
                  {formData.logo_url && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo Preview
                      </label>
                      <div className="p-4 bg-gray-50 rounded-lg border">
                        <img 
                          src={formData.logo_url} 
                          alt="Logo preview" 
                          className="max-h-16 w-auto"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Tools Tab */}
            {activeTab === 'tools' && (
              <Card>
                <CardHeader>
                  <CardTitle>AI Tools</CardTitle>
                  <CardDescription>List the AI tools used in your hiring process</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Use Audit Tools Toggle */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Use tools from audit</p>
                      <p className="text-sm text-gray-600">Automatically include tools from your compliance audit</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.use_audit_tools}
                        onChange={(e) => setFormData(prev => ({ ...prev, use_audit_tools: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Custom Tools */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium text-gray-700">
                        Additional Tools
                      </label>
                      <Button size="sm" variant="outline" onClick={addTool}>
                        <Plus className="w-4 h-4 mr-1" /> Add Tool
                      </Button>
                    </div>

                    {formData.custom_tools.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No custom tools added. Click &quot;Add Tool&quot; to add one.
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {formData.custom_tools.map((tool, i) => (
                          <div key={i} className="p-4 border rounded-lg space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">Tool {i + 1}</span>
                              <button 
                                onClick={() => removeTool(i)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={tool.name}
                              onChange={(e) => updateTool(i, 'name', e.target.value)}
                              placeholder="Tool name (e.g., HireVue)"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                            <input
                              type="text"
                              value={tool.purpose}
                              onChange={(e) => updateTool(i, 'purpose', e.target.value)}
                              placeholder="Purpose (e.g., Video interview analysis)"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                            <input
                              type="text"
                              value={tool.evaluates}
                              onChange={(e) => updateTool(i, 'evaluates', e.target.value)}
                              placeholder="What it evaluates (e.g., Communication skills)"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                            <input
                              type="text"
                              value={tool.stages}
                              onChange={(e) => updateTool(i, 'stages', e.target.value)}
                              placeholder="Stages used (e.g., Initial screening)"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>View page performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  {!page?.is_published ? (
                    <div className="text-center py-8">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-600">Publish your page to start tracking analytics</p>
                    </div>
                  ) : analytics ? (
                    <div className="space-y-6">
                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">{analytics.totalViews}</div>
                          <div className="text-sm text-gray-600">Total Views</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{analytics.viewsLast7Days}</div>
                          <div className="text-sm text-gray-600">Last 7 Days</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{analytics.viewsLast30Days}</div>
                          <div className="text-sm text-gray-600">Last 30 Days</div>
                        </div>
                      </div>

                      {/* Top Referrers */}
                      {analytics.topReferrers.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Top Referrers</h4>
                          <div className="space-y-2">
                            {analytics.topReferrers.map((ref, i) => (
                              <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm text-gray-700 truncate max-w-[200px]">
                                  {ref.referrer}
                                </span>
                                <span className="text-sm font-medium text-gray-900">{ref.count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Embed Code */}
            {page?.is_published && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="w-5 h-5" />
                    Embed Widget
                  </CardTitle>
                  <CardDescription>Add to your careers page</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      Copy this code to embed a disclosure widget on your careers page:
                    </p>
                    <pre className="p-3 bg-gray-900 text-gray-100 rounded-lg text-xs overflow-x-auto">
{`<div id="hireshield-disclosure"></div>
<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/embed.js" 
        data-company="${formData.slug}"
        data-style="card">
</script>`}
                    </pre>
                    <p className="text-xs text-gray-500">
                      Styles: <code className="bg-gray-100 px-1 rounded">compact</code> | 
                      <code className="bg-gray-100 px-1 rounded ml-1">card</code> | 
                      <code className="bg-gray-100 px-1 rounded ml-1">full</code>
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-8 h-fit">
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Live Preview
                  </CardTitle>
                  {page?.is_published && formData.slug && (
                    <a
                      href={pageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      Open <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="bg-gray-100 h-[600px] overflow-auto">
                  <div className="bg-white min-h-full">
                    {/* Preview Header */}
                    <div 
                      className="border-b p-4"
                      style={{ borderBottomColor: formData.brand_color }}
                    >
                      <div className="flex items-center gap-3">
                        {formData.logo_url ? (
                          <img 
                            src={formData.logo_url} 
                            alt="Logo"
                            className="h-8 w-auto"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none'
                            }}
                          />
                        ) : (
                          <div 
                            className="w-8 h-8 rounded flex items-center justify-center text-white font-bold text-sm"
                            style={{ backgroundColor: formData.brand_color }}
                          >
                            C
                          </div>
                        )}
                        <h2 className="font-semibold text-gray-900 text-sm">
                          {formData.header_text || 'How Your Company Uses AI in Hiring'}
                        </h2>
                      </div>
                    </div>

                    {/* Preview Content */}
                    <div className="p-4 space-y-4 text-sm">
                      {formData.intro_text && (
                        <p className="text-gray-700 text-xs leading-relaxed">
                          {formData.intro_text.substring(0, 200)}
                          {formData.intro_text.length > 200 ? '...' : ''}
                        </p>
                      )}

                      {formData.custom_tools.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1 mb-2">
                            <Bot className="w-4 h-4" style={{ color: formData.brand_color }} />
                            <span className="font-medium text-gray-900 text-xs">AI Tools</span>
                          </div>
                          {formData.custom_tools.slice(0, 2).map((tool, i) => (
                            <div key={i} className="p-2 bg-gray-50 rounded mb-2 text-xs">
                              <div className="font-medium">{tool.name || 'Tool Name'}</div>
                              <div className="text-gray-600 truncate">{tool.purpose || 'Purpose'}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {formData.rights_section_enabled && (
                        <div>
                          <div className="flex items-center gap-1 mb-2">
                            <CheckCircle className="w-4 h-4" style={{ color: formData.brand_color }} />
                            <span className="font-medium text-gray-900 text-xs">Your Rights</span>
                          </div>
                          <div className="p-2 bg-gray-50 rounded text-xs text-gray-700 space-y-1">
                            {formData.rights_custom_text ? (
                              formData.rights_custom_text.split('\n').slice(0, 3).map((line, i) => {
                                const trimmed = line.trim()
                                if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
                                  return (
                                    <div key={i} className="flex items-start gap-1">
                                      <span 
                                        className="inline-block w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0"
                                        style={{ backgroundColor: formData.brand_color }}
                                      />
                                      <span>{trimmed.substring(1).trim().substring(0, 40)}...</span>
                                    </div>
                                  )
                                }
                                return trimmed ? <div key={i}>{trimmed.substring(0, 50)}...</div> : null
                              })
                            ) : (
                              <span>Candidate rights will appear here...</span>
                            )}
                          </div>
                        </div>
                      )}

                      {formData.bias_audit_section_enabled && (
                        <div>
                          <div className="flex items-center gap-1 mb-2">
                            <FileText className="w-4 h-4" style={{ color: formData.brand_color }} />
                            <span className="font-medium text-gray-900 text-xs">Bias Audit (NYC LL144)</span>
                          </div>
                          <div className="p-2 bg-gray-50 rounded text-xs text-gray-700">
                            {formData.bias_audit_date || formData.bias_audit_auditor ? (
                              <span>
                                Audit {formData.bias_audit_date && `on ${formData.bias_audit_date}`}
                                {formData.bias_audit_auditor && ` by ${formData.bias_audit_auditor}`}
                              </span>
                            ) : (
                              <span className="text-gray-500">No audit info added yet</span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="pt-2 border-t text-center text-xs text-gray-500">
                        Contact: {formData.contact_email || 'email@company.com'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
