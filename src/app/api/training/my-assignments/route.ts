import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's organization
    const { data: membership } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', user.id)
      .single()

    if (!membership) {
      return NextResponse.json({ assignments: [] })
    }

    // Get assignments for this user (by email)
    const { data: assignments, error } = await supabase
      .from('training_assignments')
      .select(`
        id,
        track,
        status,
        user_name,
        completed_at,
        certificate_id,
        training_progress (
          section_number,
          completed_at
        ),
        training_certificates (
          certificate_number,
          issued_at,
          expires_at,
          pdf_url
        )
      `)
      .eq('org_id', membership.organization_id)
      .eq('user_email', user.email?.toLowerCase())
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch assignments:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform the response
    const transformed = assignments?.map(a => ({
      id: a.id,
      track: a.track,
      status: a.status,
      user_name: a.user_name,
      completed_at: a.completed_at,
      certificate_id: a.certificate_id,
      progress: a.training_progress || [],
      certificate: a.training_certificates?.[0] || null
    })) || []

    return NextResponse.json({ assignments: transformed })
  } catch (error) {
    console.error('My assignments error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch assignments' 
    }, { status: 500 })
  }
}
