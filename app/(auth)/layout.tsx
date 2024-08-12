//done
"use client";
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const AuthLayout = ({ children }: { children: React.ReactNode }) => 
{
	const router = useRouter();    
	return (
		<div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-t from-purple-400 via-purple-600 to-purple-800">

		<div className="flex-1 p-8 flex items-center justify-center">
		<div className="w-full max-w-10xl lg:ml-16">
		{children}
		</div>
		</div>

		<div className="hidden lg:flex flex-1 p-8">
		<button onClick={() => router.push('/')} className="w-full h-full relative">
		<Image
		src="https://raw.githubusercontent.com/monoastro/sia/main/public/static/emma.svg"
		alt="EMotional support aniMAl"
		fill
		style={{ objectFit: 'contain' }}
		className="image-scale"
		/>
		</button>
		</div>

		</div>
	);
}

export default AuthLayout;
