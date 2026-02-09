"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  FileText, Download, Eye, CheckCircle, Clock, Trash2, Loader2, X, Plus, 
  AlertTriangle, Edit, History, ChevronDown, ChevronUp, RefreshCw, 
  ExternalLink, Copy, Check
} from "lucide-react"
import Link from "next/link"
import { CalendlyCTA } from "@/components/calendly-cta"
import { DocumentsHelp } from "@/components/help-content"
import { 
  getDocuments, 
  createDocument, 
  updateDocument,
  createDocumentVersion,
  deleteDocument, 
  getDocumentTemplate, 
  getOrganizationInfo 
} from "@/lib/actions/documents"
import { trackEvent } from "@/components/GoogleAnalytics"
import { useStateContext } from "@/lib/state-context"

// Document type configuration with behaviors
type DocumentBehavior = 'singleton' | 'versioned' | 'multiple'

interface DocumentTypeConfig {
  id: string
  name: string
  description: string
  states: string[]
  lawNames: Record<string, string>
  behavior: DocumentBehavior
  renewalPeriod?: string // For versioned docs
  wizardPath?: string // For docs with dedicated wizards
}

const documentTypes: DocumentTypeConfig[] = [
  {
    id: "disclosure-candidate",
    name: "Candidate Disclosure Notice",
    description: "Notify job candidates that AI is used in the hiring process. Create one per job posting or a general notice.",
    states: ["IL", "CA", "CO", "NYC"],
    lawNames: {
      IL: "Illinois HB 3773",
      CA: "California CCPA",
      CO: "Colorado AI Act",
      NYC: "NYC Local Law 144"
    },
    behavior: 'multiple'
  },
  {
    id: "handbook-policy",
    name: "Employee Handbook Policy",
    description: "AI use policy section for your employee handbook. One policy per organization.",
    states: ["IL", "CA", "CO"],
    lawNames: {
      IL: "Illinois HB 3773",
      CA: "California CCPA",
      CO: "Colorado AI Act"
    },
    behavior: 'singleton'
  },
  {
    id: "bias-audit-disclosure",
    name: "Public Disclosure Page",
    description: "NYC Local Law 144 requires a public webpage disclosing your bias audit results.",
    states: ["NYC"],
    lawNames: {
      NYC: "NYC Local Law 144"
    },
    behavior: 'singleton'
  },
  {
    id: "impact-assessment",
    name: "Impact Assessment",
    description: "Annual assessment of AI system risks and safeguards. Required yearly or after significant changes.",
    states: ["CO"],
    lawNames: {
      CO: "Colorado AI Act (SB24-205)"
    },
    behavior: 'versioned',
    renewalPeriod: 'Annual',
    wizardPath: '/documents/impact-assessment'
  },
  {
    id: "consent-form",
    name: "Candidate Consent Form",
    description: "Collect explicit candidate consent for AI processing where required.",
    states: ["CA", "CO", "MD"],
    lawNames: {
      CA: "California CCPA",
      CO: "Colorado AI Act",
      MD: "Maryland HB 1202"
    },
    behavior: 'singleton'
  },
  {
    id: "disclosure-employee",
    name: "Employee Disclosure Notice",
    description: "Notify current employees about AI use in employment decisions.",
    states: ["IL", "CA", "CO"],
    lawNames: {
      IL: "Illinois HB 3773",
      CA: "California CCPA",
      CO: "Colorado AI Act"
    },
    behavior: 'singleton'
  },
]

interface Doc {
  id: string
  title: string
  doc_type: string
  content: string
  created_at: string
  updated_at?: string
  version: number
}

interface OrgInfo {
  id: string
  name: string
  states: string[] | null
}

// Modal component
function DocumentModal({ 
  isOpen, 
  onClose, 
  docType, 
  existingDoc,
  orgInfo,
  onSave,
  isVersioned = false
}: { 
  isOpen: boolean
  onClose: () => void
  docType: DocumentTypeConfig | null
  existingDoc: Doc | null
  orgInfo: OrgInfo | null
  onSave: () => void
  isVersioned?: boolean
}) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingTemplate, setLoadingTemplate] = useState(false)
  const [copied, setCopied] = useState(false)

  const loadTemplate = useCallback(async () => {
    if (!docType) return
    setLoadingTemplate(true)
    
    const template = await getDocumentTemplate(docType.id)
    if (template) {
      const today = new Date().toISOString().split('T')[0]
      const processedContent = template.content
        .replace(/\[COMPANY_NAME\]/g, orgInfo?.name || 'Your Company')
        .replace(/\[DATE\]/g, today)
        .replace(/\[CONTACT_EMAIL\]/g, 'hr@yourcompany.com')
        .replace(/\[APPLICABLE_LAWS\]/g, template.states.map((s: string) => {
          switch(s) {
            case 'IL': return 'Illinois HB 3773'
            case 'CA': return 'California CCPA'
            case 'CO': return 'Colorado AI Act'
            case 'NYC': return 'NYC Local Law 144'
            default: return s
          }
        }).join(', '))

      setTitle(`${template.name}${orgInfo?.name ? ` - ${orgInfo.name}` : ''}`)
      setContent(processedContent)
    }
    setLoadingTemplate(false)
  }, [docType, orgInfo?.name])

  useEffect(() => {
    if (isOpen && docType) {
      if (existingDoc) {
        // Editing existing document
        setTitle(existingDoc.title)
        setContent(existingDoc.content)
      } else {
        // Load template for new document
        loadTemplate()
      }
    }
  }, [isOpen, docType, existingDoc, loadTemplate])

  const handleSave = async () => {
    if (!docType || !title || !content) return
    setLoading(true)

    try {
      if (existingDoc && !isVersioned) {
        // Update existing document (for singletons)
        await updateDocument(existingDoc.id, title, content)
      } else if (isVersioned) {
        // Create new version
        await createDocumentVersion(docType.id, title, content)
      } else {
        // Create new document
        await createDocument(docType.id, title, content)
        trackEvent('document_create', 'engagement', docType.id)
      }
      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving document:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyContent = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadPdf = async () => {
    const html2pdf = (await import('html2pdf.js')).default
    
    const element = document.createElement('div')
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px;">
        <h1 style="font-size: 24px; margin-bottom: 20px;">${title}</h1>
        <div style="white-space: pre-wrap; line-height: 1.6;">${content}</div>
        <div style="margin-top: 40px; color: #666; font-size: 12px;">
          Generated by HireShield • ${new Date().toLocaleDateString()}
        </div>
      </div>
    `
    
    const opt = {
      margin: 10,
      filename: `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    }
    
    html2pdf().set(opt).from(element).save()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div>
            <h2 className="text-lg font-semibold">
              {existingDoc && !isVersioned ? 'Edit Document' : isVersioned ? 'Create New Version' : 'Generate Document'}
            </h2>
            <p className="text-sm text-gray-600">{docType?.name}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        {loadingTemplate ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Info banner for versioned docs */}
            {isVersioned && existingDoc && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                <History className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <strong>Creating version {existingDoc.version + 1}</strong>
                  <p className="text-blue-700">Previous versions remain available in your version history. Each version is immutable once saved.</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Document Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter document title..."
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Content</label>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCopyContent}
                    className="text-xs"
                  >
                    {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={loadTemplate}
                    className="text-xs"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" /> Reset to Template
                  </Button>
                </div>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={18}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                placeholder="Document content..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Edit the content above. Replace any bracketed placeholders like [YOUR_NAME] with your actual information.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
          <Button variant="outline" onClick={handleDownloadPdf} disabled={!content}>
            <Download className="w-4 h-4 mr-2" /> Download PDF
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading || !title || !content}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {existingDoc && !isVersioned ? 'Save Changes' : 'Save Document'}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// View Document Modal
function ViewDocumentModal({ doc, onClose, onDownload }: { 
  doc: Doc | null
  onClose: () => void 
  onDownload: (doc: Doc) => void
}) {
  if (!doc) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[80vh] overflow-hidden shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">{doc.title}</h2>
            <p className="text-sm text-gray-500">
              Version {doc.version} • Created {new Date(doc.created_at).toLocaleDateString()}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{doc.content}</pre>
        </div>
        <div className="p-4 border-t flex gap-3">
          <Button onClick={() => onDownload(doc)}>
            <Download className="w-4 h-4 mr-2" /> Download PDF
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

// Version History Component
function VersionHistory({ 
  docs, 
  onView, 
  onDownload 
}: { 
  docs: Doc[]
  onView: (doc: Doc) => void
  onDownload: (doc: Doc) => void
}) {
  const [expanded, setExpanded] = useState(false)
  
  if (docs.length <= 1) return null

  const olderVersions = docs.slice(1)
  
  return (
    <div className="mt-3 pt-3 border-t border-gray-200">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <History className="w-4 h-4" />
        <span>{olderVersions.length} previous version{olderVersions.length > 1 ? 's' : ''}</span>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      
      {expanded && (
        <div className="mt-2 space-y-2">
          {olderVersions.map(doc => (
            <div 
              key={doc.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-500">v{doc.version}</span>
                <span className="text-gray-600">{new Date(doc.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => onView(doc)}>
                  <Eye className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDownload(doc)}>
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Document Card Component
function DocumentCard({
  docType,
  docs,
  onGenerate,
  onEdit,
  onCreateVersion,
  onView,
  onDownload,
  onDelete
}: {
  docType: DocumentTypeConfig
  docs: Doc[]
  onGenerate: () => void
  onEdit: (doc: Doc) => void
  onCreateVersion: (doc: Doc) => void
  onView: (doc: Doc) => void
  onDownload: (doc: Doc) => void
  onDelete: (doc: Doc) => void
}) {
  const [deleting, setDeleting] = useState<string | null>(null)
  const hasDoc = docs.length > 0
  const latestDoc = docs[0]

  const handleDelete = async (doc: Doc) => {
    if (!confirm('Are you sure you want to delete this document?')) return
    setDeleting(doc.id)
    await onDelete(doc)
    setDeleting(null)
  }

  // Redirect to wizard for impact assessment
  if (docType.wizardPath && docType.id === 'impact-assessment') {
    return (
      <Card className={hasDoc ? 'border-green-200 bg-green-50/50' : ''}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              hasDoc ? 'bg-green-100' : 'bg-blue-100'
            }`}>
              {hasDoc ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <FileText className="w-5 h-5 text-blue-600" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className={`font-semibold ${hasDoc ? 'text-green-800' : 'text-gray-900'}`}>
                    {docType.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-0.5">{docType.description}</p>
                  
                  {docType.renewalPeriod && (
                    <div className="flex items-center gap-1 mt-2">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        Renewal: {docType.renewalPeriod}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-shrink-0">
                  <Link href={docType.wizardPath}>
                    <Button size="sm" variant={hasDoc ? 'outline' : 'default'}>
                      {hasDoc ? (
                        <>
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Open Wizard
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-1" />
                          Start Assessment
                        </>
                      )}
                    </Button>
                  </Link>
                </div>
              </div>

              {hasDoc && latestDoc && (
                <div className="mt-3 text-xs text-green-700 flex items-center gap-4">
                  <span>✓ v{latestDoc.version} - {new Date(latestDoc.created_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={hasDoc ? 'border-green-200 bg-green-50/50' : ''}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            hasDoc ? 'bg-green-100' : 'bg-blue-100'
          }`}>
            {hasDoc ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <FileText className="w-5 h-5 text-blue-600" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className={`font-semibold ${hasDoc ? 'text-green-800' : 'text-gray-900'}`}>
                  {docType.name}
                </h3>
                <p className="text-sm text-gray-600 mt-0.5">{docType.description}</p>
                
                {docType.renewalPeriod && (
                  <div className="flex items-center gap-1 mt-2">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      Renewal: {docType.renewalPeriod}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions based on behavior */}
              <div className="flex-shrink-0">
                {!hasDoc ? (
                  // No document yet - show Generate
                  <Button size="sm" onClick={onGenerate}>
                    <Plus className="w-4 h-4 mr-1" />
                    Generate
                  </Button>
                ) : docType.behavior === 'singleton' ? (
                  // Singleton - show Edit and View
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onView(latestDoc)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDownload(latestDoc)}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onEdit(latestDoc)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                ) : docType.behavior === 'versioned' ? (
                  // Versioned - show View, Download, New Version
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onView(latestDoc)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDownload(latestDoc)}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onCreateVersion(latestDoc)}>
                      <RefreshCw className="w-4 h-4 mr-1" />
                      New Version
                    </Button>
                  </div>
                ) : (
                  // Multiple - show View, Edit, Add New
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onView(latestDoc)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDownload(latestDoc)}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(latestDoc)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" onClick={onGenerate}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add New
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Show latest doc info */}
            {hasDoc && latestDoc && (
              <>
                <div className="mt-3 text-xs text-green-700 flex items-center gap-4">
                  <span>✓ {docType.behavior === 'versioned' ? `v${latestDoc.version} - ` : ''}{new Date(latestDoc.created_at).toLocaleDateString()}</span>
                  {latestDoc.updated_at && latestDoc.updated_at !== latestDoc.created_at && (
                    <span className="text-gray-500">Updated {new Date(latestDoc.updated_at).toLocaleDateString()}</span>
                  )}
                </div>

                {/* Version history for versioned docs */}
                {docType.behavior === 'versioned' && (
                  <VersionHistory 
                    docs={docs} 
                    onView={onView}
                    onDownload={onDownload}
                  />
                )}

                {/* List all docs for 'multiple' type */}
                {docType.behavior === 'multiple' && docs.length > 1 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                    {docs.slice(1).map(doc => (
                      <div 
                        key={doc.id}
                        className="flex items-center justify-between p-2 bg-white rounded border text-sm"
                      >
                        <div className="flex-1 min-w-0">
                          <span className="font-medium truncate block">{doc.title}</span>
                          <span className="text-xs text-gray-500">{new Date(doc.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => onView(doc)}>
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => onDownload(doc)}>
                            <Download className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => onEdit(doc)}>
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDelete(doc)}
                            disabled={deleting === doc.id}
                          >
                            {deleting === doc.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3 text-red-500" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Doc[]>([])
  const [loading, setLoading] = useState(true)
  const [orgInfo, setOrgInfo] = useState<OrgInfo | null>(null)
  
  // Get current state from context (state-as-product architecture)
  const { currentState, stateName } = useStateContext()
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [modalDocType, setModalDocType] = useState<DocumentTypeConfig | null>(null)
  const [modalExistingDoc, setModalExistingDoc] = useState<Doc | null>(null)
  const [modalIsVersioned, setModalIsVersioned] = useState(false)
  
  // View modal state
  const [viewDoc, setViewDoc] = useState<Doc | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const [docs, org] = await Promise.all([
      getDocuments(),
      getOrganizationInfo()
    ])
    setDocuments(docs)
    setOrgInfo(org)
    setLoading(false)
  }

  // Filter documents by current state (state-as-product: show only active state's documents)
  const userStates = [currentState]
  const filteredDocTypes = userStates.length > 0 && userStates[0]
    ? documentTypes.filter(dt => dt.states.some(s => userStates.includes(s)))
    : documentTypes

  // Get documents matching a doc type
  const getDocsForType = (docTypeId: string): Doc[] => {
    return documents.filter(d => d.doc_type === docTypeId)
      .sort((a, b) => b.version - a.version)
  }

  // Handlers
  const handleGenerate = (docType: DocumentTypeConfig) => {
    setModalDocType(docType)
    setModalExistingDoc(null)
    setModalIsVersioned(false)
    setModalOpen(true)
  }

  const handleEdit = (docType: DocumentTypeConfig, doc: Doc) => {
    setModalDocType(docType)
    setModalExistingDoc(doc)
    setModalIsVersioned(false)
    setModalOpen(true)
  }

  const handleCreateVersion = (docType: DocumentTypeConfig, doc: Doc) => {
    setModalDocType(docType)
    setModalExistingDoc(doc)
    setModalIsVersioned(true)
    setModalOpen(true)
  }

  const handleDownloadPdf = async (doc: Doc) => {
    const html2pdf = (await import('html2pdf.js')).default
    
    const element = document.createElement('div')
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px;">
        <h1 style="font-size: 24px; margin-bottom: 20px;">${doc.title}</h1>
        <div style="white-space: pre-wrap; line-height: 1.6;">${doc.content}</div>
        <div style="margin-top: 40px; color: #666; font-size: 12px;">
          Generated by HireShield • ${new Date(doc.created_at).toLocaleDateString()}
        </div>
      </div>
    `
    
    const opt = {
      margin: 10,
      filename: `${doc.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    }
    
    html2pdf().set(opt).from(element).save()
  }

  const handleDelete = async (doc: Doc) => {
    await deleteDocument(doc.id)
    await loadData()
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Required Documents
          <DocumentsHelp />
        </h1>
        <p className="text-gray-600 mt-1">
          {currentState 
            ? `Documents required for ${stateName} compliance`
            : 'Generate compliance documents for your organization'
          }
        </p>
      </div>

      {/* No states warning */}
      {!currentState && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">No states configured</p>
                <p className="text-sm text-yellow-700 mt-1">
                  <Link href="/audit" className="underline hover:no-underline">Complete your compliance audit</Link> to see which documents you need based on where you hire.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document list by behavior type */}
      <div className="space-y-8">
        {/* Singleton documents (edit-only) */}
        {filteredDocTypes.filter(dt => dt.behavior === 'singleton').length > 0 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Policies & Disclosures</h2>
              <p className="text-sm text-gray-500">One document per organization. Edit to update.</p>
            </div>
            {filteredDocTypes
              .filter(dt => dt.behavior === 'singleton')
              .map(docType => (
                <DocumentCard
                  key={docType.id}
                  docType={docType}
                  docs={getDocsForType(docType.id)}
                  onGenerate={() => handleGenerate(docType)}
                  onEdit={(doc) => handleEdit(docType, doc)}
                  onCreateVersion={(doc) => handleCreateVersion(docType, doc)}
                  onView={(doc) => setViewDoc(doc)}
                  onDownload={handleDownloadPdf}
                  onDelete={handleDelete}
                />
              ))
            }
          </div>
        )}

        {/* Versioned documents (annual renewals) */}
        {filteredDocTypes.filter(dt => dt.behavior === 'versioned').length > 0 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Assessments & Audits</h2>
              <p className="text-sm text-gray-500">Versioned documents with annual renewals. Previous versions are preserved.</p>
            </div>
            {filteredDocTypes
              .filter(dt => dt.behavior === 'versioned')
              .map(docType => (
                <DocumentCard
                  key={docType.id}
                  docType={docType}
                  docs={getDocsForType(docType.id)}
                  onGenerate={() => handleGenerate(docType)}
                  onEdit={(doc) => handleEdit(docType, doc)}
                  onCreateVersion={(doc) => handleCreateVersion(docType, doc)}
                  onView={(doc) => setViewDoc(doc)}
                  onDownload={handleDownloadPdf}
                  onDelete={handleDelete}
                />
              ))
            }
          </div>
        )}

        {/* Multiple documents (per job posting) */}
        {filteredDocTypes.filter(dt => dt.behavior === 'multiple').length > 0 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Candidate Notices</h2>
              <p className="text-sm text-gray-500">Create multiple versions for different job postings or situations.</p>
            </div>
            {filteredDocTypes
              .filter(dt => dt.behavior === 'multiple')
              .map(docType => (
                <DocumentCard
                  key={docType.id}
                  docType={docType}
                  docs={getDocsForType(docType.id)}
                  onGenerate={() => handleGenerate(docType)}
                  onEdit={(doc) => handleEdit(docType, doc)}
                  onCreateVersion={(doc) => handleCreateVersion(docType, doc)}
                  onView={(doc) => setViewDoc(doc)}
                  onDownload={handleDownloadPdf}
                  onDelete={handleDelete}
                />
              ))
            }
          </div>
        )}
      </div>

      {/* Modals */}
      <DocumentModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setModalDocType(null)
          setModalExistingDoc(null)
          setModalIsVersioned(false)
        }}
        docType={modalDocType}
        existingDoc={modalExistingDoc}
        orgInfo={orgInfo}
        onSave={loadData}
        isVersioned={modalIsVersioned}
      />

      <ViewDocumentModal
        doc={viewDoc}
        onClose={() => setViewDoc(null)}
        onDownload={handleDownloadPdf}
      />

      {/* Help */}
      <div className="mt-8 text-center">
        <CalendlyCTA 
          variant="inline" 
          title="Need help with your documents?" 
        />
      </div>
    </div>
  )
}
