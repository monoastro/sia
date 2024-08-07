import React, { useEffect, useState} from 'react';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SendIcon, CirclePlus } from "lucide-react";

import { getAPI, postAPI } from "@/lib/api"
import io, { Socket } from 'socket.io-client';
import {defpfpURL, apiBaseUrl } from "@/lib/data";
import {getUserInfoLocal} from "@/lib/utils";

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
	const [isConnected, setIsConnected] = useState(false);

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
		populateMessages();

		//some socket io shit here
		console.log(`${token}\n${chatId}`)
		if (token && chatId)
		{
			const newSocket = io(apiBaseUrl, {
				auth: { token },
			});
			setSocket(newSocket);

			newSocket.on('connect', () => {
				console.log("Socket Connected");
				setIsConnected(true);
				newSocket.emit('join', { userId, chatId });
			});

			newSocket.on('chatMessage', (data) => {
				setMessages((prevMessages) => [...prevMessages, data]);
			});

			newSocket.on('disconnect', () => {
				console.log('Socket disconnected');
			});
			// populateMessages();
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
		if (!message.trim() && attachments.length ===0)
		{
			setError('Message cannot be empty');
			return;
		}

    	const uploadedUrls = await Promise.all(attachments.map(uploadFile));
		// print the uploaded urls and details using map
		//console.log(uploadedUrls);
		//console.log(uploadedUrls[0]);	

		const newMessage: Message = 
		{
			senderId: userId,
			senderName: userName,
			message,
			attachments: uploadedUrls.map((url) => ({
				originalName: url.originalName,
				uploadedName: url.uploadedName,
				filePath: url.filePath,
				fileType: url.fileType,
			})),
			createdAt: new Date().toISOString(),
		};
		console.log("newMessage: ", newMessage);

		const payload = {
			chatId,
			senderId: userId,
			senderName: userName,
			message,
			attachments: uploadedUrls,
		};
		if (isConnected && socket)
		{
			socket?.emit('chatMessage', payload);

			setMessages((prevMessages) => [...prevMessages, newMessage]);
			setMessage('');
			setAttachments([]);
			setError('');
		}
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

	const uploadFile = async (file: File) =>
	{
		const formData = new FormData();
		formData.append('file', file);

		try {
			const response = await postAPI('attachments/upload', formData, {"Content-Type": "multipart/form-data"});
			return response[0];
		}
		catch (error) {
			setError('Failed to upload file');
		}
	}



	const renderAttachment = (file: Attachment) => {
		const { originalName, filePath, fileType } = file;
		switch (true) 
		{
			case fileType.startsWith('image'):
				return <Image src={filePath} alt={originalName} width={300} height={300} className="w-16 h-16 object-cover rounded-md" />;
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

	if(!messages)
	{
		return null;
	}
	return (
		<div className="flex flex-col h-full max-h-full overflow-hidden">
		<div className="flex-grow overflow-y-auto slick-scrollbar">
		{messages.map((msg, index) => (
			<div key={index} className="mb-4">
			<div className="flex items-center">
			<div className="relative h-[26px] w-[26px] rounded-full mr-2">
			<Image 
			fill 
			src={defpfpURL} 
			alt={"pfp"}
			sizes="(max-width: 768px) 100vw, 50vw"
			/>
			</div>
			<strong>
			<span className="text-violet-600"> {msg.senderName}</span> 
			</strong>
			<div className="text-xs text-gray-400 ml-2">
			at {new Date(msg.createdAt).toLocaleTimeString()}
			</div>
			</div>
			<div className="ml-8 mt-1">
			{msg.message}
			<div className="flex flex-wrap mt-2">
			{msg.attachments?.map((file, i) => (
				<div key={i} className="m-1">{renderAttachment(file)}</div>
			))}
			</div>
			</div>
			</div>
		))}
		</div>

		{error && <div className="text-red-500 mt-2 px-2">{error}</div>}

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

		<div className="m-2">
		<div className="flex items-center">
		
		<button
		onClick={() => document.getElementById('attachment-input')?.click()}
		className="px-4 py-2 bg-blue-900 text-black rounded-l hover:bg-blue-600 focus:outline-none"
		>
		<CirclePlus color="#ffffff"/>
		</button>
		<input
		type="file"
		id="attachment-input"
		className="hidden"
		multiple
		onChange={handleFileChange}
		/>
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
		</div>
	);
};
