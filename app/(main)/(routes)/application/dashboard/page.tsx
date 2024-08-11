"use client";

import React, { useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { deleteCookie } from 'cookies-next';

import { getAPI, putAPI } from '@/lib/api'; 
import { getUserInfoLocal, setUserInfoLocal, deleteUserInfoLocal, deleteToken } from '@/lib/utils';
import UpdateInfoForm from '@/components/dashboard/UpdateInfo';
import { defpfpURL } from '@/lib/data';

const Dashboard = () => {
	//why do it like this when interfaces exist
	//I can't even do a null check properly on this
	const [userInfo, setUserInfo] = useState({
		user_id: "",
		username: "",
		email: "",
		dob: "",
		profile_pic: "",
	});
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({ ...userInfo });
	const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const router = useRouter();

	const handleLogout = () =>
	{
		deleteCookie("token");
		deleteUserInfoLocal();
		deleteToken();
		router.push("/login");
		console.log("Logging out...");
	};

	useEffect(() =>
	{
		//the not logging out issue comes from here
		//due to the expired token
		const fetchUserInfo = async () =>
		{
			try 
			{
				const userId = getUserInfoLocal().user_id;
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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


	if(!userInfo.profile_pic)
	{
		return null;
	}
	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-8 text-center text-white">
			<h1 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h1>

			<div className="mb-4 relative w-48 h-48">
			<Image
			src={userInfo.profile_pic}
			alt="Loading..."
			fill
			priority
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
			{userInfo.username && <p className="text-xl mb-4">Hello, {userInfo.username}!</p>}

			<div className="mb-4">
				{userInfo.email && <p>Email: {userInfo.email}</p>}
				{userInfo.dob && <p>Date of Birth: {new Date(userInfo.dob).toLocaleDateString()}</p>}
			</div>

			<div className="grid grid-cols-2 gap-2">

			<button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
				Edit Profile
			</button>

			<button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
				Log Out
			</button>
			</div>

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
		</div>
	);
};

export default React.memo(Dashboard);
