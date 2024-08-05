// "use client";

// import React, { useState, useEffect } from 'react';
// import Image from 'next/image';
// import { getAPI, putAPI, postAPI, deleteAPI } from '@/lib/api';

// type AnnouncementType = 'General' | 'Class' | 'Assignment' | 'Assessment';

// interface Announcement {
//   announcement_id: string;
//   title: string;
//   message: string;
//   attachment: string | null;
//   category: string;
//   created_at: string;
//   updated_at: string;
//   username: string;
//   profile_pic: string;
// }

// const AnnouncementsPage: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<AnnouncementType>('General');
//   const [announcements, setAnnouncements] = useState<Record<AnnouncementType, Announcement[]>>({
//     General: [],
//     Class: [],
//     Assignment: [],
//     Assessment: [],
//   });
//   const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
//   const [formValues, setFormValues] = useState<Partial<Announcement>>({
//     title: '',
//     message: '',
//     category: ''
//   });
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [attachmentFile, setAttachmentFile] = useState<File | null>(null);

//   const tabs: AnnouncementType[] = ['General', 'Class', 'Assignment', 'Assessment'];

//   const fetchAnnouncements = async () => {
//     try {
//       const data = await getAPI('announcements');
//       if (data) {
//         const fetchedAnnouncements = data;
//         console.log(fetchedAnnouncements);
//         const updatedAnnouncements: Record<AnnouncementType, Announcement[]> = {
//           General: [],
//           Class: [],
//           Assignment: [],
//           Assessment: [],
//         };

//         fetchedAnnouncements.forEach((announcement: Announcement) => {
//           const category = announcement.category as AnnouncementType;
//           if (tabs.includes(category)) {
//             updatedAnnouncements[category].push(announcement);
//           }
//         });

//         setAnnouncements(updatedAnnouncements);
//       }
//     } catch (error) {
//       console.error('Error fetching announcements:', error);
//     }
//   };

//   useEffect(() => {
//     fetchAnnouncements();
//   }, []);

//   const handleDelete = async (id: string) => {
//     try {
//       await deleteAPI(`announcements/${id}`);
//       fetchAnnouncements(); // Refresh announcements
//     } catch (error) {
//       console.error('Error deleting announcement:', error);
//     }
//   };

//   const handleUpdate = async (id: string) => {
//     try {
//       const formData = new FormData();
//       formData.append('title', formValues.title || '');
//       formData.append('message', formValues.message || '');
//       formData.append('category', activeTab);
//       if (attachmentFile) {
//         formData.append('attachment', attachmentFile);
//       }
//       await putAPI(`announcements/${id}`, formData);
//       fetchAnnouncements(); // Refresh announcements
//       setEditingAnnouncement(null);
//       setFormValues({ title: '', message: '' });
//       setAttachmentFile(null);
//     } catch (error) {
//       console.error('Error updating announcement:', error);
//     }
//   };

//   const handleAdd = async () => {
//     try {
//       const formData = new FormData();
//       formData.append('title', formValues.title || '');
//       formData.append('message', formValues.message || '');
//       if (attachmentFile) {
//         formData.append('attachment', attachmentFile);

//         console.log(attachmentFile);
//       }
//       console.log(activeTab);
//       formData.append('category', activeTab);
//       console.log("form data",formData);
//       await postAPI('announcements', formData, 
//         // {
//         //   'Content-Type': 'multipart/form-data',
//         // }
//       ); // currently no attachments can be added as headers is application/json, change the postAPI to accept headers
//       fetchAnnouncements(); // Refresh announcements
//       setShowAddForm(false);
//       setFormValues({ title: '', message: '' });
//       setAttachmentFile(null);
//     } catch (error) {
//       console.error('Error adding announcement:', error);
//     }
//   };

//   const handleEditClick = (announcement: Announcement) => {
//     setEditingAnnouncement(announcement);
//     setFormValues({
//       title: announcement.title,
//       message: announcement.message
//     });
//     setAttachmentFile(null); // Clear file when editing existing announcement
//   };

//   const renderAttachment = (attachment: string | null) => {
//     if (!attachment) {
//       return null;
//     }

//     const isImage = attachment.includes('image');
//     const isDocument = attachment.includes('document');

//     if (isImage) {
//       return (
//         <div className="mt-2">
//           <Image
//             src={attachment}
//             alt="Attachment"
//             width={400}
//             height={300}
//             className="rounded object-contain"
//             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//             onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/static/fallback.png'; }}
//           />
//         </div>
//       );
//     } else if (isDocument) {
//       return (
//         <div className="mt-2">
//           <a href={attachment} download className="text-blue-400 underline">
//             Download Document
//           </a>
//         </div>
//       );
//     } else {
//       return (
//         <div className="mt-2">
//           <a href={attachment} download className="text-blue-400 underline">
//             Download Attachment
//           </a>
//         </div>
//       );
//     }
//   };

//   const AnnouncementForm = ({ onSubmit }: { onSubmit: () => void }) => (
//     <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-80">
//       <div className="bg-gray-900 p-6 rounded-lg w-full max-w-lg">
//         <h2 className="text-xl font-bold text-white mb-4">{editingAnnouncement ? 'Update Announcement' : 'Add Announcement'}</h2>
//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             onSubmit();
//           }}
//         >
//           <div className="mb-4">
//             <label className="block text-white mb-2">Title</label>
//             <input
//               type="text"
//               value={formValues.title || ''}
//               onChange={(e) => setFormValues((prev) => ({ ...prev, title: e.target.value }))}
//               className="w-full px-3 py-2 bg-gray-700 text-white rounded"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-white mb-2">Message</label>
//             <textarea
//               value={formValues.message || ''}
//               onChange={(e) => setFormValues((prev) => ({ ...prev, message: e.target.value }))}
//               className="w-full px-3 py-2 bg-gray-700 text-white rounded h-32 overflow-y-auto"
//               required
//             />
//           </div>
//           {!editingAnnouncement && (
//             <div className="mb-4">
//               <label className="block text-white mb-2">Attachment</label>
//               {attachmentFile && (
//                 <div className="mb-2 text-white">
//                   Selected file: {attachmentFile.name}
//                 </div>
//               )}
//               <input
//                 type="file"
//                 onChange={(e) => setAttachmentFile(e.target.files ? e.target.files[0] : null)}
//                 className="w-full px-3 py-2 bg-gray-700 text-white rounded"
//               />
//             </div>
//           )}
//           <div className="flex justify-end">
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               {editingAnnouncement ? 'Update' : 'Add'}
//             </button>
//             <button
//               type="button"
//               onClick={() => {
//                 setEditingAnnouncement(null);
//                 setShowAddForm(false);
//                 setFormValues({ title: '', message: '' });
//                 setAttachmentFile(null);
//               }}
//               className="ml-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );

//   return (
//     <div className="bg-gray-900 min-h-screen p-6">
//       <h1 className="text-3xl font-bold text-white mb-6">Announcements</h1>

//       {/* Tabs */}
//       <div className="flex mb-6">
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             className={`px-4 py-2 mr-2 font-semibold ${
//               activeTab === tab
//                 ? 'text-blue-400 border-b-2 border-blue-400'
//                 : 'text-gray-400 hover:text-gray-300'
//             }`}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab} Announcements
//           </button>
//         ))}
//         {/* add announcement button here */}
//       <button
//         onClick={() => setShowAddForm(true)}
//         className="ml-4 text-3xl text-green-500 font-bold hover:text-green-600 focus:outline-none"
//         aria-label="Add Announcement"
//       >
//       +
//       </button>
//       </div>

//       {/* Scrollable container for announcements */}
//       <div className="h-[50rem] overflow-y-scroll flex flex-col h-screen">
//         {announcements[activeTab].map((announcement) => (
//           <div key={announcement.announcement_id} className="relative flex items-start mb-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
//             <Image
//               src={announcement.profile_pic || '/static/fallback.png'}
//               alt="Profile"
//               width={40}
//               height={40}
//               className="rounded-full mr-4"
//             />
//             <div className="flex-grow text-white">
//               <div className="flex items-center mb-2">
//                 <span className="font-semibold text-white mr-2">{announcement.username}</span>
//               </div>
//               <div className="flex items-center mb-1">
//                 <span className="font-bold text-white">{announcement.title}</span>
//               </div>
//               <p className="text-white mb-2">{announcement.message}</p>
//               {renderAttachment(announcement.attachment)}
//               <div className="text-sm text-gray-400 mt-2">{new Date(announcement.created_at).toLocaleString()}</div>
//             </div>
//             <button
//               className="absolute top-2 right-2 text-gray-400 hover:text-white"
//               onClick={() => handleEditClick(announcement)}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 20h12M6 16h12M6 12h12m-6-8h6m-6 0H6m0 0v14m12-14v14" />
//               </svg>
//             </button>
//             <button
//               className="absolute top-2 right-12 text-red-400 hover:text-red-600"
//               onClick={() => handleDelete(announcement.announcement_id)}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Forms */}
//       {editingAnnouncement && <AnnouncementForm onSubmit={() => handleUpdate(editingAnnouncement.announcement_id)} />}
//       {showAddForm && <AnnouncementForm onSubmit={handleAdd} />}
//     </div>
//   );
// };

// export default AnnouncementsPage;

// broke all these into component and the input field started working

"use client";

import React, { useState, useEffect } from 'react';
import { getAPI, deleteAPI, putAPI, postAPI } from '@/lib/api';
import Tabs from './components/Tabs';
import AnnouncementForm from './components/AnnouncementForm';
import AnnouncementItem from './components/AnnouncementItem';

type AnnouncementType = 'General' | 'Class' | 'Assignment' | 'Assessment';

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

const AnnouncementsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AnnouncementType>('General');
  const [announcements, setAnnouncements] = useState<Record<AnnouncementType, Announcement[]>>({
    General: [],
    Class: [],
    Assignment: [],
    Assessment: [],
  });
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const tabs: AnnouncementType[] = ['General', 'Class', 'Assignment', 'Assessment'];

  const fetchAnnouncements = async () => {
    try {
      const data = await getAPI('announcements');
      if (data) {
        const fetchedAnnouncements = data;
        const updatedAnnouncements: Record<AnnouncementType, Announcement[]> = {
          General: [],
          Class: [],
          Assignment: [],
          Assessment: [],
        };

        fetchedAnnouncements.forEach((announcement: Announcement) => {
          const category = announcement.category as AnnouncementType;
          if (tabs.includes(category)) {
            updatedAnnouncements[category].push(announcement);
          }
        });

        setAnnouncements(updatedAnnouncements);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteAPI(`announcements/${id}`);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  const handleUpdate = async (formData: FormData, id: string) => {
    try {
      await putAPI(`announcements/${id}`, formData);
      fetchAnnouncements();
      setEditingAnnouncement(null);
    } catch (error) {
      console.error('Error updating announcement:', error);
    }
  };

  const handleAdd = async (formData: FormData) => {
    try {
      await postAPI('announcements', formData, {
        'Content-Type': 'multipart/form-data',
      });
      fetchAnnouncements();
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding announcement:', error);
    }
  };

  const handleEditClick = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
  };

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Announcements</h1>
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setShowAddForm={setShowAddForm}
      />
      <div className="h-[50rem] overflow-y-scroll flex flex-col">
        {announcements[activeTab].map((announcement) => (
          <AnnouncementItem
            key={announcement.announcement_id}
            announcement={announcement}
            handleDelete={handleDelete}
            handleEditClick={handleEditClick}
          />
        ))}
      </div>
      {editingAnnouncement && (
        <AnnouncementForm
          initialValues={editingAnnouncement}
          onSubmit={(formData) => handleUpdate(formData, editingAnnouncement.announcement_id)}
          onClose={() => setEditingAnnouncement(null)}
        />
      )}
      {showAddForm && (
        <AnnouncementForm
          initialValues={{ title: '', message: '', category: activeTab }}
          onSubmit={handleAdd}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};

export default AnnouncementsPage;
