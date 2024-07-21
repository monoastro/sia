//done
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
import axios from 'axios';
import { setCookie } from 'cookies-next';




const LoginPage = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();
	

	const handleSubmit = async (e : FormEvent<HTMLFormElement>) =>
	{
		e.preventDefault();

		const userData = JSON.stringify({ email, password });

		const config =
		{
			method: 'post',
			url: 'https://electrocord.onrender.com/api/v1/auth/signin/',
			headers: 
			{ 
				'Content-Type': 'application/json'
			},
			data: userData
		};

		try
		{
			console.log("Requesting electrocord for login");
			const response = await axios.request(config);
			console.log('Login successful. Login Token(Sajen doesn\'t like this method):', response.data.data.token);
			localStorage.setItem("token", response.data.data.token);
			//parse the jwt to extract user information
			localStorage.setItem("userInformation", atob(response.data.data.token.split('.')[1]));


			//let's log the cookie
			//this doesn't fucking work
			setCookie('token', response.data.data.token,
			{
				maxAge:  response.data.data.expiresIn,
				path: '/',
				secure: true, 
				sameSite: 'strict'
			});

			console.log(`Cookie: ${document.cookie}`);
			router.push('/application/dashboard');
		} 
		catch (error) 
		{
			console.error('Error:', error);
			alert('Login failed. Please try again.');
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
		<Button type="submit" className="w-1/2 rounded bg-blue-600 font-semibold text-sm hover:bg-indigo-600">
		LOG IN
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

