import { useEffect, useState } from 'react';
import ListView from '../shared/ListView';
import AddProjectForm from './AddProjectForm';
import { ListConfig } from '../shared/types';
import { Link, Trash2, Unlink } from 'lucide-react';
import LinkEntitiesForm from '../shared/LinkEntitiesForm';
import { knowledgeItems } from '../../mockData/knowledgeData';
import { ProjectItem } from '../../types';
import { fetchAllProjects, fetchProjectsByAppId } from '../../services/projectService';
import { emitter } from '../../utils/eventEmitter';

const projectConfig: ListConfig = {
  title: 'Projects',
  addButtonText: 'New Project',
  searchPlaceholder: 'Search projects...',
  itemsName: 'projects',
  // showProgress: true,
  // showMembers: true,
  // showStatus: true,
  showType: true,
  statusOptions: ['In Progress', 'Planning', 'Review'],
  sortOptions: [
    { key: 'name', label: 'Name' },
    { key: 'progress', label: 'Progress' },
    { key: 'members', label: 'Members' }
  ],
  bulkActions: [
    { label: 'Delete', action: 'delete', icon: <Trash2 className="h-4 w-4" /> },
    { label: 'Link', action: 'link', icon: <Link className="h-4 w-4" /> },
    { label: 'Delink', action: 'delink', icon: <Unlink className='h-4 w-4'/> }
  ]
};

interface ProjectListProps {
  onProjectView: (id: number) => void;
  applicationId: number;
}

export default function ProjectList({ onProjectView, applicationId }: ProjectListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLinkFormOpen, setLinkFormOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {

        var fetchedProjects = []

        if(applicationId > 0){
          fetchedProjects = await fetchProjectsByAppId(applicationId);
        }else{
          fetchedProjects = await fetchAllProjects();
        }
        

        if (fetchedProjects.length > 0) {
          setProjects(fetchedProjects);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    emitter.on('refreshProjectList', () => {
      fetchData();
    });

  }, []);

  return (
    <>
      <ListView
        items={projects}
        config={projectConfig}
        onItemView={(id) => {
          onProjectView(id);
          setSelectedProjectId(id); // Store selected project for linking
        } }
        onAddItem={() => setIsFormOpen(true)}
        projectId={-1} 
        applicationId={applicationId} 
        isApp={applicationId>0} 
      />
      <AddProjectForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} project={undefined} />
      <LinkEntitiesForm
        isOpen={isLinkFormOpen}
        onClose={() => setLinkFormOpen(false)}
        sourceType="project"
        sourceIds={selectedProjectId ? [selectedProjectId] : []} // Use selected project ID
        targetType="knowledge"
        availableItems={knowledgeItems}
        linkedItems={knowledgeItems.slice(0, 5)}
        title="Link Knowledge Items"
        onLink={(selectedIds) => {
          console.log('Linking items with IDs:', selectedIds);
        }}
      />
    </>
  );
}
