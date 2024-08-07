// "use client";

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Image from 'next/image';
// import { deleteCookie } from 'cookies-next';
// import axios from 'axios';

// import {getUserInfoLocal} from "@/lib/utils";
// import {defpfpURL} from "@/lib/data";

// const ApplicationHome = () => {
// 	const [username, setUsername] = useState("Anonymous User");
// 	//I want to use defpfpURL but for some reason this can't parse the src if I use it
// 	const [profilePicture, setProfilePicture] = useState("https://raw.githubusercontent.com/monoastro/sia/main/public/static/emma.svg");

// 	const router = useRouter();

// 	const handleLogout = () =>
// 	{
// 		deleteCookie('token');
// 		console.log("Logging out...");
// 		router.push('/login');
// 	};

// 	useEffect(() =>
// 	{
// 		//ideally this would be an api call to get the user information since user information may change
// 		const userInformation = getUserInfoLocal();
// 		if (!userInformation) 
// 		{
// 			router.push('/login');
// 		}
		
// 		setUsername(userInformation.username);
// 		setProfilePicture(userInformation.profile_pic);
// 	}, [router]);

// 	//tell bibek to make the token better such that it can only gives the user id and not the whole user object
// 	//also add an api endpoint to get the user information from token or user id


// 	return (
// 		<div className="min-h-screen  flex flex-col items-center justify-center p-8 text-center">
// 		<h1 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h1>

// 		<div className="mb-4">
// 		<Image
// 		src={profilePicture}
// 		alt="Profile Picture"
// 		width={100}
// 		height={100}
// 		className="rounded-full mx-auto"
// 		sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
// 		/>
// 		</div>

// 		<p className="text-xl mb-4">Hello, {username}!</p>

// 		<button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors" > Log Out </button>

// 		</div>
// 	);
// };

// export default ApplicationHome;
// /*
//  * <button onClick={test} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"> Test </button>
//  	const test = () =>
// 	{
// 		console.log(getUserInfoLocal());

// 		console.log('Username:', username);
// 		console.log('Profile Picture:', profilePicture);
// 	}

// */"use client";
"use client";


import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { deleteCookie } from 'cookies-next';

import { getAPI, putAPI } from '@/lib/api'; 
import { defpfpURL } from "@/lib/data";
import { getUserInfoLocal, setUserInfoLocal } from '@/lib/utils';
import UpdateInfoForm from '@/components/dashboard/UpdateInfo';

const ApplicationHome = () => {
	const [userInfo, setUserInfo] = useState({
		user_id: "",
		username: "Anonymous User",
		email: "",
		dob: "",
		profile_pic: "https://raw.githubusercontent.com/monoastro/sia/main/public/static/emma.svg",
	});
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({ ...userInfo });
	const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const router = useRouter();

	const handleLogout = () =>
	{
		deleteCookie('token');
	
		router.push('/login');
		console.log("Logging out...");
	};

	useEffect(() =>
	{
		const userId = getUserInfoLocal().user_id;
		const fetchUserInfo = async () =>
		{
			try 
			{
				const data = await getAPI(`users/${userId}`);
				if (data)
				{
					setUserInfo(data[0]);
					setFormData(data[0]);
					setUserInfoLocal(data[0]);
				}
				else
				{
					router.push('/login');
				}
			}
			catch (error)
			{
				console.error("Failed to fetch user information", error);
				router.push('/login');
			}
		};

		fetchUserInfo();
	}, [router]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
	{
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleFormSubmit = async (e: React.FormEvent) =>
	{
		e.preventDefault();
		setLoading(true);
		setError("");
		const updatedFormData = new FormData();
		updatedFormData.append('username', formData.username || '');
		updatedFormData.append('email', formData.email || '');
		updatedFormData.append('dob', formData.dob || '');
		if (profilePictureFile)
		{
			updatedFormData.append('profile_pic', profilePictureFile);
		}

		try
		{
			await putAPI(`users/${userInfo.user_id}`, updatedFormData, { "Content-Type": "multipart/form-data" });
			setUserInfo({ ...formData, profile_pic: userInfo.profile_pic });
			setIsEditing(false);
		}
		catch (error: any)
		{
			if (error.response) {
				console.error("Failed to update user information", error);
				setError(error.response.details[0]);				
			} else {
				console.error("Failed to update user information", error);
				setError("Failed to update user information");
			}
			
		}
		finally
		{
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-8 text-center text-white">
			<h1 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h1>

			<div className="mb-4 relative w-48 h-48">
			<Image
			src={userInfo.profile_pic || defpfpURL}
			alt="Profile Picture"
			fill
			className="rounded-full mx-auto"
			sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
			/>
			</div>
{/*
			width={200}  
			height={200}
			sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
			style={{ width: '200px', height: '200px' }} // Optional inline style
*/}
			<p className="text-xl mb-4">Hello, {userInfo.username}!</p>

			<div className="mb-4">
				<p>Email: {userInfo.email}</p>
				<p>Date of Birth: {new Date(userInfo.dob).toLocaleDateString()}</p>
			</div>

			<button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors mb-4">
				Edit Profile
			</button>

			{isEditing && (
				<UpdateInfoForm
					formData={formData}
					profilePictureFile={profilePictureFile}
					handleInputChange={handleInputChange}
					handleFormSubmit={handleFormSubmit}
					setProfilePictureFile={setProfilePictureFile}
					closeModal={() => setIsEditing(false)}
					loading={loading}
					error={error}
				/>
			)}

			<button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
				Log Out
			</button>
		</div>
	);
};

export default ApplicationHome;
