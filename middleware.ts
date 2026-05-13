import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/** Canonical host: apex (y typo histórico) → www (SEO + cookies consistentes). */
const APEX_HOSTS = new Set(['doce25.org', 'dosce25.org'])
const WWW_HOST = 'www.doce25.org'

export function middleware(request: NextRequest) {
  const raw =
    request.headers.get('x-forwarded-host') || request.headers.get('host') || ''
  const hostname = raw.split(':')[0]?.toLowerCase() ?? ''

  if (APEX_HOSTS.has(hostname)) {
    const url = request.nextUrl.clone()
    url.hostname = WWW_HOST
    url.protocol = 'https:'
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
