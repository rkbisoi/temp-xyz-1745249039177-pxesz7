import { useEffect, useState } from 'react';
import ListView from '../shared/ListView';
import AddDataForm from './AddDataForm';
import { ListConfig } from '../shared/types';
// import { dataItems } from '../../mockData/dataData';
import { DataItem } from '../../types';
import { getUserId } from '../../utils/storage';
import { API_URL } from '../../data';
import { Link, Trash2, Unlink } from 'lucide-react';
import { convertGMTToLocal, formatUserName, getTimeAgo } from '../../utils/utils';
import { emitter } from '../../utils/eventEmitter';



const dataConfig: ListConfig = {
  title: 'Data',
  addButtonText: 'New Data',
  searchPlaceholder: 'Search data...',
  itemsName: 'data items',
  showType: true,
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

interface DataListProps {
  onDataView?: (id: number) => void;
  defaultView?: 'grid' | 'list';
  projId: number
}

export default function DataList({
  onDataView = () => { },
  defaultView = 'grid',
  projId = -1
}: DataListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [testDataList, setTestDataList] = useState<DataItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = getUserId();
        if (!userId) {
          console.warn("User ID is missing");
          return;
        }

        var url = `${API_URL}/testdata/fetchAll/`

        if (projId > 0) {
          url = `${API_URL}/projects/${projId}/testdata`
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
        // console.log("Data List Response:", data.data);

        if (data?.data && Array.isArray(data.data)) {
          const convertedKnowledges: DataItem[] = data.data.map((data: any) => ({
            id: data.dataId,
            name: data.dataName,
            type: data.srcType,
            update_seq_no: data.update_seq_no,
            dataModel: data.dataModel,
            dataExample: data.dataExample,
            dataHeader: data.dataHeader,
            createdBy: data.createdBy,
            active: data.active,
            lastUpdated_by: data.lastUpdated_by,
            createdByUser: formatUserName(data.createdByUser.userName),
            updatedByUser: formatUserName(data.updatedByUser.userName),
            createDate: getTimeAgo(convertGMTToLocal(data.createDate))
          }));

          setTestDataList(convertedKnowledges);
        } else {
          console.warn("Invalid response structure:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    emitter.on('refreshTestDataList', () => {
      fetchData();
    });
  }, []);

  return (
    <>
      <ListView
        items={testDataList}
        config={dataConfig}
        onItemView={onDataView}
        onAddItem={() => setIsFormOpen(true)}
        defaultView={defaultView}
        projectId={projId}
      />
      <AddDataForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} data={undefined} />
    </>
  );
}

// import { useEffect, useState } from 'react';
// import ListView from '../shared/ListView';
// import AddDataForm from './AddDataForm';
// import { ListConfig } from '../shared/types';
// import { DataItem } from '../../types';
// import { getUserId } from '../../utils/storage';
// import { API_URL } from '../../data';
// import DataDetail from './DataDetail';

// const dataConfig: ListConfig = {
//   title: 'Data',
//   addButtonText: 'New Data',
//   searchPlaceholder: 'Search data...',
//   itemsName: 'data items',
//   showGlobal: true,
//   sortOptions: [
//     { key: 'name', label: 'Name' },
//     { key: 'lastUpdated', label: 'Last Updated' }
//   ]
// };

// interface DataListProps {
//   onDataView?: (id: number) => void;
//   defaultView?: 'grid' | 'list';
//   projId: number
// }

// export default function DataList({
//   onDataView = () => { },
//   defaultView = 'grid',
//   projId = -1
// }: DataListProps) {
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [testDataList, setTestDataList] = useState<DataItem[]>([]);
//   const [selectedDataId, setSelectedDataId] = useState<number | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const userId = getUserId();
//         if (!userId) {
//           console.warn("User ID is missing");
//           return;
//         }

//         var url = `${API_URL}/testdata/fetchAll/`

//         if (projId > 0) {
//           url = `${API_URL}/projects/${projId}/testdata`
//         }

//         const response = await fetch(url, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         });

//         if (!response.ok) {
//           throw new Error(`API error: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log("Data List Response:", data.data);

//         if (data?.data && Array.isArray(data.data)) {
//           const convertedKnowledges: DataItem[] = data.data.map((data: any) => ({
//             id: data.dataId,
//             name: data.dataName,
//             type: data.srcType,
//             update_seq_no: data.update_seq_no,
//             dataModel: data.dataModel,
//             dataExample: data.dataExample,
//             dataHeader: data.dataHeader,
//             createdBy: data.createdBy,
//             active: data.active,
//             lastUpdated_by: data.lastUpdated_by,
//             createDate: data.createDate,
//             // description: ''
//           }));

//           setTestDataList(convertedKnowledges);
//         } else {
//           console.warn("Invalid response structure:", data);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleDataView = (id: number) => {
//     onDataView(id)
//     // setSelectedDataId(id);
//   };

//   if (selectedDataId) {
//     return (
//       <DataDetail
//         dataId={selectedDataId}
//         onBack={() => setSelectedDataId(null)}
//       />
//     );
//   }

//   return (
//     <>
//       <ListView
//         items={testDataList}
//         config={dataConfig}
//         onItemView={handleDataView}
//         onAddItem={() => setIsFormOpen(true)}
//         defaultView={defaultView}
//       />
//       <AddDataForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
//     </>
//   );
// }