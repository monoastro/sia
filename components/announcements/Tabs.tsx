import { getUserInfo } from '@/lib/utils';
import React from 'react';

type AnnouncementType = 'General' | 'Class' | 'Assignment' | 'Assessment';

interface TabsProps {
  tabs: AnnouncementType[];
  activeTab: AnnouncementType;
  setActiveTab: (tab: AnnouncementType) => void;
  setShowAddForm: (show: boolean) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, setActiveTab, setShowAddForm }) => {
  const isAdmin = getUserInfo().is_admin;
  return (
    <div className="flex mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`px-4 py-2 mr-2 font-semibold ${
            activeTab === tab
              ? 'text-blue-400 border-b-2 border-blue-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {tab} Announcements
        </button>
      ))}
      {isAdmin && <button
        onClick={() => setShowAddForm(true)}
        className="ml-4 text-3xl text-green-500 font-bold hover:text-green-600 focus:outline-none"
        aria-label="Add Announcement"
      >
        +
      </button>}
    </div>
  );
};

export default Tabs;
