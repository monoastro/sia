import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[])
{
  return twMerge(clsx(inputs))
}

const getUserInfo = () =>
{
	if (typeof window !== "undefined" && typeof localStorage !== "undefined")
	{
		const userInformation = localStorage.getItem("userInformation");
		return userInformation ? JSON.parse(userInformation) : null;
	}
	return null;
}

const getToken = () =>
{
	if (typeof window !== "undefined" && typeof localStorage !== "undefined")
	{
		return localStorage.getItem("token");
	}
	return null;
}


export { cn, getUserInfo, getToken }

// <button onClick={test} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"> Test </button>

