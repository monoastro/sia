"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";
import { useRouter } from 'next/navigation';

interface UserItemProps {
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
		<div className="relative flex h-[32px] w-[32px] rounded-full overflow-hidden mr-2">
		<Image fill src={imageUrl} alt={name} />
		</div>
		<span className="text-sm font-medium">{name}</span>
		</button>
		</div>
		//</ActionTooltip>
	);
}
