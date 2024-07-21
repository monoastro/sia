import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = ['/', '/forgotPassword', '/login', '/otp-verification', '/register']

export const middleware = (request: NextRequest) =>
{
	const { pathname } = request.nextUrl;
	const authToken = request.cookies.get('token');

	console.log("[Path: ", pathname, "]");

	//two redirects are defined 
	//if the route is not public and the user is not authenticated, redirect to login
	//if the route is public and the user is authenticated, redirect to dashboard with the exception of the home page
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
