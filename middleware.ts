import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = ['/', '/forgotPassword', '/login', '/otp-verification', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  if (publicRoutes.includes(pathname))
	{
    return NextResponse.next()
  }

  const authToken = request.cookies.get('auth_token')

  if (!authToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
