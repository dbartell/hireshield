import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get assignment by magic token
    const { data: assignment, error } = await supabase
      .from('training_assignments')
      .select(`
        id,
        user_name,
        user_email,
        track,
        status,
        token_expires_at,
        organizations (
          name
        )
      `)
      .eq('magic_token', token)
      .single()

    if (error || !assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    // Check expiry
    if (new Date(assignment.token_expires_at) < new Date()) {
      return NextResponse.json({ error: 'Link has expired' }, { status: 404 })
    }

    const org = assignment.organizations as { name: string } | null

    return NextResponse.json({
      assignment: {
        id: assignment.id,
        user_name: assignment.user_name,
        user_email: assignment.user_email,
        track: assignment.track,
        status: assignment.status,
        org_name: org?.name || 'Your Company'
      }
    })
  } catch (error) {
    console.error('Start training error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to load assignment' 
    }, { status: 500 })
  }
}
