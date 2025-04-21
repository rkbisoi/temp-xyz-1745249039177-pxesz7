import { useEffect, useState } from 'react';
import ListView from '../shared/ListView';
import AddApplicationForm from './AddApplicationForm';
import { ListConfig } from '../shared/types';
import { fetchAllApplication } from '../../services/applicationService';
import { ApplicationItem } from '../../types';
import { emitter } from '../../utils/eventEmitter';
import { Trash2 } from 'lucide-react';


const applicationConfig: ListConfig = {
  title: 'QE Goals',
  addButtonText: 'Add QE Goal',
  searchPlaceholder: 'Search QE Goals...',
  itemsName: 'applications',
  showType: true,
  sortOptions: [
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'lastUpdated', label: 'Last Updated' }
  ],
  bulkActions: [
    { label: 'Delete', action: 'delete', icon: <Trash2 className="h-4 w-4" /> }
  ]
};


interface ApplicationListProps {
  onApplicationView?: (id: number) => void;
  defaultView?: 'grid' | 'list';
}
export default function ApplicationList({
  onApplicationView = () => { },
  defaultView = 'grid'
}: ApplicationListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);

  useEffect(() => {
      const fetchData = async () => {
        try {
  
          const fetchedApplications = await fetchAllApplication();
  
          if (fetchedApplications.length > 0) {
            setApplications(fetchedApplications);
          }
  
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData();
  
      emitter.on('refreshApplicationList', () => {
        fetchData();
      });
  
    }, []);

  return (
    <>
      <ListView
        items={applications}
        config={applicationConfig}
        onItemView={onApplicationView}
        onAddItem={() => setIsFormOpen(true)}
        defaultView={defaultView}
        projectId={-1}
        applicationId={-1} isApp={true}
      />
      <AddApplicationForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} app={undefined} />
    </>
  );
}