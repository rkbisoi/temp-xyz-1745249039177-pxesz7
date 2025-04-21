// import { useEffect, useState } from 'react';
// import { Clock, Calendar, RefreshCw, Play, Trash2, Eye } from 'lucide-react';
// import { ScheduledTask } from './types';
// import CreateScheduleForm from './CreateScheduleForm';
// // import { getStatusColor } from '../../utils/utils';
// import { getUserId } from '../../utils/storage';
// import { API_URL } from '../../data';
// import toast from 'react-hot-toast';

// export default function SchedulerList() {
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   // const [tasks, setTasks] = useState<ScheduledTask[]>(scheduledTasks);
//   const [tasks, setSchedules] = useState<ScheduledTask[]>([]);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'scheduled':
//         return 'bg-blue-100 text-blue-800';
//       case 'running':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'active':
//         return 'bg-green-100 text-green-800';
//       case 'completed':
//         return 'bg-green-100 text-green-800';
//       case 'failed':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const userId = getUserId();
//         if (!userId) {
//           console.warn("User ID is missing");
//           return;
//         }

//         var url = `${API_URL}/schedules`

//         // if (projId > 0) {
//         //   url = `${API_URL}/projects/${projId}/testdata`
//         // }

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
//         console.log("Schedule List Response:", data.data);

//         if (data?.data && Array.isArray(data.data)) {
//           const convertedSchedules: ScheduledTask[] = data.data.map((sch: any) => ({
//             id: sch.sch_id,
//             project_id: sch.project_id,
//             user_id: sch.user_id,
//             scheduler_instruction: sch.scheduler_instruction,
//             execute_after_in_ms: sch.execute_after_in_ms,
//             repeat_schedule: sch.is_repeating_schedule,
//             schStartTime: sch.sch_start_time,
//             runSchTillDate: sch.run_sch_till_date,
//             last_execution_time: sch.last_execution_time,
//             active: sch.active,
//             created_date: sch.created_date,
//             last_execution_status: sch.last_execution_status,
//             next_execution_time: sch.next_execution_time,
//             updated_by: sch.updated_by,
//             update_seq_number: sch.update_seq_number,
//             is_repeating_schedule: sch.repeat_schedule,
//             pause: sch.pause,
//             contextExecId: sch.context_exec_id,
//             testSuiteId: sch.test_suite_id,
//             completed: sch.completed
//           }));

//           setSchedules(convertedSchedules);
//         } else {
//           console.warn("Invalid response structure:", data);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleDeleteTask = (taskId: number) => {
//     toast.error("Delete Schedule")
//     // setTasks(tasks.filter(task => task.id !== taskId));
//   };

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Scheduled Tasks</h1>
//         <button
//           onClick={() => setIsFormOpen(true)}
//           className="btn1"
//         >
//           Schedule New Task
//         </button>
//       </div>

//       <div className="space-y-4">
//         {tasks.map((task) => (
//           <div
//             key={task.id}
//             className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
//           >
//             <div className="flex justify-between items-start">
//               <div>
//                 {/* <h3 className="text-lg font-semibold text-gray-900">{task.projectName}</h3> */}
//                 <p className="text-sm text-gray-600 mt-1">Instruction: {task.scheduler_instruction}</p>
//               </div>
//               {/* <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
//                 {task.status}
//               </span> */}
//               <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.completed ? 'completed' : 'pending')}`}>
//                 {task.completed ? 'completed' : 'pending'}
//               </span>
//             </div>

//             <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
//               <div className="flex items-center">
//                 <RefreshCw className="h-4 w-4 mr-2" />
//                 <span>{task.repeat_schedule ? 'Repeating' : 'One-time'}</span>
//               </div>
//               {task.repeat_schedule ? (
//                 <>
//                   <div className="flex items-center">
//                     <Calendar className="h-4 w-4 mr-2" />
//                     <span>Start: {new Date(task.schStartTime!).toLocaleString()}</span>
//                   </div>
//                   <div className="flex items-center">
//                     <Calendar className="h-4 w-4 mr-2" />
//                     <span>End: {new Date(task.runSchTillDate!).toLocaleString()}</span>
//                   </div>
//                 </>
//               ) : (
//                 <div className="flex items-center">
//                   <Clock className="h-4 w-4 mr-2" />
//                   <span>Execution: {new Date(task.schStartTime!).toLocaleString()}</span>
//                 </div>
//               )}
//               {task.last_execution_time && (
//                 <div className="flex items-center">
//                   <Clock className="h-4 w-4 mr-2" />
//                   <span>Last Run: {new Date(task.last_execution_time).toLocaleString()}</span>
//                 </div>
//               )} 
//               {task.next_execution_time && (
//                 <div className="flex items-center">
//                   <Clock className="h-4 w-4 mr-2" />
//                   <span>Next Run: {new Date(task.next_execution_time).toLocaleString()}</span>
//                 </div>
//               )}
//             </div>

//             <div className="mt-4 flex justify-end space-x-2">
//               <button
//                 className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-blue-50"
//                 title="View Details"
//               >
//                 <Eye className="h-5 w-5" />
//               </button>
//               <button
//                 className="p-2 text-gray-600 hover:text-green-600 rounded-full hover:bg-green-50"
//                 title="Run Now"
//               >
//                 <Play className="h-5 w-5" />
//               </button>
//               <button
//                 onClick={() => handleDeleteTask(task.id)}
//                 className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-red-50"
//                 title="Delete"
//               >
//                 <Trash2 className="h-5 w-5" />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       <CreateScheduleForm
//         isOpen={isFormOpen}
//         onClose={() => setIsFormOpen(false)}
//         onSubmit={(newTask: any) => {
//           // setTasks([...tasks, { ...newTask, id: tasks.length + 1 }]);
//           setIsFormOpen(false);
//         }}
//       />
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { ScheduledTaskItem } from '../../types';
import CreateScheduleForm from './CreateScheduleForm';
import ListView from '../shared/ListView';
import { ListConfig } from '../shared/types';
import SchedulerDetail from './SchedulerDetail';
import { getUserId } from '../../utils/storage';
import { API_URL } from '../../data';
import { convertGMTToLocal2 } from '../../utils/utils';
import { emitter } from '../../utils/eventEmitter';

const schedulerConfig: ListConfig = {
  title: 'Scheduled Tasks',
  addButtonText: 'Schedule New Task',
  searchPlaceholder: 'Search tasks...',
  itemsName: 'tasks',
  showStatus: true,
  showSchedule: true,
  statusOptions: ['scheduled', 'running', 'completed', 'failed'],
  sortOptions: [
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status' },
    { key: 'nextRun', label: 'Next Run' }
  ],
  bulkActions: [
    // { label: 'Run Now', action: 'run', icon: <Play className="h-4 w-4" /> },
    { label: 'Delete', action: 'delete', icon: <Trash2 className="h-4 w-4" /> },
    // { label: 'Schedule', action: 'schedule', icon: <CalendarClock className="h-4 w-4" /> }
  ]
};

interface SchedulerListProps {
  // onTaskView?: (id: number) => void; 
  defaultView?: 'grid' | 'list';
  projId: number;
}

export default function SchedulerList({
  // onTaskView = () => {}, 
  defaultView = 'grid',
  projId = -1,
}: SchedulerListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  // const [tasks, setTasks] = useState<ScheduledTaskItem[]>(mockTasks);
  const [tasks, setTasks] = useState<ScheduledTaskItem[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = getUserId();
        if (!userId) {
          console.warn("User ID is missing");
          return;
        }

        var url = `${API_URL}/schedules`

        if (projId > 0) {
          url = `${API_URL}/schedules/project/${projId}`
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
        // console.log("Schedule List Response:", data.data);

        if (data?.data && Array.isArray(data.data)) {
          const convertedSchedules: ScheduledTaskItem[] = data.data.map((sch: any) => ({
            id: sch.sch_id,
            name: sch.sch_name || "Sample 1",
            project_id: sch.project_id,
            user_id: sch.user_id,
            scheduler_instruction: sch.scheduler_instruction,
            execute_after_in_ms: sch.execute_after_in_ms,
            repeat_schedule: sch.is_repeating_schedule,
            schStartTime: sch.sch_start_time ? convertGMTToLocal2(sch.sch_start_time) : sch.sch_start_time,
            runSchTillDate: sch.run_sch_till_date ? convertGMTToLocal2(sch.run_sch_till_date) : sch.run_sch_till_date,
            last_execution_time: sch.last_execution_time ? convertGMTToLocal2(sch.last_execution_time) : sch.last_execution_time,
            active: sch.active,
            created_date: sch.created_date,
            last_execution_status: sch.last_execution_status,
            next_execution_time: sch.next_execution_time ? convertGMTToLocal2(sch.next_execution_time) : sch.next_execution_time,
            updated_by: sch.updated_by,
            update_seq_no: sch.update_seq_number,
            is_repeating_schedule: sch.repeat_schedule,
            pause: sch.pause,
            contextExecId: sch.context_exec_id,
            testSuiteId: sch.test_suite_id,
            completed: sch.completed
          }));

          setTasks(convertedSchedules);
        } else {
          console.warn("Invalid response structure:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    emitter.on('refreshScheduleList', () => {
      fetchData();
    });
  }, []);


  const handleRunTask = async (taskId: number) => {
    // Implement task execution logic here
    console.log('Running task:', taskId);
  };

  const handleTaskView = (taskId: number) => {
    setSelectedTaskId(taskId);
  };

  if (selectedTaskId) {
    const task = tasks.find(t => t.id === selectedTaskId);
    if (task) {
      return (
        <SchedulerDetail
          task={task}
          onBack={() => setSelectedTaskId(null)}
          onRun={() => handleRunTask(task.id)}
        />
      );
    }
  }

  return (
    <div>
      <ListView
        items={tasks}
        config={schedulerConfig}
        onItemView={handleTaskView}
        onAddItem={() => setIsFormOpen(true)}
        defaultView={defaultView}
        projectId={-1}
      />

      <CreateScheduleForm
        schId={-1}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={() => {
          // setTasks([...tasks, { ...newTask, id: tasks.length + 1 }]);
          setIsFormOpen(false);
        }}
        projectId={projId}
        contextExecId={0}
        testSuiteId={0}
        isEdit={false}
      />
    </div>
  );
}