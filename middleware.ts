import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/** Canonical host: send apex traffic to www (SEO + cookies consistentes). */
const APEX = 'doce25.org'

export function middleware(request: NextRequest) {
  const raw =
    request.headers.get('x-forwarded-host') || request.headers.get('host') || ''
  const hostname = raw.split(':')[0]?.toLowerCase() ?? ''

  if (hostname === APEX) {
    const url = request.nextUrl.clone()
    url.hostname = `www.${APEX}`
    url.protocol = 'https:'
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
