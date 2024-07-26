"use client";

import { Sidebar } from "@/components/navigation/navigation-sidebar";
import { UsersSidebar } from "@/components/users/users-sidebar";
import {useState} from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => 
{
	const [areUsersVisible, setAreUsersVisible] = useState(true);
	return (
		<div className="h-full ">
		<div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
		<Sidebar />
		</div>


		<main className="md:pl-[72px] h-full">
		{children}
		</main>

		{/*
		{areUsersVisible && (
			<div className="hidden md:flex h-full w-[240px] z-30 flex-col fixed inset-y-0 right-0">
			<UsersSidebar />
			</div>
		)}
		*/}
		</div>
	);
};

export default MainLayout;


/*

const mainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <Sidebar/>
      </div>
      <main className="md:pl-[72px] h-full">
        {children}
      </main>
    </div>
  );
};

*/
