//done
"use client";

import React, { useState, useEffect } from 'react';
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


const RegisterPage = () => {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const [shouldRedirect, setShouldRedirect] = useState(false);
	const router = useRouter();

	useEffect(() =>
	{
		if (shouldRedirect) 
		{
			router.push('/otp-verification');
		}
	}, [shouldRedirect, router]);

	const handleSubmit = async (e) =>
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
			dob: '2003-09-11',
			password1: password,
			password2: confirmPassword,
			is_admin: true
		});

		const config = {
			method: 'post',
			maxBodyLength: Infinity,
			url: 'https://electrocord.onrender.com/api/v1/auth/signup/',
			headers: { 
				'Content-Type': 'application/json'
			},
			data: userData
		};

		try
		{
			const response = await axios.request(config);
			if (response.data.statusCode === 201)
			{
				console.log(response.data.data.user);
				localStorage.setItem('registrationEmail', response.data.data.user[0].email);

				setShouldRedirect(true);
			}
			else
			{
				alert('Registration failed!');
			}
		} 
		catch (error)
		{
			console.error('Error during registration:', error);
			console.log('Response data:', error.response?.data);
			console.log('User data:', userData);
			alert(`An error occurred during registration: ${error.response?.data?.detail || error.message}`);
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

