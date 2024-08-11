'use client'
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import moment from 'moment';
import dynamic from 'next/dynamic';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import LoadingRoutinePage from '@/components/loading/loadingRoutine';

import { getAPI } from '@/lib/api';

const Table = dynamic(() => import("@/components/ui/table").then((mod) => mod.Table));
const TableBody = dynamic(() => import("@/components/ui/table").then((mod) => mod.TableBody));
const TableCell = dynamic(() => import("@/components/ui/table").then((mod) => mod.TableCell));
const TableHeader = dynamic(() => import("@/components/ui/table").then((mod) => mod.TableHeader));
const TableRow = dynamic(() => import("@/components/ui/table").then((mod) => mod.TableRow));

interface Routine 
{
	id: number;
	day: string;
	start_time: string;
	end_time: string;
	name: string;
	category: string;
	grp: string;
}

const RoutinePage: React.FC = () => 
{
	const [routines, setRoutines] = useState<Routine[]>([]);
	const [isDownloadToggled, setIsDownloadToggled] = useState<boolean>(false);
	const [activeSemester, setActiveSemester] = useState<number>(5);

	const fetchRoutines = useCallback(async () => 
	{
		try 
		{
			const data = await getAPI('routines');
			setRoutines(data);
		} catch (error) 
		{
			console.error(error);
		}
	}, []);

	useEffect(() => 
	{
		fetchRoutines();
	}, [fetchRoutines, activeSemester]);

	const daysOfWeek = useMemo(() => 
	{
		const startOfWeek = moment().startOf('week');
		return Array.from({ length: 7 }).map((_, index) => startOfWeek.clone().add(index, 'days').format('dddd'));
	}, []);

	const timeSlots = useMemo(() => 
	{
		const interval = 50;
		const slots = [];
		const start = moment('10:15 AM', 'h:mm A');
		const end = moment('4:05 PM', 'h:mm A');

		while (start <= end) 
		{
			const endTime = start.clone().add(interval, 'minutes');
			slots.push({ start: start.format('h:mm A'), end: endTime.format('h:mm A') });
			start.add(interval, 'minutes');
		}
		return slots;
	}, []);

	const rowHeight = useMemo(() => `calc((100vh - 10rem) / ${timeSlots.length})`, [timeSlots]);

	const getRoutineForTimeSlot = useCallback((day: string, time: string) => 
	{
		return routines.find(routine => 
		{
			const routineDay = routine.day;
			const routineStartTime = moment(routine.start_time, 'HH:mm:ss');
			const routineEndTime = moment(routine.end_time, 'HH:mm:ss');
			const currentTime = moment(time, 'h:mm A');
			return routineDay === day && currentTime >= routineStartTime && currentTime < routineEndTime;
		});
	}, [routines]);

	const getRowSpan = useCallback((routine: Routine) => 
	{
		const startTime = moment(routine.start_time, 'HH:mm:ss');
		const endTime = moment(routine.end_time, 'HH:mm:ss');
		const diff = endTime.diff(startTime, 'minutes');
		return diff / 50; // 50 is the interval
	}, []);

	const downloadAsCSV = useCallback(() => 
	{
		const csvContent = 
			"ID,Day,Start Time,End Time,Name,Category,Group\n"
		+ routines.map(routine =>
					   `${routine.id},${routine.day},${routine.start_time},${routine.end_time},${routine.name},${routine.category},${routine.grp}`
					  ).join("\n");

					  const blob = new Blob([decodeURIComponent(encodeURI(csvContent))], { type: "text/csv;charset=utf-8;" });
					  saveAs(blob, "routines.csv");
	}, [routines]);

	const downloadAsPDF = useCallback(() => 
	{
		const pdf = new jsPDF();
		pdf.setFontSize(18);
		pdf.text(`Routine for ${activeSemester}th Semester`, 14, 22);

		const columns = ["Day", "Start Time", "End Time", "Name", "Category", "Group"];

		const rows = routines.map(routine => [
			routine.day,
			moment(routine.start_time, 'HH:mm:ss').format('h:mm A'),
			moment(routine.end_time, 'HH:mm:ss').format('h:mm A'),
			routine.name,
			routine.category,
			routine.grp
		]);

		autoTable(pdf, 
		{
			head: [columns],
			body: rows,
			startY: 30,
			theme: 'striped',
		});

		pdf.save('routine.pdf');
	}, [routines, activeSemester]);

	const renderedRoutines = new Set();

	if(routines.length === 0) 
	{
		return <LoadingRoutinePage/>
	}

	return (
		<div className="h-full flex flex-col text-white overflow-hidden w-full">

		<div className="relative">
		<div className="flex justify-center items-center px-4 py-2">
		<h1 className="text-3xl font-black">Routine for Semester {activeSemester}</h1>

		<div className="absolute top-0 right-0 mt-3">
		<button
		onClick={() => setIsDownloadToggled(!isDownloadToggled)}
		className="text-white mr-2 px-4 py-2 rounded flex text-center border-2 border-violet-900 hover:bg-indigo-900">
		Download <ChevronDownIcon className="w-5 h-5 ml-2" />
		</button>
		</div>

		{isDownloadToggled && (
			<div className="absolute top-full right-0 mt-1 w-48 rounded z-10 ">
			{/* i think this might be the most amount of class I've written for a single div */}
			<button onClick={downloadAsCSV} className="rounded block w-full text-center text-white px-4 py-2 bg-indigo-800 hover:border-2 hover:border-indigo-500">
			Download as CSV
			</button>
			<button onClick={downloadAsPDF} className="rounded block w-full text-center text-white bg-indigo-800 px-4 py-2 hover:border-2 hover:border-indigo-500">
			Download as PDF
			</button>
			</div>
		)}
		</div>
		</div>

		<div className="flex-grow p-2 overflow-x-auto">
		<Table className="w-full table-fixed border-collapse border border-white">
		<TableHeader>
		<TableRow className="border border-white">
		<TableCell className="w-1/8 text-center border border-white">Time</TableCell>
		{daysOfWeek.map((day, index) => (
			<TableCell key={index} className="w-1/8 text-center border border-white whitespace-nowrap">{day}</TableCell>
		))}
		</TableRow>
		</TableHeader>
		<TableBody>
		{timeSlots.map((slot, rowIndex) => (
			<TableRow key={rowIndex} style={{ height: rowHeight }}>
			<TableCell className="text-center border border-white">
			{slot.start} - {slot.end}
			</TableCell>
			{daysOfWeek.map((day, colIndex) => 
			{
				const routine = getRoutineForTimeSlot(day, slot.start);
				if (routine) 
				{
					const routineId = `${routine.id}`
					if (!renderedRoutines.has(routineId)) 
					{
						renderedRoutines.add(routineId);
						const rowSpan = getRowSpan(routine);
						const routineClass = routine.category === 'Lab' ? 'bg-red-500' : 'bg-green-500';
						return (
							<TableCell
							key={colIndex}
							rowSpan={rowSpan}
							className={`text-center border border-white ${routineClass}`}
							>
							{routine.name} - {routine.category} - {routine.grp}
							</TableCell>
						);
					}
					return null;
				} else 
				{
					return (<TableCell key={colIndex} className="text-center border border-white"></TableCell>);
				}
			})}
			</TableRow>
		))}
		</TableBody>
		</Table>
		</div>
		</div>

	);
};

export default React.memo(RoutinePage);
