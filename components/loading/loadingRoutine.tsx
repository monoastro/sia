import React from 'react';

const Skeleton = ({ className = '' }) => ( <div className={`bg-indigo-900 rounded animate-pulse ${className}`}></div>);

const LoadingRoutinePage = () => 
{
	return (
		<div className="h-full flex flex-col text-white overflow-hidden w-full p-4">

		<div className="flex justify-between mb-6">

		<div className="w-32"/>
		<Skeleton className="w-64 h-10" />
		<Skeleton className="w-32 h-10" />
		</div>
		<div className="justify-between flex mb-2">
		{[...Array(7)].map((_, index) => ( <Skeleton key={index} className="w-40 h-12" />))}
		</div>

		<div className="justify-between flex">
		<div>
		{[...Array(6)].map((_, index) => <Skeleton key={index} className="w-40 h-24 mb-2" />)}
		</div>

		<div>
		<Skeleton className="w-40 h-48 mb-2" />
		<Skeleton className="w-40 h-24 mb-2" />
		<Skeleton className="w-40 h-48 mb-2" />
		<Skeleton className="w-40 h-24 mb-2" />
		</div>

		<div>
		<Skeleton className="w-40 h-24 mb-2" />
		<Skeleton className="w-40 h-48 mb-2" />
		<Skeleton className="w-40 h-32 mb-2" />
		<Skeleton className="w-40 h-24 mb-2" />
		</div>

		<div>
		<Skeleton className="w-40 h-28 mb-2" />
		<Skeleton className="w-40 h-24 mb-2" />
		<Skeleton className="w-40 h-48 mb-2" />
		<Skeleton className="w-40 h-48 mb-2" />
		</div>

		<div>
		<Skeleton className="w-40 h-32 mb-2" />
		<Skeleton className="w-40 h-36 mb-2" />
		<Skeleton className="w-40 h-32 mb-2" />
		<Skeleton className="w-40 h-32 mb-2" />
		</div>

		<div>
		<Skeleton className="w-40 h-40 mb-2" />
		<Skeleton className="w-40 h-24 mb-2" />
		<Skeleton className="w-40 h-36 mb-2" />
		<Skeleton className="w-40 h-40 mb-2" />
		</div>

		<div>
		<Skeleton className="w-40 h-24 mb-2" />
		<Skeleton className="w-40 h-48 mb-2" />
		<Skeleton className="w-40 h-48 mb-2" />
		<Skeleton className="w-40 h-24 mb-2" />
		</div>
		</div>


		</div>
	);
};

export default React.memo(LoadingRoutinePage);
