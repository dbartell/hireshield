"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  FileText, Download, Shield, CheckCircle, AlertTriangle, 
  Loader2, Building2, Users, ClipboardCheck, Scale, Award,
  Calendar, RefreshCw, Lock
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { TaskHeader } from "@/components/task-header"

interface PacketData {
  organization: {
    name: string
    states: string[]
    subscriptionStatus: string | null
    createdAt: string
  }
  tools: Array<{
    name: string
    purpose: string
    riskLevel: string
  }>
  disclosures: {
    hasPublicPage: boolean
    publicPageUrl: string | null
    lastPublished: string | null
  }
  training: {
    completed: number
    total: number
    certificates: Array<{
      name: string
      certificateNumber: string
      issuedAt: string
      expiresAt: string
    }>
  }
  consents: {
    totalCollected: number
    thisMonth: number
    optOutRate: number
  }
  compliance: {
    overallStatus: 'compliant' | 'at-risk' | 'non-compliant'
    completedTasks: number
    totalTasks: number
    lastUpdated: string
  }
}

export default function CompliancePacketPage() {
  const router = useRouter()
  const [data, setData] = useState<PacketData | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const packetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadPacketData()
  }, [])

  const loadPacketData = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const orgId = user.id

    // Fetch all data in parallel
    const [orgRes, toolsRes, disclosureRes, trainingRes, consentsRes, docsRes] = await Promise.all([
      supabase.from('organizations').select('name, states, subscription_status, created_at').eq('id', orgId).single(),
      supabase.from('audits').select('tools').eq('org_id', orgId).order('created_at', { ascending: false }).limit(1),
      supabase.from('disclosure_pages').select('is_published, slug, last_published_at').eq('organization_id', orgId).single(),
      supabase.from('training_assignments').select(`
        user_name, status, 
        certificate:training_certificates(certificate_number, issued_at, expires_at)
      `).eq('org_id', orgId),
      supabase.from('consents').select('created_at, opted_out').eq('org_id', orgId),
      supabase.from('documents').select('doc_type').eq('org_id', orgId),
    ])

    // Process tools from audit
    const auditTools = toolsRes.data?.[0]?.tools || []
    const tools = Array.isArray(auditTools) ? auditTools.map((t: any) => ({
      name: t.name || t,
      purpose: t.purpose || 'Hiring/Recruitment',
      riskLevel: t.riskLevel || 'Medium',
    })) : []

    // Process training
    const trainingData = trainingRes.data || []
    const completedTraining = trainingData.filter((t: any) => t.status === 'completed')
    const certificates = completedTraining
      .filter((t: any) => t.certificate)
      .map((t: any) => ({
        name: t.user_name,
        certificateNumber: t.certificate.certificate_number,
        issuedAt: t.certificate.issued_at,
        expiresAt: t.certificate.expires_at,
      }))

    // Process consents
    const consentsData = consentsRes.data || []
    const thisMonth = new Date()
    thisMonth.setDate(1)
    const consentsThisMonth = consentsData.filter((c: any) => new Date(c.created_at) >= thisMonth)
    const optOuts = consentsData.filter((c: any) => c.opted_out).length
    const optOutRate = consentsData.length > 0 ? Math.round((optOuts / consentsData.length) * 100) : 0

    // Calculate compliance status
    const states = orgRes.data?.states || []
    const hasDisclosure = disclosureRes.data?.is_published || false
    const hasTraining = completedTraining.length > 0
    const docTypes = docsRes.data?.map((d: any) => d.doc_type) || []
    
    // Simple task counting
    let totalTasks = 3 // Base: disclosure, training, tools inventory
    let completedTasks = 0
    if (hasDisclosure) completedTasks++
    if (hasTraining) completedTasks++
    if (tools.length > 0) completedTasks++
    
    // Add state-specific tasks
    if (states.includes('NYC')) {
      totalTasks += 1 // Bias audit
      // Check if bias audit exists...
    }

    const overallStatus = completedTasks === totalTasks ? 'compliant' : 
                          completedTasks >= totalTasks * 0.5 ? 'at-risk' : 'non-compliant'

    setData({
      organization: {
        name: orgRes.data?.name || 'Your Company',
        states: states,
        subscriptionStatus: orgRes.data?.subscription_status,
        createdAt: orgRes.data?.created_at,
      },
      tools,
      disclosures: {
        hasPublicPage: hasDisclosure,
        publicPageUrl: disclosureRes.data?.slug ? `/d/${disclosureRes.data.slug}` : null,
        lastPublished: disclosureRes.data?.last_published_at,
      },
      training: {
        completed: completedTraining.length,
        total: trainingData.length,
        certificates,
      },
      consents: {
        totalCollected: consentsData.length,
        thisMonth: consentsThisMonth.length,
        optOutRate,
      },
      compliance: {
        overallStatus,
        completedTasks,
        totalTasks,
        lastUpdated: new Date().toISOString(),
      },
    })

    setLoading(false)
  }

  const handleDownloadPDF = async () => {
    setGenerating(true)
    
    // Use browser print for now (can upgrade to proper PDF generation later)
    try {
      const printContent = packetRef.current
      if (!printContent) return

      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        alert('Please allow popups to download the PDF')
        setGenerating(false)
        return
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Compliance Packet - ${data?.organization.name}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px; }
            h2 { color: #1f2937; margin-top: 30px; }
            .section { margin-bottom: 30px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; }
            .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-weight: 600; font-size: 14px; }
            .compliant { background: #dcfce7; color: #166534; }
            .at-risk { background: #fef3c7; color: #92400e; }
            .non-compliant { background: #fee2e2; color: #991b1b; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th, td { text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb; }
            th { background: #f9fafb; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; }
            .watermark { position: fixed; bottom: 20px; right: 20px; opacity: 0.1; font-size: 60px; transform: rotate(-30deg); }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          ${data?.organization.subscriptionStatus !== 'active' ? '<div class="watermark">INACTIVE</div>' : ''}
          ${printContent.innerHTML}
          <div class="footer">
            <p>Generated by AIHireLaw on ${new Date().toLocaleDateString()}</p>
            <p>This document is valid as of the generation date. Compliance status may change.</p>
            ${data?.organization.subscriptionStatus !== 'active' ? '<p style="color: #dc2626; font-weight: bold;">⚠️ SUBSCRIPTION INACTIVE - This packet may not reflect current compliance status</p>' : ''}
          </div>
        </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    } catch (err) {
      console.error('PDF generation failed:', err)
      alert('Failed to generate PDF. Please try again.')
    }

    setGenerating(false)
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!data) {
    return <div className="p-8">Failed to load data</div>
  }

  const isActive = data.organization.subscriptionStatus === 'active'
  const statusColors = {
    compliant: 'bg-green-100 text-green-800 border-green-200',
    'at-risk': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'non-compliant': 'bg-red-100 text-red-800 border-red-200',
  }

  return (
    <>
      <TaskHeader
        title="Compliance Packet"
        description="AG-ready documentation of your AI hiring compliance"
      />

      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[data.compliance.overallStatus]}`}>
              {data.compliance.overallStatus === 'compliant' ? '✓ Compliant' : 
               data.compliance.overallStatus === 'at-risk' ? '⚠ At Risk' : '✗ Non-Compliant'}
            </div>
            <span className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadPacketData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleDownloadPDF} disabled={generating}>
              {generating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Download PDF
            </Button>
          </div>
        </div>

        {/* Inactive Warning */}
        {!isActive && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <Lock className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Subscription Inactive</p>
              <p className="text-sm text-red-700 mt-1">
                Your compliance packet will be watermarked. Reactivate your subscription to remove the watermark and maintain verified compliance status.
              </p>
            </div>
          </div>
        )}

        {/* Printable Content */}
        <div ref={packetRef} className="space-y-6">
          {/* Header */}
          <div className="text-center pb-6 border-b">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">AI Hiring Compliance Packet</h1>
            </div>
            <p className="text-gray-600">{data.organization.name}</p>
            <p className="text-sm text-gray-500 mt-1">Generated {new Date().toLocaleDateString()}</p>
          </div>

          {/* Executive Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                1. Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Organization</p>
                  <p className="font-medium">{data.organization.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">States Covered</p>
                  <p className="font-medium">{data.organization.states.length > 0 ? data.organization.states.join(', ') : 'None configured'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Compliance Status</p>
                  <p className={`font-medium ${
                    data.compliance.overallStatus === 'compliant' ? 'text-green-600' :
                    data.compliance.overallStatus === 'at-risk' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {data.compliance.completedTasks}/{data.compliance.totalTasks} requirements complete
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Status</p>
                  <p className="font-medium">{isActive ? '✓ Active' : '⚠ Inactive'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Tools Inventory */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-blue-600" />
                2. AI Tools Inventory
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.tools.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 text-sm font-medium text-gray-600">Tool Name</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-600">Purpose</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-600">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.tools.map((tool, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2">{tool.name}</td>
                        <td className="py-2 text-gray-600">{tool.purpose}</td>
                        <td className="py-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            tool.riskLevel === 'High' ? 'bg-red-100 text-red-700' :
                            tool.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {tool.riskLevel}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 italic">No AI tools inventoried yet. Complete an assessment to populate this section.</p>
              )}
            </CardContent>
          </Card>

          {/* Disclosure Documentation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-600" />
                3. Disclosure Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Public Disclosure Page</span>
                  {data.disclosures.hasPublicPage ? (
                    <span className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      Published
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-yellow-600">
                      <AlertTriangle className="w-4 h-4" />
                      Not published
                    </span>
                  )}
                </div>
                {data.disclosures.publicPageUrl && (
                  <div className="text-sm text-gray-500">
                    URL: {typeof window !== 'undefined' ? window.location.origin : ''}{data.disclosures.publicPageUrl}
                  </div>
                )}
                {data.disclosures.lastPublished && (
                  <div className="text-sm text-gray-500">
                    Last published: {new Date(data.disclosures.lastPublished).toLocaleDateString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Training Certificates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                4. Training Certificates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                <span className="text-sm text-gray-500">Team Completion: </span>
                <span className="font-medium">{data.training.completed}/{data.training.total} certified</span>
              </div>
              {data.training.certificates.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 text-sm font-medium text-gray-600">Name</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-600">Certificate #</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-600">Issued</th>
                      <th className="text-left py-2 text-sm font-medium text-gray-600">Expires</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.training.certificates.map((cert, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2">{cert.name}</td>
                        <td className="py-2 font-mono text-sm">{cert.certificateNumber}</td>
                        <td className="py-2">{new Date(cert.issuedAt).toLocaleDateString()}</td>
                        <td className="py-2">{new Date(cert.expiresAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 italic">No training certificates issued yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Consent Records Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                5. Consent Records Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{data.consents.totalCollected}</div>
                  <div className="text-sm text-gray-500">Total Collected</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{data.consents.thisMonth}</div>
                  <div className="text-sm text-gray-500">This Month</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{data.consents.optOutRate}%</div>
                  <div className="text-sm text-gray-500">Opt-Out Rate</div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Consent records are retained for 4 years per California CCPA requirements.
              </p>
            </CardContent>
          </Card>

          {/* Attestation */}
          <Card className={isActive ? 'border-green-200 bg-green-50' : 'border-gray-200'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                6. Compliance Attestation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm">
                <p>
                  As of <strong>{new Date().toLocaleDateString()}</strong>, <strong>{data.organization.name}</strong> maintains 
                  an active AI hiring compliance program through AIHireLaw. This includes:
                </p>
                <ul className="mt-2 space-y-1">
                  <li>Inventory of AI tools used in hiring decisions</li>
                  <li>Published disclosure notices for candidates and employees</li>
                  <li>Ongoing training and certification for hiring personnel</li>
                  <li>Consent collection and record-keeping systems</li>
                </ul>
                {isActive ? (
                  <p className="mt-4 text-green-700 font-medium">
                    ✓ This organization maintains an active compliance subscription and is verified as of the date above.
                  </p>
                ) : (
                  <p className="mt-4 text-red-700 font-medium">
                    ⚠ Subscription inactive. This attestation cannot be verified. Compliance status may have changed.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help Text */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Scale className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">When to use this packet</p>
              <p className="text-sm text-blue-700 mt-1">
                Present this document to regulators, auditors, or legal counsel as evidence of your 
                AI hiring compliance program. Download a fresh copy before any audit to ensure the 
                most current data is included.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
