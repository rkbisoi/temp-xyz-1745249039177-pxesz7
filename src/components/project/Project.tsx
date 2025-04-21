import { useEffect, useState } from 'react';
import ProjectSidebar from './ProjectSidebar';
import {
  Database,
  // SlidersHorizontal,
  BookOpen,
  Boxes,
  AlignCenter,
  ClipboardList,
  Link,
  Menu,
  Zap,
  Edit,
  Trash,
  CalendarClock,
  Users,
  ArrowLeft,
  Share2,
  History
} from 'lucide-react';


import LinkEntitiesForm from '../shared/LinkEntitiesForm';
import { knowledgeItems } from '../../mockData/knowledgeData';
import ActionDropdown from '../shared/ActionDropdown';
import KnowledgeList from '../knowledge/KnowledgeList';
import ApplicationList from '../application/ApplicationList';
import DataList from '../data/DataList';
import SchedulerList from '../scheduler/SchedulerList';
// import KnowledgeDetail from '../knowledge/KnowledgeDetailOld';
import { Item, ProjectItem } from '../../types';
import ItemOverviewPopup from '../shared/ItemOverviewPopup';
import { applications } from '../../mockData/appData';
import UserDetail from '../users/UserDetail';
import { API_URL } from '../../data';
import AddProjectForm from './AddProjectForm';
import MemberList from '../users/MemberList';
import WorkflowDetail from '../workflow/WorkflowDetail';
import WorkflowList from '../workflow/WorkflowList';
import TestSuiteList from '../test/testsuite/TestSuiteList2';
import ExecutionLogList from '../test/executionLog/ExecutionLog';
// import TestInterface from '../test/testInterface/TestInterface';
import KnowledgeDetail from '../knowledge/KnowledgeDetail';
import TestInterface2 from '../test/testInterface/TestInterface2';
import ProjectDetail from './ProjectDetail';

type ProjectState = {
  workflowId: any;
  activeOption: string;
  isCollapsed: boolean;
  isLinkFormOpen: boolean;
  knowledgeId: number | null;
  userId: number | null;
};

interface ProjectProps {
  projectId: number;
  onBack: () => void;
}

const Project: React.FC<ProjectProps> = ({ projectId, onBack }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [project, setProject] = useState<ProjectItem>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {

        // const userId = getUserId();
        // if (!userId) {
        //   console.warn("User ID is missing");
        //   return;
        // }

        const response = await fetch(`${API_URL}/getProjectById/${projectId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        // console.log("Project Response:", data.data);

        if (data?.data) {
          const convertedProject: ProjectItem = {
            id: data.data.projID,
            name: data.data.projName,
            description: data.data.projDesc,
            type: data.data.projType,
            lastUpdated: data.data.projCrtDt,
            createDate: data.data.projCrtDt,
            progress: data.data.progress ?? 0,
            members: data.data.members ?? 0,
            update_seq_no: data.data.updateSeqNo,
            createdBy: data.data.createdBy,
            instruction: data.data.instruction,
            createdByUser: data.data.createdByUser.userName,
            updatedByUser: data.data.updatedByUser.userName,
          };

          setProject(convertedProject);
        } else {
          console.warn("Invalid response structure:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const [state, setState] = useState<ProjectState>(() => {
    const savedState = sessionStorage.getItem('projectState');
    if (savedState) {
      return JSON.parse(savedState);
    }
    return {
      activeOption: 'Action',
      isCollapsed: false,
      isLinkFormOpen: false,
      knowledgeId: null,
      userId: null
    };
  });

  useEffect(() => {
    sessionStorage.setItem('projectState', JSON.stringify(state));
  }, [state]);

  const options = [
    'Action',
    'Logs',
    'Test Suites',
    'Workflow',
    'Knowledge',
    'Application',
    'Data',
    'Schedules',
    'Users',
    'Details',
    // 'Configuration'
  ];
  const icons = [
    <Zap />,
    <History />,
    <ClipboardList />,
    <Share2 />,
    <BookOpen />,
    <Boxes />,
    <Database />,
    <CalendarClock />,
    <Users />,
    <AlignCenter />,
    // <SlidersHorizontal />,
  ];

  const handleOptionClick = (option: string) => setState(prev => ({ ...prev, activeOption: option }));
  const toggleSidebar = () => setState(prev => ({ ...prev, isCollapsed: !prev.isCollapsed }));
  const handleLinkClick = () => setState(prev => ({ ...prev, isLinkFormOpen: true }));
  const handleEditClick = () => setIsFormOpen(true);
  const closeLinkForm = () => setState(prev => ({ ...prev, isLinkFormOpen: false }));

  const handleKnowledgeView = (id: number) => {
    setState(prev => ({ ...prev, knowledgeId: id }));
  };

  const handleApplicationView = (id: number) => {
    const item = applications.find(item => item.id === id);
    if (item) {
      setSelectedItem(item);
      setIsPopupOpen(true);
    }
  };

  const handleDataView = (id: number) => {
    setState(prev => ({ ...prev, dataId: id }));
  };

  const handleUserView = (id: number) => {
    setState(prev => ({ ...prev, userId: id }));
  };

  const handleWorkflowView = (id: number) => {
    setSelectedWorkflowId(id);
  };

  const renderComponent = () => {
    switch (state.activeOption) {
      case 'Action':
        // return <TestingInterface projectId={projectId} />;
        // return <TestInterface projectId={projectId} project={project} />
        return <TestInterface2 projectId={projectId} project={project} />
      case 'Logs':
        return <ExecutionLogList projectId={projectId} executionId={-1} />;
      case 'Test Suites':
        return <TestSuiteList projId={projectId} />;
      case 'Ntelg':
        return <WorkflowList onWorkflowView={handleWorkflowView} projectId={projectId} />;
      case 'Knowledge':
        return state.knowledgeId ? (
          <KnowledgeDetail
            onBack={() => setState(prev => ({ ...prev, knowledgeId: null }))}
            knowledgeId={state.knowledgeId}
          />
        ) : (
          <KnowledgeList
            onKnowledgeView={handleKnowledgeView}
            defaultView="list"
            projId={projectId}
          />
        );
      case 'Application':
        return (
          <ApplicationList
            onApplicationView={handleApplicationView}
            defaultView="list"
          />
        );
      case 'Data':
        return (
          <DataList
            onDataView={handleDataView}
            defaultView="list"
            projId={projectId}
          />
        );
      case 'Schedules':
        return <SchedulerList projId={projectId} />;
      case 'Details':
          return <ProjectDetail project={project} />;
      case 'Users':
        return state.userId ? (
          <UserDetail
            onBack={() => setState(prev => ({ ...prev, userId: null }))}
            userId={state.userId}
          />
        ) : (
          <MemberList
              onUserView={handleUserView}
              defaultView="list"
              projId={projectId} 
              appId={-1} 
              isApp={false}          
            />
        );
      default:
        return (
          <div className="flex-1 ml-2 p-2 bg-gray-100 rounded-md">
            <h1 className="text-2xl font-bold">{state.activeOption}</h1>
            <p className="mt-4">
              This is the content for the <strong>{state.activeOption}</strong> section.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col mt-4 px-4">
      <div className="flex justify-between mb-2">
        <div className="flex flex-row justify-start">
          <div
            className={`p-2 mr-1 bg-gray-100 flex hover:bg-gray-200 rounded items-center justify-between cursor-pointer}`}
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </div>
          <div
            className={`p-2 bg-gray-100 flex hover:bg-gray-200 rounded mr-2 items-center justify-between cursor-pointer}`}
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </div>
          <h1 className="text-lg font-bold text-intelQEDarkBlue mt-1 ml-1">{project?.name}</h1>
        </div>

        <ActionDropdown
          actions={[
            { icon: <Edit className="size-4" />, text: 'Edit', onClick: handleEditClick },
            { icon: <Link className="size-4" />, text: 'Link', onClick: handleLinkClick },
            { icon: <Trash className="size-4" />, text: 'Delete', onClick: handleLinkClick },
          ]}
        />
      </div>

      <div className="flex flex-row">
        <ProjectSidebar
          options={options}
          icons={icons}
          onOptionClick={handleOptionClick}
          activeOption={state.activeOption}
          isCollapsed={state.isCollapsed}
        // toggleSidebar={toggleSidebar}
        />

        <div className="flex-1 ml-2">
          <div className="flex-1 overflow-y-auto h-[calc(100vh-100px)] px-2">
            {renderComponent()}
          </div>
        </div>
      </div>

      {project && (<AddProjectForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        project={project}
      />)}

      <WorkflowDetail
        workflowId={selectedWorkflowId || 0}
        isOpen={selectedWorkflowId !== null}
        onClose={() => setSelectedWorkflowId(null)}
      />

      <LinkEntitiesForm
        isOpen={state.isLinkFormOpen}
        onClose={closeLinkForm}
        sourceType="project"
        sourceIds={[]}
        targetType="knowledge"
        availableItems={knowledgeItems}
        linkedItems={knowledgeItems.slice(2, 4)}
        title="Link Knowledge"
        onLink={selectedIds => {
          console.log('Linking items with IDs:', selectedIds);
        }}
      />

      {isPopupOpen && selectedItem && (
        <ItemOverviewPopup item={selectedItem} onClose={() => setIsPopupOpen(false)} />
      )}
    </div>
  );
};

export default Project;