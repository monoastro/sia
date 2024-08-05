import React, { useEffect, useState} from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SendIcon, CirclePlus } from "lucide-react";

import { getAPI } from "@/lib/api"
import io, { Socket } from 'socket.io-client';
import { defpfpURL, apiBaseUrl } from "@/lib/data";

interface ChatProps
{
	chatId: string;
	chatName: string;
	userId: string;
	userName: string;
	token: string;
}

interface Attachment
{
	originalName: string;
	uploadedName: string;
	filePath: string;
	fileType: string;
}

interface Message
{
	senderId: string;
	senderName: string;
	message: string;
	attachments?: Attachment[];
	createdAt: string;
}

export const Chat : React.FC<ChatProps> = ({ chatId, chatName, userId, userName, token} : ChatProps) =>
{
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState<Message[]>([]); //if this was  c++ this would be circular buffer

	const [socket, setSocket] = useState<Socket | null>(null);

	//completely useless as of now
	const [attachments, setAttachments] = useState<File[]>([]);
	const [error, setError] = useState('');


	/*
	useEffect(() =>
	{
		console.log(chatId + "\n" + chatName + "\n" + userId + "\n" + userName + "\n" + token + "\n" );
	}, []);

   */
	useEffect(() =>
	{
		const populateMessages = async () => 
		{
			try 
			{
				const oldMessages = await getAPI(`messages/${chatId}`);
				setMessages(oldMessages);
				//console.log(oldMessages); //for some reason bro is returing the chatId in the message
			}
			catch (error) 
			{
				console.error('Error fetching old messages:', error);
			}
		};

		//some socket io shit here
		if (token && chatId)
		{
			const newSocket = io('https://electrocord.onrender.com', {
				auth: { token },
			});
			setSocket(newSocket);

			newSocket.on('connect', () => {
				console.log('Socket connected');
				newSocket.emit('join', { userId, chatId });
			});

			newSocket.on('chatMessage', (data) => {
				setMessages((prevMessages) => [...prevMessages, data]);
			});

			newSocket.on('disconnect', () => {
				console.log('Socket disconnected');
			});

			populateMessages();
			return () =>
			{
				if (newSocket)
				{
					newSocket.emit('leave', { userId, chatId });
					newSocket.off('chatMessage');
					newSocket.disconnect();
				}
			};
		}


	}, [chatId, chatName, token, userId]);


	const sendMessage = async (e: React.FormEvent) =>
	{
		e.preventDefault();
		if (!message.trim())
		{
			setError('Message cannot be empty');
			return;
		}
		const newMessage: Message = 
		{
			senderId: userId,
			senderName: userName,
			message,
			createdAt: new Date().toISOString(),
		};

		const payload = {
			chatId,
			senderId: userId,
			senderName: userName,
			message,
		};
		socket?.emit('chatMessage', payload);

		setMessages([...messages, newMessage]);
		setMessage('');
		setAttachments([]);
		setError('');
	};


	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) =>
	{
		const files = Array.from(e.target.files || []);
		if (files.length + attachments.length > 5)
		{
			setError('You can only attach up to 5 files.');
			return;
		}
		setAttachments(prev => [...prev, ...files]);
	};
	const renderAttachment = (file: Attachment) => {
		const { filePath, fileType, originalName } = file;
		switch (true) 
		{
			case fileType.startsWith('image'):
				return <Image src={filePath} alt={originalName} className="w-16 h-16 object-cover rounded-md" />;
			case fileType.startsWith('video'):
				return <video src={filePath} controls className="w-64 h-36 object-cover rounded-md mt-2 mr-2" />;
			case fileType.startsWith('audio'):
				return (
					<audio controls className="w-full">
					<source src={filePath} />
					</audio>
			);
			default:
				return (
					<a href={filePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
					{originalName}
					</a>
			);
		}
	};

	return (
		<div className="flex flex-col p-2 h-full">

		<div className="flex-grow overflow-y-auto p-4">
		{messages.map((msg, index) => (
			<div key={index}>

			<div className="flex">

			<div className="relative h-[26px] w-[26px] rounded-full">
			<Image fill src={defpfpURL} alt={"pfp"} />
			</div>

			<strong>
				<span className="text-violet-600"> {msg.senderName}</span> 
			</strong>

			<div className="text-xs text-gray-400 mt-1 ml-2">at {new Date(msg.createdAt).toLocaleTimeString()} </div>
			</div>

			<div className="ml-8">
			{msg.message}
			{/*render any attachments associated with the message*/}
			<div className="flex flex-wrap">
			{msg.attachments?.map((file, i) => (
				<div key={i} className="m-1">{renderAttachment(file)}</div>
			))}
			</div>
			</div>

			</div>
		))}
		</div>

		{error && <div className="text-red-500 mt-2">{error}</div>}
		{attachments.length > 0 && (
			<div className="mt-2 p-2 rounded-lg flex flex-wrap">
			{attachments.map((file, index) => (
				<div key={index} className="relative w-16 h-16 p-2 m-1 bg-gray-300 rounded-md flex flex-col items-center">
				<span className="text-xs text-gray-600 truncate">{file.name}</span>
				<span className="justify-center">📄</span>
				</div>
			))}
			</div>
		)}

		{/*Message input*/}
		<div className="flex items-center">
		<input
		type="file"
		id="attachment-input"
		className="hidden"
		multiple
		onChange={handleFileChange} />
		<button
		onClick={() => document.getElementById('attachment-input')?.click()}
		className="px-4 py-2 bg-blue-900 text-black rounded-l hover:bg-blue-600 focus:outline-none">
		<CirclePlus color="#ffffff"/>
		</button>
		<input
		type="text"
		value={message}
		onChange={(e) => setMessage(e.target.value)}
		placeholder={`Message ${chatName}`}
		className="flex-grow bg-blue-900 px-4 py-2 focus:outline-none"
		onKeyDown={(e) => e.key === 'Enter' && sendMessage(e)}
		/>
		<Button 
		type="submit"
		className="bg-blue-900 hover:bg-blue-600 rounded-none rounded-r"
		onClick={sendMessage}
		>
        <SendIcon/>
        </Button>
		</div>

		</div>
	);
};

