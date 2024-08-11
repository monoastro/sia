"use client";
import React from 'react';
import Image from 'next/image';

import dynamic from 'next/dynamic';
import { FileLink } from '@/components/RenderFileLink';
const RenderFileLink = dynamic<FileLink>(() => import('@/components/RenderFileLink').then((mod) => mod.default) );

interface Announcement
{
	announcement_id: string;
	title: string;
	message: string;
	attachment: string | null;
	category: string;
	created_at: string;
	updated_at: string;
	username: string;
	profile_pic: string;
}

export interface AnnouncementItemProps
{
	announcement: Announcement;
	handleDelete: (id: string) => void;
	handleEditClick: (announcement: Announcement) => void;
	isAdmin: boolean;
}

const AnnouncementItem: React.FC<AnnouncementItemProps> = ({ announcement, handleDelete, handleEditClick, isAdmin}) => 
{
	return (
		<div className="relative z-0 flex items-start mb-4 p-4 rounded-md border border-violet-900 mr-3 hover:bg-indigo-900">

		<div className="h-10 w-10 rounded-full mr-2 overflow-hidden">
		<Image
		src={announcement.profile_pic || ''}
		alt="Profile"
		width={40}
		height={40}
		/>
		</div>

		<div className="flex-grow">
	
		<div className="items-center mb-2">
		<span className="font-semibold text-violet-600 mr-2">{announcement.username}</span>
		</div>

		<div className="items-center mb-1">
		<span className="font-bold text-blue-600">{announcement.title}</span>
		</div>

		<p className="text-white mb-2">{announcement.message}</p>

		<RenderFileLink
		name="Download Attachment"
		file_path={announcement.attachment || ''}
		/>
		<div className="text-sm text-gray-400 mt-2">
		{new Date(announcement.created_at).toLocaleString()}
		</div>
		</div>

		{isAdmin &&
		<div>
		<button
		className="absolute top-2 right-2 text-gray-400 hover:text-white"
		onClick={() => handleEditClick(announcement)}
		>
		<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 20h12M6 16h12M6 12h12m-6-8h6m-6 0H6m0 0v14m12-14v14" />
		</svg>
		</button>

		<button
		className="absolute top-2 right-12 text-red-400 hover:text-red-600"
		onClick={() => handleDelete(announcement.announcement_id)}
		>
		<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
		</svg>
		</button>
		</div>
		}
		</div>
	);
};

export default React.memo(AnnouncementItem);

