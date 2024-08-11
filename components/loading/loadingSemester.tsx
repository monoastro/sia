import React from 'react';

const Skeleton = ({ className = '' }) => (
	<div className={`bg-indigo-900 rounded animate-pulse ${className}`}></div>
);

const LoadingSemesterPage = () => 
{
	return (
		<div className="h-screen flex flex-col">

		<div className="flex px-3 py-4 justify-between">
		<div className="flex space-x-4">
		<Skeleton className="w-36 h-11" />
		<Skeleton className="w-52 h-11" />
		<Skeleton className="w-14 h-11" />
		</div>
		<div className="flex space-x-2">
		{[...Array(4)].map((_, i) => ( <Skeleton key={i} className="p-2 w-10 h-10" />))}
		</div>
		</div>

		<div className="ml-3">
		<Skeleton className="w-1/4 h-10 mb-4" />
		<Skeleton className="w-3/4 h-3 mb-3" />
		</div>


		<div className="flex">
        <Skeleton className="w-10 h-10 rounded-full ml-3" />
        <Skeleton className="w-10 h-5 ml-3" />

		</div>
		</div>
	);
};

export default LoadingSemesterPage;
