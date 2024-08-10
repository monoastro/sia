import React, { useRef, useEffect } from 'react';

interface ModalProps 
{
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	imageUrl: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, imageUrl }) => 
{
	const modalRef = useRef<HTMLDivElement>(null);

	const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => 
	{
		if (modalRef.current && !modalRef.current.contains(e.target as Node)) 
		{
			onClose();
		}
	};

	useEffect(() => 
	{
		const handleEscape = (e: KeyboardEvent) => 
		{
			if (e.key === 'Escape') 
			{
				onClose();
			}
		};
		document.addEventListener('keydown', handleEscape);

		// Disable scrolling when the modal is open
		if (isOpen) 
		{
			document.body.style.overflow = 'hidden';
		} else 
		{
			document.body.style.overflow = '';
		}

		return () => 
		{
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = '';
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-80 z-50" onClick={handleOverlayClick}>
		<div className="bg-gray-900 p-6 rounded-lg relative z-50" ref={modalRef}>
		{children}
		<div className="mt-2 text-left">
		<a href={imageUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 underline">
		Open in Browser
		</a>
		</div>
		</div>
		</div>
	);
};

export default Modal;
