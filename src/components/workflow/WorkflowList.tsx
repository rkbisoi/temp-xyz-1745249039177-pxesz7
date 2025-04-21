import { useState } from 'react';
import ListView from '../shared/ListView';
import { ListConfig } from '../shared/types';
import { Link, Trash } from 'lucide-react';
import { WorkflowItem } from '../../types';
import AddWorkflowForm from './AddWorkflowForm';
import WorkflowDetail from './WorkflowDetail';

const workflowConfig: ListConfig = {
  title: 'Ntelg',
  addButtonText: 'New Workflow',
  searchPlaceholder: 'Search workflows...',
  itemsName: 'workflows',
  showStatus: true,
  showType: true,
  statusOptions: ['active', 'draft', 'archived'],
  sortOptions: [
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'lastUpdated', label: 'Last Updated' }
  ],
  bulkActions: [
    { label: 'Link', action: 'link', icon: <Link className="h-4 w-4" /> },
    { label: 'Delete', action: 'delete', icon: <Trash className="h-4 w-4" /> }
  ]
};

const mockWorkflows: WorkflowItem[] = [
  {
    id: 1,
    name: 'Test Automation Flow',
    description: 'End-to-end test automation workflow',
    type: 'Test Automation',
    status: 'active',
    lastUpdated: '2h ago',
    createDate: '2024-03-20',
    update_seq_no: 1
  },
  {
    id: 2,
    name: 'Data Processing Pipeline',
    description: 'Data transformation and validation workflow',
    type: 'Data Processing',
    status: 'draft',
    lastUpdated: '1d ago',
    createDate: '2024-03-19',
    update_seq_no: 1
  }
];

interface WorkflowListProps {
  onWorkflowView?: (id: number) => void;
  defaultView?: 'grid' | 'list';
  projectId?: number;
}

export default function WorkflowList({
  defaultView = 'grid',
  projectId = -1
}: WorkflowListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<number | null>(null);

  const handleAddItem = () => {
    setIsFormOpen(true);
  };

  const handleWorkflowView = (id: number) => {
    setSelectedWorkflowId(id);
  };

  return (
    <div>
      <div className="max-w-8xl mx-auto">
        <ListView
          items={mockWorkflows}
          config={workflowConfig}
          onItemView={handleWorkflowView}
          onAddItem={handleAddItem}
          defaultView={defaultView}
          projectId={projectId}
        />
        <AddWorkflowForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          projectId={projectId}
        />
        <WorkflowDetail
          workflowId={selectedWorkflowId || 0}
          isOpen={selectedWorkflowId !== null}
          onClose={() => setSelectedWorkflowId(null)}
        />
      </div>
    </div>
  );
}