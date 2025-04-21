import { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import WorkflowDetail from './WorkflowDetail';

interface AddWorkflowFormProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: number;
}

export default function AddWorkflowForm({ isOpen, onClose, projectId }: AddWorkflowFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: ''
  });

  const [selectedWorkflowId, setSelectedWorkflowId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newWorkflowId = Date.now(); 

      setSelectedWorkflowId(newWorkflowId);
      toast.success('Workflow created successfully!');
    } catch (error) {
      toast.error('Failed to create workflow');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Create Workflow</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md"
              placeholder="Enter workflow name"
              required
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="mt-1 block w-full rounded-md"
              required
            >
              <option value="">Select type</option>
              <option value="Test Automation">Test Automation</option>
              <option value="Data Processing">Data Processing</option>
              <option value="Integration">Integration</option>
              <option value="Deployment">Deployment</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md"
              placeholder="Enter workflow description"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn1"
            >
              Create Workflow
            </button>
          </div>
        </form>
      </div>

      {selectedWorkflowId && (
        <WorkflowDetail
          workflowId={selectedWorkflowId}
          isOpen={true}
          onClose={() => setSelectedWorkflowId(null)}
        />
      )}
    </div>
  );
}
