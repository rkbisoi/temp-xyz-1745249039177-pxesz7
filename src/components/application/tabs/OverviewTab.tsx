import React from 'react';
import SummaryCard from '../overview/SummaryCard';
import TestStatusCard from '../overview/TestStatusCard';
import AIInsightsCard from '../overview/AIInsightsCard';
import RecentActivityCard from '../overview/RecentActivityCard';
import ProjectsPreview from '../overview/ProjectsPreview';
import DeploymentsCard from '../overview/DeploymentsCard';
import { ApplicationData } from '../interface';
import { Activity, AlertTriangle, BarChart } from 'lucide-react';

interface OverviewTabProps {
  data: ApplicationData;
}

const QuickStatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendDirection,
  positive = trendDirection === 'up'
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendDirection: 'up' | 'down';
  positive?: boolean;
}) => {
  const trendColor = (positive && trendDirection === 'up') || (!positive && trendDirection === 'down') 
    ? 'text-green-500' 
    : 'text-red-500';

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="rounded-full p-2 h-10 bg-gray-100">
          {icon}
        </div>
      </div>
      <div className={`flex items-center mt-2 ${trendColor}`}>
        <span>{trend}</span>
        <svg 
          className="w-4 h-4 ml-1" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          {trendDirection === 'up' ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          )}
        </svg>
        <span className="text-xs ml-1">from last week</span>
      </div>
    </div>
  );
};

export default function OverviewTab({ data }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <QuickStatCard 
          title="Test Pass Rate" 
          value={`${Math.round((data.testStats.passed / data.testStats.total) * 100)}%`} 
          icon={<Activity className="h-6 w-6 text-green-500" />}
          trend="+2.5%"
          trendDirection="up"
        />
        <QuickStatCard 
          title="API Coverage" 
          value={`${data.coverageData[0].value}%`} 
          icon={<BarChart className="h-6 w-6 text-blue-500" />}
          trend="+1.2%"
          trendDirection="up"
        />
        <QuickStatCard 
          title="Failed Tests" 
          value={data.testStats.failed.toString()} 
          icon={<AlertTriangle className="h-6 w-6 text-red-500" />}
          trend="-5"
          trendDirection="down"
          positive
        />
        <QuickStatCard 
          title="Total Projects" 
          value={data.totalProjects.toString()} 
          icon={<Activity className="h-6 w-6 text-purple-500" />}
          trend="+2"
          trendDirection="up"
        />
      </div>

      {/* Main Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard data={data} />
        <TestStatusCard testStats={data.testStats} />
        <AIInsightsCard insights={data.aiInsights} />
      </div>

      {/* Activity & Deployments Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <RecentActivityCard activities={data.recentActivity} />
        </div>
        <div>
          <DeploymentsCard deployments={data.deployments || []} />
        </div>
      </div>

      {/* Projects Preview */}
      {/* <ProjectsPreview projects={data.projects} /> */}
    </div>
  );
}