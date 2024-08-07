import React, { useState } from 'react';
import Image from 'next/image';
import Modal from './Modal';

interface Announcement {
  announcement_id: string;
  title: string;
  message: string;
  attachment: string | null;
  category: string;
  created_at: string;
  updated_at: string;
  username: string;
  profile_pic: string;
}

interface AnnouncementItemProps {
  announcement: Announcement;
  handleDelete: (id: string) => void;
  handleEditClick: (announcement: Announcement) => void;
}

const AnnouncementItem: React.FC<AnnouncementItemProps> = ({ announcement, handleDelete, handleEditClick}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderAttachment = (attachment: string | null) => {
    if (!attachment) return null;

    const isImage = attachment.includes('image');
    const isDocument = attachment.includes('document');

    if (isImage) {
      return (
        <div className="mt-2">
          <Image
            src={attachment}
            alt="Attachment"
            width={300}
            height={300}
            className="rounded object-cover cursor-pointer"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onClick={() => setIsModalOpen(true)}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/static/fallback.png'; }}
          />
        </div>
      );
    } else if (isDocument) {
      return (
        <div className="mt-2">
          <a href={attachment} download className="text-blue-400 underline">
            Attachment
          </a>
        </div>
      );
    } else {
      return (
        <div className="mt-2">
          <a href={attachment} download className="text-blue-400 underline">
            Attachment
          </a>
        </div>
      );
    }
  };

  return (
    <div className="relative flex items-start mb-4 p-4 rounded-lg border">
      <Image
        src={announcement.profile_pic || '/static/fallback.png'}
        alt="Profile"
        width={40}
        height={40}
        className="rounded-full mr-4"
      />
      <div className="flex-grow text-white">
        <div className="flex items-center mb-2">
          <span className="font-semibold text-white mr-2">{announcement.username}</span>
        </div>
        <div className="flex items-center mb-1">
          <span className="font-bold text-white">{announcement.title}</span>
        </div>
        <p className="text-white mb-2">{announcement.message}</p>
        {renderAttachment(announcement.attachment)}
        <div className="text-sm text-gray-400 mt-2">
          {new Date(announcement.created_at).toLocaleString()}
        </div>
      </div>

      <button
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
        onClick={() => handleEditClick(announcement)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 20h12M6 16h12M6 12h12m-6-8h6m-6 0H6m0 0v14m12-14v14" />
        </svg>
      </button>
      <button
        className="absolute top-2 right-12 text-red-400 hover:text-red-600"
        onClick={() => handleDelete(announcement.announcement_id)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} imageUrl={announcement.attachment || ''}>
          <Image
            src={announcement.attachment || '/static/fallback.png'}
            alt="Attachment"
            width={600}
            height={600}
            className="rounded object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/static/fallback.png'; }}
          />
        </Modal>
      )}
    </div>
  );
};

export default AnnouncementItem;
