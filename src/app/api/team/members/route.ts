import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserMembership } from '@/lib/permissions-server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const membership = await getUserMembership(user.id)
    
    if (!membership) {
      return NextResponse.json({ error: 'No organization membership' }, { status: 400 })
    }
    
    // Get organization members with profile info
    const { data: members, error: membersError } = await supabase
      .from('organization_members')
      .select(`
        id,
        organization_id,
        user_id,
        role,
        joined_at,
        last_active_at,
        created_at,
        profiles!organization_members_user_id_fkey (
          email,
          full_name
        )
      `)
      .eq('organization_id', membership.organization_id)
      .order('role', { ascending: true })
      .order('joined_at', { ascending: true })
    
    if (membersError) {
      console.error('Failed to fetch members:', membersError)
      return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 })
    }
    
    // Get pending invites
    const { data: invites, error: invitesError } = await supabase
      .from('team_invites')
      .select(`
        id,
        email,
        role,
        created_at,
        expires_at,
        invited_by,
        profiles!team_invites_invited_by_fkey (
          email,
          full_name
        )
      `)
      .eq('organization_id', membership.organization_id)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
    
    if (invitesError) {
      console.error('Failed to fetch invites:', invitesError)
      // Don't fail the request, just return empty invites
    }
    
    // Get organization info for seat limits
    const { data: org } = await supabase
      .from('organizations')
      .select('seat_limit, seats_used, employee_count')
      .eq('id', membership.organization_id)
      .single()
    
    // Helper to extract profile data from join result
    const extractProfile = (profiles: unknown) => {
      if (!profiles) return undefined
      const profileData = Array.isArray(profiles) ? profiles[0] : profiles
      if (!profileData) return undefined
      const { email, full_name } = profileData as { email: string; full_name?: string }
      return { email, full_name }
    }

    // Transform the data to match our types
    const transformedMembers = members?.map(m => ({
      ...m,
      user: extractProfile(m.profiles),
      profiles: undefined, // Remove the original profiles field
    })) ?? []
    
    const transformedInvites = invites?.map(i => ({
      ...i,
      inviter: extractProfile(i.profiles),
      profiles: undefined,
    })) ?? []
    
    return NextResponse.json({
      members: transformedMembers,
      invites: transformedInvites,
      organization: {
        seat_limit: org?.seat_limit ?? 5,
        seats_used: org?.seats_used ?? 1,
        employee_count: org?.employee_count ?? 0,
      },
      currentUserRole: membership.role,
    })
  } catch (error) {
    console.error('Members fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch team data' }, { status: 500 })
  }
}
