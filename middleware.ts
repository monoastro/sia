import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { getUserInfoLocal, setUserInfoLocal } from './lib/utils';
import { getAPI } from './lib/api';

//two redirects are defined 
//if the route is not public and the user is not authenticated, redirect to login
//if the route is public and the user is authenticated, redirect to dashboard with the exception of the home page
const publicRoutes = ['/', '/forgotPassword', '/login', '/otp-verification', '/register']

const fetchUserInfo = async () =>
{
	try 
	{
		const userId = getUserInfoLocal().user_id;
		const data = await getAPI(`users/${userId}`);
		if (data)
		{
			setUserInfoLocal(data[0]);
		}
	}
	catch (error)
	{
		console.error("Failed to fetch user information", error);
	}
};

export const middleware = (request: NextRequest) =>
{
	const { pathname } = request.nextUrl;
//	console.log("[Path: ", pathname, "]");

	//check if cookie is valid
	const cookie = request.cookies.get('token');
	//instead of doing this check in the frontend, make bibek create an endpoint that will return the user information based on the cookie
	//server will read the cookie, validate it, and return the user information which solves the problem of non-constant user information
	//if the cookie is invalid, the server will return null and the frontend will redirect to login

	if(!publicRoutes.includes(pathname))
	{
		if(!cookie) 
		{
			console.error("Cookie expired or not found. Please login again.");
			return NextResponse.redirect(new URL('/login', request.url));
		}
	}
	else if (cookie)
	{
		fetchUserInfo();
		if(pathname!=='/') return NextResponse.redirect(new URL('/application/dashboard', request.url));
	}

	return NextResponse.next();
};

//routes this middleware should run on
export const config = 
{
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
