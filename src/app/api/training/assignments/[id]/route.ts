import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requirePermission } from '@/lib/permissions-server'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { membership } = await requirePermission('manage_team')
    const supabase = await createClient()

    // Verify assignment belongs to this org
    const { data: assignment } = await supabase
      .from('training_assignments')
      .select('id, org_id')
      .eq('id', id)
      .single()

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    if (assignment.org_id !== membership.organization_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Delete (cascades to progress, quizzes, certificates)
    const { error } = await supabase
      .from('training_assignments')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Failed to delete assignment:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete assignment error:', error)
    const message = error instanceof Error ? error.message : 'Failed to delete'
    const status = message === 'Unauthorized' || message === 'Insufficient permissions' ? 403 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
