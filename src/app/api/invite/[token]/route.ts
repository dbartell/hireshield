import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Get invite details (for the invite page)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const supabase = await createClient()
    
    const { data: invite, error } = await supabase
      .from('team_invites')
      .select(`
        id,
        email,
        role,
        expires_at,
        accepted_at,
        organization_id,
        organizations!team_invites_organization_id_fkey (
          name
        )
      `)
      .eq('token', token)
      .single()
    
    if (error || !invite) {
      return NextResponse.json({ error: 'Invite not found' }, { status: 404 })
    }
    
    // Check if already accepted
    if (invite.accepted_at) {
      return NextResponse.json({ error: 'This invite has already been used' }, { status: 400 })
    }
    
    // Check if expired
    if (new Date(invite.expires_at) < new Date()) {
      return NextResponse.json({ error: 'This invite has expired' }, { status: 400 })
    }
    
    // Handle the organizations join - it can be object or array depending on supabase version
    const orgData = invite.organizations as unknown
    const orgName = Array.isArray(orgData) 
      ? (orgData[0] as { name: string } | undefined)?.name 
      : (orgData as { name: string } | null)?.name

    return NextResponse.json({
      invite: {
        email: invite.email,
        role: invite.role,
        expires_at: invite.expires_at,
        organization: orgName ? { name: orgName } : undefined,
      },
    })
  } catch (error) {
    console.error('Get invite error:', error)
    return NextResponse.json({ error: 'Failed to get invite' }, { status: 500 })
  }
}

// POST - Accept the invite
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const supabase = await createClient()
    
    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ 
        error: 'You must be logged in to accept this invite',
        code: 'UNAUTHORIZED'
      }, { status: 401 })
    }
    
    // Get the invite
    const { data: invite, error: inviteError } = await supabase
      .from('team_invites')
      .select('*')
      .eq('token', token)
      .single()
    
    if (inviteError || !invite) {
      return NextResponse.json({ error: 'Invite not found' }, { status: 404 })
    }
    
    // Check if already accepted
    if (invite.accepted_at) {
      return NextResponse.json({ error: 'This invite has already been used' }, { status: 400 })
    }
    
    // Check if expired
    if (new Date(invite.expires_at) < new Date()) {
      return NextResponse.json({ error: 'This invite has expired' }, { status: 400 })
    }
    
    // Check if email matches
    if (user.email?.toLowerCase() !== invite.email.toLowerCase()) {
      return NextResponse.json({ 
        error: `This invite was sent to ${invite.email}. Please log in with that email address.`,
        code: 'EMAIL_MISMATCH'
      }, { status: 400 })
    }
    
    // Check if user is already in an organization
    const { data: existingMembership } = await supabase
      .from('organization_members')
      .select('id, organization_id')
      .eq('user_id', user.id)
      .single()
    
    if (existingMembership) {
      // Check if it's the same organization
      if (existingMembership.organization_id === invite.organization_id) {
        return NextResponse.json({ 
          error: 'You are already a member of this organization',
          code: 'ALREADY_MEMBER'
        }, { status: 400 })
      }
      
      return NextResponse.json({ 
        error: 'You are already a member of another organization. Multi-org support is not yet available.',
        code: 'ALREADY_IN_ORG'
      }, { status: 400 })
    }
    
    // Check seat limits
    const { data: org } = await supabase
      .from('organizations')
      .select('seat_limit, seats_used')
      .eq('id', invite.organization_id)
      .single()
    
    if (org && org.seats_used >= org.seat_limit) {
      return NextResponse.json({ 
        error: 'This organization has reached its seat limit. Please contact the admin.',
        code: 'SEAT_LIMIT_REACHED'
      }, { status: 400 })
    }
    
    // Create the membership
    const { error: memberError } = await supabase
      .from('organization_members')
      .insert({
        organization_id: invite.organization_id,
        user_id: user.id,
        role: invite.role,
        invited_by: invite.invited_by,
      })
    
    if (memberError) {
      console.error('Failed to create membership:', memberError)
      return NextResponse.json({ error: 'Failed to join organization' }, { status: 500 })
    }
    
    // Update user's profile with org_id (for backwards compatibility)
    await supabase
      .from('profiles')
      .update({ org_id: invite.organization_id })
      .eq('id', user.id)
    
    // Mark invite as accepted
    await supabase
      .from('team_invites')
      .update({ accepted_at: new Date().toISOString() })
      .eq('id', invite.id)
    
    return NextResponse.json({ 
      success: true,
      message: 'Welcome to the team!',
      redirect: '/dashboard'
    })
  } catch (error) {
    console.error('Accept invite error:', error)
    return NextResponse.json({ error: 'Failed to accept invite' }, { status: 500 })
  }
}

// DELETE - Cancel/revoke the invite (admin action)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get the invite
    const { data: invite, error: inviteError } = await supabase
      .from('team_invites')
      .select('id, organization_id')
      .eq('token', token)
      .single()
    
    if (inviteError || !invite) {
      return NextResponse.json({ error: 'Invite not found' }, { status: 404 })
    }
    
    // Check if user is admin/owner of the org
    const { data: membership } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', invite.organization_id)
      .eq('user_id', user.id)
      .single()
    
    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }
    
    // Delete the invite
    const { error: deleteError } = await supabase
      .from('team_invites')
      .delete()
      .eq('id', invite.id)
    
    if (deleteError) {
      console.error('Failed to delete invite:', deleteError)
      return NextResponse.json({ error: 'Failed to cancel invite' }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cancel invite error:', error)
    return NextResponse.json({ error: 'Failed to cancel invite' }, { status: 500 })
  }
}
