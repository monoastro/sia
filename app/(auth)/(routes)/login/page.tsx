"use client";

import React, { useState } from 'react';
import {useRouter} from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link'

//import axios for api calls
import axios from 'axios';

const LoginPage = () => 
{
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();

	const handleSubmit = async (e) =>
	{
		e.preventDefault();
		try
		{
			//Bibek's login api here
			//await axios.post('http://localhost:3000/api/login', {email, password});

			if(email === 'test@test.com' && password === 'testtesttest')
			{
				router.push('/application');
			}
			else
			{
				alert('Invalid email or password');
				setPassword('');
			}
		}
		catch(error: any)
		{
			console.error(error);
		}
	};

	return (
		<Card className="w-full max-w-md p-6 bg-blue-100">

		<CardHeader className="text-center">
		<CardTitle className="font-bold text-3xl">Welcome back!</CardTitle>
		<CardTitle>Login to SIA</CardTitle>
		</CardHeader>

		<CardContent>
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

		<Button type="submit" className="w-full bg-blue-600 font-semibold hover:bg-indigo-600">
		LOG IN
		</Button>

		</form>
		</CardContent>

		<CardFooter>
		<p className="font-semibold text-sm text-blue-600 hover:underline">
		<Link href="/register">Register your college id?</Link>
		</p>
		</CardFooter>
		</Card>
	);
}

export default LoginPage;
