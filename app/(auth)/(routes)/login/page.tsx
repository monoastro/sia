"use client";

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { setCookie } from 'cookies-next';

import { postAPI } from '@/lib/api';


const LoginPage = () =>
{
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) =>
	{
		e.preventDefault();
		const userData = JSON.stringify({ email, password });

		setLoading(true);
		setError('');

		try
		{
			console.log("Requesting electrocord for login");
			const data = await postAPI('auth/signin', userData);

			//In the middle of production, somehow someway base64 encoding changed into base64url encoding,
			//how you ask? I'd like to know that as well - update: figured it out
			const decoded = atob((data.token.split('.')[1]).replace(/-/g, '+').replace(/_/g, '/'));
			localStorage.setItem("userInformation", decoded);
			localStorage.setItem("token", data.token); // i couldn't see any tokens being set in localStorage but you used it for auth in websocket so i'm setting it here
			
			//fun little exercise in base64 encoding
			//console.log(data.token.split('.')[1]);
			//console.log((data.token.split('.')[1]).replace(/-/g, '+').replace(/_/g, '/'));
	
			//console.log(`Login successful.\nLogin Token(Sajen doesn\'t like this method): ${data.token}\n\n`);
			//apparently sending extra shit with the cookie causes the cookie not be sent
			//hijacking the cookie
			setCookie('token', data.token,
			{
				maxAge: data.expiresIn,
				path: '/',
				secure: true, 
				sameSite: "none"
			});
			//console.log(`Hijacked Cookie: ${document.cookie}`);

			router.push('/application/dashboard');
		} 
		catch (error: any)
		{
			if (error.response?.status === 400)
			{
				setError(error.response.data.message);
			}
			else
			{
				setError('Failed to login. Please try again later.');
			}
			setLoading(false);
		}
	};

	return (
		<Card className="w-full max-w-9xl p-6 bg-blue-100">

		<CardHeader className="text-center">
		<CardTitle className="font-bold text-3xl">Welcome back!</CardTitle>
		<CardTitle>Login to SIA</CardTitle>
		</CardHeader>

		<CardContent className="justify-center w-2/3 mx-auto">
		<form className="space-y-4" onSubmit={handleSubmit}>
		{error && <p className="text-red-600">{error}</p>}
		<div>
		<Input
		type="email"
		id="email"
		name="email"
		required
		placeholder="Enter your college email"
		className="mt-1 block w-full"
		value={email}
		onChange={(e) => setEmail(e.target.value)}
		/>
		</div>

		<div>
		<Input
		type="password"
		id="password"
		name="password"
		required
		placeholder="Password"
		className="mt-1 block w-full"
		value={password}
		onChange={(e) => setPassword(e.target.value)}
		/>
		</div>

		<p className="font-semibold text-sm text-blue-600 hover:underline">
		<Link href="/forgotPassword">Forgot your password?</Link>
		</p>

		<div className="w-full flex justify-center">
		<Button type="submit" className="w-1/2 rounded bg-blue-600 font-semibold text-sm hover:bg-indigo-600" disabled={loading}>
		{loading ? '...' : 'LOG IN'}
		</Button>
		</div>

		</form>
		</CardContent>

		<CardFooter className="justify-start w-2/3 mx-auto">
		<p className="font-semibold text-sm text-blue-600 hover:underline">
		<Link href="/register">Register your college id?</Link>
		</p>
		</CardFooter>

		</Card>
	);
};

export default LoginPage;
