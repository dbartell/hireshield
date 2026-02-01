'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DeleteAccountButtonProps {
  isSuperAdmin: boolean
}

export function DeleteAccountButton({ isSuperAdmin }: DeleteAccountButtonProps) {
  const [showModal, setShowModal] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleteUser, setDeleteUser] = useState(true)
  const [loading, setLoading] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  if (!isSuperAdmin) return null

  const handleDelete = async () => {
    if (confirmText !== 'DELETE EVERYTHING') return
    
    setLoading(true)
    try {
      const res = await fetch('/api/admin/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deleteUser })
      })

      if (!res.ok) {
        const data = await res.json()
        alert(`Error: ${data.error}`)
        return
      }

      window.location.href = '/'
    } catch (error) {
      alert('Failed to delete account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button 
        variant="destructive" 
        size="sm" 
        className="gap-2"
        onClick={() => setShowModal(true)}
      >
        <Trash2 className="h-4 w-4" />
        Admin: Delete Account
      </Button>

      {/* First Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-xl font-bold text-red-600 flex items-center gap-2 mb-4">
              ⚠️ Delete Account & All Data
            </h2>
            
            <p className="text-gray-600 mb-4">
              This will permanently delete all organization data including:
            </p>

            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 mb-4">
              <li>All audits and findings</li>
              <li>All compliance documents</li>
              <li>Training assignments and certificates</li>
              <li>Team members and invites</li>
              <li>ATS integrations and synced data</li>
              <li>Disclosure pages</li>
            </ul>

            <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg mb-4">
              <input
                type="checkbox"
                checked={deleteUser}
                onChange={(e) => setDeleteUser(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Also delete the user account</span>
            </label>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={() => {
                  setShowModal(false)
                  setShowConfirm(true)
                }}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              ⚠️ Final Confirmation
            </h2>
            
            <p className="text-gray-600 mb-4">
              Type <strong>DELETE EVERYTHING</strong> to confirm:
            </p>

            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE EVERYTHING"
              className="w-full px-3 py-2 border rounded-md mb-4"
              autoFocus
            />

            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowConfirm(false)
                  setConfirmText('')
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDelete}
                disabled={confirmText !== 'DELETE EVERYTHING' || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Everything'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
