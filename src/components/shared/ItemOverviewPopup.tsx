import React, { useState, useRef, useEffect } from 'react';
import { X, Clock, Users, Globe2 } from 'lucide-react';
import { BaseItem, Item, ProjectItem, KnowledgeItem, ApplicationItem, DataItem } from '../../types';

interface ItemOverviewPopupProps {
    item: Item;
    onClose: () => void;
}

type AppState = {
    view: string;
    projectId?: number | null;
    knowledgeId?: number | null;
    applicationId?: number | null;
    dataId?: number | null;
    userId?: number | null;
  };

const ItemOverviewPopup: React.FC<ItemOverviewPopupProps> = ({ item, onClose }) => {
    const popupRef = useRef<HTMLDivElement>(null);
    const [isProject, setIsProject] = useState(false);
    const [isKnowledge, setIsKnowledge] = useState(false);
    const [isApplication, setIsApplication] = useState(false);
    const [isData, setIsData] = useState(false);

    // Initialize all state from sessionStorage or default values
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
          userId: null
        };
      });

      useEffect(() => {
        sessionStorage.setItem('appState', JSON.stringify(state));
      }, [state]);

    const handleKnowledgeView = (knowledgeId: number) => {
        setState(prev => ({ ...prev, knowledgeId, view: 'knowledge' }));
      };
    
      const handleApplicationView = (applicationId: number) => {
        setState(prev => ({ ...prev, applicationId, view: 'applications' }));
      };
    
      const handleDataView = (dataId: number) => {
        setState(prev => ({ ...prev, dataId, view: 'data' }));
      };
    
      const handleUserView = (userId: number) => {
        setState(prev => ({ ...prev, userId, view: 'users' }));
      };

      const handleView = () => {
        const id = item.id;
        if (isKnowledge) {
          handleKnowledgeView(id);
        } else if (isApplication) {
          handleApplicationView(id);
        } else if (isData) {
          handleDataView(id);
        } else {
          handleUserView(id);
        }

        onClose();
      };

    useEffect(() => {
        setIsProject('progress' in item);
        setIsKnowledge('global' in item && (item as KnowledgeItem).global);
        setIsApplication('type' in item);
        setIsData('global' in item && !(item as DataItem).global);
    }, [item]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const renderSpecificData = () => {
        if (isProject) {
            const project = item as ProjectItem;
            return (
                <>
                    <div className="flex items-center mb-2">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{project.members} members</span>
                    </div>
                    <div className="flex items-center mb-2">
                        <span>Progress: {project.progress}%</span>
                    </div>
                    <div className="flex items-center mb-2">
                        <span>Status: {project.status}</span>
                    </div>
                </>
            );
        } else if (isKnowledge || isData) {
            const knowledgeOrData = item as KnowledgeItem | DataItem;
            return (
                <div className="flex items-center mb-2">
                    <Globe2 className="h-4 w-4 mr-1" />
                    <span>{knowledgeOrData.global ? 'Global' : 'Private'} Access</span>
                </div>
            );
        } else if (isApplication) {
            const application = item as ApplicationItem;
            return (
                <div className="flex items-center mb-2">
                    <span>Type: {application.type}</span>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-49">
            <div className="bg-white rounded-lg shadow-xl p-6 w-96 relative" ref={popupRef}>
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    <X className="h-5 w-5" />
                </button>
                <h2 className="text-xl font-bold text-gray-900 mb-4">{item.name}</h2>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="space-y-2">
                    <div className="flex items-center mb-2">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Last Updated: {item.lastUpdated}</span>
                    </div>
                    {renderSpecificData()}
                </div>
                <div className='flex mt-2 justify-end -mb-2'>
                    <button className='btn1' onClick={ handleView }>
                        View
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ItemOverviewPopup;
