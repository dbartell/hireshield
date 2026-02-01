'use client'

import { useState } from 'react'
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface DeleteAccountButtonProps {
  isSuperAdmin: boolean
}

export function DeleteAccountButton({ isSuperAdmin }: DeleteAccountButtonProps) {
  const [open, setOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
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

      // Redirect to home after successful deletion
      window.location.href = '/'
    } catch (error) {
      alert('Failed to delete account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive" size="sm" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Admin: Delete Account
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Account & All Data
            </DialogTitle>
            <DialogDescription>
              This will permanently delete all organization data including:
            </DialogDescription>
          </DialogHeader>

          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 my-4">
            <li>All audits and findings</li>
            <li>All compliance documents</li>
            <li>Training assignments and certificates</li>
            <li>Team members and invites</li>
            <li>ATS integrations and synced data</li>
            <li>Disclosure pages</li>
            <li>All other organization data</li>
          </ul>

          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="delete-user"
              checked={deleteUser}
              onChange={(e) => setDeleteUser(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="delete-user" className="text-sm">
              Also delete the user account (can&apos;t sign back in)
            </label>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                setOpen(false)
                setConfirmOpen(true)
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Second confirmation dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">
              ⚠️ Final Confirmation
            </DialogTitle>
            <DialogDescription>
              Type <strong>DELETE EVERYTHING</strong> to confirm:
            </DialogDescription>
          </DialogHeader>

          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE EVERYTHING"
            className="w-full px-3 py-2 border rounded-md"
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setConfirmOpen(false)
              setConfirmText('')
            }}>
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
