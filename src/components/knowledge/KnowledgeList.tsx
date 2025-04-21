import { useEffect, useState } from 'react';
import ListView from '../shared/ListView';
import AddKnowledgeForm from './AddKnowledgeForm';
import { ListConfig } from '../shared/types';
import { Link, Trash2, Unlink } from 'lucide-react';
import { getUserId } from '../../utils/storage';
import { KnowledgeItem } from '../../types';
import { API_URL } from '../../data';
import { emitter } from '../../utils/eventEmitter';
import { convertGMTToLocal, formatUserName, getTimeAgo } from '../../utils/utils';

const knowledgeConfig: ListConfig = {
  title: 'Knowledge',
  addButtonText: 'Add Knowledge',
  searchPlaceholder: 'Search knowledge base...',
  itemsName: 'knowledge items',
  showGlobal: true,
  sortOptions: [
    { key: 'name', label: 'Name' },
    { key: 'lastUpdated', label: 'Last Updated' }
  ],
  bulkActions: [
    { label: 'Delete', action: 'delete', icon: <Trash2 className="h-4 w-4" /> },
    { label: 'Link', action: 'link', icon: <Link className="h-4 w-4" /> },
    { label: 'Delink', action: 'delink', icon: <Unlink className='h-4 w-4' /> }
  ]
};

interface KnowledgeListProps {
  onKnowledgeView?: (id: number) => void;
  defaultView?: 'grid' | 'list';
  projId: number
}
export default function KnowledgeList({
  onKnowledgeView = () => { },
  defaultView = 'grid',
  projId = -1
}: KnowledgeListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [knowledges, setKnowledges] = useState<KnowledgeItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = getUserId();
        if (!userId) {
          console.warn("User ID is missing");
          return;
        }

        var url = `${API_URL}/knowledgebases`

        if (projId > 0) {
          url = `${API_URL}/knowledgebase/by-project/${projId}`
        }

        const response = await fetch(url, {
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
        // console.log("Knowledge List Response:", data.data);

        if (data?.data && Array.isArray(data.data)) {
          const convertedKnowledges: KnowledgeItem[] = data.data.map((know: any) => ({
            id: know.kb_ID,
            name: know.kb_Name,
            description: know.kb_Desc,
            type: know.kb_Type,
            global: know.global,
            update_seq_no: know.updateSeqNo,
            createdByUser: formatUserName(know.createdByUser.userName),
            createDate: getTimeAgo(convertGMTToLocal(know.createDate))
            // updatedByUser: formatUserName(know.updatedByUser.userName)
          }));

          setKnowledges(convertedKnowledges);
        } else {
          console.warn("Invalid response structure:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    emitter.on('refreshKnowledgeList', () => {
      fetchData();
    });
  }, []);

  const handleItemClick = (id: number) => {
    onKnowledgeView(id);
  };

  return (
    <>
      <ListView
        items={knowledges}
        config={knowledgeConfig}
        onItemView={handleItemClick}
        onAddItem={() => setIsFormOpen(true)}
        defaultView={defaultView}
        projectId={projId} 
        applicationId={-1} 
        isApp={false}      
        />
      <AddKnowledgeForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} knowledge={undefined} />

    </>
  );
}