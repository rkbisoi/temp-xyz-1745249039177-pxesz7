import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
// import Dashboard from './Dashboard';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ProjectList from './project/ProjectList';
import ApplicationList from './application/ApplicationList';
import KnowledgeList from './knowledge/KnowledgeList';
// import KnowledgeDetail from './knowledge/KnowledgeDetailOld';
import Project from './project/Project2';
import LoginPage from './auth/LoginPage';
import DataList from './data/DataList';
import UserDetail from './users/UserDetail';
import SchedulerList from './scheduler/SchedulerList';
import UserInviteList from './users/UserInviteList';
import DataDetail from './data/DataDetail';
import WorkflowList from './workflow/WorkflowList';
import WorkflowDetail from './workflow/WorkflowDetail';
import KnowledgeDetail from './knowledge/KnowledgeDetail';
import Application from './application/Application';

type AppState = {
  view: string;
  projectId?: number | null;
  knowledgeId?: number | null;
  applicationId?: number | null;
  dataId?: number | null;
  userId?: number | null;
  workflowId?: number | null;
};

export default function AppContent() {
  const { user, loading } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  const [state, setState] = useState<AppState>(() => {
    const savedState = sessionStorage.getItem('appState');
    if (savedState) {
      return JSON.parse(savedState);
    }
    return {
      view: 'dashboard',
      projectId: null,
      knowledgeId: null,
      applicationId: null,
      dataId: null,
      userId: null,
      workflowId: null
    };
  });

  useEffect(() => {
    sessionStorage.setItem('appState', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!user) {
    return <LoginPage />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-intelQEDarkBlue"></div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center my-12">
          <h1 className="mt-2 mb-2 text-center text-3xl font-extrabold text-intelQEDarkBlue">
            intelQE
          </h1>
          <p className="text-sm text-gray-600 text-center mx-8">Please open this app on a desktop or larger screen for a better experience.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onMenuClick={handleMenuClick} activeView={state.view} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ml-[100px]`}>
        <Navbar />
        <main className="flex-1 overflow-auto pt-[70px] bg-gray-50 p-4 ">
          {/* {state.view === 'dashboard' && <ApplicationDetail />} */}
          {state.view === 'projects' && !state.projectId && <ProjectList onProjectView={handleProjectView} applicationId={-1} />}
          {state.view === 'knowledge' && !state.knowledgeId && (
            <KnowledgeList onKnowledgeView={handleKnowledgeView} projId={-1} />
          )}
          {state.view === 'knowledge' && state.knowledgeId && (
            <KnowledgeDetail onBack={() => setState(prev => ({ ...prev, knowledgeId: null }))} knowledgeId={state.knowledgeId} />
          )}
          {state.view === 'applications' && !state.applicationId && <ApplicationList onApplicationView={handleApplicationView} />}
          {state.view === 'applications' && state.applicationId && (
            <Application appId={state.applicationId} onBack={() => setState(prev => ({ ...prev, applicationId: null }))} />
          )}
          {state.view === 'data' && !state.dataId && <DataList onDataView={handleDataView} projId={-1} />}
          {state.view === 'data' && state.dataId && (
            <DataDetail onBack={() => setState(prev => ({ ...prev, dataId: null }))} dataId={state.dataId} />
          )}
          {state.view === 'projects' && state.projectId && <Project onBack={() => setState(prev => ({ ...prev, projectId: null }))} projectId={state.projectId} />}
          {state.view === 'users' && !state.userId && <UserInviteList onUserView={handleUserView} />}
          {state.view === 'users' && state.userId && (
            <UserDetail onBack={() => setState(prev => ({ ...prev, userId: null }))} userId={state.userId} />
          )}
          {state.view === 'scheduler' && <SchedulerList projId={-1} />}
          {state.view === 'workflows' && !state.workflowId && (
            <WorkflowList onWorkflowView={handleWorkflowView} />
          )}
          {state.view === 'workflows' && state.workflowId && (
            <WorkflowDetail
              workflowId={state.workflowId} isOpen={false} onClose={function (): void {
                throw new Error('Function not implemented.');
              }}
            />
          )}
        </main>
      </div>
    </div>
  );

  function handleMenuClick(view: string) {
    setState({
      view,
      projectId: null,
      knowledgeId: null,
      applicationId: null,
      dataId: null,
      userId: null,
      workflowId: null
    });
  }

  function handleProjectView(projectId: number) {
    setState(prev => ({ ...prev, projectId, view: 'projects' }));
  }

  function handleKnowledgeView(knowledgeId: number) {
    setState(prev => ({ ...prev, knowledgeId, view: 'knowledge' }));
  }

  function handleApplicationView(applicationId: number) {
    setState(prev => ({ ...prev, applicationId, view: 'applications' }));
  }

  function handleDataView(dataId: number) {
    setState(prev => ({ ...prev, dataId, view: 'data' }));
  }

  function handleUserView(userId: number) {
    setState(prev => ({ ...prev, userId, view: 'users' }));
  }

  function handleWorkflowView(workflowId: number) {
    setState(prev => ({ ...prev, workflowId, view: 'workflows' }));
  }
}
