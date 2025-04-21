import { ArrowLeft, Clock, Edit, FolderKanban, Play, RefreshCw } from 'lucide-react';
import { ScheduledTaskItem } from '../../types';
import ExecutionLogList from '../test/executionLog/ExecutionLog';
import { useEffect, useState } from 'react';
import { getProjectNameById } from '../../services/projectService';
import CreateScheduleForm from './CreateScheduleForm';

interface SchedulerDetailProps {
  task: ScheduledTaskItem;
  onBack: () => void;
  onRun: () => void;
}

export default function SchedulerDetail({ task, onBack, onRun }: SchedulerDetailProps) {
  const [projectName, setProjectName] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (task.project_id) {
      getProjectNameById(task.project_id)
        .then(setProjectName)
        .catch(() => setProjectName("Unknown/Deleted Project"));
    }
  }, [task]);

  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Scheduler
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{task.name}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <FolderKanban className="h-4 w-4 mr-1" />
                <span>{projectName}</span>
              </div>
              <div className="flex items-center">
                <RefreshCw className="h-4 w-4 mr-1" />
                <span>{task.repeat_schedule ? 'Recurring' : 'One-time'}</span>
              </div>
            </div>
          </div>
          <div className='flex flex-row justify-end space-x-2 h-8'>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center text-sm px-2 py-2 bg-intelQEDarkBlue text-white rounded hover:bg-sky-700"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button
            onClick={onRun}
            className="flex items-center text-sm px-2 py-1 bg-intelQEDarkBlue text-white rounded hover:bg-sky-700"
          >
            <Play className="h-4 w-4 mr-2" />
            Run Now
          </button>
          </div>
          
        </div>

        <p className="text-gray-600 mb-6">{task.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Schedule Information</h3>
            <div className="space-y-2">
              {task.repeat_schedule ? (
                <>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600">Start: {new Date(task.schStartTime!).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600">End: {new Date(task.runSchTillDate!).toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-600">Execution: {new Date(task.schStartTime!).toLocaleString()}</span>
                </div>
              )}
              {task.last_execution_time && (
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-600">Last Run: {new Date(task.last_execution_time).toLocaleString()}</span>
                </div>
              )}
              {task.next_execution_time && (<div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-600">Next Run: {new Date(task.next_execution_time).toLocaleString()}</span>
              </div>)}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">Task Instructions</h3>
            <p className="text-sm text-gray-600">{task.scheduler_instruction}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <ExecutionLogList projectId={-1} executionId={task.id} />
        </div>
      </div>
      <CreateScheduleForm
        schId = {task.id}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={() => {
          setIsFormOpen(false);
        }}
        projectId={task.project_id}
        contextExecId={-1}
        testSuiteId={-1}
        isEdit={true}
      />
    </div>
  );
}