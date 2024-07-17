import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of public routes that don't require authentication
const publicRoutes = ['/', '/forgotPassword', '/login', '/otp-verification', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the requested path is a public route
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check for the presence of the auth_token cookie
  const authToken = request.cookies.get('auth_token')

  // If auth_token is not present, redirect to login page
  if (!authToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If auth_token is present, allow the request to proceed
  return NextResponse.next()
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
