import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requirePermission } from '@/lib/permissions-server'
import type { MemberRole } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const { membership, userId } = await requirePermission('manage_team')
    const supabase = await createClient()
    
    const { email, role } = await req.json() as { email: string; role: Exclude<MemberRole, 'owner'> }
    
    if (!email || !role) {
      return NextResponse.json({ error: 'Email and role are required' }, { status: 400 })
    }
    
    // Validate role
    if (!['admin', 'manager', 'member'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }
    
    // Check if user is already a member
    const { data: existingMember } = await supabase
      .from('organization_members')
      .select('id')
      .eq('organization_id', membership.organization_id)
      .eq('user_id', (
        await supabase.from('profiles').select('id').eq('email', email).single()
      ).data?.id)
      .single()
    
    if (existingMember) {
      return NextResponse.json({ error: 'User is already a team member' }, { status: 400 })
    }
    
    // Check for existing pending invite
    const { data: existingInvite } = await supabase
      .from('team_invites')
      .select('id')
      .eq('organization_id', membership.organization_id)
      .eq('email', email.toLowerCase())
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .single()
    
    if (existingInvite) {
      return NextResponse.json({ error: 'An invite is already pending for this email' }, { status: 400 })
    }
    
    // Check seat limits
    const { data: org } = await supabase
      .from('organizations')
      .select('seat_limit, seats_used')
      .eq('id', membership.organization_id)
      .single()
    
    if (org && org.seats_used >= org.seat_limit) {
      return NextResponse.json({ 
        error: 'Seat limit reached. Please upgrade your plan to add more team members.',
        code: 'SEAT_LIMIT_REACHED'
      }, { status: 400 })
    }
    
    // Create invite
    const { data: invite, error } = await supabase
      .from('team_invites')
      .insert({
        organization_id: membership.organization_id,
        email: email.toLowerCase(),
        role,
        invited_by: userId,
      })
      .select()
      .single()
    
    if (error) {
      console.error('Failed to create invite:', error)
      return NextResponse.json({ error: 'Failed to create invite' }, { status: 500 })
    }
    
    // TODO: Send invite email via Resend
    // For now, just return the invite with token
    const inviteUrl = `${req.nextUrl.origin}/invite/${invite.token}`
    
    return NextResponse.json({ 
      success: true, 
      invite,
      inviteUrl,
    })
  } catch (error) {
    console.error('Invite error:', error)
    const message = error instanceof Error ? error.message : 'Failed to send invite'
    const status = message === 'Unauthorized' || message === 'Insufficient permissions' ? 403 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
