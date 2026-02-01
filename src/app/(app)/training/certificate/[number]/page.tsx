"use client"

import { useState, useEffect, useRef, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Award, Download, ArrowLeft, Loader2, CheckCircle, 
  Calendar, Building, User, Shield
} from "lucide-react"
import { TRACK_LABELS, type TrainingTrack } from "@/lib/training-data"

interface Certificate {
  certificate_number: string
  issued_at: string
  expires_at: string
  employee_name: string
  company_name: string
  track: TrainingTrack
  track_title: string
}

interface PageProps {
  params: Promise<{ number: string }>
}

export default function CertificatePage({ params }: PageProps) {
  const { number } = use(params)
  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)
  const certRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadCertificate()
  }, [number])

  const loadCertificate = async () => {
    try {
      const res = await fetch(`/api/training/certificate/${number}`)
      if (!res.ok) {
        if (res.status === 404) {
          setError('Certificate not found')
        } else {
          throw new Error('Failed to load certificate')
        }
        return
      }
      const data = await res.json()
      setCertificate(data.certificate)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = async () => {
    if (!certificate || !certRef.current) return
    
    setDownloading(true)
    try {
      // Dynamic import jspdf
      const { jsPDF } = await import('jspdf')
      
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })

      // Background
      doc.setFillColor(248, 250, 252)
      doc.rect(0, 0, 297, 210, 'F')

      // Border
      doc.setDrawColor(59, 130, 246)
      doc.setLineWidth(2)
      doc.rect(10, 10, 277, 190)
      doc.setLineWidth(0.5)
      doc.rect(15, 15, 267, 180)

      // Header
      doc.setFillColor(30, 64, 175)
      doc.rect(20, 20, 257, 30, 'F')
      
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      doc.text('CERTIFICATE OF COMPLETION', 148.5, 38, { align: 'center' })

      // Shield icon area
      doc.setFillColor(234, 179, 8)
      doc.circle(148.5, 70, 15, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(20)
      doc.text('✓', 148.5, 76, { align: 'center' })

      // Main content
      doc.setTextColor(31, 41, 55)
      doc.setFontSize(14)
      doc.setFont('helvetica', 'normal')
      doc.text('This certifies that', 148.5, 100, { align: 'center' })

      doc.setFontSize(28)
      doc.setFont('helvetica', 'bold')
      doc.text(certificate.employee_name, 148.5, 115, { align: 'center' })

      doc.setFontSize(14)
      doc.setFont('helvetica', 'normal')
      doc.text('has successfully completed', 148.5, 130, { align: 'center' })

      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(30, 64, 175)
      doc.text(certificate.track_title, 148.5, 145, { align: 'center' })

      doc.setTextColor(31, 41, 55)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text('AI Hiring Compliance Training', 148.5, 155, { align: 'center' })

      // Details box
      doc.setFillColor(249, 250, 251)
      doc.roundedRect(60, 165, 177, 25, 3, 3, 'F')
      
      doc.setFontSize(10)
      doc.text(`Certificate #: ${certificate.certificate_number}`, 70, 175)
      doc.text(`Issued: ${new Date(certificate.issued_at).toLocaleDateString()}`, 148.5, 175, { align: 'center' })
      doc.text(`Expires: ${new Date(certificate.expires_at).toLocaleDateString()}`, 227, 175, { align: 'right' })
      doc.text(`Organization: ${certificate.company_name}`, 148.5, 183, { align: 'center' })

      // Footer
      doc.setFontSize(8)
      doc.setTextColor(107, 114, 128)
      doc.text('Powered by AIHireLaw | www.aihirelaw.com', 148.5, 200, { align: 'center' })

      doc.save(`certificate-${certificate.certificate_number}.pdf`)
    } catch (err) {
      console.error('PDF generation error:', err)
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error || !certificate) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center py-12">
          <p className="text-red-600 mb-4">{error || 'Certificate not found'}</p>
          <Link href="/training">
            <Button>Back to Training</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isExpired = new Date(certificate.expires_at) < new Date()

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/training"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Training
          </Link>
        </div>

        {/* Certificate Card */}
        <Card className="overflow-hidden">
          <div 
            ref={certRef}
            className="bg-gradient-to-br from-slate-50 to-blue-50 p-8"
          >
            {/* Certificate Header */}
            <div className="bg-blue-800 text-white text-center py-4 px-6 rounded-t-lg">
              <h1 className="text-2xl font-bold tracking-wide">CERTIFICATE OF COMPLETION</h1>
            </div>

            {/* Certificate Body */}
            <div className="bg-white border-2 border-blue-800 border-t-0 rounded-b-lg p-8 text-center">
              {/* Award Icon */}
              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>

              <p className="text-gray-600 mb-2">This certifies that</p>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {certificate.employee_name}
              </h2>

              <p className="text-gray-600 mb-4">has successfully completed</p>

              <h3 className="text-xl font-bold text-blue-800 mb-1">
                {certificate.track_title}
              </h3>
              <p className="text-gray-600 mb-6">AI Hiring Compliance Training</p>

              {/* Details */}
              <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Certificate #:</span>
                    <span className="font-medium">{certificate.certificate_number}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Organization:</span>
                    <span className="font-medium">{certificate.company_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Issued:</span>
                    <span className="font-medium">{new Date(certificate.issued_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Expires:</span>
                    <span className={`font-medium ${isExpired ? 'text-red-600' : ''}`}>
                      {new Date(certificate.expires_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {isExpired && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  This certificate has expired. Please complete recertification training.
                </div>
              )}

              {/* Footer */}
              <p className="text-xs text-gray-400 mt-6">
                Powered by AIHireLaw | www.aihirelaw.com
              </p>
            </div>
          </div>

          <CardContent className="border-t bg-gray-50 py-4">
            <div className="flex justify-center">
              <Button onClick={downloadPDF} disabled={downloading}>
                {downloading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
