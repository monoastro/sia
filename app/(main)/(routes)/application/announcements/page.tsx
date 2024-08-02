"use client";

import React, { useState } from 'react';
import Image from 'next/image';

type AnnouncementType = 'General' | 'Class' | 'Assignments' | 'Assessments';

interface Announcement {
  id: string;
  content: string;
  username: string;
  profilePicture: string;
  timestamp: string;
}

//bibek logic here
const mockAnnouncements: Record<AnnouncementType, Announcement[]> = {
  General: [
    { id: '1', content: 'General Announcement 1', username: 'Admin1', profilePicture: '/static/emma.svg', timestamp: '2023-07-14 10:00' },
    { id: '2', content: 'General Announcement 2', username: 'Mod1', profilePicture: '/static/emma.svg', timestamp: '2023-07-15 15:30' },
  ],
  Class: [
    { id: '3', content: 'Class Announcement 1', username: 'Teacher1', profilePicture: '/static/emma.svg', timestamp: '2023-07-12 09:15' },
    { id: '4', content: 'Class Announcement 2', username: 'Teacher2', profilePicture: '/static/emma.svg', timestamp: '2023-07-13 14:45' },
  ],
  Assignments: [
    { id: '5', content: 'Assignment 1 due next week', username: 'Teacher1', profilePicture: '/static/emma.svg', timestamp: '2023-07-10 11:00' },
    { id: '6', content: 'New assignment posted', username: 'Teacher2', profilePicture: '/static/emma.svg', timestamp: '2023-07-11 16:20' },
  ],
  Assessments: [
    { id: '7', content: 'Upcoming quiz on Chapter 5', username: 'Teacher1', profilePicture: '/static/emma.svg', timestamp: '2023-07-08 10:30' },
    { id: '8', content: 'Exam schedule posted', username: 'Admin1', profilePicture: '/static/emma.svg', timestamp: '2023-07-09 13:45' },
  ],
};

const AnnouncementsPage: React.FC = () => {
	const [activeTab, setActiveTab] = useState<AnnouncementType>('General');

	const tabs: AnnouncementType[] = ['General', 'Class', 'Assignments', 'Assessments'];

	return (
		<div>
		<h1 className="text-3xl font-bold mb-6">Announcements</h1>

		{/* Tabs */}
		<div className="flex mb-6">
		{tabs.map((tab) => (
			<button
			key={tab}
			className={`px-4 py-2 mr-2 font-semibold ${
				activeTab === tab
					? 'text-blue-500 border-b-2 border-blue-500'
					: 'text-gray-500 hover:text-gray-700'
			}`}
			onClick={() => setActiveTab(tab)}
			>
			{tab} Announcements
			</button>
		))}
		</div>

		<div>
		{
			[...mockAnnouncements[activeTab]].reverse().map((announcement) => (
			<div key={announcement.id} className="flex items-start mb-4">
			<Image
			src={announcement.profilePicture}
			alt={`${announcement.username}'s profile`}
			width={40}
			height={40}
			className="rounded-full mr-4"
			/>
			<div>
			<div className="flex items-center mb-1">
			<span className="font-semibold mr-2">{announcement.username}</span>
			<span className="text-sm text-gray-500">{announcement.timestamp}</span>
			</div>
			<p>{announcement.content}</p>
			</div>
			</div>
		))}
		</div>
		</div>
	);
};

export default AnnouncementsPage;
