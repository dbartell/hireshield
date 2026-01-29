"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Search, Download, Plus, CheckCircle, Clock, AlertTriangle, FileText, Filter } from "lucide-react"

const mockRecords = [
  {
    id: "1",
    candidateName: "John Smith",
    candidateEmail: "john.smith@email.com",
    position: "Software Engineer",
    disclosureDate: "2026-01-15",
    consentDate: "2026-01-16",
    status: "consented"
  },
  {
    id: "2",
    candidateName: "Sarah Johnson",
    candidateEmail: "sarah.j@email.com",
    position: "Product Manager",
    disclosureDate: "2026-01-14",
    consentDate: null,
    status: "pending"
  },
  {
    id: "3",
    candidateName: "Mike Chen",
    candidateEmail: "mchen@email.com",
    position: "Data Analyst",
    disclosureDate: "2026-01-12",
    consentDate: "2026-01-12",
    status: "consented"
  },
  {
    id: "4",
    candidateName: "Emily Davis",
    candidateEmail: "emily.d@email.com",
    position: "Marketing Manager",
    disclosureDate: "2026-01-10",
    consentDate: null,
    status: "declined"
  },
  {
    id: "5",
    candidateName: "Alex Wong",
    candidateEmail: "awong@email.com",
    position: "UX Designer",
    disclosureDate: "2026-01-08",
    consentDate: "2026-01-09",
    status: "consented"
  }
]

export default function ConsentPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredRecords = mockRecords.filter(record => {
    const matchesSearch = record.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.candidateEmail.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: mockRecords.length,
    consented: mockRecords.filter(r => r.status === "consented").length,
    pending: mockRecords.filter(r => r.status === "pending").length,
    declined: mockRecords.filter(r => r.status === "declined").length
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Consent Tracking</h1>
            <p className="text-gray-600">Track candidate disclosures and consent records</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" /> Import CSV
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Add Record
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Records</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Consented</p>
                  <p className="text-2xl font-bold text-green-600">{stats.consented}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Declined</p>
                  <p className="text-2xl font-bold text-red-600">{stats.declined}</p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Records Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Consent Records</CardTitle>
                <CardDescription>All candidate disclosure and consent records</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="consented">Consented</option>
                <option value="pending">Pending</option>
                <option value="declined">Declined</option>
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium text-gray-600">Candidate</th>
                    <th className="pb-3 font-medium text-gray-600">Position</th>
                    <th className="pb-3 font-medium text-gray-600">Disclosure Date</th>
                    <th className="pb-3 font-medium text-gray-600">Consent Date</th>
                    <th className="pb-3 font-medium text-gray-600">Status</th>
                    <th className="pb-3 font-medium text-gray-600"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map(record => (
                    <tr key={record.id} className="border-b hover:bg-gray-50">
                      <td className="py-4">
                        <div className="font-medium">{record.candidateName}</div>
                        <div className="text-sm text-gray-500">{record.candidateEmail}</div>
                      </td>
                      <td className="py-4 text-gray-600">{record.position}</td>
                      <td className="py-4 text-gray-600">{record.disclosureDate}</td>
                      <td className="py-4 text-gray-600">{record.consentDate || "—"}</td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                          record.status === 'consented' ? 'bg-green-100 text-green-700' :
                          record.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {record.status === 'consented' && <CheckCircle className="w-3 h-3" />}
                          {record.status === 'pending' && <Clock className="w-3 h-3" />}
                          {record.status === 'declined' && <AlertTriangle className="w-3 h-3" />}
                          {record.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <Button variant="ghost" size="sm">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredRecords.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No records found matching your search.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Card */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Upload className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Bulk Import</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Import consent records from your ATS or HRIS using our CSV template. Download the template to see the required format.
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  Download CSV Template
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
