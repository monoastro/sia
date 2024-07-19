import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getUserInfo()
{
	if (typeof window !== "undefined" && typeof localStorage !== "undefined")
	{
		const userInformation = localStorage.getItem("userInformation");
		return userInformation ? JSON.parse(userInformation) : null;
	}
	return null;
}


// <button onClick={test} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"> Test </button>

