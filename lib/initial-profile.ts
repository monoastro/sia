import { currentUser, redirectToSignIn } from '@clerk/nextjs';

import { db } from '@/lib/database';

export const initialProfile = async () => 
{
	const user = await currentUser();
	if (!user) 
	{
		redirectToSignIn();
		return;
	}

	const profile = await db.profile.findUnique({
		where: {
			userId: user.id,
		},
	});

	if(profile) return profile;

	const newProfile = await db.profile.create({
		data: {
			userId: user.id,
			name:`${user.firstName} ${user.lastName}`,
			email: user.emailAddresses[0].emailAddress,

		},
	});

	return newProfile;

};
