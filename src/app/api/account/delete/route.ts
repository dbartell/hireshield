import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function DELETE(req: NextRequest) {
  try {
    // Verify user is authenticated
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.id

    // Delete all user data (order matters for foreign keys)
    await supabaseAdmin.from('training_assignments').delete().eq('org_id', userId)
    await supabaseAdmin.from('consents').delete().eq('org_id', userId)
    await supabaseAdmin.from('documents').delete().eq('org_id', userId)
    await supabaseAdmin.from('audits').delete().eq('org_id', userId)
    await supabaseAdmin.from('hiring_states').delete().eq('org_id', userId)
    await supabaseAdmin.from('hiring_tools').delete().eq('org_id', userId)
    await supabaseAdmin.from('disclosure_pages').delete().eq('organization_id', userId)
    await supabaseAdmin.from('users').delete().eq('id', userId)
    await supabaseAdmin.from('organizations').delete().eq('id', userId)

    // Delete the auth user
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (deleteError) {
      console.error('Error deleting auth user:', deleteError)
      return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete account error:', error)
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }
}
