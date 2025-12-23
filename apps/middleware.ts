import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// The function is named 'middleware' in Next.js convention
export default function middleware(request: NextRequest) {
  // 1. Get the current path
  const path = request.nextUrl.pathname

  // 2. Define Public Routes (Pages that do NOT need login)
  const isPublicRoute = 
    path === '/login' || 
    path === '/signup' || 
    path === '/api/auth/login' // Ensure your auth API is public

  // 3. Get the Token (Check if user is logged in)
  // Note: 'session_token' must match the cookie name you set in your login action
  const token = request.cookies.get('session_token')?.value

  // 4. PROTECTION LOGIC
  
  // SCENARIO A: Unauthenticated user trying to access a Protected Route
  // (User is NOT on login/signup, and has NO token)
  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // SCENARIO B: Authenticated user trying to access Login/Signup
  // (User HAS a token, but is trying to go to login)
  if (isPublicRoute && token && path !== '/api/auth/login') {
    return NextResponse.redirect(new URL('/task', request.url))
  }

  // 5. If checks pass, allow the request to proceed
  return NextResponse.next()
}

// 6. Configuration: Tell Next.js which paths to run this proxy on
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * 1. /api/ (API routes - generally handled separately, but included in logic above)
     * 2. /_next/ (Next.js internals)
     * 3. /static (static files)
     * 4. /favicon.ico, /sitemap.xml (public assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml).*)',
  ],
}