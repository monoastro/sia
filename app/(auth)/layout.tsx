//done
"use client";
import Image from 'next/image';
import {useRouter} from 'next/navigation'

const AuthLayout = ({ children }: { children: React.ReactNode }) => 
{
	const router = useRouter();	
	return (
		<div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-t from-purple-400 via-purple-600 to-purple-800">

		<div className="flex-1 p-8 flex items-center justify-center">
		<div className="w-full max-w-10xl lg:ml-16 ">
		{children}
		</div>
		</div>

		<div className="hidden lg:flex flex-1 items-center justify-center p-8">
		<div className="relative w-full h-full">
		<button onClick={() => router.push('/')}>
		<Image
		src="https://raw.githubusercontent.com/monoastro/sia/main/public/static/emma.svg"
		alt="EMotional support aniMAl"
		fill
		sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
		style={{
			objectFit: 'contain'
		}}
		className="image-scale"
		/>
		</button>
		</div>
		</div>

		</div>
	);
}

export default AuthLayout;
