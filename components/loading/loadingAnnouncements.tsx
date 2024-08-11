import React from 'react';

const Skeleton = ({ className = '' }) => ( <div className={`bg-indigo-900 rounded animate-pulse ${className}`}></div>);

const LoadingAnnouncementsPage = () => 
{
	return (
		<div className="h-screen flex flex-col">
		<Skeleton className="w-64 h-10 mb-6" />

		<div className="flex space-x-4 mb-6">
		{[...Array(4)].map((_, i) => (
			<Skeleton key={i} className="w-28 h-10" />
		))}
		</div>

		<div className="space-y-6">
		{[...Array(5)].map((_, index) => (
			<div key={index} className="space-y-2">
			<Skeleton className="w-full h-12" />
			<Skeleton className="w-5/6 h-6" />
			<Skeleton className="w-3/4 h-6" />
			<div className="flex justify-between items-center">
			<Skeleton className="w-40 h-6" />
			<div className="flex space-x-2">
			<Skeleton className="w-8 h-8" />
			<Skeleton className="w-8 h-8" />
			</div>
			</div>
			</div>
		))}
		</div>
		</div>
	);
};

export default LoadingAnnouncementsPage;
