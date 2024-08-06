import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect, useState} from "react";
import { UserItem } from "@/components/users/user-item";
import { getAPI } from "@/lib/api";


interface User
{
	user_id: string;
	username: string;
	email: string;
	dob: string;
	profile_pic: string;
	is_admin: boolean;
}

export const UsersSidebar: React.FC = () =>
{
	const [admins, setAdmins] = useState<User[]>([]);
	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => 
	{
		const fetchUsers = async () =>
		{
			try
			{
				const allUsers = await getAPI("users");
				setAdmins(allUsers.filter((user: User) => user.is_admin));
				setUsers(allUsers.filter((user: User) => !user.is_admin));
			}
			catch (error)
			{
				console.error(error);
			}
		};
		fetchUsers();
	}, []);

	return (
		<div className="space-y-4 flex flex-col items-center h-full w-full py-3 text-blue-700">
		<ScrollArea className="flex-1 w-full">
		<div className="mb-4">
		<div className="text-sm font-semibold mb-2 mt-2">
		Admins — {admins.length}
		</div>
		{admins.map((user) => (
			<div key={user.user_id} className="text-violet-600">
			<UserItem
			id={user.user_id}
			name={user.username}
			imageUrl={user.profile_pic}
			/>
			</div>
		))}
		</div>


		<div>
		<div className="text-sm font-semibold mb-2">Users — {users.length}</div>
		{users.map((user) => (
			<div key={user.user_id} className="text-blue-600">
			<UserItem
			id={user.user_id}
			name={user.username}
			imageUrl={user.profile_pic}
			/>
			</div>
		))}
		</div>
		</ScrollArea>

		</div>
	);
};
