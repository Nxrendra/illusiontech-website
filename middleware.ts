import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get('auth_token');

  // 1. Check for a valid token on all admin routes except the login page
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // If there's no token or no secret key, redirect to login
    if (!tokenCookie || !JWT_SECRET) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const key = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(tokenCookie.value, key);
      // Token is valid, allow the request to proceed
    } catch (error) {
      // Token is invalid, redirect to the login page
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // 2. If a logged-in user tries to go to the login page, redirect them to the dashboard
  if (pathname.startsWith('/admin/login') && tokenCookie && JWT_SECRET) {
    try {
      const key = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(tokenCookie.value, key);
      return NextResponse.redirect(new URL('/admin', request.url));
    } catch (error) {
      // Token is invalid, so let them stay on the login page.
    }
  }

  const isProd = process.env.NODE_ENV === 'production'
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  // 'unsafe-inline' is kept as a fallback for older browsers. Modern browsers will ignore it if a nonce is present.
  // 'unsafe-eval' is required by some libraries like framer-motion for dynamic style calculations.
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'unsafe-eval' 'unsafe-inline' https://www.google.com https://www.gstatic.com;
    style-src 'self' 'nonce-${nonce}' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://www.google.com;
    font-src 'self' https://fonts.gstatic.com;
    worker-src 'self' blob:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-src https://www.google.com;
    connect-src 'self' https://www.google.com ${isProd ? '' : 'ws:'};
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
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes), _next/static (static files), _next/image, favicon.ico
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}