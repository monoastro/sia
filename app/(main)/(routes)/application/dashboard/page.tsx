"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { deleteCookie } from 'cookies-next';
import axios from 'axios';

const ApplicationHome = () => {
	const [username, setUsername] = useState("Anonymous User");
	const [profilePicture, setProfilePicture] = useState("/shandi.svg");

	const router = useRouter();

	const handleLogout = () => {
		deleteCookie('auth_token');
		router.push('/');
	};

	useEffect(() => {
		//ideally this would be an api call to get the user information since user information may change
		const userInformation = JSON.parse(localStorage.getItem('userInformation'));
		if (userInformation) {
			setUsername(userInformation.username);
			//setProfilePicture(userInformation.profile_pic);
		}
		else {
			router.push('/');
		}
	}, [router]);

	//tell bibek to make the token better such that it can only gives the user id and not the whole user object
	const test = () =>
	{
		console.log(JSON.parse(localStorage.getItem('userInformation')));

		console.log('Username:', username);
		console.log('Profile Picture:', profilePicture);
	}

	return (
		<div className="min-h-screen  flex flex-col items-center justify-center">
		<div className="p-8 text-center">
		<h1 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h1>
		<div className="mb-4">
		<Image
		src={profilePicture}
		alt="Profile Picture"
		width={100}
		height={100}
		className="rounded-full mx-auto"
		/>
		</div>
		<p className="text-xl mb-4">Hello, {username}!</p>


		<button
		onClick={handleLogout}
		className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
		>
		Log Out
		</button>

		<button onClick={test} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"> Test </button>
		</div>
		</div>
	);
};

export default ApplicationHome;
