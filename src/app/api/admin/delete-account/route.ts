import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

// This endpoint completely deletes an organization and optionally the user
// Only accessible by super admins

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    
    // Create client for auth check
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      }
    )

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is super admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_super_admin, org_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.is_super_admin) {
      return NextResponse.json({ error: 'Forbidden: Super admin access required' }, { status: 403 })
    }

    const { deleteUser = false } = await request.json()
    const orgId = profile.org_id

    if (!orgId) {
      return NextResponse.json({ error: 'No organization found' }, { status: 400 })
    }

    // Use service role client for admin operations
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get all user IDs in this org before deletion
    const { data: orgUsers } = await adminClient
      .from('profiles')
      .select('id')
      .eq('org_id', orgId)

    // Call the deletion function
    const { error: deleteError } = await adminClient.rpc('delete_organization_completely', {
      org_uuid: orgId
    })

    if (deleteError) {
      console.error('Delete org error:', deleteError)
      return NextResponse.json({ error: 'Failed to delete organization data' }, { status: 500 })
    }

    // If deleteUser flag is set, delete all auth users from this org
    if (deleteUser && orgUsers) {
      for (const orgUser of orgUsers) {
        const { error: userDeleteError } = await adminClient.auth.admin.deleteUser(orgUser.id)
        if (userDeleteError) {
          console.error('Delete user error:', userDeleteError)
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: deleteUser 
        ? 'Organization and all users deleted' 
        : 'Organization data deleted (users preserved)'
    })

  } catch (error) {
    console.error('Delete account error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
