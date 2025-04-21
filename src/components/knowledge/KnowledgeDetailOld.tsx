// import React, { useEffect, useState } from 'react';
// import { ArrowLeft, FileText, Download, Trash2, Calendar, Globe2, Plus, Link, Edit, Trash } from 'lucide-react';
// import UploadDocumentForm from './UploadDocumentForm';
// import LinkEntitiesForm from '../shared/LinkEntitiesForm';
// // import { projects } from '../../mockData/projectData';
// import { KnowledgeItem, ProjectItem } from '../../types';
// import { API_URL, LLM_URL } from '../../data';
// import ActionDropdown from '../shared/ActionDropdown';
// import AddKnowledgeForm from './AddKnowledgeForm';
// import { fetchAllProjects, fetchKnowledgeProjects } from '../../services/projectService';
// import toast from 'react-hot-toast';

// interface Document {
//   id: string;
//   name: string;
//   type: string;
//   size: string;
//   uploadedBy: string;
//   uploadedAt: string;
// }

// interface KnowledgeDetailProps {
//   onBack: () => void;
// }

// const mockDocuments: Document[] = [
//   // {
//   //   id: '1',
//   //   name: 'Test Strategy Document.pdf',
//   //   type: 'PDF',
//   //   size: '2.5 MB',
//   //   uploadedBy: 'John Doe',
//   //   uploadedAt: '2024-03-15'
//   // },
//   // {
//   //   id: '2',
//   //   name: 'Test Cases Template.xlsx',
//   //   type: 'Excel',
//   //   size: '1.8 MB',
//   //   uploadedBy: 'Jane Smith',
//   //   uploadedAt: '2024-03-14'
//   // },
//   // {
//   //   id: '3',
//   //   name: 'API Documentation.docx',
//   //   type: 'Word',
//   //   size: '3.2 MB',
//   //   uploadedBy: 'Mike Johnson',
//   //   uploadedAt: '2024-03-13'
//   // }
// ];

// interface KnowledgeDetailProps {
//   knowledgeId: number;
//   onBack: () => void;
// };

// const KnowledgeDetail: React.FC<KnowledgeDetailProps> = ({ knowledgeId, onBack }) => {
//   const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
//   const [documents, setDocuments] = useState<Document[]>(mockDocuments);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [isLinkFormOpen, setLinkFormOpen] = useState(false);
//   const [knowledge, setKnowledge] = useState<KnowledgeItem>();
//   const [allUserProjects, setAllUserProjects] = useState<ProjectItem[]>([]);
//   const [allKnowledgeProjects, setAllKnowledgeProjects] = useState<ProjectItem[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {

//         // const userId = getUserId();
//         // if (!userId) {
//         //   console.warn("User ID is missing");
//         //   return;
//         // }

//         const response = await fetch(`${API_URL}/getKnowledgeById/${knowledgeId}`, {
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
//         // console.log("Knowledge Response:", data.data);

//         if (data?.data) {
//           const convertedProject: KnowledgeItem = {
//             id: data.data.kb_ID,
//             name: data.data.kb_Name,
//             description: data.data.kb_Desc,
//             // type: data.data.kb_Type,
//             global: data.data.global,
//             lastUpdated: '',
//             createDate: data.data.createDate,
//             update_seq_no: data.data.updateSeqNo
//           };

//           setKnowledge(convertedProject);
//         } else {
//           console.warn("Invalid response structure:", data);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     const fetchKnowledgeDocuments = async () => {

//       const response = await fetch(`${LLM_URL}/vector_docs/${knowledgeId}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         }
//       );
//         const result = await response.json();
//         if (Array.isArray(result)) {
//           console.log(`Document for knowledgeId ${knowledgeId} : `, result)
//           toast.success("Documents Fetched Successfully")
//           // setData(result);
//         } else {
//           // setData([]);
//           toast.error("Error Fetching Documents")
//         }

//     }

//     fetchKnowledgeDocuments()
//   });


//   const handleDeleteDocument = (documentId: string) => {
//     setDocuments(documents.filter(doc => doc.id !== documentId));
//   };

//   const handleDeleteKnolwedge = () => {
//     console.log("Delete Knowledge")
//   }

//   const handleLinkKnowledge = async () => {
//     const fetchedProjects = await fetchAllProjects();
//     const fetchedKnowledgeProjects = await fetchKnowledgeProjects(knowledgeId)

//     if (fetchedProjects.length > 0) {
//       setAllUserProjects(fetchedProjects);
//       setAllKnowledgeProjects(fetchedKnowledgeProjects);
//       setLinkFormOpen(true)
//     }
//   }

//   const getFileIcon = (type: string) => {
//     switch (type.toLowerCase()) {
//       case 'pdf':
//         return 'text-red-500';
//       case 'excel':
//         return 'text-green-500';
//       case 'word':
//         return 'text-blue-500';
//       default:
//         return 'text-gray-500';
//     }
//   };



//   return (
//     <div className="p-4">
//       <div className="flex justify-between mb-2">
//         <div className="flex flex-row justify-start">
//           <button
//             onClick={onBack}
//             className="flex items-center text-gray-600 hover:text-gray-900 mb-2 p-2 bg-gray-100 rounded"
//           >
//             <ArrowLeft className="h-5 w-5" />
//           </button>
//           <h1 className="text-2xl font-bold text-gray-900 mb-2 ml-2">{knowledge?.name}</h1>
//         </div>
//         <ActionDropdown
//           actions={[
//             { icon: <Edit className="size-4" />, text: 'Edit', onClick: () => { setIsFormOpen(true) } },
//             { icon: <Link className="size-4" />, text: 'Link', onClick: () => { handleLinkKnowledge() } },
//             { icon: <Trash className="size-4" />, text: 'Delete', onClick: handleDeleteKnolwedge },
//           ]}
//         />
//       </div>



//       <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-8">
//         <div className="flex justify-between items-start mb-6">
//           <div>

//             <div className="flex items-center space-x-4 text-sm text-gray-500">
//               <div className="flex items-center">
//                 <Calendar className="h-4 w-4 mr-1" />
//                 <span>Created: {knowledge?.createDate}</span>
//               </div>
//               {knowledge?.global && (<div className="flex items-center">
//                 <Globe2 className="h-4 w-4 mr-1" />
//                 <span>Global Access</span>
//               </div>)}
//             </div>
//           </div>
//           {/* <div className="flex items-center space-x-2">
//             <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-sm font-medium">
//               Technical Guide
//             </span>
//             <button onClick={() => { setLinkFormOpen(true) }} className="flex flex-row text-sm btn1 h-8 rounded-md">
//               <Link className='mr-2 w-4 h-4' />
//               <p>Link</p>
//             </button>
//           </div> */}
//         </div>

//         <div className="prose max-w-none mb-8">
//           <p className="text-gray-600">
//             {knowledge?.description}
//           </p>
//         </div>

//         <div className="border-t border-gray-200 pt-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
//             <button
//               onClick={() => setIsUploadFormOpen(true)}
//               className="btn1 flex items-center"
//             >
//               <Plus className="h-4 w-4 mr-2" />
//               Upload Document
//             </button>
//           </div>

//           <div className="space-y-4">
//             {documents.map((doc) => (
//               <div
//                 key={doc.id}
//                 className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
//               >
//                 <div className="flex items-center space-x-4">
//                   <FileText className={`h-8 w-8 ${getFileIcon(doc.type)}`} />
//                   <div>
//                     <h3 className="text-sm font-medium text-gray-900">{doc.name}</h3>
//                     <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
//                       <span>{doc.type}</span>
//                       <span>{doc.size}</span>
//                       <span>Uploaded by {doc.uploadedBy}</span>
//                       <span>{doc.uploadedAt}</span>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <button
//                     className="p-2 text-gray-500 hover:text-intelQEDarkBlue rounded-full hover:bg-gray-200"
//                     title="Download"
//                   >
//                     <Download className="h-5 w-5" />
//                   </button>
//                   <button
//                     onClick={() => handleDeleteDocument(doc.id)}
//                     className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-200"
//                     title="Delete"
//                   >
//                     <Trash2 className="h-5 w-5" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <UploadDocumentForm
//         knowledgeId={knowledgeId}
//         isOpen={isUploadFormOpen}
//         onClose={() => setIsUploadFormOpen(false)}
//         onUpload={(newDoc: Document) => {
//           setDocuments([...documents, newDoc]);
//           setIsUploadFormOpen(false);
//         }}
//       />
//       <LinkEntitiesForm
//         isOpen={isLinkFormOpen}
//         onClose={() => setLinkFormOpen(false)}
//         sourceType="knowledge"
//         sourceIds={[knowledgeId]}
//         targetType="project"
//         availableItems={allUserProjects}
//         linkedItems={allKnowledgeProjects}
//         title="Link Project"
//         onLink={(selectedIds) => {
//           // Handle linking logic here
//           console.log('Linking items with IDs:', selectedIds);
//         }}
//       />
//       <AddKnowledgeForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} knowledge={knowledge} />

//     </div>
//   );
// };

// export default KnowledgeDetail;