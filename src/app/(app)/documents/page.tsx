"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, Eye, Plus, CheckCircle, Clock, AlertTriangle } from "lucide-react"

const documentTypes = [
  {
    id: "disclosure-candidate",
    name: "Candidate Disclosure Notice",
    description: "Notify job candidates that AI is used in the hiring process",
    states: ["IL", "CA", "CO", "NYC"],
    icon: FileText
  },
  {
    id: "disclosure-employee",
    name: "Employee Disclosure Notice",
    description: "Notify employees about AI use in employment decisions",
    states: ["IL", "CA", "CO"],
    icon: FileText
  },
  {
    id: "consent-form",
    name: "Candidate Consent Form",
    description: "Collect candidate consent for AI processing",
    states: ["CA", "CO"],
    icon: FileText
  },
  {
    id: "handbook-policy",
    name: "Employee Handbook Policy",
    description: "AI use policy section for employee handbook",
    states: ["IL", "CA", "CO"],
    icon: FileText
  },
  {
    id: "impact-assessment",
    name: "Impact Assessment",
    description: "Document AI system impact for Colorado compliance",
    states: ["CO"],
    icon: FileText
  },
  {
    id: "bias-audit-disclosure",
    name: "Bias Audit Disclosure",
    description: "Public disclosure page for NYC AEDT bias audit",
    states: ["NYC"],
    icon: FileText
  }
]

const generatedDocs = [
  {
    id: "1",
    name: "Candidate Disclosure Notice - Illinois",
    type: "disclosure-candidate",
    createdAt: "2026-01-15",
    status: "active"
  },
  {
    id: "2",
    name: "Employee Handbook Policy",
    type: "handbook-policy",
    createdAt: "2026-01-10",
    status: "draft"
  },
  {
    id: "3",
    name: "Impact Assessment - Colorado",
    type: "impact-assessment",
    createdAt: "2026-01-08",
    status: "review"
  }
]

export default function DocumentsPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [showGenerator, setShowGenerator] = useState(false)

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
            <p className="text-gray-600">Generate and manage compliance documents</p>
          </div>
          <Button onClick={() => setShowGenerator(true)}>
            <Plus className="w-4 h-4 mr-2" /> New Document
          </Button>
        </div>

        {/* Document Generator Modal/Section */}
        {showGenerator && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle>Generate New Document</CardTitle>
              <CardDescription>Select the type of document you need to create</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documentTypes.map(docType => (
                  <button
                    key={docType.id}
                    onClick={() => setSelectedType(docType.id)}
                    className={`p-4 text-left rounded-lg border transition-colors ${
                      selectedType === docType.id
                        ? 'bg-white border-blue-600 shadow-sm'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <docType.icon className="w-6 h-6 text-blue-600 mb-2" />
                    <div className="font-medium">{docType.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{docType.description}</div>
                    <div className="flex gap-1 mt-2">
                      {docType.states.map(state => (
                        <span key={state} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                          {state}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setShowGenerator(false)}>
                  Cancel
                </Button>
                <Button disabled={!selectedType}>
                  Continue to Generator
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generated Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Your Documents</CardTitle>
            <CardDescription>Previously generated compliance documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedDocs.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">{doc.name}</div>
                      <div className="text-sm text-gray-500">Created {doc.createdAt}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                      doc.status === 'active' ? 'bg-green-100 text-green-700' :
                      doc.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {doc.status === 'active' && <CheckCircle className="w-3 h-3" />}
                      {doc.status === 'draft' && <Clock className="w-3 h-3" />}
                      {doc.status === 'review' && <AlertTriangle className="w-3 h-3" />}
                      {doc.status}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Document Templates Info */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">State-Specific Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Our document generator creates templates customized for each state's specific requirements, including:
              </p>
              <ul className="text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Illinois HB 3773 disclosure requirements
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Colorado AI Act impact assessment format
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  California CCPA ADMT notice language
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  NYC Local Law 144 bias audit disclosure
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Document Formats</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Export your documents in multiple formats:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="font-medium text-sm">PDF</div>
                    <div className="text-xs text-gray-500">Print-ready format</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-sm">Word (DOCX)</div>
                    <div className="text-xs text-gray-500">Editable format</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium text-sm">HTML</div>
                    <div className="text-xs text-gray-500">For website embedding</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
