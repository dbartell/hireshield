import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requirePermission } from '@/lib/permissions-server'
import { canChangeToRole } from '@/lib/permissions'
import type { MemberRole } from '@/types'

// DELETE - Remove a team member
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: memberId } = await params
    const { membership, userId } = await requirePermission('manage_team')
    const supabase = await createClient()
    
    // Get the member to delete
    const { data: memberToDelete, error: fetchError } = await supabase
      .from('organization_members')
      .select('id, user_id, role, organization_id')
      .eq('id', memberId)
      .single()
    
    if (fetchError || !memberToDelete) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }
    
    // Verify same organization
    if (memberToDelete.organization_id !== membership.organization_id) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }
    
    // Can't remove yourself
    if (memberToDelete.user_id === userId) {
      return NextResponse.json({ error: "You can't remove yourself from the team" }, { status: 400 })
    }
    
    // Can't remove the owner
    if (memberToDelete.role === 'owner') {
      return NextResponse.json({ error: "The organization owner can't be removed" }, { status: 400 })
    }
    
    // Admins can only remove managers and members
    if (membership.role === 'admin' && memberToDelete.role === 'admin') {
      return NextResponse.json({ error: "Admins can't remove other admins" }, { status: 403 })
    }
    
    // Delete the member
    const { error: deleteError } = await supabase
      .from('organization_members')
      .delete()
      .eq('id', memberId)
    
    if (deleteError) {
      console.error('Failed to remove member:', deleteError)
      return NextResponse.json({ error: 'Failed to remove team member' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Remove member error:', error)
    const message = error instanceof Error ? error.message : 'Failed to remove member'
    const status = message === 'Unauthorized' || message === 'Insufficient permissions' ? 403 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

// PATCH - Update a team member's role
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: memberId } = await params
    const { membership, userId } = await requirePermission('change_roles')
    const supabase = await createClient()
    
    const { role: newRole } = await req.json() as { role: MemberRole }
    
    if (!newRole || !['admin', 'manager', 'member'].includes(newRole)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }
    
    // Get the member to update
    const { data: memberToUpdate, error: fetchError } = await supabase
      .from('organization_members')
      .select('id, user_id, role, organization_id')
      .eq('id', memberId)
      .single()
    
    if (fetchError || !memberToUpdate) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }
    
    // Verify same organization
    if (memberToUpdate.organization_id !== membership.organization_id) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }
    
    // Can't change owner's role
    if (memberToUpdate.role === 'owner') {
      return NextResponse.json({ error: "The owner's role can't be changed" }, { status: 400 })
    }
    
    // Check if user can set this role
    if (!canChangeToRole(membership.role, newRole)) {
      return NextResponse.json({ error: "You don't have permission to set this role" }, { status: 403 })
    }
    
    // Update the member's role
    const { error: updateError } = await supabase
      .from('organization_members')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', memberId)
    
    if (updateError) {
      console.error('Failed to update member role:', updateError)
      return NextResponse.json({ error: 'Failed to update role' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update role error:', error)
    const message = error instanceof Error ? error.message : 'Failed to update role'
    const status = message === 'Unauthorized' || message === 'Insufficient permissions' ? 403 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
