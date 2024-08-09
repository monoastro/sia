import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { SendIcon, CirclePlus } from 'lucide-react';
import { getAPI, postAPI } from '@/lib/api';
import io, { Socket } from 'socket.io-client';
import { defpfpURL, apiBaseUrl } from '@/lib/data';

interface ChatProps 
{
	chatId: string;
	chatName: string;
	userId: string;
	userName: string;
	userPfp: string;
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
	senderProfile: string;
	message: string;
	attachments?: Attachment[];
	createdAt: string;
}

export const Chat: React.FC<ChatProps> = (
{
	chatId,
	chatName,
	userId,
	userName,
	userPfp,
	token
}: ChatProps) => 
{
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState<Message[]>([]); // If this was c++, this would be circular buffer

	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);

	// Completely useless as of now // useful now
	const [attachments, setAttachments] = useState<File[]>([]);
	const [error, setError] = useState('');

	useEffect(() => 
	{
		const populateMessages = async () => 
		{
			try 
			{
				const oldMessages = await getAPI(`messages/${chatId}`);
				setMessages(oldMessages);
			} catch (error) 
			{
				console.error('Error fetching old messages:', error);
			}
		};
		populateMessages();

		// Some socket.io shit here
		if (token && chatId) 
		{
			const newSocket = io(apiBaseUrl, 
			{
				auth: { token }
			});
			setSocket(newSocket);

			newSocket.on('connect', () => 
			{
				setIsConnected(true);
				newSocket.emit('join', { userId, chatId });
			});

			newSocket.on('chatMessage', (data) => 
			{
				console.log(data);
				setMessages((prevMessages) => [...prevMessages, data]);
			});

			newSocket.on('disconnect', () => 
			{
				console.log('Socket disconnected');
			});

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
	}, [chatId, token, userId]);

	const sendMessage = async (e: React.FormEvent) => 
	{
		e.preventDefault();
		if (!message.trim() && attachments.length === 0) 
		{
			setError('Message cannot be empty');
			return;
		}

		const uploadedUrls = await Promise.all(attachments.map(uploadFile));

		const newMessage: Message = 
		{
			senderId: userId,
			senderName: userName,
			senderProfile: userPfp,
			message,
			attachments: uploadedUrls.map((url) => (
			{
				originalName: url.originalName,
				uploadedName: url.uploadedName,
				filePath: url.filePath,
				fileType: url.fileType
			})),
			createdAt: new Date().toISOString()
		};

		const payload = 
		{
			chatId,
			senderId: userId,
			senderName: userName,
			senderProfile: userPfp,
			message,
			attachments: uploadedUrls,
			createdAt: new Date().toISOString()
		};
		if (isConnected && socket) 
		{
			socket.emit('chatMessage', payload);
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
		setAttachments((prev) => [...prev, ...files]);
	};

	const uploadFile = async (file: File) => 
	{
		const formData = new FormData();
		formData.append('file', file);

		try 
		{
			const response = await postAPI('attachments/upload', formData, 
			{
				'Content-Type': 'multipart/form-data'
			});
			return response[0];
		} catch (error) 
		{
			setError('Failed to upload file');
		}
	};

	const renderAttachment = (file: Attachment) => 
	{
		const { originalName, filePath, fileType } = file;

		const renderDocumentIcon = () => (
			<div className="flex flex-col items-center justify-center w-full h-full bg-gray-200 rounded-md">
			<span className="text-gray-600 text-2xl">📄</span>
			<span className="text-gray-600 text-xs truncate">{originalName}</span>
			</div>
		);

		switch (true) 
		{
			case fileType.startsWith('image'):
				return (
					<div className="mt-2">
					<Image
					src={filePath}
					alt={originalName}
					width={300}
					height={300}
					className="rounded object-cover cursor-pointer"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					onClick={() => window.open(filePath, '_blank')}
					onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/static/fallback.png'; }}
					/>
					</div>
			);
			case fileType.startsWith('video'):
				return (
					<div className="mt-2">
					<video
					src={filePath}
					controls
					className="w-full rounded max-w-xs"
					/>
					<a href={filePath} download className="text-blue-400 underline">

					</a>
					</div>
			);
			case fileType.startsWith('audio'):
				return (
					<div className="mt-2">
					<audio controls className="w-full">
					<source src={filePath} type="audio/mp3" />
					Your browser does not support the audio element.
						</audio>
					<a href={filePath} download className="text-blue-400 underline">

					</a>
					</div>
			);
			case fileType.startsWith('application'):
				return (
					<div className="mt-2">
					<a href={filePath} download className="text-blue-400 underline">
					<button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700">Download Attachment</button>
					</a>
					</div>
			);
			default:
				return (
					<div className="mt-2">
					<a href={filePath} download className="text-blue-400 underline">
					<button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700">Download Attachment</button>
					</a>
					</div>
			);
		}
	};


	return (
		<div className="flex flex-col h-full max-h-full overflow-hidden">

		<div className="flex-grow overflow-y-auto slick-scrollbar">
		{messages.map((msg, index) => (
			<div key={index} className="mb-4">
			<div className="flex items-center">
			<div className="relative h-6 w-6 rounded-full mr-2">
			<Image
			fill
			src={msg.senderProfile || defpfpURL}
			alt={msg.senderName}
			className="rounded-full"
			/>
			</div>
			<strong>
			<span className="text-violet-600">{msg.senderName}</span>
			</strong>
			<div className="text-xs text-gray-400 ml-2">
			at {new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
			</div>
			</div>
			<div className="ml-8 mt-1">
			{msg.message}
			<div className="flex flex-wrap mt-2">
			{msg.attachments?.map((file, i) => (
				<div key={i} className="m-1">
				{renderAttachment(file)}
				</div>
			))}
			</div>
			</div>
			</div>
		))}
		</div>

		{error && <div className="text-red-500 mt-2 px-2">{error}</div>}

		{attachments.length > 0 && (
			<div className="mt-2 p-2 rounded-lg flex flex-wrap bg-gray-100">
			{attachments.map((file, index) => (
				<div
				key={index}
				className="relative w-16 h-16 p-2 m-1 bg-gray-300 rounded-md flex flex-col items-center"
				>
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
		className="px-4 py-2 bg-blue-900 text-white rounded-l hover:bg-blue-600 focus:outline-none"
		>
		<CirclePlus />
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
		className="flex-grow bg-blue-900 px-4 py-2 focus:outline-none text-white"
		onKeyDown={(e) => e.key === 'Enter' && sendMessage(e)}
		/>
		<Button
		type="submit"
		className="bg-blue-900 hover:bg-blue-600 rounded-none rounded-r"
		onClick={sendMessage}
		>
		<SendIcon />
		</Button>
		</div>
		</div>
		</div>
	);
};

