"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

import { getAPI } from "@/lib/api";
import {getToken, getUserInfoLocal } from '@/lib/utils';

import dynamic from 'next/dynamic';
import { ChatProps } from '@/components/Chat';
import { markdownProps } from '@/components/markdownRenderer';
const Chat = dynamic<ChatProps>(() => import('@/components/Chat').then((mod) => mod.default) );
const MarkdownRenderer = dynamic<markdownProps>(() => import('@/components/markdownRenderer').then((mod) => mod.default) );

const ChatIcon = () => <span>💬</span>;
const NotesIcon = () => <span>📝</span>;
const SyllabusIcon = () => <span>📚</span>;
const QuestionPapersIcon = () => <span>📄</span>;


interface Channel

{
	chat_id: string;
	//type: string;
	//category: string;
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
	semester_id: string;
	//semester: number;
	//description: string;
}

//hacks to load semesters and their subjects faster
const fastSemesters : number[] = Array.from({length: 8}, (_, i) => i + 1);

const SemesterPage: React.FC = () => 

{
	const [semesterIDs, setSemesterIDs] = useState<string[8]>();
	const [subjects, setSubjects] = useState<Subject[]>();

	//getActiveSemester fn for these lads; for now just hardcode the defaults
	const [selectedSemester, setSelectedSemester] = useState<number>(5);
    const [selectedSubject, setSelectedSubject] = useState<number>(0);
	const [isSemesterDropdownOpen, setIsSemesterDropdownOpen] = useState<boolean>(false);
	const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState<string>("Syllabus");

	const userInfo = getUserInfoLocal();
	const token = getToken();

    const fetchSemesterIDs = useCallback(async () => 
    {
        try 
        {
            const allSemestersInfo = await getAPI("semesters/each");
            setSemesterIDs(allSemestersInfo.map((semester: Semester) => semester.semester_id));
        } catch (error) 
        {
            console.log("Error fetching semesters/each in semesters/page.tsx : 93\n", error);
        }
    }, []);

    useEffect(() => 
    {
        fetchSemesterIDs();
    }, [fetchSemesterIDs]);

	//weird logic but it works; don't blame me blame react
	const fetchSubjects = useCallback( async () => 
	{
		if(!semesterIDs) return; //this is probably the 50th hack i've implemented in this project
		//console.log(semesterIDs[selectedSemester - 1 ]);
	    try
	    
	    {
			const data = await getAPI(`semesters/${semesterIDs[selectedSemester - 1]}`);
			setSubjects(data[0].subjects);
			setSelectedSubject(0);
	    }
	    catch(error)
	    
	    {
			console.log("Error fetching semesters/id in semesters/page.tsx : 71")
	    }
	}, [selectedSemester, semesterIDs]);

	useEffect(()=> 
	{
		fetchSubjects();
	}, [fetchSubjects]);




    const handleSemesterChange = async (semester: number) => 
    {
        setSelectedSemester(semester);
        setIsSemesterDropdownOpen(false);
    };

	const getSelectedChatID = () => 
	{
		return subjects && subjects[selectedSubject].chat.chat_id || "";
	}
	const getSelectedSubjectName = () => 
	{
		return subjects && subjects[selectedSubject].name || "";
	}

	if(!subjects) 
	{
		return null;
	}

    return (
		<div className="flex flex-col h-screen text-white ">

		<div className="flex px-3 py-4 justify-between items-center">
		<div className="flex space-x-4">
		<div className="relative">
		<button
		onClick={() => { setIsSemesterDropdownOpen(!isSemesterDropdownOpen); setIsSubjectDropdownOpen(false);}} className="px-4 py-2 rounded flex items-center border-2 border-violet-900 hover:bg-indigo-900" >
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
		onClick={() => {setIsSubjectDropdownOpen(!isSubjectDropdownOpen); setIsSemesterDropdownOpen(false);}}
		className="px-4 py-2 rounded flex items-center border-2 border-violet-900 hover:bg-indigo-900" >
		{getSelectedSubjectName()} <ChevronDownIcon className="w-5 h-5 ml-2" />
		</button>
		{isSubjectDropdownOpen && (
			<div className="absolute top-full left-0 mt-1 bg-violet-900 rounded shadow-lg z-10">
			{subjects && subjects.map((subject, index) => (
				<button
				key={subject.subject_id}
				onClick={() => { setSelectedSubject(index); setIsSubjectDropdownOpen(false);} }
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


		{selectedTab === "Notes" && (
			<div className="ml-3">
			<h2 className="text-xl mb-4 font-bold">Notes for {selectedSubject + 1}. {getSelectedSubjectName()}</h2>
			{/* Add a component or logic to display and post note links */}
			</div>
		)}

		{selectedTab === "Chat" && subjects && 
			<Chat
			chatId={getSelectedChatID()}
			chatName={getSelectedSubjectName()}
			userId={userInfo?.user_id || ''}
			userName={userInfo?.username || ''}
			userPfp={userInfo?.profile_pic || ''}
			token={token || ''}
			/>
		}

		{selectedTab === "Syllabus" && (
			<div className="ml-3">
			<h2 className="text-xl mb-4 font-bold">Syllabus for {getSelectedSubjectName()}</h2>
			{subjects && subjects[selectedSubject].description}
			{subjects && <MarkdownRenderer markdownContent={ subjects[selectedSubject].syllabus} /> }
			</div>
		)}

		{selectedTab === "Question Papers" && (
			<div className="ml-3">
			<h2 className="text-xl mb-4 font-bold">Question Papers for {selectedSubject}</h2>
			</div>
		)}

		</div>
	);
};

export default React.memo(SemesterPage);

