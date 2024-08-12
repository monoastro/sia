import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { SendIcon, CirclePlus, ListTree, ArrowUpToLine, ArrowDownToLine } from 'lucide-react';
import { getAPI, postAPI } from '@/lib/api';
import io, { Socket } from 'socket.io-client';
import { defpfpURL, apiBaseUrl } from '@/lib/data';

export interface ChatProps 
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

const Chat: React.FC<ChatProps> = (
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
	const [compactMode, setCompactMode] = useState(false);

	const [pageCount, setPageCount] = useState<number>(1);
	const [hasMore, setHasMore] = useState<boolean>(true);

	const newMessageScroll = useRef<null | HTMLDivElement>(null);

	const populateMessages = useCallback(async () =>
	{
		try
		{
			setMessages([]);
			const response = await getAPI(`messages/paginated/${chatId}?page=${pageCount}&limit=40`);
			setMessages(response.messages);
			setHasMore(!(pageCount === response.totalPages));
			//use this in the event of implementation of infinite scroll
			//setMessages([...messages, ...response.messages]);
		}
		catch (error)
		{
			console.error('Error fetching old messages:', error);
		}
	}, [chatId, pageCount]);

	useEffect(() => 
	{
		populateMessages();

		//socket.io shit here
		if (token && chatId) 
		{
			const newSocket = io(apiBaseUrl, 
			{
				auth: { token }
			});
			setSocket(newSocket);

			newSocket.on('connect', () => 
			{
				console.log("Socket connected");
				setIsConnected(true);
				newSocket.emit('join', { userId, chatId });
			});

			newSocket.on('chatMessage', (data) => 
			{
				setMessages((prevMessages) => [data, ...prevMessages]);
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
	}, [chatId, token, userId, populateMessages]);


	useEffect(() =>
	{
		newMessageScroll.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

    const sendMessage = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() && attachments.length === 0) {
            setError('Message cannot be empty');
            return;
        }

        const uploadedUrls = await Promise.all(attachments.map(uploadFile));

        const newMessage: Message = {
            senderId: userId,
            senderName: userName,
            senderProfile: userPfp,
            message,
            attachments: uploadedUrls.map(({ originalName, uploadedName, filePath, fileType }) => 
                ({ originalName, uploadedName, filePath, fileType })),
            createdAt: new Date().toISOString()
        };

        const payload = {
            chatId,
            ...newMessage,
            attachments: uploadedUrls,
        };

        if (isConnected && socket) {
            socket.emit('chatMessage', payload);
            setMessages((prevMessages) => [newMessage, ...prevMessages]);
            setMessage('');
            setAttachments([]);
            setError('');
        }
    }, [message, attachments, isConnected, socket, chatId, userId, userName, userPfp]);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + attachments.length > 5)
		{
            setError('You can only attach up to 5 files.');
            return;
        }
        setAttachments((prev) => [ ...files, ...prev]);
    }, [attachments]);

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

    const renderAttachment = useMemo(() => (file: Attachment) =>
	{
		const { originalName, filePath, fileType } = file;

		switch (true) 
		{
			case fileType.startsWith('image'):
				return (
					<div>
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
					<div>
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
					<div>
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
					<div>
					<a href={filePath} download className="text-blue-400 underline">
					<button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700">Download Attachment</button>
					</a>
					</div>
			);
			default:
				return (
					<div>
					<a href={filePath} download className="text-blue-400 underline">
					<button className="bg-blue-500 text-white py-1 rounded hover:bg-blue-700">Download Attachment</button>
					</a>
					</div>
			);
		}
	}, []);

	return (
		<div className="flex flex-col h-full max-h-full overflow-hidden">

		<div className="flex-grow overflow-y-auto slick-scrollbar">
		{messages.toReversed().map((msg, index) => (
			<div key={index} className="p-1 rounded hover:bg-indigo-900">

			<div className="flex items-start">

			{!compactMode && (
			<div className="h-10 w-10 rounded-full mr-2 overflow-hidden">
			<Image
			width={40}
			height={40}
			src={msg.senderProfile || defpfpURL}
			alt={msg.senderName}
			/>
			</div>
			)}

			<div>
			<span className="text-violet-600 font-bold">{msg.senderName}</span>
			{!compactMode && (
			<span className="text-xs text-gray-400 ml-2 mt-1 pt-0.5 ">
			at {new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
			</span>
			)}
			<div>
			{!compactMode && (
			<div>
			{msg.message}
			</div>
			)}

			<div className="flex flex-wrap">
			{msg.attachments?.map((file, i) => (
				<div key={i} >
				{renderAttachment(file)}
				</div>
			))}
			</div>
			</div>
			</div>


			{compactMode && (
			<div className="ml-1">
			{msg.message}
			</div>
			)}

			</div>



			</div>
		))}
		<div ref={newMessageScroll} />
		</div>

		{error && <div className="text-red-500 mt-2 px-2">{error}</div>}

		{attachments.length > 0 && (
			<div className="mt-2 p-2 rounded-lg flex flex-wrap ">
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
		onClick={() => 
		{
			hasMore && setPageCount((prev) => prev + 1);
		}}
		className="bg-blue-900 hover:bg-blue-600 rounded-none"
		>
		<ArrowUpToLine />
		</Button>

		<Button
		onClick={() => pageCount > 1 && setPageCount((prev) => prev - 1)} 
		className="bg-blue-900 hover:bg-blue-600 rounded-none"
		>
		<ArrowDownToLine />
		</Button>

		<Button
		onClick={() => setCompactMode((prev) => !prev)}
		className="bg-blue-900 hover:bg-blue-600 rounded-none"
		>
		<ListTree />
		</Button>
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


export default React.memo(Chat);
