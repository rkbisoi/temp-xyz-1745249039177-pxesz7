// import { useState, useRef, useEffect } from 'react';
// import { Clock, Users, MoreHorizontal, CheckCircle, Circle } from 'lucide-react';
// import { ListItemCardProps } from './types';

// export default function ListItemCard({
//     item,
//     config,
//     isSelected,
//     onSelect,
//     onView,
//     getStatusColor,
// }: ListItemCardProps) {
//     const [dropdownOpen, setDropdownOpen] = useState(false);
//     const dropdownRef = useRef<HTMLDivElement | null>(null);

//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//                 setDropdownOpen(false);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     const isProject = 'progress' in item;
//     const isKnowledgeOrData = 'global' in item;

//     const handleCardClick = (e: React.MouseEvent) => {
//         // Don't navigate if clicking on the checkbox or dropdown
//         const target = e.target as HTMLElement;
//         if (
//             target.closest('.checkbox-area') ||
//             target.closest('.dropdown-area')
//         ) {
//             return;
//         }
//         onView(item.id);
//     };

//     return (
//         <div
//             className="card1 relative rounded shadow cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-lg"
//             onClick={handleCardClick}
//         >
//             <div className="absolute top-2 right-10 checkbox-area">
//                 <button
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         onSelect(item.id);
//                     }}
//                     className="p-1 mt-0.5 rounded-full hover:bg-gray-100"
//                 >
//                     {isSelected ? (
//                         <CheckCircle className="h-4 w-4 text-intelQEDarkBlue" />
//                     ) : (
//                         <Circle className="h-4 w-4 text-gray-400" />
//                     )}
//                 </button>
//             </div>

//             <div className="absolute top-2 right-2 dropdown-area" ref={dropdownRef}>
//                 <button
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         setDropdownOpen(!dropdownOpen);
//                     }}
//                     className="p-1 rounded hover:bg-gray-100"
//                 >
//                     <MoreHorizontal className="h-5 w-5 text-intelQEDarkBlue" />
//                 </button>

//                 {dropdownOpen && (
//                     <div
//                         className="absolute top-6 right-0 mt-2 w-28 bg-white border rounded shadow-md z-10"
//                         onClick={(e) => e.stopPropagation()}
//                     >
//                         <ul>
//                             <li
//                                 onClick={() => {
//                                     onView(item.id);
//                                     setDropdownOpen(false);
//                                 }}
//                                 className="text-left font-semibold text-intelQEDarkBlue px-3 text-sm py-1 hover:bg-gray-100 cursor-pointer"
//                             >
//                                 View
//                             </li>
//                             <hr />
//                             <li
//                                 onClick={() => setDropdownOpen(false)}
//                                 className="text-left font-semibold text-intelQEDarkBlue px-3 text-sm py-1 hover:bg-gray-100 cursor-pointer"
//                             >
//                                 Link
//                             </li>
//                             <hr />
//                             <li
//                                 onClick={() => setDropdownOpen(false)}
//                                 className="text-left font-semibold text-intelQEDarkBlue px-3 text-sm py-1 hover:bg-gray-100 cursor-pointer"
//                             >
//                                 Delete
//                             </li>
//                         </ul>
//                     </div>
//                 )}
//             </div>

//             <div className="p-4">
//                 <div className="flex flex-col justify-between items-start mb-4">
//                     <h3 className="text-lg font-semibold text-gray-900 ml-1 mb-2">{item.name}</h3>
//                     {isProject && 'status' in item && getStatusColor && typeof item.status === 'string' && (
//                         <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
//                             {item.status}
//                         </span>
//                     )}

//                     {isKnowledgeOrData && typeof item.global === 'boolean' && item.global && (
//                     <span className="px-2 py-1 text-xs rounded-full bg-sky-100 text-sky-800">
//                         Global
//                     </span>
//                     )}
//                 </div>

//                 <p className="text-gray-600 text-sm mb-4">{item.description}</p>

//                 {isProject && config.showProgress && 'progress' in item && typeof item.progress === 'number' && (
//                     <div className="mb-4">
//                         <div className="flex justify-between text-sm text-gray-600 mb-1">
//                             <span>Progress</span>
//                             <span>{item.progress}%</span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-2">
//                             <div
//                                 className="bg-intelQEDarkBlue rounded-full h-2"
//                                 style={{ width: `${item.progress}%` }}
//                             />
//                         </div>
//                     </div>
//                 )}

//                 <div className="flex items-center justify-between text-sm text-gray-500">
//                     {isProject && config.showMembers && 'members' in item && typeof item.members === 'number' && (
//                         <div className="flex items-center">
//                             <Users className="h-4 w-4 mr-1" />
//                             <span>{item.members} members</span>
//                         </div>
//                     )}
//                     <div className="flex items-center">
//                         <Clock className="h-4 w-4 mr-1" />
//                         <span>{item.lastUpdated}</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


// import { useState, useRef, useEffect } from "react";
// import { Clock, Users, MoreHorizontal, CheckCircle, Circle } from "lucide-react";
// import { InvitationItem, Item, UserItem } from "../../types"; // Assuming Item is the unified type for all possible items.
// import { getItemType } from "../../utils/utils";

// interface ListItemCardProps {
//   item: Item;
//   config: { showProgress?: boolean; showMembers?: boolean };
//   isSelected: boolean;
//   onSelect: (id: number) => void;
//   onView: (id: number) => void;
//   getStatusColor?: (status: string) => string;
// }

// export default function ListItemCard({
//   item,
//   config,
//   isSelected,
//   onSelect,
//   onView,
//   getStatusColor,
// }: ListItemCardProps) {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement | null>(null);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Handle card click
//   const handleCardClick = (e: React.MouseEvent) => {
//     const target = e.target as HTMLElement;
//     if (target.closest(".checkbox-area") || target.closest(".dropdown-area")) return;
//     onView(item.id);
//   };

//   // Render type (if applicable)
//   const renderType = () => {
//     if ("type" in item && typeof item.type === "string") {
//       return (
//         <span className={`px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800`}>
//           {item.type}
//         </span>
//       );
//     }
//     return null;
//   };

//   // Render status (if applicable)
//   const renderStatus = () => {
//     if ("status" in item && typeof item.status === "string" && getStatusColor) {
//       return (
//         <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
//           {item.status}
//         </span>
//       );
//     }
//     return null;
//   };

//   const renderRole = () => {
//     if ("role" in item && typeof item.role === "string") {
//       return (
//         <span className="px-2 py-1 text-xs rounded-full bg-sky-100 text-sky-800">
//           {item.role === "admin" ? "Admin" : "User"}
//         </span>
//       );
//     }
//     return null;
//   };


//   // Render global tag (if applicable)
//   const renderGlobalTag = () => {
//     if ("global" in item && typeof item.global === "boolean") {
//       return (
//         <span className={`px-2 py-1 text-xs rounded-full  ${item.global ? "bg-sky-100 text-sky-800" : "bg-gray-100 text-gray-800"}`}>
//           {item.global ? 'Global' : 'Private'}
//         </span>
//       );
//     }
//     return null;
//   };

//   // Render progress bar (if applicable)
//   const renderProgress = () => {
//     if (
//       "progress" in item &&
//       typeof item.progress === "number" &&
//       config.showProgress
//     ) {
//       return (
//         <div className="mb-4">
//           <div className="flex justify-between text-sm text-gray-600 mb-1">
//             <span>Progress</span>
//             <span>{item.progress}%</span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div
//               className="bg-intelQEDarkBlue rounded-full h-2"
//               style={{ width: `${item.progress}%` }}
//             />
//           </div>
//         </div>
//       );
//     }
//     return null;
//   };

//   // Render members count (if applicable)
//   const renderMembers = () => {
//     if ("members" in item && typeof item.members === "number" && config.showMembers) {
//       return (
//         <div className="flex items-center">
//           <Users className="h-4 w-4 mr-1" />
//           <span>{item.members} members</span>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div
//       className="card1 relative rounded shadow cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-lg"
//       onClick={handleCardClick}
//     >
//       {/* Checkbox */}
//       <div className="absolute top-2 right-10 checkbox-area">
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             onSelect(item.id);
//           }}
//           className="p-1 mt-0.5 rounded-full hover:bg-gray-100"
//         >
//           {isSelected ? (
//             <CheckCircle className="h-4 w-4 text-intelQEDarkBlue" />
//           ) : (
//             <Circle className="h-4 w-4 text-gray-400" />
//           )}
//         </button>
//       </div>

//       {/* Dropdown */}
//       <div className="absolute top-2 right-2 dropdown-area" ref={dropdownRef}>
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             setDropdownOpen(!dropdownOpen);
//           }}
//           className="p-1 rounded hover:bg-gray-100"
//         >
//           <MoreHorizontal className="h-5 w-5 text-intelQEDarkBlue" />
//         </button>

//         {dropdownOpen && (
//           <div
//             className="absolute top-6 right-0 mt-2 w-28 bg-white border rounded shadow-md z-10"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <ul>
//               <li
//                 onClick={() => {
//                   onView(item.id);
//                   setDropdownOpen(false);
//                 }}
//                 className="text-left font-semibold text-intelQEDarkBlue px-3 text-sm py-1 hover:bg-gray-100 cursor-pointer"
//               >
//                 View
//               </li>
//               <hr />
//               <li
//                 onClick={() => setDropdownOpen(false)}
//                 className="text-left font-semibold text-intelQEDarkBlue px-3 text-sm py-1 hover:bg-gray-100 cursor-pointer"
//               >
//                 Link
//               </li>
//               <hr />
//               <li
//                 onClick={() => setDropdownOpen(false)}
//                 className="text-left font-semibold text-intelQEDarkBlue px-3 text-sm py-1 hover:bg-gray-100 cursor-pointer"
//               >
//                 Delete
//               </li>
//             </ul>
//           </div>
//         )}
//       </div>

//       {/* Card Content */}
//       <div className="p-4">
//         <div className="flex flex-col justify-between items-start mb-2">
//           {getItemType(item) === 'InvitationItem' ? (<h3 className="text-md font-semibold text-gray-900 ml-1 mb-2 w-3/4 line-clamp-2">
//             {(item as InvitationItem).email}
//           </h3>) : (<h3 className="text-lg font-semibold text-gray-900 ml-1 mb-2 w-3/4 line-clamp-2">
//             {item.name}
//           </h3>)}

//           {(getItemType(item) === 'UserItem') && (<p className="text-sm text-gray-900 ml-1 mb-2">
//             {(item as UserItem).email}
//           </p>)}


//           <div className="flex flex-row justify-between items-center w-full">

//             {(getItemType(item) === 'ProjectItem' || 'ApplicationItem') && (<div>{renderType()}</div>)}
//             {/* {(getItemType(item) === 'UserItem' || 'InvitationItem') && (<div>{renderRole()}</div>)}
//               {(getItemType(item) === 'UserItem' || 'InvitationItem') && (<div>{renderStatus()}</div>)} */}
//             {(getItemType(item) === 'KnowledgeItem') && (<div>{renderGlobalTag()}</div>)}
//             {/* <div>{renderGlobalTag()}</div> */}
//           </div>
//           {(getItemType(item) === 'UserItem' || 'InvitationItem') && (<div className="flex flex-row justify-between items-center w-full">
//             <div>{renderRole()}</div>
//             <div>{renderStatus()}</div>
//           </div>)}




//         </div>

//         {/* <p className="text-gray-600 text-xs mb-4">{item.description}</p> */}
//         {(getItemType(item) === 'ProjectItem' || 'KnowledgeItem') && (<p className="text-gray-600 text-xs mb-2 mt-4 overflow-hidden text-ellipsis whitespace-nowrap">{item.description}</p>)}

//         {(getItemType(item) === 'ProjectItem') && renderProgress()}

//         {(getItemType(item) === 'ProjectItem' || 'KnowledgeItem') && (<div className="flex items-center justify-between text-sm text-gray-500">
//           {renderMembers()}
//           {/* <div className="flex items-center">
//             <Clock className="h-4 w-4 mr-1" />
//             <span>{item.lastUpdated}</span>
//           </div> */}
//         </div>)}
//       </div>
//     </div>
//   );
// }

import { useState, useRef, useEffect } from "react";
import { Calendar, CheckCircle, Circle, Clock, MoreHorizontal, Pause, Play, RefreshCw, User, Users } from "lucide-react";
import { InvitationItem, Item, ScheduledTaskItem, UserItem } from "../../types";
import { getItemType } from "../../utils/utils";
import { API_URL } from "../../data";
import toast from "react-hot-toast";
import { emitter } from "../../utils/eventEmitter";

interface ListItemCardProps {
  item: Item;
  config: { showProgress?: boolean; showMembers?: boolean };
  isSelected: boolean;
  onSelect: (id: number) => void;
  onView: (id: number) => void;
  getStatusColor?: (status: string) => string;
}

export default function ListItemCard({
  item,
  config,
  isSelected,
  onSelect,
  onView,
  getStatusColor,
}: ListItemCardProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePlayPauseClick = async () => {

    const isSchedule = getItemType(item) === "ScheduledTaskItem"

    if (isSchedule) {
      const action = (item as ScheduledTaskItem).pause ? 'resume' : 'pause'

      const response = await fetch(`${API_URL}/schedule/${item.id}/status?status=${action}&update_seq_no=${item.update_seq_no}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });

      if (!response.ok) {
        toast.error("Error Updating Schedule!")
      }
      emitter.emit('refreshScheduleList')
      toast.success("Scheduler Status Updated Successfully!")
    }

  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".checkbox-area, .dropdown-area")) return;
    onView(item.id);
  };

  return (
    <div
      className="relative rounded shadow-sm bg-white hover:shadow-md transition-all p-4 min-h-24 cursor-pointer space-y-3"
      onClick={handleCardClick}
    >
      {/* Selection Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(item.id);
        }}
        className="absolute top-3 right-12 checkbox-area p-1 rounded-full hover:bg-gray-100"
      >
        {isSelected ? (
          <CheckCircle className="h-4 w-4 text-blue-600" />
        ) : (
          <Circle className="h-4 w-4 text-gray-400" />
        )}
      </button>

      {/* Dropdown Menu */}
      <div className="absolute -top-0.5 right-3 dropdown-area" ref={dropdownRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setDropdownOpen(!dropdownOpen);
          }}
          className="p-1 rounded hover:bg-gray-100"
        >
          <MoreHorizontal className="h-5 w-5 text-gray-600" />
        </button>
        {dropdownOpen && (
          <div className="absolute bottom-8 right-0 w-32 bg-white border rounded shadow-md z-10">
            <ul className="py-1 text-sm">
              <li onClick={() => onView(item.id)} className="px-3 py-2 hover:bg-gray-100 cursor-pointer">View</li>
              <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer">Link</li>
              <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer">Delete</li>
            </ul>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col space-y-2">
        <h3 className="font-semibold text-gray-900 -mt-4 w-4/5 line-clamp-1">
          {getItemType(item) === "InvitationItem" ? (item as InvitationItem).email : item.name}
        </h3>

        {(getItemType(item) === "UserItem") && (
          <p className="text-sm text-gray-600">{(item as UserItem).email}</p>
        )}

        {/* Tags */}
        <div className={`flex flex-wrap items-center gap-2 text-xs text-gray-700`}>
          {"type" in item && item.type && (
            <span className={`px-2 py-1 rounded-full ${item.type == 'Flame' ? 'bg-sky-100' : 'bg-gray-100'}`}>{item.type == 'Flame' ? 'IntelQE' : item.type}</span>
          )}
          {"status" in item && item.status && getStatusColor && (
            <span className={`px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>{item.status}</span>
          )}
          {"repeat_schedule" in item && (
            <div className="flex items-center">
              <RefreshCw className="h-4 w-4 mr-2" />
              <span>{item.repeat_schedule ? 'Repeating' : 'One-time'}</span>
            </div>
          )}
          {"completed" in item && getStatusColor && (
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.completed ? 'completed' : 'pending')}`}>
              {item.completed ? 'completed' : 'pending'}
            </span>
          )}

          {"role" in item && (
            <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800">
              {item.role === "admin" ? "Admin" : "User"}
            </span>
          )}
          {"global" in item && (
            <span className={`px-2 py-1 rounded-full ${item.global ? "bg-blue-100 text-blue-800" : "bg-gray-100"}`}>
              {item.global ? "Global" : "Private"}
            </span>
          )}
        </div>

        {/* Description (Truncated) */}
        {(getItemType(item) === "ProjectItem" || getItemType(item) === "KnowledgeItem") && (
          <p className="text-sm text-gray-500 text-xs line-clamp-2 h-8">{item.description}</p>
        )}

        {/* Progress Bar */}
        {"progress" in item && typeof item.progress === "number" && config.showProgress && (
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-blue-600 rounded-full h-1.5" style={{ width: `${item.progress}%` }} />
          </div>
        )}

        {/* Members Count */}
        {"members" in item && config.showMembers && (
          <div className="flex items-center text-xs text-gray-600">
            <Users className="h-4 w-4 mr-1" />
            <span>{item.members} members</span>
          </div>
        )}



        {('repeat_schedule' in item && item.repeat_schedule) ? (
          <>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-2" />
              <span className="text-xs">Start: {item.schStartTime!}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-2" />
              <span className="text-xs">End: {item.runSchTillDate!}</span>
            </div>
          </>
        ) : (
          ('schStartTime' in item) && (
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-2" />
              <span className="text-xs">Execution: {item.schStartTime!}</span>
            </div>
          )
        )}



        {"last_execution_time" in item && (
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-2" />
            <span className="text-xs">Last Run: {item.last_execution_time}</span>
          </div>
        )}
        {"next_execution_time" in item && item.next_execution_time && (
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-2" />
            <span className="text-xs">Next Run: {item.next_execution_time}</span>
          </div>
        )}

        <div className="flex flex-row justify-between">
          {"createdByUser" in item && (
            <div className="flex items-center text-xs text-gray-600">
              <User className="h-4 w-4 mr-1" />
              <span>{item.createdByUser}</span>
            </div>
          )}
          {"createDate" in item && (
            <div className="flex items-center text-xs text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              <span>{item.createDate}</span>
            </div>
          )}
        </div>
        {"pause" in item && (
          <div className="absolute bottom-4 right-4 flex justify-end">
            {/* <div className="flex items-center text-gray-500 mt-2">
              <FolderKanban className="h-4 w-4 mr-1" />
              <span className="text-xs">{item.projectName}</span>
            </div> */}
            {item.pause ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPauseClick();
                }}
                className="p-2 border border-gray-100 shadow-md text-green-600 rounded-full hover:bg-green-50"
                title="Run Now"
              >
                <Play className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayPauseClick();
                }}
                className="p-2 border border-gray-100 shadow-md text-red-600 rounded-full hover:bg-red-50"
                title="Run Now"
              >
                <Pause className="h-4 w-4" />
              </button>
            )}
          </div>)}
      </div>
    </div>
  );
}
