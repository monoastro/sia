"use client";
import React, { useState } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/20/solid';

const channels = ['off-topic', 'memes', 'programming', 'general'];

const GeneralChatsPage: React.FC = () =>
{
	const [selectedChannel, setSelectedChannel] = useState(channels[0]);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState<string[]>([]);

	const handleChannelChange = (channel: string) => {
		setSelectedChannel(channel);
		setIsDropdownOpen(false);
	};

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (message.trim()) {
			setMessages([...messages, message]);
			setMessage('');
		}
	};

	return (
		<div className="flex flex-col h-screen text-white">
		{/* Top bar */}
		<div className="p-4 flex justify-between items-center">
		<div className="relative">
		<button
		onClick={() => setIsDropdownOpen(!isDropdownOpen)}
		className="bg-blue-800 text-white px-4 py-2 rounded flex items-center"
		>
		{selectedChannel}
		<ChevronDownIcon className="w-5 h-5 ml-2" />
		</button>
		{isDropdownOpen && (
			<div className="absolute top-full left-0 mt-1 rounded shadow-lg z-10">
			{channels.map((channel) => (
				<button
				key={channel}
				onClick={() => handleChannelChange(channel)}
				className="block w-full text-left px-4 py-2 hover:bg-blue-700"
				>
				{channel}
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
		className="bg-blue-800 text-white pl-10 pr-4 py-2 rounded"
		/>
		<MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
		</div>
		<UserCircleIcon className="w-8 h-8" />
		</div>
		</div>

		{/* Chat area */}
		<div className="flex-grow overflow-y-auto p-4">
		{messages.map((msg, index) => (
			<div key={index} className="mb-4 flex">
			<UserCircleIcon className="w-8 h-8 mr-2" />
			<div className="bg-blue-800 rounded-lg p-3">
			<p>{msg}</p>
			</div>
			</div>
		))}
		</div>

		{/* Chat input */}
		<form onSubmit={handleSendMessage} className="p-4">
		<div className="flex items-center">
		<input
		type="text"
		value={message}
		onChange={(e) => setMessage(e.target.value)}
		placeholder="Type a message..."
		className="flex-grow bg-blue-800 text-white px-4 py-2 rounded-l"
		/>
		<button
		type="submit"
		className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-500"
		>
		Send
		</button>
		</div>
		</form>
		</div>
	);
};

export default GeneralChatsPage;
