"use client";

import React from 'react';
import { cn } from "@/lib/utils";

type AnnouncementType = 'General' | 'Class' | 'Assignment' | 'Assessment';

export interface TabsProps
{
	tabs: AnnouncementType[];
	activeTab: AnnouncementType;
	setActiveTab: (tab: AnnouncementType) => void;
	setShowAddForm: (show: boolean) => void;
	setAddAnnouncementError: (error: string) => void;
	isAdmin: boolean;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, setActiveTab, setShowAddForm, setAddAnnouncementError, isAdmin}) => 
{
	return (
		<div className="flex justify-between mb-6">
		{tabs.map((tab) => (
			<button
			key={tab}
			className={cn("px-4 py-2 mr-2 font-semibold transition-all", activeTab === tab ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400 hover:text-gray-300")}
			onClick={() => setActiveTab(tab)}
			>
			{tab} Announcements
			</button>
		))}
		{isAdmin && (
			<button
			onClick={() => { setShowAddForm(true); setAddAnnouncementError(''); }}
			className="ml-4 text-3xl text-green-500 font-bold hover:text-green-600 focus:outline-none"
			aria-label="Add Announcement"
			>
			+
				</button>
		)}
		</div>
	);
};

export default React.memo(Tabs);
