"use client";

import React from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { ActionTooltip } from "@/components/action-tooltip";
import { getActualRouteName } from "@/lib/data";
import { cn } from "@/lib/utils";

interface NavigationItemProps 
{
  id: number;
  imageUrl: string;
  name: string;
}

export function NavigationItem({ id, imageUrl, name }: NavigationItemProps)
{
	const router = useRouter();
	const pathname = usePathname();
	const isActive : boolean = pathname === `/application/${getActualRouteName[id]}`;

	const onClick = () => 
	{
		router.push(`/application/${getActualRouteName[id]}`);
	};

	return (
		<ActionTooltip side="right" align="center" label={name}>
		<button onClick={onClick} className="group relative flex items-center">

		<div
		className={cn(
			"absolute left-0 bg-blue-700 rounded-full transition-all w-[5px]",
			isActive ? "h-[40px]" : "h-[0px] group-hover:h-[20px]" 
		)}/>

		<div className={"relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden bg-violet-800"}>
		<Image 
		fill 
		src={imageUrl} 
		alt="Tabs"
		className="transition-transform transform group-hover:scale-110 group-hover:rotate-3" />
		</div>

		</button>
		</ActionTooltip>
	);
}

{
/* 
//intended behaviour
if not-selected and hovered, it should be 20px
if selected, it should be 40px
if not-selected and not-hovered, it should be 0px

//conditional classes to find whether the item is selected or not
//problem is idk how to find the selected item
//eh just put it as hover 40px for now
*/
}
