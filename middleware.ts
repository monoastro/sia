import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = ['/', '/forgotPassword', '/login', '/otp-verification', '/register']

export const middleware = (request: NextRequest) =>
{
	const { pathname } = request.nextUrl;
	const authToken = request.cookies.get('chocolate-chip');

	console.log("[Path: ", pathname, "]");

	if(!publicRoutes.includes(pathname))
	{
		if(!authToken) return NextResponse.redirect(new URL('/login', request.url));
	}
	else
	{
		if(authToken && pathname!=='/') return NextResponse.redirect(new URL('/application/dashboard', request.url));
	}

	return NextResponse.next();
};

//routes this middleware should run on
export const config = 
{
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
