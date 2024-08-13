import React, {useState} from 'react';
import Image from 'next/image';
import Modal from '@/components/Modal';

export interface FileLink
{
	name: string;
	file_path: string | null;
};

const RenderFileLink : React.FC<FileLink> = ({name, file_path }) =>
{ 
	const [isModalOpen, setIsModalOpen] = useState(false);
	if(!file_path) return null;
	//there must be a better way to extract file type than this; do that
	if(file_path.includes('image'))
	{
		return (
			<div className="mt-2">
			<Image
			src={file_path}
			alt="Attachment"
			width={300}
			height={300}
			className="rounded object-cover cursor-pointer"
			sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
			onClick={() => setIsModalOpen(true)}
			onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/static/emma.svg'; }}
			/>
			{isModalOpen && (
				<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} imageUrl={file_path || ''}>
				<Image
				src={file_path || '/static/emma.svg'}
				alt="Attachment"
				width={600}
				height={600}
				className="rounded object-cover"
				sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/static/emma.svg'; }}
				/>
				</Modal>
				)}
			</div>
		);
	} 

	else if(file_path.includes('audio'))
	{
		return (
			<div className="mt-2">
			<audio controls className="w-full">
			<source src={file_path} type="audio/mp3" />
			Your browser does not support the audio element.
				</audio>
			</div>
		);
	}
	else if (file_path.includes('video')) 
	{
		return (
			<div className="mt-2">
			<video controls className="w-1/2 rounded">
			<source src={file_path} type="video/mp4" />
			Your browser does not support the video element.
			</video>
			</div>
		);
	}

	else if( file_path.includes('document'))
	{
		return (
			<div className='mt-1'>
			<a href={file_path} download className="text-blue-400 underline ml-2">
			<button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700">Download file</button>
			</a>
			</div>
		);
	}
//pdf rendering this way takes too much resources
//but as long it's below document it's not gonna run for now
	else if(file_path.includes('pdf')) 
	{
		return (
			<div style={{ height: 'calc(80vh - 2rem)' }}>
			<iframe 
			src={`${file_path}#toolbar=0&view=FitH`} 
			className="w-full h-full" 
			style={{
				border: 'none',
				background: 'transparent',
			}}
			title={name}
			>
			This browser does not support PDFs. Please download the PDF to view it.
			</iframe>
			</div>
		);
	}
	else 
	{
		return (
			<div className="mt-1">
			<a href={file_path} download className="text-blue-400 underline">
			{name}
			</a>
			</div>
		);
	}
};

export default React.memo(RenderFileLink);
