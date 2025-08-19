import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isProd = process.env.NODE_ENV === 'production'
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  // 'unsafe-inline' is kept as a fallback for older browsers. Modern browsers will ignore it if a nonce is present.
  // 'unsafe-eval' is required by some libraries like framer-motion for dynamic style calculations.
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'unsafe-eval' 'unsafe-inline' https://www.google.com https://www.gstatic.com;
    style-src 'self' 'nonce-${nonce}' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    worker-src 'self' blob:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-src https://www.google.com;
    connect-src 'self' ${isProd ? '' : 'ws:'};
    ${isProd ? 'upgrade-insecure-requests;' : ''}
  `.replace(/\s{2,}/g, ' ').trim()

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  response.headers.set('Content-Security-Policy', cspHeader)
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Permissions-Policy', "camera=(), microphone=(), geolocation=()")
  if (isProd) {
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}