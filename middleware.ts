import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

// Helper function to verify the token, separating the logic for clarity.
async function isTokenValid(token: string | undefined): Promise<boolean> {
  if (!token || !JWT_SECRET) {
    return false;
  }
  try {
    const key = new TextEncoder().encode(JWT_SECRET);
    await jwtVerify(token, key);
    return true;
  } catch (err) {
    // It's common for tokens to be invalid, so logging can be noisy.
    // Only log if you need to debug token issues.
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;
  const tokenIsValid = await isTokenValid(token);

  // 1. Protect admin routes: if not on login page and token is invalid, redirect to login.
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!tokenIsValid) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // 2. Redirect logged-in users from login page: if on login page and token is valid, redirect to dashboard.
  if (pathname.startsWith('/admin/login') && tokenIsValid) {
      return NextResponse.redirect(new URL('/admin', request.url));
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
    connect-src 'self' https://www.google.com ${isProd ? 'wss:' : 'ws:'};
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