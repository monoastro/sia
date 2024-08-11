"use client";

import React from "react";
import Image from "next/image";
import { ActionTooltip } from "@/components/action-tooltip";
import { useRouter } from 'next/navigation';

interface UserItemProps 
{
  id: string;
  name: string;
  imageUrl: string;
}

export function UserItem({ id, name, imageUrl }: UserItemProps)
{
	const router = useRouter();

	const onClick = () => 
	{
	};

	return (
		//<ActionTooltip side="left" align="center" label={name}>
		<div className="hover:bg-indigo-500/10 rounded-lg transition-all">
		<button onClick={onClick} className="group relative flex items-center w-full p-2 hover:bg-primary/10 rounded-lg transition-all">

		<div className="relative h-[35px] w-[35px] rounded-full mr-2 overflow-hidden">
		<Image
		width={40}
		height={40}
		src={imageUrl}
		alt={name}
		/>
		</div>

		<span className="text-sm font-medium">{name}</span>
		</button>
		</div>
		//</ActionTooltip>
	);
}
