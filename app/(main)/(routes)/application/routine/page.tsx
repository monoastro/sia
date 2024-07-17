'use client'
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const RoutinePage: React.FC = () => {
  const startOfWeek = moment().startOf('week');
  const daysOfWeek = Array.from({ length: 7 }).map((_, index) =>
    startOfWeek.clone().add(index, 'days').format('dddd')
  );
  const [routines, setRoutines] = useState([]);

  const fetchRoutines = async () => {
	  try {
		  const response = await fetch('https://electrocord.onrender.com/api/v1/routines/');
		  const data = await response.json();
		  if (data.statusCode === 201) {
			  setRoutines(data.data);
		  } else {
			  console.error('Failed to fetch routines:', data.message);
		  }
	  } catch (error) {
		  console.error('Error fetching routines:', error);
	  }
  };
  useEffect(() => {

    fetchRoutines();
  }, []);

  const handleDownload = () => {
    // Implement download routine
    console.log("Downloading routine...");
  }

  const interval = 50; // Interval in minutes

  // Generate intervals for a day (10:15 AM to 4:55 PM)
  const generateTimeSlots = () => {
    const slots = [];
    const start = moment('10:15 AM', 'h:mm A');
    const end = moment('4:05 PM', 'h:mm A');

    while (start <= end) {
      const endTime = start.clone().add(interval, 'minutes');
      slots.push({ start: start.format('h:mm A'), end: endTime.format('h:mm A') });
      start.add(interval, 'minutes');
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Set row height based on the interval
  const rowHeight = `calc((100vh - 10rem) / ${timeSlots.length})`;

  // Helper to find routines for a specific day and time
  const getRoutineForTimeSlot = (day: string, time: string) => {
    return routines.find(routine => {
      const routineDay = routine.day;
      const routineStartTime = moment(routine.start_time, 'HH:mm:ss');
      const routineEndTime = moment(routine.end_time, 'HH:mm:ss');
      const currentTime = moment(time, 'h:mm A');
      return routineDay === day && currentTime >= routineStartTime && currentTime < routineEndTime;
    });
  };

  const getRowSpan = (routine) => {
    const startTime = moment(routine.start_time, 'HH:mm:ss');
    const endTime = moment(routine.end_time, 'HH:mm:ss');
    const diff = endTime.diff(startTime, 'minutes');
    return diff / interval;
  }
  const renderedRoutines = new Set();

  return (
    <div className="h-screen flex flex-col bg-blue-900 text-white overflow-hidden">
      <div className="flex justify-center items-center p-4">
        <button
          onClick={() => handleDownload()}
          className="bg-blue-800 text-white px-4 py-2 rounded"
          style={{ position: 'absolute', top: '1rem', right: '1rem' }}
        >
          Download
        </button>
        <h1 className="text-2xl font-bold">ROUTINE FOR 5th SEMESTER</h1>
      </div>
      <div className="flex-grow p-4 overflow-x-auto">
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
                {daysOfWeek.map((day, colIndex) => {
                  const routine = getRoutineForTimeSlot(day, slot.start);
                  if (routine) {
                    const routineId = `${routine.id}`
                      if (!renderedRoutines.has(routineId)) {
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
                }
                else {
                  return ( <TableCell key={colIndex} className="text-center border border-white"></TableCell>
                  );
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

export default RoutinePage;
