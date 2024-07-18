"use client";

import React, { useState, FormEvent } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ForgotPasswordPage = () => 
{
	const [email, setEmail] = useState('');
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmit = (e : FormEvent<HTMLFormElement>) => 
	{
		e.preventDefault();

		//Bibek API call
		setIsSubmitted(true);
	};

	if (isSubmitted)
	{
		return (
			<Card className="w-full max-w-md p-6 bg-blue-100">
			<CardHeader className="text-center">
			<CardTitle className="font-bold text-3xl">Check Your Email</CardTitle>
			</CardHeader>
			<CardContent>
			<p className="text-center">
			If an account exists for {email}, you will receive password reset instructions.
			</p>
			</CardContent>
			<CardFooter className="justify-center">
			<Button onClick={() => setIsSubmitted(false)} className="bg-blue-600 font-semibold hover:bg-indigo-600">
			Back to Forgot Password
			</Button>
			</CardFooter>
			</Card>
		);
	}

	return (
		<Card className="w-full max-w-md p-6 bg-blue-100">
		<CardHeader className="text-center">
		<CardTitle className="font-bold text-3xl">Forgot Password?</CardTitle>
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
		<Button type="submit" className="w-full bg-blue-600 font-semibold hover:bg-indigo-600">
		RESET PASSWORD
		</Button>
		</form>
		</CardContent>
		<CardFooter>
		<p className="font-semibold text-sm text-blue-600 hover:underline">
		<a href="/login">Alzheimer's patient? Go back to Log in</a>
		</p>
		</CardFooter>
		</Card>
	);
}

export default ForgotPasswordPage;
