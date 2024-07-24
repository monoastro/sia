//done
"use client";
import React, { useState, useEffect } from 'react';
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
import { postAPI } from '@/lib/api';

const OtpVerificationPage = () => 
{
	const [otp, setOtp] = useState("");
	const [email, setEmail] = useState("");
	const [insult, setInsult] = useState("");
	const [dumbassCounter, setDumbassCounter] = useState(0);
	const router = useRouter();

	useEffect(() =>
	{
		const storedEmail = localStorage.getItem('registrationEmail');
		if (storedEmail)
		{
			setEmail(storedEmail);
		}
		else 
		{
			router.push('/register');
		}
	}, [router]);

	const handleActivate = async (e: React.FormEvent) => {
		e.preventDefault();

		const verificationData = JSON.stringify({
			email: email,
			otp_code: otp,
			request_type: "signup"
		});

		try
		{
			console.log("Verifying OTP");
			const data = await postAPI('auth/activate/', verificationData);
			console.log("OTP verified successfully, you may now login");
			localStorage.removeItem('registrationEmail');
			router.push('/login');
		}
		catch (error : any) 
		{
			setInsult('Invalid OTP, learn to type properly.');
			console.error('Error:', error);
			localStorage.removeItem('registrationEmail');
			setDumbassCounter(dumbassCounter + 1);
			console.log(dumbassCounter);
			if (dumbassCounter > 2) // ah the many wonders of react, where 2 means it checks for 3 because for some reason it only increments after this function exits
			{
				router.push('/register');
			}
		}
	};


	const handleRegenerate = async (e: React.MouseEvent<HTMLAnchorElement>) =>
	{
		const regenData = JSON.stringify(
		{ 
			email: email,
			request_type: "signup"
		});

		try
		{
			const data = await postAPI('auth/regenerate/', regenData);
			setInsult('OTP re-sent successfully, try not to miss it this time.');
		}
		catch (error : any)
		{
			console.error('Error during OTP regeneration:', error);
		}
	};


	return (
		<Card className="w-full max-w-md p-6 bg-blue-100">

		<CardHeader className="text-center">
		<CardTitle className="font-bold text-3xl">Activate Your Account</CardTitle>
		<CardTitle>Enter the OTP sent to your email</CardTitle>
		<p className="text-red-600">{insult}</p>
		</CardHeader>

		<CardContent>
		<form className="space-y-4" onSubmit={handleActivate}>
		<div>
		<Input
		type="text"
		id="otp"
		name="otp"
		required
		placeholder="Enter OTP"
		className="mt-1 block w-full"
		value={otp}
		onChange={(e) => setOtp(e.target.value)}
		/>
		</div>

		<Button type="submit" className="w-full bg-blue-600 font-semibold hover:bg-indigo-600">
		Activate Account
		</Button>


		</form>

		</CardContent>

		<div className="flex justify-center">
		<a href="#" onClick={handleRegenerate} className="font-semibold text-sm text-blue-600 hover:underline">
		Re-send OTP?
		</a>
		</div>

		<CardFooter className="flex justify-center py-4">

		<p className="font-semibold text-sm text-blue-600 hover:underline">
		<a href="/register">Didn't receive OTP? Register again</a>
		</p>
		</CardFooter>

		</Card>
	);
};

export default OtpVerificationPage;
