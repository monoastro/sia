"use client";

import Link from 'next/link'
import Image from 'next/image'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LandingPage() 
{
	const router = useRouter();
	useEffect(() => 
	{
		const pingElectrocord = async () =>
		{
			try
			{
				console.log("Pinging electrocord");
				const pong = await fetch("https://electrocord.onrender.com/");
				console.log(pong);
			}
			catch (error)
			{
				console.error("Error pinging electrocord:", error);
			}
		}
		pingElectrocord();
	}, []);

	return (
		<div>
		<h1 className="text-5xl place-content-center font-bold text-center mt-10">Welcome to SIA
		<p className="text-base"> Powered by Electrocord</p>
		</h1>
		<p className="text-center mt-10">The premier platform for all your academic needs.</p>
		<div className="flex justify-center m-20">

		<button onClick={() => router.push('/login')}>
		<Image
		src="https://raw.githubusercontent.com/monoastro/sia/main/public/static/emma.svg"
		alt="EMotional support aniMAl"
		width={300}
		height={300}
		className="image-spin" />
		</button>
		</div>
		<div className="flex justify-center mt-20">
		<p className="text-center">Don't have an account? <Link href="/register" className="text-blue-500 hover:underline"> Register </Link></p>
		</div>
		<div className="flex justify-center mt-5">
		<p className="text-center">Already have an account? 
		<a href="/login" className="text-blue-500 hover:underline"> Log in </a>
		</p>
		</div>
		</div>
	);
}

