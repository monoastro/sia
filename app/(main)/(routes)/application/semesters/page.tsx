"use client";
import React, { useState, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Chat } from "@/components/Chat"

import { getAPI } from "@/lib/api";
import {getToken, getUserInfoLocal } from '@/lib/utils';
import { MarkdownRenderer } from '@/components/markdownRenderer';

const ChatIcon = () => <span>💬</span>;
const NotesIcon = () => <span>📝</span>;
const SyllabusIcon = () => <span>📚</span>;
const QuestionPapersIcon = () => <span>📄</span>;


interface Channel
{
	chat_id: string;
	type: string;
	category: string;
};

interface Subject
{
	subject_id: string;
	name: string;
	description: string;
	syllabus: string;
	chat: Channel;
};

interface Semester
{
	semester: number;
	semester_id: string;
	created_at: string;
	updated_at: string;
	subjects: Subject[];
};

//hacks to load semesters and their subjects faster
const fastSemesters : number[] = Array.from({length: 8}, (_, i) => i + 1);

const SemesterPage: React.FC = () => 
{
	const [semesters, setSemesters] = useState<Semester[]>();

	//getActiveSemester fn for these lads; for now just hardcode the defaults
    const [selectedSemester, setSelectedSemester] = useState<number>(5);
    const [selectedSubject, setSelectedSubject] = useState<number>(0);
	const [isSemesterDropdownOpen, setIsSemesterDropdownOpen] = useState<boolean>(false);
	const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState<string>("Syllabus");

	useEffect( () =>
	{
		const fetchSemesters = async () =>
		{
			try
			{
				const allSemesters = await getAPI("semesters");
				//console.log(allSemesters);
				setSemesters(allSemesters);
			}
			catch(error)
			{
				console.log("Error fetching channels:\n", error);
			}
		};
		fetchSemesters();
	}, []);

    const handleSemesterChange = (semester: number) =>
	{
        setSelectedSemester(semester);
        setSelectedSubject(0);
        setIsSemesterDropdownOpen(false);
    };

    const handleSubjectChange = (subject: number) => 
	{
        setSelectedSubject(subject);
		setIsSubjectDropdownOpen(false);
    };

	const getSelectedChatID = () =>
	{
		return semesters && semesters[selectedSemester - 1].subjects[selectedSubject].chat.chat_id || "";
	}
	const getSelectedSubjectName = () =>
	{
		return semesters && semesters[selectedSemester - 1].subjects[selectedSubject].name || "";
	}

	if (!semesters)
	{
		return null;
	}
    return (
		<div className="flex flex-col h-screen text-white ">


		<div className="flex px-3 py-4 justify-between items-center">

		<div className="flex space-x-4">
		<div className="relative">
		<button
		onClick={() => setIsSemesterDropdownOpen(!isSemesterDropdownOpen)} className="px-4 py-2 rounded flex items-center border-2 border-violet-900 hover:bg-indigo-900" >
		Semester {selectedSemester} <ChevronDownIcon className="w-5 h-5 ml-3" />
		</button>

		{isSemesterDropdownOpen && (
			<div className="absolute top-full left-0 mt-1 bg-violet-900 rounded shadow-lg z-10">
			{fastSemesters.map((semester) => (
				<button
				key={semester}
				onClick={() => handleSemesterChange(semester)}
				className="block w-full text-left px-4 py-2 hover:bg-blue-700"
				>
				Semester {semester}
				</button>
			))}
			</div>
		)}
		</div>
		<div className="relative">
		<button
		onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
		className="px-4 py-2 rounded flex items-center border-2 border-violet-900 hover:bg-indigo-900" >
		{getSelectedSubjectName()} <ChevronDownIcon className="w-5 h-5 ml-2" />
		</button>
		{isSubjectDropdownOpen && (
			<div className="absolute top-full left-0 mt-1 bg-violet-900 rounded shadow-lg z-10">
			{semesters && semesters[selectedSemester - 1].subjects.map((subject, index) => (
				<button
				key={subject.subject_id}
				onClick={() => handleSubjectChange(index)}
				className="block w-full text-left px-4 py-2 hover:bg-blue-700"
				>
				{subject.name}
				</button>
			))}
			</div>
		)}
		</div>
		</div>

		<div className="flex space-x-2">
		<button
		onClick={() => setSelectedTab('Chat')}
		className={`p-2 rounded ${selectedTab === 'Chat' ? 'bg-indigo-700' : 'bg-indigo-500'}`}>
		<ChatIcon/>
		</button>
		<button
		onClick={() => setSelectedTab('Notes')}
		className={`p-2 rounded ${selectedTab === 'Notes' ? 'bg-indigo-700' : 'bg-indigo-500'}`}>
		<NotesIcon/>
		</button>
		<button
		onClick={() => setSelectedTab('Syllabus')}
		className={`p-2 rounded ${selectedTab === 'Syllabus' ? 'bg-indigo-700' : 'bg-indigo-500'}`}>
		<SyllabusIcon/>
		</button>
		<button
		onClick={() => setSelectedTab('Question Papers')}
		className={`p-2 rounded ${selectedTab === 'Question Papers' ? 'bg-indigo-700' : 'bg-indigo-500'}`}>
		<QuestionPapersIcon/>
		</button>
		</div>

		</div>


		{selectedTab === 'Notes' && (
			<div className="ml-3">
			<h2 className="text-xl mb-4 font-bold">Notes for {selectedSubject}. {getSelectedSubjectName()}</h2>
			{/* Add a component or logic to display and post note links */}
			</div>
		)}

		{selectedTab === 'Chat' && semesters && 
			<Chat
			chatId={getSelectedChatID()}
			chatName={getSelectedSubjectName()}
			userId={getUserInfoLocal()?.user_id}
			userName={getUserInfoLocal()?.username}
			userPfp={getUserInfoLocal()?.profile_pic}
			token={getToken() || ''}
			/>
		}

		{selectedTab === 'Syllabus' && (
			<div className="ml-3">
			<h2 className="text-xl mb-4 font-bold">Syllabus for {getSelectedSubjectName()}</h2>
			{semesters && semesters[selectedSemester - 1].subjects[selectedSubject].description}
			{semesters &&
			<MarkdownRenderer markdownContent={ semesters[selectedSemester - 1].subjects[selectedSubject].syllabus} />
			}
			</div>
		)}

		{selectedTab === 'Question Papers' && (
			<div className="ml-3">
			<h2 className="text-xl mb-4 font-bold">Question Papers for {selectedSubject}</h2>
			{/* Add a component or logic to display and post question paper links */}
			<p>Here you can post and view links to question papers.</p>
			</div>
		)}

		</div>
	);
};

export default SemesterPage;

