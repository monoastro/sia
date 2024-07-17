"use client";
import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const ChatIcon = () => <span>💬</span>;
const NotesIcon = () => <span>📝</span>;
const SyllabusIcon = () => <span>📚</span>;
const QuestionPapersIcon = () => <span>📄</span>;

//fuck this; imma chatgpt this shit
const semesters = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'];
const subjects = {
  'Semester 1': ['Math', 'Physics', 'Chemistry'],
  'Semester 2': ['Programming', 'English', 'Economics'],
  'Semester 3': ['Biology', 'History', 'Geography'],
  'Semester 4': ['Art', 'Music', 'Dance'],
  'Semester 5': ['PE', 'Health', 'Computer Science'],
  'Semester 6': ['Psychology', 'Sociology', 'Philosophy'],
  'Semester 7': ['Business', 'Marketing', 'Finance'],
  'Semester 8': ['Engineering', 'Architecture', 'Design'],
};

const SemesterPage: React.FC = () =>
{
	const [selectedSemester, setSelectedSemester] = useState(semesters[0]);
	const [selectedSubject, setSelectedSubject] = useState(subjects[selectedSemester][0]);
	const [selectedTab, setSelectedTab] = useState('Notes');
	const [isSemesterDropdownOpen, setIsSemesterDropdownOpen] = useState(false);
	const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);

	const handleSemesterChange = (semester: string) => {
		setSelectedSemester(semester);
		setSelectedSubject(subjects[semester][0]);
		setIsSemesterDropdownOpen(false);
	};

	const handleSubjectChange = (subject: string) => {
		setSelectedSubject(subject);
		setIsSubjectDropdownOpen(false);
	};

	return (
		<div className="p-6 text-white min-h-screen">
		<div className="flex justify-between items-center mb-6">
		<div className="flex space-x-4">
		<div className="relative">
		<button
		onClick={() => setIsSemesterDropdownOpen(!isSemesterDropdownOpen)}
		className="bg-white text-blue-900 px-4 py-2 rounded flex items-center"
		>
		{selectedSemester}
		<ChevronDownIcon className="w-5 h-5 ml-2" />
		</button>
		{isSemesterDropdownOpen && (
			<div className="absolute top-full left-0 mt-1 bg-white text-blue-900 rounded shadow-lg z-10">
			{semesters.map((semester) => (
				<button
				key={semester}
				onClick={() => handleSemesterChange(semester)}
				className="block w-full text-left px-4 py-2 hover:bg-blue-100"
				>
				{semester}
				</button>
			))}
			</div>
		)}
		</div>
		<div className="relative">
		<button
		onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
		className="bg-white text-blue-900 px-4 py-2 rounded flex items-center"
		>
		{selectedSubject}
		<ChevronDownIcon className="w-5 h-5 ml-2" />
		</button>
		{isSubjectDropdownOpen && (
			<div className="absolute top-full left-0 mt-1 bg-white text-blue-900 rounded shadow-lg z-10">
			{subjects[selectedSemester].map((subject) => (
				<button
				key={subject}
				onClick={() => handleSubjectChange(subject)}
				className="block w-full text-left px-4 py-2 hover:bg-blue-100"
				>
				{subject}
				</button>
			))}
			</div>
		)}
		</div>
		</div>
		<div className="flex space-x-2">
		<button onClick={() => setSelectedTab('Chat')} className={`p-2 rounded ${selectedTab === 'Chat' ? 'bg-red-600' : 'bg-red-500'}`}><ChatIcon /></button>
		<button onClick={() => setSelectedTab('Notes')} className={`p-2 rounded ${selectedTab === 'Notes' ? 'bg-red-600' : 'bg-red-500'}`}><NotesIcon /></button>
		<button onClick={() => setSelectedTab('Syllabus')} className={`p-2 rounded ${selectedTab === 'Syllabus' ? 'bg-red-600' : 'bg-red-500'}`}><SyllabusIcon /></button>
		<button onClick={() => setSelectedTab('Question Papers')} className={`p-2 rounded ${selectedTab === 'Question Papers' ? 'bg-red-600' : 'bg-red-500'}`}><QuestionPapersIcon /></button>
		</div>
		</div>
		<div className="bg-blue-800 p-4 rounded">
		{selectedTab === 'Notes' && (
			<div>
			<h2 className="text-xl mb-4">Notes for {selectedSubject}</h2>
			{/* Add a component or logic to display and post note links */}
			<p>Here you can post and view links to notes.</p>
			</div>
		)}
		{selectedTab === 'Chat' && (
			<div>
			<h2 className="text-xl mb-4">Chat for {selectedSubject}</h2>
			{/* Add a chat component here */}
			<p>This is where the chat interface would go.</p>
			</div>
		)}
		{selectedTab === 'Syllabus' && (
			<div>
			<h2 className="text-xl mb-4">Syllabus for {selectedSubject}</h2>
			{/* Add syllabus content or component here */}
			<p>Display the syllabus for the selected subject here.</p>
				</div>
		)}
		{selectedTab === 'Question Papers' && (
			<div>
			<h2 className="text-xl mb-4">Question Papers for {selectedSubject}</h2>
			{/* Add a component or logic to display and post question paper links */}
			<p>Here you can post and view links to question papers.</p>
			</div>
		)}
		</div>
		</div>
	);
};

export default SemesterPage;
