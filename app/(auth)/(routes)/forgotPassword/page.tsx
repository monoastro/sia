"use client";

import React, { useState, FormEvent } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { postAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

const ForgotPasswordPage = () =>
{
	const [email, setEmail] = useState('');
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [OTP, setOTP] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmNewPassword, setConfirmNewPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const router = useRouter();

	const handleEmailSubmit = async (e: FormEvent<HTMLFormElement>) => 
	{
		e.preventDefault();
		const data = JSON.stringify({ email });

		setLoading(true);
		setError('');

		try
		{
			console.log("Requesting electrocord for reset password OTP.");
			await postAPI('auth/reset', data);
			console.log("Requested OTP successfully.");
			setIsSubmitted(true);
		} 
		catch (error: any)
		{
			console.error(`Error: ${error}`);
			if (error.response)
				{
					setError(error.response.data.message);
				}
				else {
					setError('Failed to send OTP. Please try again.');
				}
		}
		finally
		{
			setLoading(false);
		}
	};

	const handleOTPSubmit = async (e: FormEvent<HTMLFormElement>) =>
	{
		e.preventDefault();
		const data = JSON.stringify({
			email,
			password1: newPassword,
			password2: confirmNewPassword,
			request_type: "reset",
			otp_code: OTP,
		});

		setLoading(true);
		setError('');

		try
		{
			console.log("Requesting electrocord to set new password.");
			await postAPI('auth/change', data);
			console.log("Password reset successfully.");
			router.push('/login');
		}
		catch (error: any)
		{
			console.error(`Error: ${error}`);
			if (error.response)
			{
				setError(error.response.data.message);
			}
			else
			{
				setError('Failed to reset password. Please try again.');
			}
		} 
		finally
		{
			setLoading(false);
		}
	};

	if (!isSubmitted)
	{
		return (
			<Card className="w-full max-w-md p-6 bg-blue-100">
			<CardHeader className="text-center">
			<CardTitle className="font-bold text-3xl">Forgot Password?</CardTitle>
			</CardHeader>
			<CardContent>
			<form className="space-y-4" onSubmit={handleEmailSubmit}>
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
			<Button 
			type="submit" 
			className="w-full bg-blue-600 font-semibold hover:bg-indigo-600"
			disabled={loading}
			>
			{loading ? 'Submitting...' : 'Continue'}
			</Button>
			</form>
			</CardContent>
			<CardFooter className="justify-center">
			<p className="font-semibold text-sm text-blue-600 hover:underline">
			<a href="/login">Alzheimer's patient? Go back to Log in</a>
			</p>
			</CardFooter>
			</Card>
		);
	}

	return (
		<Card className="w-full max-w-md p-6 bg-blue-100">
		<CardHeader className="text-center">
		<CardTitle className="font-bold text-3xl">Check Your Email</CardTitle>
		</CardHeader>
		<CardContent>
		<p className="text-center">If an account exists for {email}, you will receive an OTP.</p>
		<form className="space-y-4" onSubmit={handleOTPSubmit}>
		{error && <p className="text-red-600">{error}</p>}
		<div>
		<Input 
		type="text" 
		id="OTP" 
		name="OTP" 
		required 
		placeholder="Enter your 6 digit OTP"
		className="mt-1 block w-full"
		value={OTP}
		onChange={(e) => setOTP(e.target.value)}
		/>
		</div>
		<div>
		<Input
		type="password"
		id="newPassword"
		name="newPassword"
		required
		placeholder="Enter new password"
		className="mt-1 block w-full"
		value={newPassword}
		onChange={(e) => setNewPassword(e.target.value)}
		/>
		</div>
		<div>
		<Input
		type="password"
		id="confirmNewPassword"
		name="confirmNewPassword"
		required
		placeholder="Confirm new password"
		className="mt-1 block w-full"
		value={confirmNewPassword}
		onChange={(e) => setConfirmNewPassword(e.target.value)}
		/>
		</div>
		<Button 
		type="submit" 
		className="w-full bg-blue-600 font-semibold hover:bg-indigo-600"
		disabled={loading}
		>
		{loading ? 'Submitting...' : 'Reset Password'}
		</Button>
		</form>
		</CardContent>
		<CardFooter className="justify-center">
		<a href="#" onClick={() => setIsSubmitted(false)} className="font-semibold text-sm text-blue-600 hover:underline">
		Back to Forgot Password?
		</a>
		</CardFooter>
		</Card>
	);
}

export default ForgotPasswordPage;
