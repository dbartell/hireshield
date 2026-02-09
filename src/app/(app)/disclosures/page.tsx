"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Globe, ExternalLink, Copy, Check, Eye, EyeOff, Settings, 
  Loader2, Sparkles, AlertTriangle, Scale, Code, CheckCircle
} from "lucide-react"
import { 
  getDisclosurePage, 
  togglePublishDisclosurePage,
  generateDisclosureContent,
  saveDisclosurePage
} from "@/lib/actions/disclosure"
import { TaskHeader } from "@/components/task-header"
import { TaskCompletionModal } from "@/components/task-completion-modal"
import { useNextTask } from "@/hooks/use-next-task"
import { useStateContext } from "@/lib/state-context"

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
  custom_tools: Array<{ name: string; purpose: string }>
  last_published_at: string | null
  updated_at: string
}

export default function DisclosuresPage() {
  const [page, setPage] = useState<DisclosurePage | null>(null)
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showEmbed, setShowEmbed] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const { nextTask } = useNextTask('disclosure-page')
  
  // Get current state from context (state-as-product architecture)
  const { currentState, stateName } = useStateContext()

  useEffect(() => {
    loadPage()
  }, [])

  const loadPage = async () => {
    setLoading(true)
    const { page: existingPage } = await getDisclosurePage()
    setPage(existingPage)
    setLoading(false)
  }

  const handleTogglePublish = async () => {
    if (!page) return
    const wasPublished = page.is_published
    setPublishing(true)
    await togglePublishDisclosurePage(!page.is_published)
    await loadPage()
    setPublishing(false)
    // Show completion modal when publishing (not unpublishing)
    if (!wasPublished) {
      setShowCompletion(true)
    }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const generated = await generateDisclosureContent()
      if ('error' in generated) {
        console.error('Generate error:', generated.error)
        alert('Failed to generate content. Please try again.')
        setGenerating(false)
        return
      }
      
      // Ensure we have required fields
      if (!generated.slug || !generated.contact_email) {
        console.error('Missing required fields:', { slug: generated.slug, email: generated.contact_email })
        alert('Could not generate page. Please create manually.')
        setGenerating(false)
        return
      }
      
      // Save the generated content
      const saveResult = await saveDisclosurePage({
        slug: generated.slug,
        logo_url: '',
        brand_color: '#3B82F6',
        header_text: generated.header_text || '',
        intro_text: generated.intro_text || '',
        contact_email: generated.contact_email,
        rights_section_enabled: true,
        rights_custom_text: generated.rights_custom_text || '',
        bias_audit_section_enabled: false,
        bias_audit_url: '',
        bias_audit_date: '',
        bias_audit_auditor: '',
        custom_tools: generated.custom_tools || [],
        use_audit_tools: true
      })
      
      if (saveResult.error) {
        console.error('Save error:', saveResult.error)
        alert('Failed to save page: ' + saveResult.error)
        setGenerating(false)
        return
      }
      
      await loadPage()
    } catch (err) {
      console.error('Generate failed:', err)
      alert('Something went wrong. Please try again.')
    }
    setGenerating(false)
  }

  const copyUrl = () => {
    if (!page?.slug) return
    const url = `${window.location.origin}/d/${page.slug}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const pageUrl = page?.slug ? `${typeof window !== 'undefined' ? window.location.origin : ''}/d/${page.slug}` : ''

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  // No disclosure page created yet
  if (!page) {
    return (
      <div className="p-6 md:p-8 max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Public Disclosure Page</h1>
          <p className="text-gray-600 mt-1">Create a public page explaining your AI hiring practices</p>
        </div>

        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Create Your Disclosure Page</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Many states require a public disclosure of how you use AI in hiring. 
              We'll help you create a compliant page in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={handleGenerate} disabled={generating}>
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Auto-Generate Page
                  </>
                )}
              </Button>
              <Link href="/settings/disclosure">
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Create Manually
                </Button>
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Scale className="w-4 h-4" />
                <span>Required by NYC Local Law 144, Illinois HB 3773, and others</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      {/* Completion Modal */}
      <TaskCompletionModal
        isOpen={showCompletion}
        onClose={() => setShowCompletion(false)}
        title="Public Disclosure Page Published"
        description="Your AI hiring disclosure is now live and visible to candidates."
        nextTask={nextTask || undefined}
      />

      <TaskHeader
        title="Public Disclosure Page"
        description="Share how your organization uses AI in hiring"
        estimatedTime="~5 min"
        isComplete={page.is_published}
      />

      <div className="p-6 md:p-8 max-w-3xl mx-auto">

      {/* Status Card */}
      <Card className={page.is_published ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              page.is_published ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              {page.is_published ? (
                <Globe className="w-6 h-6 text-green-600" />
              ) : (
                <EyeOff className="w-6 h-6 text-yellow-600" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`text-lg font-semibold ${
                  page.is_published ? 'text-green-800' : 'text-yellow-800'
                }`}>
                  {page.is_published ? 'Published' : 'Draft'}
                </span>
                {page.is_published && (
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
                    Live
                  </span>
                )}
              </div>
              
              {page.is_published && pageUrl && (
                <div className="mt-2">
                  <a 
                    href={pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {pageUrl}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {!page.is_published && (
                <p className="text-sm text-yellow-700 mt-1">
                  Your page is not visible to candidates yet. Publish when ready.
                </p>
              )}
            </div>

            <div className="flex gap-2">
              {page.is_published && (
                <Button variant="outline" size="sm" onClick={copyUrl}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              )}
              <Button 
                size="sm"
                variant={page.is_published ? "outline" : "default"}
                onClick={handleTogglePublish}
                disabled={publishing}
              >
                {publishing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : page.is_published ? (
                  'Unpublish'
                ) : (
                  'Publish'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="mt-6">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Page Preview</CardTitle>
              <CardDescription>How candidates will see your disclosure</CardDescription>
            </div>
            <div className="flex gap-2">
              {page.is_published && (
                <a href={pageUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View Live
                  </Button>
                </a>
              )}
              <Link href="/settings/disclosure">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-gray-100">
            {/* Mini preview */}
            <div className="bg-white m-4 rounded-lg shadow-sm overflow-hidden border">
              {/* Header */}
              <div className="p-4 border-b" style={{ borderBottomColor: page.brand_color }}>
                <div className="flex items-center gap-2">
                  {page.logo_url ? (
                    <img src={page.logo_url} alt="Logo" className="h-6 w-auto" />
                  ) : (
                    <div 
                      className="w-6 h-6 rounded flex items-center justify-center text-white font-bold text-xs"
                      style={{ backgroundColor: page.brand_color }}
                    >
                      C
                    </div>
                  )}
                  <span className="font-medium text-sm">
                    {page.header_text || 'How We Use AI in Hiring'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                {page.intro_text && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {page.intro_text}
                  </p>
                )}

                {page.custom_tools && page.custom_tools.length > 0 && (
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-2">AI Tools Used</div>
                    <div className="space-y-1">
                      {page.custom_tools.slice(0, 2).map((tool, i) => (
                        <div key={i} className="text-xs bg-gray-50 p-2 rounded">
                          <span className="font-medium">{tool.name}</span>
                          {tool.purpose && <span className="text-gray-500"> - {tool.purpose}</span>}
                        </div>
                      ))}
                      {page.custom_tools.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{page.custom_tools.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {page.rights_section_enabled && (
                  <div className="flex items-center gap-1 text-xs text-green-700">
                    <CheckCircle className="w-3 h-3" />
                    <span>Candidate rights included</span>
                  </div>
                )}

                <div className="pt-2 border-t text-xs text-gray-500 text-center">
                  Contact: {page.contact_email || 'Not set'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Embed Code */}
      {page.is_published && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Embed on Your Site
                </CardTitle>
                <CardDescription>Add a disclosure widget to your careers page</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowEmbed(!showEmbed)}
              >
                {showEmbed ? 'Hide Code' : 'Show Code'}
              </Button>
            </div>
          </CardHeader>
          {showEmbed && (
            <CardContent>
              <pre className="p-3 bg-gray-900 text-gray-100 rounded-lg text-xs overflow-x-auto">
{`<div id="hireshield-disclosure"></div>
<script src="${typeof window !== 'undefined' ? window.location.origin : ''}/embed.js" 
        data-company="${page.slug}"
        data-style="card">
</script>`}
              </pre>
              <p className="text-xs text-gray-500 mt-2">
                Styles available: <code className="bg-gray-100 px-1 rounded">compact</code>, 
                <code className="bg-gray-100 px-1 rounded ml-1">card</code>, 
                <code className="bg-gray-100 px-1 rounded ml-1">full</code>
              </p>
            </CardContent>
          )}
        </Card>
      )}

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <Link href="/settings/disclosure">
          <Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
            <CardContent className="pt-6">
              <Settings className="w-8 h-8 text-gray-400 mb-3" />
              <h3 className="font-medium">Edit Content</h3>
              <p className="text-sm text-gray-500 mt-1">
                Customize text, branding, and tools
              </p>
            </CardContent>
          </Card>
        </Link>

        {page.is_published && (
          <a href={pageUrl} target="_blank" rel="noopener noreferrer">
            <Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
              <CardContent className="pt-6">
                <Eye className="w-8 h-8 text-gray-400 mb-3" />
                <h3 className="font-medium">View Live Page</h3>
                <p className="text-sm text-gray-500 mt-1">
                  See what candidates see
                </p>
              </CardContent>
            </Card>
          </a>
        )}
      </div>

      {/* Compliance Note - State-specific messaging */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Scale className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">Why this matters for {stateName}</p>
            <p className="text-sm text-blue-700 mt-1">
              {currentState === 'IL' && 'Illinois HB 3773 requires employers to disclose AI use in employment decisions. This page helps you meet that requirement.'}
              {currentState === 'NYC' && 'NYC Local Law 144 requires publishing bias audit results on a public webpage. This disclosure page fulfills that requirement.'}
              {currentState === 'CO' && 'Colorado AI Act requires pre-decision notification to candidates about AI use. This page helps demonstrate compliance.'}
              {currentState === 'CA' && 'California CCPA ADMT rules require explaining AI purpose and opt-out rights. Use this page to communicate with candidates.'}
              {!['IL', 'NYC', 'CO', 'CA'].includes(currentState) && 'A public disclosure of your AI hiring practices is a best practice for transparency and may be required as regulations expand.'}
            </p>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
