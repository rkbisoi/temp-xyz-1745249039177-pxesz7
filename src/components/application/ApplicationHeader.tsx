// src/components/application-detail/ApplicationHeader.tsx

import React from 'react';
import { Settings, Download, Share2, Bell } from 'lucide-react';

interface ApplicationHeaderProps {
  name: string;
  description: string;
  onSettingsClick: () => void;
}

const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({ 
  name, 
  description, 
  onSettingsClick 
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
          <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            Active
          </span>
        </div>
        <p className="text-gray-500 mt-1">{description}</p>
      </div>
      <div className="flex space-x-2">
        <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 flex items-center hover:bg-gray-50">
          <Download size={16} className="mr-1" />
          Export
        </button>
        <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 flex items-center hover:bg-gray-50">
          <Share2 size={16} className="mr-1" />
          Share
        </button>
        <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 flex items-center hover:bg-gray-50">
          <Bell size={16} className="mr-1" />
          Alerts
        </button>
        <button 
          onClick={onSettingsClick}
          className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 flex items-center hover:bg-gray-300"
        >
          <Settings size={16} className="mr-1" />
          Settings
        </button>
      </div>
    </div>
  );
};

export default ApplicationHeader;