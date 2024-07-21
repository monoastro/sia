//done
"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { postAPI } from '@/lib/api';

const RegisterPage = () => {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const router = useRouter();


	const handleSubmit = async (e : FormEvent<HTMLFormElement>) =>
	{
		e.preventDefault();

		if (password !== confirmPassword)
		{
			alert("Passwords don't match!");
			return;
		}

		const userData = JSON.stringify({
			username,
			fullname: `${firstName} ${lastName}`,
			email,
			dob: '2001-09-11',
			password1: password,
			password2: confirmPassword,
			is_admin: false
		});

		try
		{
			const data = await postAPI('auth/signup', userData);
			localStorage.setItem('registrationEmail', data.user[0].email);
			router.push('/otp-verification');
		} 
		catch (error)
		{
			console.error('Error:', error);
		}
	};

	return (
		<Card className="w-full max-w-3xl p-6 bg-blue-100">
		<CardHeader className="text-center">
		<CardTitle className="font-bold text-3xl">Welcome!</CardTitle>
		<CardTitle>Register for SIA</CardTitle>
		</CardHeader>

		<CardContent>
		<form className="space-y-4" onSubmit={handleSubmit}>
		<div className="grid grid-cols-2 gap-2">
		<Input
		type="text"
		id="firstName"
		name="firstName"
		required
		placeholder="First Name"
		className="mt-1 block"
		value={firstName}
		onChange={(e) => setFirstName(e.target.value)}
		/>
		<Input
		type="text"
		id="lastName"
		name="lastName"
		required
		placeholder="Last Name"
		className="mt-1 block"
		value={lastName}
		onChange={(e) => setLastName(e.target.value)}
		/>
		</div>

		<div>
		<Input
		type="text"
		id="username"
		name="username"
		required
		placeholder="Username"
		className="mt-1 block w-full"
		value={username}
		onChange={(e) => setUsername(e.target.value)}
		/>
		</div>

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
		placeholder="Create a password"
		className="mt-1 block w-full"
		value={password}
		onChange={(e) => setPassword(e.target.value)}
		/>
		</div>

		<div>
		<Input
		type="password"
		id="confirmPassword"
		name="confirmPassword"
		required
		placeholder="Confirm password"
		className="mt-1 block w-full"
		value={confirmPassword}
		onChange={(e) => setConfirmPassword(e.target.value)}
		/>
		</div>

		<Button type="submit" className="w-full bg-blue-600 font-semibold hover:bg-indigo-600">
		REGISTER
		</Button>
		</form>
		</CardContent>

		<CardFooter>
		<p className="font-semibold text-sm text-blue-600 hover:underline">
		<a href="/login">Already have an account? Log in</a>
		</p>
		</CardFooter>
		</Card>
	);
};

export default RegisterPage;

