"use client";
import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Chat } from "@/components/Chat"

import { getAPI } from "@/lib/api";
import {getToken, getUserInfoLocal } from '@/lib/utils';

interface Channel
{
	id: string;
	name: string;
	type: string;
	description: string;
	category: string;
	general_category: string;
	created_at: string;
	updated_at: string;
};

const GeneralChatsPage: React.FC = () =>
{
	const [selectedChannel, setSelectedChannel] = useState(0);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const [channels, setChannels] = useState<Channel[]>();


	useEffect( () =>
	{
		const fetchChannels = async () =>
		{
			try
			{
				const allChannels = await getAPI("chats/rooms");
				setChannels(allChannels.filter((channel : Channel) => channel.category === "general"));
			}
			catch(error)
			{
				console.log("Error fetching channels:\n", error);
			}
		};
		fetchChannels();
	}, []);
	
	const handleChannelChange = (channel: number) =>
	{
		setSelectedChannel(channel);
		setIsDropdownOpen(false);
	};

	return (
		<div className="flex flex-col h-screen text-white">
		{/* Top bar */}
		<div className="px-3 py-4 flex justify-between items-center">
		<div className="relative">
		<button
		onClick={() => setIsDropdownOpen(!isDropdownOpen)}
		className="text-white px-3 py-2 rounded flex items-center border-2 border-violet-900 hover:bg-indigo-900"
		>
		#{(channels && channels[selectedChannel].name) || "off-topic"}
		<ChevronDownIcon className="w-5 h-5 ml-1 mr-2" /> |
		<p className="ml-2" >
		{(channels && channels[selectedChannel].description) || "Chat about anything unrelated to the main topics"}
		</p>
		</button>
		{isDropdownOpen && (
			<div className="absolute top-full left-0 mt-1 bg-violet-900 rounded shadow-lg z-10">
			{channels?.map((channel, index) => (
				<button
				key={channel.id}
				onClick={() => handleChannelChange(index)}
				className="block w-full text-left px-4 py-2 hover:bg-blue-700"
				>
				{channel.name}
				</button>
			))}
			</div>
		)}
		</div>
		<div className="flex items-center">
		<div className="relative mr-4">
		<input
		type="text"
		placeholder="Search"
		className="bg-transparent text-white pl-10 pr-4 py-2 rounded"
		/>
		<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" />
		</div>
		</div>
		</div>

		{/* Chat */}
		{channels &&
		<Chat
		chatId={channels[selectedChannel].id}
		chatName={channels[selectedChannel].name}
		userId={getUserInfoLocal()?.user_id}
		userName={getUserInfoLocal()?.username}
		token={getToken() || ''}
		/>
		}
		
		</div>
	);
};

export default GeneralChatsPage;
