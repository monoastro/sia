import React from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';

const Skeleton = ({ className = '' }) => ( <div className={`bg-indigo-900 rounded animate-pulse ${className}`}></div>);

//make that loading skeleton twoparted
const LoadingGeneralChatsPage = () => {
  return (
    <div className="flex flex-col h-screen">

      <div className="px-3 py-4 flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2 w-2/3">
          <Skeleton className="w-32 h-10" />
          <ChevronDownIcon className="w-5 h-5 text-white" />
          <Skeleton className="w-full h-10" />
        </div>

      </div>

      <div className="flex-grow space-y-4 overflow-hidden">
        {[...Array(7)].map((_, index) => (
          <div key={index} className="flex items-start space-x-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2 flex-grow">
              <Skeleton className="w-1/4 h-5" />
              <Skeleton className="w-3/4 h-4" />
              <Skeleton className="w-1/2 h-4" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Skeleton className="w-full h-12" />
      </div>
    </div>
  );
};

export default LoadingGeneralChatsPage;
