import { useEffect, useState } from 'react';
import { Settings, Activity, Code, Layers, Users, ArrowLeft, Edit, AlignCenter, ClipboardList  } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../shared/Tabs';
import { applicationData } from './mockData';
import OverviewTab from './tabs/OverviewTab';
import APITab from './tabs/APITab';
import AnalyticsTab from './tabs/AnalyticsTab';
import ProjectList from '../project/ProjectList';
import Project from '../project/Project2'; // <- your project detail component
import MemberList from '../users/MemberList';
import UserDetail from '../users/UserDetail';
import { getApplicationById } from '../../services/applicationService';
import { ApplicationItem } from '../../types';
import ActionDropdown from '../shared/ActionDropdown';
import AddApplicationForm from './AddApplicationForm';
import ApplicationDetail from './ApplicationDetail';
import { emitter } from '../../utils/eventEmitter';
import LogsTab from './tabs/LogsTab';

interface ApplicationDetailProps {
  appId: number;
  onBack: () => void;
}

export default function Application({ appId, onBack }: ApplicationDetailProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [app, setApplication] = useState<ApplicationItem>();
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const app = await getApplicationById(appId)
        if (app) {
          setApplication(app);
          // console.log("Application Detail", app)
        } else {
          console.warn("Invalid response structure:", app);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }


    fetchData();

    emitter.on('refreshApplicationDetail', () => {
      fetchData();
    });
  }, []);

  const [view, setView] = useState<{
    type: 'tab' | 'project' | 'api' | 'analytics' | 'user';
    id?: number;
  }>({ type: 'tab' });

  const handleBack = () => setView({ type: 'tab' });

  const handleEditClick = () => setIsFormOpen(true);


  return (
    <div className="max-w-full bg-gray-50 min-h-screen">
      {/* Dynamic View Rendering */}
      {view.type === 'tab' ? (
        <div>
          <div className="flex justify-between items-center mb-3">
            <div className='flex flex-row justify-start'>
              <div
                className={`p-1.5 mr-1 bg-gray-100 flex hover:bg-gray-200 rounded items-center justify-between cursor-pointer}`}
                onClick={onBack}
              >
                <ArrowLeft className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-intelQEDarkBlue ml-3">{app?.name}</h1>
              </div>
            </div>
            <div className="flex space-x-2">
              <ActionDropdown
                actions={[
                  { icon: <Edit className="size-4" />, text: 'Edit', onClick: handleEditClick },
                  { icon: <Settings className="size-4" />, text: 'Settings', onClick: handleEditClick },
                ]}
              />
            </div>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="mb-2">
              <TabsList>
                <TabsTrigger value="overview" className="data-[state=active]:bg-blue-100">
                  <Activity size={16} className="mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="projects" className="data-[state=active]:bg-blue-100">
                  <Layers size={16} className="mr-2" />
                  Projects
                </TabsTrigger>
                <TabsTrigger value="apis" className="data-[state=active]:bg-blue-100">
                  <Code size={16} className="mr-2" />
                  APIs
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-100">
                  <Activity size={16} className="mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="logs" className="data-[state=active]:bg-blue-100">
                  <ClipboardList size={16} className="mr-2" />
                  Logs
                </TabsTrigger>
                <TabsTrigger value="users" className="data-[state=active]:bg-blue-100">
                  <Users size={16} className="mr-2" />
                  Members
                </TabsTrigger>
                <TabsTrigger value="details" className="data-[state=active]:bg-blue-100">
                  <AlignCenter size={16} className="mr-2" />
                  Details
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview">
              <OverviewTab data={applicationData} />
            </TabsContent>

            <TabsContent value="projects">
              <ProjectList onProjectView={(id) => setView({ type: 'project', id })} applicationId={appId} />
            </TabsContent>

            <TabsContent value="apis">
              <APITab apis={applicationData.apis} />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsTab data={applicationData} />
            </TabsContent>
            <TabsContent value="logs">
              <LogsTab />
            </TabsContent>
            <TabsContent value="users">
              <MemberList onUserView={(id) => setView({ type: 'user', id })} projId={-1} appId={appId} isApp={true} />
            </TabsContent>

            <TabsContent value="details">
              <ApplicationDetail app={app} />
            </TabsContent>
          </Tabs>
        </div>
      ) : view.type === 'project' && view.id !== undefined ? (
        <Project projectId={view.id} onBack={handleBack} />
      ) : view.type === 'user' && view.id !== undefined ? (
        <UserDetail userId={view.id} onBack={handleBack} />
      ) : view.type === 'api' && view.id !== undefined ? (
        <div> {/* Replace with <APIDetail /> when you have it */}
          <button onClick={handleBack} className="mb-4 text-blue-600 underline">← Back</button>
          <p>Showing API detail for ID: {view.id}</p>
        </div>
      ) : view.type === 'analytics' ? (
        <div>
          <button onClick={handleBack} className="mb-4 text-blue-600 underline">← Back</button>
          <p>Custom analytics detail view here</p>
        </div>
      ) : null}

      {app && <AddApplicationForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} app={app} />}
    </div>
  );
}
