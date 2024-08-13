"use client";

import { Sidebar } from "@/components/navigation/navigation-sidebar";
import { UsersSidebar } from "@/components/users/users-sidebar";
import {useState} from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => 
{
	//use this in a button somewhere
	const [areUsersVisible, setAreUsersVisible] = useState(true);
	return (
		<div className="h-full flex">

		<div className="hidden md:flex h-full w-[72px] flex-shrink-0">
		<Sidebar />
		</div>

		<main className="flex-grow overflow-hidden">
		{children}
		</main>

		{areUsersVisible && (
			<div className="hidden md:flex h-full w-[200px] flex-shrink-0 ml-3">
			<UsersSidebar />
			</div>
		)}

	

		</div>
	);
};

export default MainLayout;
