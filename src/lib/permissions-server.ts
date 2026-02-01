import { createClient } from '@/lib/supabase/server'
import { hasPermission, type Permission, type UserMembership } from './permissions'

export async function getUserMembership(userId: string): Promise<UserMembership | null> {
  const supabase = await createClient()
  
  const { data } = await supabase
    .from('organization_members')
    .select('organization_id, role, user_id')
    .eq('user_id', userId)
    .single()
  
  return data as UserMembership | null
}

export async function requirePermission(permission: Permission): Promise<{ 
  membership: UserMembership
  userId: string 
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Unauthorized')
  }
  
  const membership = await getUserMembership(user.id)
  
  if (!membership) {
    throw new Error('No organization membership')
  }
  
  if (!hasPermission(membership.role, permission)) {
    throw new Error('Insufficient permissions')
  }
  
  return { membership, userId: user.id }
}
