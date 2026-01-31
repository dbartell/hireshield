import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  
  // Handle ?format=md for markdown API access
  if (searchParams.get('format') === 'md' && pathname.startsWith('/compliance')) {
    const mdUrl = new URL(`/api/markdown${pathname}`, request.url)
    return NextResponse.rewrite(mdUrl)
  }
  
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
