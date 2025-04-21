import { useState, useEffect } from 'react';
import { X, Search, Check, Loader2 } from 'lucide-react';
import { BaseItem } from '../../types';
import { linkKnowledgesToProjects } from '../../services/knowledgeService';
import { linkDataToProjects } from '../../services/dataService';
import toast from 'react-hot-toast';
import { linkUsersToApplications} from '../../services/userService';
import { linkProjectsToApplication } from '../../services/applicationService';


interface LinkEntitiesFormProps {
  isOpen: boolean;
  onClose: () => void;
  sourceType: string;
  sourceIds: number[];
  targetType: string;
  onLink: (selectedIds: number[]) => void;
  availableItems: BaseItem[];
  linkedItems?: BaseItem[];
  title?: string;
}

export default function LinkEntitiesForm({
  isOpen,
  onClose,
  sourceType,
  sourceIds,
  targetType,
  onLink,
  availableItems,
  linkedItems = [],
  title = 'Link Items'
}: LinkEntitiesFormProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Pre-select already linked items
    setSelectedIds(new Set(linkedItems.map(item => item.id)));
  }, [linkedItems]);

  const filteredItems = availableItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleSelect = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      onLink(Array.from(selectedIds));
      const targetIds: number[] = Array.from(selectedIds);
  
      if (sourceType === 'project') {
        await linkProjectsToApplication(targetIds, sourceIds);
      } else if (sourceType === 'knowledge') {
        await linkKnowledgesToProjects(targetIds, sourceIds);
      } else if (sourceType === 'data') {
        await linkDataToProjects(targetIds, sourceIds);
      } else if (sourceType === 'user') {
        // await linkUsersToProjects(projectIds, sourceIds);
        await linkUsersToApplications(targetIds, sourceIds)
      }

      toast.success("Items Linked Successfully")
      console.log("Target IDs to Link:", selectedIds);
      onClose();
    } catch (error) {
      toast.error("Error Linking Items")
      console.error("Error linking items:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-intelQEDarkBlue focus:border-intelQEDarkBlue"
          />
        </div>

        <div className="max-h-96 overflow-y-auto mb-6">
          <div className="grid grid-cols-1 gap-2">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${selectedIds.has(item.id)
                  ? 'border-intelQEDarkBlue bg-sky-50'
                  : 'border-gray-200 hover:bg-gray-50'
                  }`}
                onClick={() => handleToggleSelect(item.id)}
              >
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{item.description}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedIds.has(item.id)
                  ? 'border-intelQEDarkBlue bg-intelQEDarkBlue text-white'
                  : 'border-gray-300'
                  }`}>
                  {selectedIds.has(item.id) && <Check className="h-3 w-3" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="btn2"
          >
            Cancel
          </button>
          {/* <button
            onClick={handleSubmit}
            className="btn1"
          >
            Link Selected
          </button> */}
          <button
            onClick={handleSubmit}
            className="btn1 flex items-center justify-center"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <div className='flex flex-row justify-between'>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  <span>Processing...</span>
                </div>

              </>
            ) : (
              <span>Link Selected</span>
            )}
          </button>

        </div>
      </div>
    </div>
  );
}