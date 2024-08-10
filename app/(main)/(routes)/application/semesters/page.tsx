"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

import { getAPI, postAPI } from "@/lib/api";
import {getToken, getUserInfoLocal } from '@/lib/utils';

import dynamic from 'next/dynamic';
import { ChatProps } from '@/components/Chat';
import { markdownProps } from '@/components/markdownRenderer';
import { FileLink } from '@/components/RenderFileLink';
import { ResourceFormProps } from '@/components/semesters/ResourcesForm';
import { set } from 'react-hook-form';

const Chat = dynamic<ChatProps>(() => import('@/components/Chat').then((mod) => mod.default) );
const MarkdownRenderer = dynamic<markdownProps>(() => import('@/components/markdownRenderer').then((mod) => mod.default) );
const RenderFileLink = dynamic<FileLink>(() => import('@/components/RenderFileLink').then((mod) => mod.default) );
const ResourceForm = dynamic<ResourceFormProps>(() => import('@/components/semesters/ResourcesForm').then((mod) => mod.default) );


const ChatIcon = () => <span>💬</span>;
const NotesIcon = () => <span>📝</span>;
const SyllabusIcon = () => <span>📚</span>;
const QuestionPapersIcon = () => <span>📄</span>;

//Chat and Syllabus
interface Channel
{
	chat_id: string;
	//type: string;selectedTab
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

//Resources stuff: PQ and Notes
type ResourceCat ='Notes'| 'PQ'| 'Assignments'| 'Links'| 'Others';
interface Resource
{
	name: string;
	file_path: string;
	category: ResourceCat;
};

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

	//this looks cool computationally but results in some rendering artifacts
	//const [resources, setResources] = useState<Resource[]>();
	
	const [notes, setNotes] = useState<Resource[]>();
	const [pastQ, setPastQ] = useState<Resource[]>(); //maybe make this just one resource: pdf

	const [addResource, setAddResource] = useState<boolean>(false);
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => 
	{
		import('@/lib/utils').then(({ getUserInfoLocal }) => { setIsAdmin(getUserInfoLocal()?.is_admin || false); }); //this is magic
	}, []);

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
	const getSelectedSubjectName = () => 
	{
		return subjects && subjects[selectedSubject].name || "";
	}

	//Resources stuff
	//any time the tab is switched to qp or notes && subjects array changes or the selected suject changes resources are then fetched
	const fetchResources = useCallback(async () => 
	{
		if(!subjects) return;
		try 
		{
			const resources = await getAPI(`resources/subject/${subjects[selectedSubject].subject_id}`);
			//const res : Resource = (resources.filter((resources: Resource) => resources.category === selectedTab));
			//console.log("Logging resource\n" + JSON.stringify(res));
			setNotes(resources.filter((resources: Resource) => resources.category === "Notes"));
			setPastQ(resources.filter((resources: Resource) => 
			{
				return resources.category === "PQ" || resources.category === "Links" || resources.category === "Others" || resources.category === "Assignments";
			}));
		} 
		catch (error) 
		{
			console.log("Error fetching resources at semesters/page.tsx : 122");
		}
	}, [selectedSubject, subjects]);
	useEffect(() => 
	{
		if(selectedTab === "PQ" || selectedTab === "Notes")
		{
			fetchResources();
		}
	}, [fetchResources, selectedTab]);


	//add new resource stuff
	const handleResourceSend = useCallback(async (formData: FormData) => 
	{
		console.log(formData);
		try 
		{
			await postAPI('resources', formData, 
			{
				'Content-Type': 'multipart/form-data',
			});
			fetchResources();
			setAddResource(false);
		}
		catch (error: any) 
		{
			console.log("Error posting new resource in semesters/page.tsx:173");
		}
	}, [fetchResources]);


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
		onClick={() => { setIsSemesterDropdownOpen(!isSemesterDropdownOpen); setIsSubjectDropdownOpen(false);}} 
		className="px-4 py-2 rounded flex items-center border-2 border-violet-900 hover:bg-indigo-900" >
		Semester {selectedSemester} <ChevronDownIcon className="w-5 h-5 ml-3" />
		</button>

		{isSemesterDropdownOpen && (
			<div className="absolute top-full left-0 mt-1 bg-violet-900 rounded shadow-lg z-10">
			{fastSemesters.map((semester) => (
				<button
				key={semester}
				onClick={() => { setSelectedSemester(semester); setIsSemesterDropdownOpen(false);}}
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
				onClick={() => { setSelectedSubject(index); setIsSubjectDropdownOpen(false); } }
				className="block w-full text-left px-4 py-2 hover:bg-blue-700"
				>
				{subject.name}
				</button>
			))}
			</div>
		)}
		</div>

		{isAdmin && (
		<div>
 		<button 
		onClick={() => setAddResource(true)} 
		className="px-4 py-2 rounded flex border-2 border-violet-900 hover:bg-indigo-900 transition-colors">
		+ 
		</button>
		</div>
		)}

		</div>


		<div className="flex space-x-2">
		<button
		onClick={() => setSelectedTab('Syllabus')}
		className={`p-2 rounded ${selectedTab === 'Syllabus' ? 'bg-indigo-700' : 'bg-indigo-500'}`}>
		<SyllabusIcon/>
		</button>
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
		onClick={() => setSelectedTab('PQ')}
		className={`p-2 rounded ${selectedTab === 'PQ' ? 'bg-indigo-700' : 'bg-indigo-500'}`}>
		<QuestionPapersIcon/>
		</button>
		</div>

		</div>


		{selectedTab === "Syllabus" && (
			<div className="ml-3">
			<h2 className="text-xl mb-4 font-bold">Syllabus for {getSelectedSubjectName()}</h2>
			{subjects && subjects[selectedSubject].description}
			{subjects && <MarkdownRenderer markdownContent={ subjects[selectedSubject].syllabus} /> }
			</div>
		)}
		{selectedTab === "Chat" && subjects && 
			<Chat
			chatId={subjects[selectedSubject].chat.chat_id || ""}
			chatName={getSelectedSubjectName()}
			userId={userInfo?.user_id || ''}
			userName={userInfo?.username || ''}
			userPfp={userInfo?.profile_pic || ''}
			token={token || ''}
			/>
		}

		{selectedTab === "Notes" && notes && (
			<div className="ml-3">
			<h2 className="text-xl mb-4 font-bold">Notes for {getSelectedSubjectName()}</h2>
			{notes.map((resource : Resource, index) => (
				<div key={index}>
				{<a href={resource.file_path} className="text-blue-600 underline hover:text-blue-700">{index+1}.{resource.name}</a>}
				<RenderFileLink
				name={resource.name}
				file_path={resource.file_path}
				/>
				</div>
			))}
			</div>

		)}

		{selectedTab === "PQ" && pastQ && (
			<div className="ml-3">
			<h2 className="text-xl mb-4 font-bold">Question Papers for {getSelectedSubjectName()}</h2>
			{pastQ.map((resource : Resource, index) => (
				<div key={index}>
				<a href={resource.file_path} className="text-blue-600 underline hover:text-blue-700">{index+1}. {resource.name}</a>
				<RenderFileLink
				name={resource.name}
				file_path={resource.file_path}
				/>
				</div>
			))}
			</div>
		)}

		{addResource && subjects && (
			<ResourceForm
			subject_id={subjects[selectedSubject].subject_id}
			onSubmit={handleResourceSend}
			onClose={()=>setAddResource(false)}
			/>
		)}
		</div>
	);
};

export default React.memo(SemesterPage);

