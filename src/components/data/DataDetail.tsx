import { ArrowLeft, User, Calendar, Edit, Link, Trash } from 'lucide-react';
import { DataItem, ProjectItem } from '../../types';
import { useEffect, useState } from 'react';
import { API_URL } from '../../data';
import ActionDropdown from '../shared/ActionDropdown';
import LinkEntitiesForm from '../shared/LinkEntitiesForm';
import AddDataForm from './AddDataForm';
import { projects } from '../../mockData/projectData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../shared/Tabs';
import { fetchDataProjects } from '../../services/projectService';
import { emitter } from '../../utils/eventEmitter';

interface DataDetailProps {
    dataId: number;
    onBack: () => void;
}

interface DataRow {
    [key: string]: string | number;
}

export default function DataDetail({ dataId, onBack }: DataDetailProps) {
    const [data, setData] = useState<DataItem>();
    const [parsedData, setParsedData] = useState<DataRow[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isLinkFormOpen, setLinkFormOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('test-data');
    const [dataProjects, setDataProjects] = useState<ProjectItem[]>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_URL}/testdata/${dataId}`, {
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
                if (data?.data) {
                    const convertedProject: DataItem = {
                        id: data.data.dataId,
                        name: data.data.dataName,
                        type: data.data.srcType,
                        update_seq_no: data.data.update_seq_no,
                        dataModel: data.data.dataModel,
                        dataExample: data.data.dataExample,
                        dataHeader: data.data.dataHeader,
                        createdBy: data.data.createdBy,
                        active: data.data.active,
                        lastUpdated_by: data.data.lastUpdated_by,
                        createDate: data.data.createDate,
                        description: ''
                    }

                    setData(convertedProject);

                    // Parse the dataExample string into an array of objects
                    if (convertedProject.dataExample) {
                        const parsedExample = JSON.parse(convertedProject.dataExample);
                        setParsedData(parsedExample);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

        emitter.on('refreshDataDetail', () => {
            fetchData();
          });
    }, [dataId]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedKnowledgeProjects = await fetchDataProjects(dataId);
                if (fetchedKnowledgeProjects.length > 0) setDataProjects(fetchedKnowledgeProjects);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleDeleteData = () => {
        console.log("Delete Data")
    }

    return (
        <div className="p-6">
            {/* <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Data List
      </button> */}
            <div className="flex justify-between mb-2">
                <div className="flex flex-row justify-start">
                    <button
                        onClick={onBack}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-2 p-2 bg-gray-100 rounded"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2 ml-2">{data?.name}</h1>
                </div>
                <ActionDropdown
                    actions={[
                        { icon: <Edit className="size-4" />, text: 'Edit', onClick: () => { setIsFormOpen(true) } },
                        { icon: <Link className="size-4" />, text: 'Link', onClick: () => { setLinkFormOpen(true) } },
                        { icon: <Trash className="size-4" />, text: 'Delete', onClick: handleDeleteData },
                    ]}
                />
            </div>



            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        {/* <h1 className="text-2xl font-bold text-gray-900 mb-2">{data?.name}</h1> */}

                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-4">
                            <span className="px-2 py-1 rounded-full bg-gray-100">{data?.type}</span>
                            <div className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                <span>Created by: {data?.createdBy}</span>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>Created: {new Date(data?.createDate || '').toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <div className='mb-2 flex justify-between'>
                            <TabsList>

                                <TabsTrigger value="test-data">{`Data`}</TabsTrigger>
                                <TabsTrigger value="projects">{`Projects`}</TabsTrigger>
                            </TabsList>

                        </div>
                        <TabsContent value="test-data">

                            <div className="overflow-x-auto mt-4">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {data?.dataHeader.map((header, index) => (
                                                <th
                                                    key={index}
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {parsedData.map((row, rowIndex) => (
                                            <tr key={rowIndex}>
                                                {data?.dataHeader.map((header, colIndex) => (
                                                    <td
                                                        key={`${rowIndex}-${colIndex}`}
                                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                                    >
                                                        {row[header]?.toString()}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </TabsContent>

                        <TabsContent value="projects">
                            {(dataProjects && dataProjects.length > 0) ? (

                                <div className="overflow-x-auto mt-4">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-sky-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Project</th>
                                                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Role</th> */}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {dataProjects.map((project) => (
                                                <tr key={project.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.name}</td>
                                                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.createdBy === userId ? 'Owner' : 'Member'}</td> */}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className='px-4 flex justify-center py-4'>No projects linked for this test data</p>
                            )}
                        </TabsContent>

                    </Tabs>


                </div>
            </div>
            <LinkEntitiesForm
                isOpen={isLinkFormOpen}
                onClose={() => setLinkFormOpen(false)}
                sourceType="data"
                sourceIds={[-1]}
                targetType="project"
                availableItems={projects}
                linkedItems={projects.slice(2, 4)}
                title="Link Project"
                onLink={(selectedIds) => {
                    // Handle linking logic here
                    console.log('Linking items with IDs:', selectedIds);
                }}
            />
            <AddDataForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} data={data} />
        </div>
    );
}