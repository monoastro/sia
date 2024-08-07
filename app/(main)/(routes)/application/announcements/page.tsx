"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getAPI, deleteAPI, putAPI, postAPI } from '@/lib/api';
import Tabs from '@/components/announcements/Tabs';
import AnnouncementForm from '@/components/announcements/AnnouncementForm';
import AnnouncementItem from '@/components/announcements/AnnouncementItem';
import { set } from 'date-fns';

type AnnouncementType = 'General' | 'Class' | 'Assignment' | 'Assessment';

interface Announcement
{
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
  const [error, setError] = useState('');
  const [isSubmissionLoading, setIsSubmissionLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

	const tabs: AnnouncementType[] = useMemo(() => ['General', 'Class', 'Assignment', 'Assessment'], []);

  const fetchAnnouncements = useCallback(async () => {
    setError("");
    setSubmissionError("");

		try {
			const data = await getAPI('announcements');
			if (data)
			{
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
      } else {
        setError('No announcements found');
      }
    } catch (error) {
      setError('Error fetching announcements');
    }
  }, [tabs]);

	useEffect(() => {
		fetchAnnouncements();
	}, [fetchAnnouncements]);

  const handleDelete = async (id: string) => {
    setIsSubmissionLoading(true);
    setError("");

    try {
      await deleteAPI(`announcements/${id}`);
      fetchAnnouncements();
    } catch (error) {
      setSubmissionError('Error deleting announcement');
    } finally {
      setIsSubmissionLoading(false);
    }
  };

  const handleUpdate = async (formData: FormData, id: string) => {
    setIsSubmissionLoading(true);
    setError("");

    try {
      await putAPI(`announcements/${id}`, formData);
      fetchAnnouncements();
      setEditingAnnouncement(null);
    } catch (error: any) {
      console.log("Error updating announcement", error.response);
      setSubmissionError(error.response.data.message);      
    } finally {
      setIsSubmissionLoading(false);
    }
  };

  const handleAdd = async (formData: FormData) => {
    setIsSubmissionLoading(true);
    setSubmissionError("");

    try {
      await postAPI('announcements', formData, {
        'Content-Type': 'multipart/form-data',
      });
      fetchAnnouncements();
      setShowAddForm(false);
    } catch (error: any) {
      console.log("Show add form", showAddForm);
      console.log("Error adding announcement", error.response);
      if (error.response) {
        const errorMessage = error.response.data.details
          ? error.response.data.details[0]
          : error.response.data.message;
        console.log("Error message", errorMessage);
        setSubmissionError(errorMessage);
      } else {
        setSubmissionError('Failed to submit the announcement.');
      }
    } finally {
      setIsSubmissionLoading(false);
    }
  };

  const handleEditClick = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setSubmissionError("");
  };

  return (
    <div className="flex flex-col h-full max-h-full overflow-hidden p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Announcements</h1>
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} setShowAddForm={setShowAddForm} setAddAnnouncementError={setSubmissionError}/>
      <div className="flex-grow overflow-y-auto chat-scrollbar">
        {announcements[activeTab].length === 0 ? (
          <p className="text-white">No announcements found</p>
        ) : (
          announcements[activeTab].map((announcement) => (
            <AnnouncementItem
              key={announcement.announcement_id}
              announcement={announcement}
              handleDelete={handleDelete}
              handleEditClick={handleEditClick}
              
            />
          ))
        )}
      </div>
      {editingAnnouncement && (
        <AnnouncementForm
          initialValues={editingAnnouncement}
          onSubmit={(formData) => handleUpdate(formData, editingAnnouncement.announcement_id)}
          onClose={() => {
            setEditingAnnouncement(null);
            setError("");
          }}
          loading={isSubmissionLoading}
          error={submissionError}
        />
      )}
      {showAddForm && (
        <AnnouncementForm
          initialValues={{ title: '', message: '', category: activeTab }}
          onSubmit={handleAdd}
          onClose={() => {
            setShowAddForm(false);
            setError("");
          }}
          loading={isSubmissionLoading}
          error={submissionError}
        />
      )}
    </div>
  );
};

export default AnnouncementsPage;

