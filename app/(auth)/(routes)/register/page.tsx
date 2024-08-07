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

//all of these imports are for the date picker 80-20 rule strikes again
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { postAPI } from '@/lib/api';

const months : string[] = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
const days : number[] = Array.from({ length: 31 }, (_, i) => i + 1);
const years : number[] = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);


const RegisterPage : React.FC = () => 
{
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [date, setDate] = useState<{ year: string; month: string; day: string}>({ year: '', month: '', day: '', });
	const [profilePicture, setProfilePicture] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [openPopover, setOpenPopover] = useState<string | null>(null);

	const router = useRouter();



	const handleSubmit = async (e : FormEvent<HTMLFormElement>) =>
	{
		e.preventDefault();

		if (password !== confirmPassword)
		{
			setError("Passwords don't match!");
			return;
		}

		setLoading(true);

		const formData = new FormData();
		formData.append('username', username);
		formData.append('fullname', `${firstName} ${lastName}`);
		formData.append('email', email);
		formData.append('dob', `${date.year}-${months.indexOf(date.month) + 1}-${date.day}`);
		formData.append('password1', password);
		formData.append('password2', confirmPassword);
		if (profilePicture)
		{
			formData.append('profile_picture', profilePicture);
		}
		console.log("Sending registration data to electrocord", formData);
/*
		const userData = JSON.stringify({
			username,
			fullname: `${firstName} ${lastName}`,
			email,
			dob: `${date.year}-${months.indexOf(date.month) + 1}-${date.day}`,
			password1: password,
			password2: confirmPassword,
			is_admin: adminEmails.includes(email)
		});
*/
		try
		{
			console.log("Sending registration data to electrocord")
			console.log(formData);
			const data = await postAPI('auth/signup', formData, { 'Content-Type': 'multipart/form-data' });
			localStorage.setItem('registrationEmail', data.user[0].email);
			console.log("Registration Email", data.user[0].email);
			router.push('/otp-verification');
		} 
		catch (error : any)
		{
			if (error.response) 
			{
				if (error.response.status === 400) {
					setError(error.response.data.message);
				}
				else
					{
						setError('An unexpected error occurred. Please try again later.');
					}
			}
		}
		finally
		{
			setLoading(false);
		}	
	};

	const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) =>
	{
		const files = e.target.files;
		if (files && files.length > 0)
		{
			setProfilePicture(files[0]);
		}
		console.log("Profile Picture", profilePicture);
	};



	const handleDateSelect = (type: string, value: string) => 
	{
		setDate((prevDate) => ({ ...prevDate, [type]: value }));
	};

	return (
		<Card className="w-full max-w-3xl p-6 bg-blue-100">
		<CardHeader className="text-center">
		<CardTitle className="font-bold text-3xl">Welcome!</CardTitle>
		<CardTitle>Register for SIA</CardTitle>
		</CardHeader>

		<CardContent>
		<form className="space-y-4" onSubmit={handleSubmit}>
		{error && <p className="text-red-600">{error}</p>}
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



		<div className="grid grid-cols-3 gap-2 w-full">
		<Popover open={openPopover === 'month'} onOpenChange={(open) => setOpenPopover(open ? 'month' : null)}>
		<PopoverTrigger asChild>
		<Button
		variant={"outline"}
		className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
		onClick={() => setOpenPopover(openPopover === 'month' ? null : 'month')}
		>
		<CalendarIcon className="mr-2 h-3.5 w-3.5" />
		{date?.month || <p className="text-slate-500">Month</p>}
		</Button>
		</PopoverTrigger>
		<PopoverContent className="w-auto p-0">
		<div className="max-h-48 overflow-y-auto">
		{months.map((month) => (
			<div
			key={month}
			onClick={() => {
				handleDateSelect('month', month.toString());
				setOpenPopover(null); // Close popover
			}}
			className="cursor-pointer hover:bg-indigo-200"
			>
			{month}
			</div>
		))}
		</div>
		</PopoverContent>
		</Popover>

		<Popover open={openPopover === 'day'} onOpenChange={(open) => setOpenPopover(open ? 'day' : null)}>
		<PopoverTrigger asChild>
		<Button
		variant={"outline"}
		className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
		onClick={() => setOpenPopover(openPopover === 'day' ? null : 'day')}
		>
		<CalendarIcon className="mr-2 h-3.5 w-3.5" />
		{date?.day || <p className="text-slate-500">Day</p>}
		</Button>
		</PopoverTrigger>
		<PopoverContent className="w-auto p-0">
		<div className="max-h-48 overflow-y-auto">
		{days.map((day) => (
			<div
			key={day}
			onClick={() => {
				handleDateSelect('day', day.toString());
				setOpenPopover(null);
			}}
			className="cursor-pointer hover:bg-indigo-200"
			>
			{day}
			</div>
		))}
		</div>
		</PopoverContent>
		</Popover>

		<Popover open={openPopover === 'year'} onOpenChange={(open) => setOpenPopover(open ? 'year' : null)}>
		<PopoverTrigger asChild>
		<Button
		variant={"outline"}
		className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
		onClick={() => setOpenPopover(openPopover === 'year' ? null : 'year')}
		>
		<CalendarIcon className="mr-2 h-3.5 w-3.5" />
		{date?.year || <p className="text-slate-500">Year</p>}
		</Button>
		</PopoverTrigger>
		<PopoverContent className="w-auto p-0">
		<div className="max-h-48 overflow-y-auto">
		{years.map((year) => (
			<div
			key={year}
			onClick={() => {
				handleDateSelect('year', year.toString());
				setOpenPopover(null);
			}}
			className="cursor-pointer hover:bg-indigo-200"
			>
			{year}
			</div>
		))}
		</div>
		</PopoverContent>
		</Popover>
		</div>

		<div>
		<Input
		id="profilePicture"
		type="file"
		name="profilePicture"
		placeholder="Profile Picture"
		accept="image/*"
		required
		className="mt-1 block w-full"
		onChange={handleProfilePictureChange}
		onMouseEnter={(e) => e.currentTarget.style.cursor = "pointer"}
		/>
		</div>

		<Button type="submit" className="w-full bg-blue-600 font-semibold hover:bg-indigo-600" disabled={loading}>
		{loading ? '...' : 'REGISTER'}
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

