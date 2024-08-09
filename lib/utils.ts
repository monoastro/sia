import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[])
{
  return twMerge(clsx(inputs))
}

const getUserInfoLocal = () =>
{
	if (typeof window !== "undefined" && typeof localStorage !== "undefined")
	{
		const userInformation = localStorage.getItem("userInformation");
		return userInformation ? JSON.parse(userInformation) : null;
	}
	return null;
}

interface UserInfo
{
	user_id: number;
	username: string;
	email: string;
	dob: string;
	profile_pic: string;
	is_admin: boolean;
}


const setUserInfoLocal = (userInfo: UserInfo) =>
{
	if (typeof window !== "undefined" && typeof localStorage !== "undefined")
	{
		//destructure the previous user information with the new user information, update the local storage
		//because the users/userid endpoint doesn't return iat and exp
		localStorage.setItem("userInformation",
		getUserInfoLocal() ? JSON.stringify({ ...getUserInfoLocal(), ...userInfo }) : JSON.stringify(userInfo));
	}
}

const deleteUserInfoLocal = () =>
{
	if (typeof window !== "undefined" && typeof localStorage !== "undefined")
	{
		localStorage.removeItem("userInformation");
	}
}
const getToken = () =>
{
	if (typeof window !== "undefined" && typeof localStorage !== "undefined")
	{
		return localStorage.getItem("token");
	}
	return null;
}

const deleteToken = () =>
{
	if (typeof window !== "undefined" && typeof localStorage !== "undefined")
	{
		localStorage.removeItem("token");
	}
}

//not making a setToken because it's only required at login(for now i guess);

export { cn, getUserInfoLocal, setUserInfoLocal, deleteUserInfoLocal , getToken, deleteToken}

// <button onClick={test} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"> Test </button>

