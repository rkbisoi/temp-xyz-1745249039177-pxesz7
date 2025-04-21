import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../shared/Tabs';
import { Database, BookOpen, AlignCenter, ClipboardList, Link, Zap, Edit, Trash, CalendarClock, Users, ArrowLeft, History } from 'lucide-react';
import LinkEntitiesForm from '../shared/LinkEntitiesForm';
import { knowledgeItems } from '../../mockData/knowledgeData';
import ActionDropdown from '../shared/ActionDropdown';
import KnowledgeList from '../knowledge/KnowledgeList';
import DataList from '../data/DataList';
import SchedulerList from '../scheduler/SchedulerList';
import KnowledgeDetail from '../knowledge/KnowledgeDetail';
import TestInterface2 from '../test/testInterface/TestInterface2';
import ProjectDetail from './ProjectDetail';
import UserDetail from '../users/UserDetail';
import TestSuiteList from '../test/testsuite/TestSuiteList2';
import ExecutionLogList from '../test/executionLog/ExecutionLog';
import { API_URL } from '../../data';
import AddProjectForm from './AddProjectForm';
import MemberList from '../users/MemberList';
import ItemOverviewPopup from '../shared/ItemOverviewPopup';

type ProjectState = {
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
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [project, setProject] = useState<any>();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [state, setState] = useState<ProjectState>({
        activeOption: 'Action',
        isCollapsed: false,
        isLinkFormOpen: false,
        knowledgeId: null,
        userId: null,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/getProjectById/${projectId}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const data = await response.json();

                if (data?.data) {
                    const convertedProject = {
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
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const options = [
        'Action',
        'Logs',
        'Test Suites',
        'Knowledge',
        // 'Application',
        'Data',
        'Schedules',
        'Users',
        'Details',
    ];

    const icons = [
        <Zap className='size-4 mr-2' />,
        <History className='size-4 mr-2' />,
        <ClipboardList className='size-4 mr-2' />,
        <BookOpen className='size-4 mr-2' />,
        // <Boxes className='size-4 mr-1.5' />,
        <Database className='size-4 mr-2' />,
        <CalendarClock className='size-4 mr-2' />,
        <Users className='size-4 mr-2' />,
        <AlignCenter className='size-4 mr-2' />,
    ];

    const handleTabChange = (option: string) => setState(prev => ({ ...prev, activeOption: option }));

    const renderComponent = () => {
        switch (state.activeOption) {
            case 'Action':
                return <TestInterface2 projectId={projectId} project={project} />;
            case 'Logs':
                return <ExecutionLogList projectId={projectId} executionId={-1} />;
            case 'Test Suites':
                return <TestSuiteList projId={projectId} />;
            case 'Knowledge':
                return state.knowledgeId ? (
                    <KnowledgeDetail
                        onBack={() => setState(prev => ({ ...prev, knowledgeId: null }))}
                        knowledgeId={state.knowledgeId}
                    />
                ) : (
                    <KnowledgeList
                        onKnowledgeView={id => setState(prev => ({ ...prev, knowledgeId: id }))}
                        defaultView="list"
                        projId={projectId}
                    />
                );
            case 'Data':
                return (
                    <DataList
                        onDataView={id => setState(prev => ({ ...prev, dataId: id }))}
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
                        onUserView={id => setState(prev => ({ ...prev, userId: id }))}
                        projId={projectId} appId={-1} isApp={false} />
                );
            default:
                return (
                    <div className="flex-1 ml-2 p-2 bg-gray-100 rounded-md">
                        <h1 className="text-2xl font-bold">{state.activeOption}</h1>
                        <p className="mt-4">This is the content for the <strong>{state.activeOption}</strong> section.</p>
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col">
            <div className="flex justify-between mb-2">
                <div className="flex flex-row justify-start">
                    <div
                        className="p-2 mr-1 bg-gray-100 flex hover:bg-gray-200 rounded items-center justify-between cursor-pointer"
                        onClick={onBack}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </div>
                    <h1 className="text-lg font-bold text-intelQEDarkBlue mt-1 ml-1">{project?.name}</h1>
                </div>

                <ActionDropdown
                    actions={[
                        { icon: <Edit className='size-4' />, text: 'Edit', onClick: () => setIsFormOpen(true) },
                        { icon: <Link className='size-4' />, text: 'Link', onClick: () => setState(prev => ({ ...prev, isLinkFormOpen: true })) },
                        { icon: <Trash className='size-4' />, text: 'Delete', onClick: () => setState(prev => ({ ...prev, isLinkFormOpen: true })) },
                    ]}
                />
            </div>


            <Tabs value={state.activeOption} onValueChange={handleTabChange}>
                <div className='mb-2'>
                    <TabsList>
                        {options.map((option, idx) => (
                            <TabsTrigger key={option} value={option} className="data-[state=active]:bg-blue-100">
                                {icons[idx]} {option}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <div className="flex-1">
                    <TabsContent value={state.activeOption}>
                        {renderComponent()}
                    </TabsContent>
                </div>
            </Tabs>

            {project && <AddProjectForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} project={project} />}

            <LinkEntitiesForm
                isOpen={state.isLinkFormOpen}
                onClose={() => setState(prev => ({ ...prev, isLinkFormOpen: false }))}
                sourceType="project"
                sourceIds={[]}
                targetType="knowledge"
                availableItems={knowledgeItems}
                linkedItems={knowledgeItems.slice(2, 4)}
                title="Link Knowledge"
                onLink={selectedIds => console.log('Linking items with IDs:', selectedIds)}
            />

            {isPopupOpen && selectedItem && (
                <ItemOverviewPopup item={selectedItem} onClose={() => setIsPopupOpen(false)} />
            )}
        </div>
    );
};

export default Project;