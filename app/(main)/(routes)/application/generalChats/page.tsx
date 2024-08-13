"use client";
import React, { useState, useEffect,  } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import dynamic from 'next/dynamic';

//let's see the difference between ssr chat and non ssr chat
import { ChatProps } from '@/components/Chat';
const Chat = dynamic<ChatProps>(() => import('@/components/Chat').then((mod) => mod.default), {ssr:false});
import { getAPI } from "@/lib/api";
import {getToken, getUserInfoLocal } from '@/lib/utils';
import LoadingGeneralChatsPage from '@/components/loading/LoadingGeneralChats';

//useless fields are commneted out for now
interface Channel
{
	id: string;
	name: string;
	description: string;
	category: string;
	//type: string;
	//general_category: string;
	//created_at: string;
	//updated_at: string;
};

const GeneralChatsPage: React.FC = () =>
{
	const [selectedChannel, setSelectedChannel] = useState(0);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const [channels, setChannels] = useState<Channel[]>();

	const userInfo = getUserInfoLocal();
	const token = getToken();

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

	if(!channels)
	{
		return <LoadingGeneralChatsPage/>;
	}

	return (
		<div className="flex flex-col h-screen text-white">

		<div className="px-3 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
		<div className="relative w-full sm:w-auto mb-4 sm:mb-0">
		<button
		onClick={() => setIsDropdownOpen(!isDropdownOpen)}
		className="text-white px-3 py-2 rounded flex items-center border-2 border-violet-900 hover:bg-indigo-900 w-full sm:w-auto"
		>
		<span className="truncate">#{(channels && channels[selectedChannel].name) || "off-topic"}</span>
		<ChevronDownIcon className="w-5 h-5 ml-1 mr-2 flex-shrink-0" />

		<p className="ml-2" >
		{(channels && channels[selectedChannel].description) || "Chat about anything unrelated to the main topics"}
		</p>
		</button>
		{isDropdownOpen && (
			<div className="absolute top-full left-0 mt-1 bg-violet-900 rounded shadow-lg z-10 w-full sm:w-auto ">
			{channels.map((channel, index) => (
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

		<div className="flex items-center w-full sm:w-auto">
		<div className="relative mr-4 w-full sm:w-auto">
		<input
		type="text"
		placeholder="Search"
		className="bg-transparent text-white pl-10 pr-4 py-2 rounded w-full sm:w-auto"
		/>
		<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" />
		</div>
		</div>
		</div>

		{channels &&
		<Chat
		chatId={channels[selectedChannel].id}
		chatName={channels[selectedChannel].name}
		userId={userInfo?.user_id || ''}
		userName={userInfo?.username || ''}	
		userPfp={userInfo?.profile_pic || ''}
		token={token || ''}
		/>
		}
		</div>
	);
};

export default React.memo(GeneralChatsPage);
