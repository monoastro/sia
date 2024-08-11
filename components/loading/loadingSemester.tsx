import React from 'react';

const Skeleton = ({ className = '' }) => (
	<div className={`bg-indigo-900 rounded animate-pulse ${className}`}></div>
);

const LoadingSemesterPage = () => 
{
	return (
		<div className="h-screen p-6">

		<div className="flex justify-between mb-8">
		<div className="flex space-x-6">
		<Skeleton className="w-40 h-11" />
		<Skeleton className="w-56 h-11" />
		<Skeleton className="w-12 h-11" />
		</div>
		<div className="flex space-x-4">
		{[...Array(4)].map((_, i) => (
			<Skeleton key={i} className="w-14 h-13" />
		))}
		</div>
		</div>

		<div className="space-y-6 mb-12">
		<Skeleton className="w-3/4 h-10" />
		<Skeleton className="w-full h-6" />
		<Skeleton className="w-full h-6" />
		<Skeleton className="w-5/6 h-6" />
		</div>

		<div className="space-y-10">
		{[...Array(6)].map((_, index) => (
			<div key={index} className="space-y-4">
			<Skeleton className="w-full h-6" />
			<Skeleton className="w-full h-6" />
			<Skeleton className="w-5/6 h-6" />
			<Skeleton className="w-3/4 h-6" />
			</div>
		))}
		</div>

		</div>
	);
};

export default LoadingSemesterPage;
