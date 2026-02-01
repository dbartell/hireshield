import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requirePermission } from '@/lib/permissions-server'

export async function GET(req: NextRequest) {
  try {
    const { membership } = await requirePermission('manage_team')
    const supabase = await createClient()

    // Get all assignments for this org
    const { data: assignments, error } = await supabase
      .from('training_assignments')
      .select(`
        id,
        user_email,
        user_name,
        track,
        status,
        assigned_at,
        completed_at,
        training_progress (
          section_number,
          completed_at
        ),
        training_certificates (
          certificate_number,
          expires_at
        )
      `)
      .eq('org_id', membership.organization_id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch assignments:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform
    const transformed = assignments?.map(a => ({
      id: a.id,
      user_email: a.user_email,
      user_name: a.user_name,
      track: a.track,
      status: a.status,
      assigned_at: a.assigned_at,
      completed_at: a.completed_at,
      progress_count: a.training_progress?.filter(p => p.completed_at).length || 0,
      certificate: a.training_certificates?.[0] || null
    })) || []

    return NextResponse.json({ assignments: transformed })
  } catch (error) {
    console.error('Assignments error:', error)
    const message = error instanceof Error ? error.message : 'Failed to fetch'
    const status = message === 'Unauthorized' || message === 'Insufficient permissions' ? 403 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
