"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { deleteCookie } from 'cookies-next';
import axios from 'axios';

const ApplicationHome = () => {
	const [username, setUsername] = useState('bernhardturing');
	const [profilePicture, setProfilePicture] = useState('/1.png');
	const storedEmail = localStorage.getItem('registrationEmail');

	const router = useRouter();

	
	  const handleLogout = () => {
		  deleteCookie('auth_token');
		  router.push('/');
	  };

	  return (
		  <div className="min-h-screen  flex flex-col items-center justify-center">
		  <div className="p-8 text-center">
		  <h1 className="text-2xl font-bold mb-4">Welcome to Your Dashboard Traveller</h1>
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
		  </div>
		  </div>
	  );
};

export default ApplicationHome;
