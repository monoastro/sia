"use client";

import React from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

export function NavigationItem({ id, imageUrl, name }: NavigationItemProps)
{
	const params = useParams();
	const router = useRouter();

	const onClick = () => 
	{
		router.push(`/application/${name}`);
	};

	return (
		<ActionTooltip side="right" align="center" label={name}>
		<button onClick={onClick} className="group relative flex items-center">

		{/* 
			This isn't working as I want it to. it seems to me params?.id is always undefined
			//intended behaviour
			if not-selected and hovered, it should be 40px
			if selected, it should be 20px
			if not-selected and not-hovered, it should be 0px
		*/}
		<div
		className={cn(
			"absolute left-0 bg-indigo-500 rounded-full transition-all w-[4px]",
			params?.id !== id && "group-hover:h-[40px]", 
			params?.id === id ? "h-[20px]" : "h-[0px]"
		)}
		/>

		<div
		className={cn(
			"relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden bg-violet-800",
			params?.id === id && "bg-primary/10 text-primary rounded-[16px]"
		)}
		>
		<Image fill src={imageUrl} alt="Tabs" 
		className="transition-transform transform group-hover:scale-110 group-hover:rotate-3"
		/>
		</div>

		</button>
		</ActionTooltip>
	);
}

