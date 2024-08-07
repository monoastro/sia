"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getAPI, deleteAPI, putAPI, postAPI } from '@/lib/api';
import Tabs from '@/components/announcements/Tabs';
import AnnouncementForm from '@/components/announcements/AnnouncementForm';
import AnnouncementItem from '@/components/announcements/AnnouncementItem';

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
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	const tabs: AnnouncementType[] = useMemo(() => ['General', 'Class', 'Assignment', 'Assessment'], []);

	const fetchAnnouncements = useCallback(async () =>
	{
		setIsLoading(true);
		setError("");

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
				setIsLoading(false);
			}
			else
			{
				setError('No announcements found');
				setIsLoading(false);
			}
		}
		catch (error)
		{
			setError('Error fetching announcements');
			setIsLoading(false);
		}
	}, [tabs]);

	useEffect(() => {
		fetchAnnouncements();
	}, [fetchAnnouncements]);

	const handleDelete = async (id: string) => {
		setIsLoading(true);
		setError("");

		try {
			await deleteAPI(`announcements/${id}`);
			fetchAnnouncements();
		} catch (error) {
			setError('Error deleting announcement');
			setIsLoading(false);
		}
	};

	const handleUpdate = async (formData: FormData, id: string) => {
		setIsLoading(true);
		setError("");

		try {
			await putAPI(`announcements/${id}`, formData);
			fetchAnnouncements();
			setEditingAnnouncement(null);
		} catch (error) {
			setError('Error updating announcement');
			setIsLoading(false);
		}
	};

	const handleAdd = async (formData: FormData) => {
		setIsLoading(true);
		setError("");

		try {
			await postAPI('announcements', formData, {
				'Content-Type': 'multipart/form-data',
			});
			fetchAnnouncements();
			setShowAddForm(false);
		} catch (error: any) {
			console.log(error.response.data)      
			if (error.response.data) {
				if (error.response.data.details) { setError(error.response.data.details[0]); }
				else{
					setError(error.response.data.message);
				}
			} else {
				console.error('Failed to submit the announcement.', error);
				setError('Failed to submit the announcement.');
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleEditClick = (announcement: Announcement) => {
		setEditingAnnouncement(announcement);
	};

	if(!announcements)
	{
		return null;
	}
	return (
		<div className="min-h-screen p-6">
		<h1 className="text-3xl font-bold text-white mb-6">Announcements</h1>
		<Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} setShowAddForm={setShowAddForm}/>
		<div className="h-[50rem] overflow-y-scroll flex flex-col">
		{
			isLoading ?  <p className="text-white">Loading...</p> : announcements[activeTab].length === 0 ? 
			( <p className="text-white">No announcements yet...</p>) : 
			(
				announcements[activeTab].map((announcement) => (
					<AnnouncementItem
					key={announcement.announcement_id}
					announcement={announcement}
					handleDelete={handleDelete}
					handleEditClick={handleEditClick}
					/>
		)))}
		</div>
		{editingAnnouncement && (
			<AnnouncementForm
			initialValues={editingAnnouncement}
			onSubmit={(formData) => handleUpdate(formData, editingAnnouncement.announcement_id)}
			onClose={() => {
				setEditingAnnouncement(null);
				setError("");
			}}
			loading={isLoading}
			error={error}

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
			loading={isLoading}
			error={error}
			/>
		)}
		</div>
	);
};

export default AnnouncementsPage;

