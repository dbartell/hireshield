"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Upload, Search, Download, Plus, CheckCircle, Clock, AlertTriangle, 
  FileText, Trash2, Loader2, X, Edit2 
} from "lucide-react"
import { 
  getConsentRecords, createConsentRecord, updateConsentRecord, 
  deleteConsentRecord, bulkImportConsent, getConsentStats, ConsentRecord 
} from "@/lib/actions/consent"

export default function ConsentPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [records, setRecords] = useState<ConsentRecord[]>([])
  const [stats, setStats] = useState({ total: 0, consented: 0, pending: 0, declined: 0 })
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingRecord, setEditingRecord] = useState<ConsentRecord | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [formData, setFormData] = useState({
    candidate_name: '',
    candidate_email: '',
    position: '',
    disclosure_date: new Date().toISOString().split('T')[0],
    consent_date: '',
    status: 'pending' as 'pending' | 'consented' | 'declined'
  })

  useEffect(() => {
    loadData()
  }, [statusFilter, searchQuery])

  const loadData = async () => {
    setLoading(true)
    const [recordsData, statsData] = await Promise.all([
      getConsentRecords({ status: statusFilter, search: searchQuery }),
      getConsentStats()
    ])
    setRecords(recordsData)
    setStats(statsData)
    setLoading(false)
  }

  const resetForm = () => {
    setFormData({
      candidate_name: '',
      candidate_email: '',
      position: '',
      disclosure_date: new Date().toISOString().split('T')[0],
      consent_date: '',
      status: 'pending'
    })
    setEditingRecord(null)
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    if (editingRecord) {
      await updateConsentRecord(editingRecord.id, {
        ...formData,
        consent_date: formData.consent_date || null,
      })
    } else {
      await createConsentRecord({
        ...formData,
        consent_date: formData.consent_date || null,
      })
    }

    await loadData()
    resetForm()
    setSaving(false)
  }

  const handleEdit = (record: ConsentRecord) => {
    setEditingRecord(record)
    setFormData({
      candidate_name: record.candidate_name,
      candidate_email: record.candidate_email,
      position: record.position || '',
      disclosure_date: record.disclosure_date,
      consent_date: record.consent_date || '',
      status: record.status as 'pending' | 'consented' | 'declined'
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return
    
    setDeleting(id)
    await deleteConsentRecord(id)
    await loadData()
    setDeleting(null)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImporting(true)

    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
      
      const records = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim())
        const record: Record<string, string> = {}
        headers.forEach((h, i) => {
          record[h] = values[i] || ''
        })
        return {
          candidate_name: record['name'] || record['candidate_name'] || '',
          candidate_email: record['email'] || record['candidate_email'] || '',
          position: record['position'] || '',
          disclosure_date: record['disclosure_date'] || new Date().toISOString().split('T')[0],
          consent_date: record['consent_date'] || '',
          status: (record['status'] || 'pending') as string
        }
      }).filter(r => r.candidate_email && r.candidate_name)

      if (records.length > 0) {
        const result = await bulkImportConsent(records)
        if (result.error) {
          alert(`Import error: ${result.error}`)
        } else {
          alert(`Successfully imported ${result.count} records`)
          await loadData()
        }
      } else {
        alert('No valid records found in CSV')
      }
    } catch (err) {
      alert('Error parsing CSV file')
    }

    setImporting(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const exportToCsv = () => {
    const headers = ['Name', 'Email', 'Position', 'Disclosure Date', 'Consent Date', 'Status']
    const rows = records.map(r => [
      r.candidate_name,
      r.candidate_email,
      r.position || '',
      r.disclosure_date,
      r.consent_date || '',
      r.status
    ])
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `consent-records-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
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
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
            >
              {importing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              Import CSV
            </Button>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" /> Add Record
            </Button>
          </div>
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{editingRecord ? 'Edit Record' : 'Add Consent Record'}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={resetForm}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Candidate Name *</label>
                    <input
                      type="text"
                      value={formData.candidate_name}
                      onChange={e => setFormData({ ...formData, candidate_name: e.target.value })}
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <input
                      type="email"
                      value={formData.candidate_email}
                      onChange={e => setFormData({ ...formData, candidate_email: e.target.value })}
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Position</label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={e => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Disclosure Date *</label>
                      <input
                        type="date"
                        value={formData.disclosure_date}
                        onChange={e => setFormData({ ...formData, disclosure_date: e.target.value })}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Consent Date</label>
                      <input
                        type="date"
                        value={formData.consent_date}
                        onChange={e => setFormData({ ...formData, consent_date: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as 'pending' | 'consented' | 'declined' })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="consented">Consented</option>
                      <option value="declined">Declined</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={saving} className="flex-1">
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : editingRecord ? 'Update' : 'Add Record'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Records</p>
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
                  <p className="text-sm text-gray-600">Consented</p>
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
                  <p className="text-sm text-gray-600">Pending</p>
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
                  <p className="text-sm text-gray-600">Declined</p>
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
              <Button variant="outline" size="sm" onClick={exportToCsv} disabled={records.length === 0}>
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
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
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
              </div>
            ) : records.length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                {searchQuery || statusFilter !== 'all' 
                  ? 'No records found matching your filters.'
                  : 'No consent records yet. Add your first record to get started.'}
              </div>
            ) : (
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
                    {records.map(record => (
                      <tr key={record.id} className="border-b hover:bg-gray-50">
                        <td className="py-4">
                          <div className="font-medium">{record.candidate_name}</div>
                          <div className="text-sm text-gray-600">{record.candidate_email}</div>
                        </td>
                        <td className="py-4 text-gray-600">{record.position || '—'}</td>
                        <td className="py-4 text-gray-600">{record.disclosure_date}</td>
                        <td className="py-4 text-gray-600">{record.consent_date || '—'}</td>
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
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(record)}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDelete(record.id)}
                              disabled={deleting === record.id}
                            >
                              {deleting === record.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4 text-red-500" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                  Import consent records from your ATS or HRIS using CSV. Required columns: name, email, disclosure_date. Optional: position, consent_date, status.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3"
                  onClick={() => {
                    const csv = 'name,email,position,disclosure_date,consent_date,status\nJohn Doe,john@example.com,Software Engineer,2026-01-15,2026-01-16,consented'
                    const blob = new Blob([csv], { type: 'text/csv' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'consent-template.csv'
                    a.click()
                  }}
                >
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
