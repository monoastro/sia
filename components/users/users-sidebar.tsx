import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { UserItem } from "@/components/users/user-item";
import { users } from "@/lib/data";

export const UsersSidebar: React.FC = () => {
	return (
		<div className="space-y-4 flex flex-col items-center h-full text-primary w-full py-3">

		<h2 className="text-lg font-bold text-indigo-600">Admins</h2>
		<Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />

		<ScrollArea className="flex-1 w-full">
		{users.filter(user => user.isAdmin).map(user => (
			<div key={user.id} className="mb-4">
			<UserItem
			id={user.id}
			name={user.name}
			imageUrl={user.imageUrl}
			isAdmin={user.isAdmin}
			/>
			</div>
		))}
		</ScrollArea>

		<h2 className="text-lg text-indigo-600 font-bold">Users</h2>
		<Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
		<ScrollArea className="flex-1 w-full">
		{users.filter(user => !user.isAdmin).map(user => (
			<div key={user.id} className="mb-4">
			<UserItem
			id={user.id}
			name={user.name}

			imageUrl={user.imageUrl}
			isAdmin={user.isAdmin}
			/>
			</div>
		))}
		</ScrollArea>

		</div>
	);
};

