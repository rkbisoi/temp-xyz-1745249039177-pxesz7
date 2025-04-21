import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { API_URL } from '../../data';
import { getUserId } from '../../utils/storage';
import { ProjectItem, ScheduledTaskItem } from '../../types';
import { fetchAllProjects, getProjectNameById } from '../../services/projectService';
import { convertLocalToGMT } from '../../utils/utils';
import toast from 'react-hot-toast';

export function convertDateTime(input: string): string {
  const inputDate = new Date(input);

  if (isNaN(inputDate.getTime())) {
    console.error("Invalid date input:", input);
    return "";
  }

  return `${inputDate.getDate().toString().padStart(2, '0')}/` +
    `${(inputDate.getMonth() + 1).toString().padStart(2, '0')}/` +
    `${inputDate.getFullYear()} ` +
    `${inputDate.getHours().toString().padStart(2, '0')}:` +
    `${inputDate.getMinutes().toString().padStart(2, '0')}:00`;
}


interface CreateScheduleFormProps {
  schId: number;
  projectId: number,
  contextExecId: number,
  testSuiteId: number,
  isEdit: boolean,
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<ScheduledTaskItem, 'id' | 'status' | 'lastRun'>) => void;
}

export default function CreateScheduleForm({ schId = -1, projectId = -1, contextExecId = -1, testSuiteId = -1, isEdit = false, isOpen, onClose, onSubmit }: CreateScheduleFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    project_id: projectId,
    user_id: -1,
    scheduler_instruction: '',
    execute_after_in_ms: '',
    repeat_schedule: false,
    schStartTime: '',
    runSchTillDate: '',
    contextExecId: contextExecId,
    testSuiteId: testSuiteId
  });

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [updateSeqno, setUpdateSeqNo] = useState<number>(-1);
  const [filteredProjects, setFilteredProjects] = useState<ProjectItem[]>([]);
  const [frequency, setFrequency] = useState(15);
  const [frequencyUnit, setFrequencyUnit] = useState('minutes');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {

        if (isEdit && schId > 0) {
          const response = await fetch(`${API_URL}/schedule/${schId}`, {
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
            // console.log("Scheduler Data : ", data.data)
            const schData = {
              name: data.data.sch_name,
              project_id: data.data.project_id || -1,
              user_id: data.data.user_id || -1,
              scheduler_instruction: data.data.scheduler_instruction,
              execute_after_in_ms: data.data.execute_after_in_ms,
              repeat_schedule: data.data.is_repeating_schedule,
              schStartTime: data.data.sch_start_time || '',
              runSchTillDate: data.data.run_sch_till_date || '',
              contextExecId: data.data.context_exec_id || -1,
              testSuiteId: data.data.test_suite_id || -1
            }

            setUpdateSeqNo(data.data.update_seq_number)

            setFormData(schData);
          } else {
            console.warn("Invalid response structure:", data.data);
          }
        }

      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    }

    fetchData()
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (projectId > 0) {
          const projectName = await getProjectNameById(projectId);
          setProjects([{
            id: projectId,
            name: projectName,
            description: '',
            type: '',
            instruction: '',
            progress: 0,
            members: 0,
            createdBy: 0,
            update_seq_no: 0
          }]);
        } else {
          const fetchedProjects = await fetchAllProjects();

          if (fetchedProjects.length > 0) {
            setProjects(fetchedProjects);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [projectId]);

  useEffect(() => {
    if (projectId === -1) {
      setFilteredProjects(projects); // Load all projects
      setSelectedProject(null);
    } else {
      const selected = projects.find((p) => p.id === projectId);
      if (selected) {
        setFilteredProjects([selected]); // Only show the selected project
        setSelectedProject(selected.id);
      }
    }
  }, [projectId, projects]);

  const handleFrequencyUnitChange = (unit: string) => {
    setFrequencyUnit(unit);
    setFrequency(unit === 'minutes' ? 15 : 1);
  };



  const handleSubmit = async (e: React.FormEvent) => {
    setIsProcessing(true);
    e.preventDefault();
    const selectedProject = projects.find(p => p.id === formData.project_id);
    if (!selectedProject) return;

    const userId = getUserId();
    if (!userId) {
      console.warn("User ID is missing");
      setIsProcessing(false);
      return;
    }

    const requestBody: any = {
      project_id: formData.project_id,
      name: formData.name,
      scheduler_instruction: "Run test cases",
      repeat_schedule: formData.repeat_schedule,
      schStartTime: convertLocalToGMT(convertDateTime(formData.schStartTime)),
      update_seq_number: updateSeqno
    };

    if (formData.repeat_schedule) {
      requestBody.runSchTillDate = convertLocalToGMT(convertDateTime(formData.runSchTillDate));
      requestBody.execute_after_in_ms = (frequency * (frequencyUnit === 'minutes' ? 60000 : frequencyUnit === 'hours' ? 3600000 : 86400000))
    }

    if (formData.contextExecId > 0) {
      requestBody.contextExecId = formData.contextExecId
    }

    if (formData.testSuiteId > 0) {
      requestBody.testSuiteId = formData.testSuiteId
    }

    try {

      if(isEdit && schId>0){
        const response = await fetch(`${API_URL}/schedule/${schId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify(requestBody)
        });

        if(!response.ok){
          toast.error("Error Updating Schedule!")
        }
        const responseData = await response.json();
        setUpdateSeqNo(responseData.data.update_seq_number)
        toast.success("Scheduler Updated Successfully!")
        console.log("Scheduler Created: ", responseData);
        setIsProcessing(false);
        onClose()
      }else{
        const response = await fetch(`${API_URL}/create-schedule`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify(requestBody)
        });

        if(!response.ok){
          toast.error("Error Creating Schedule!")
        }
        const responseData = await response.json();
        toast.success("Scheduler Created Successfully!")
        console.log("Scheduler Created: ", responseData);
        setIsProcessing(false);
        onClose()
      }
    } catch (error) {
      console.error("Error creating schedule:", error);
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-intelQEDarkBlue">Schedule New Task</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                placeholder="Enter task name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="grid grid-cols-2 gap-2  justify-between items-center my-2 mt-4 gap-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">Project</label>
                {/* <select
                  value={formData.project_id}
                  onChange={(e) => setFormData({ ...formData, project_id: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-intelQEDarkBlue focus:outline-none focus:ring-1 focus:ring-intelQEDarkBlue"
                  required
                  disabled={projectId > 0}
                >
                  {projectId === -1 && <option value="">Select Project</option>}
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select> */}
                <select
                  value={selectedProject ?? ""}
                  onChange={(e) => setSelectedProject(Number(e.target.value))}
                  disabled={projectId !== -1} // Disable dropdown if projectId is not -1
                >
                  {filteredProjects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>


              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">Instructions</label>
                <select
                  value={formData.scheduler_instruction}
                  onChange={(e) => setFormData({ ...formData, scheduler_instruction: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-intelQEDarkBlue focus:outline-none focus:ring-1 focus:ring-intelQEDarkBlue"
                  required
                >
                  <option value="master">Master Instructions</option>
                  <option value="instruction-1">Custom Instructions 1</option>
                  <option value="instruction-2">Custom Instructions 2</option>
                </select>
              </div>
            </div>


            <div className="flex items-center">
              <input
                type="checkbox"
                id="isRepeat"
                checked={formData.repeat_schedule}
                onChange={(e) => setFormData({ ...formData, repeat_schedule: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-intelQEDarkBlue focus:ring-intelQEDarkBlue"
              />
              <label htmlFor="isRepeat" className="ml-2 block text-sm text-gray-700">
                Repeat Task
              </label>
            </div>

            {formData.repeat_schedule ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Time</label>
                  <input
                    type="datetime-local"
                    value={formData.schStartTime}
                    onChange={(e) => setFormData({ ...formData, schStartTime: e.target.value })}
                    onBlur={(e) => e.target.blur()} // Close the date picker
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-intelQEDarkBlue focus:outline-none focus:ring-1 focus:ring-intelQEDarkBlue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Time</label>
                  <input
                    type="datetime-local"
                    value={formData.runSchTillDate}
                    onChange={(e) => setFormData({ ...formData, runSchTillDate: e.target.value })}
                    onBlur={(e) => e.target.blur()} // Close the date picker
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-intelQEDarkBlue focus:outline-none focus:ring-1 focus:ring-intelQEDarkBlue"
                    required
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700">Execution Time</label>
                <input
                  type="datetime-local"
                  value={formData.schStartTime}
                  onChange={(e) => setFormData({ ...formData, schStartTime: e.target.value })}
                  onBlur={(e) => e.target.blur()} // Close the date picker
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-intelQEDarkBlue focus:outline-none focus:ring-1 focus:ring-intelQEDarkBlue"
                  required
                />
              </div>
            )}
          </div>

          {formData.repeat_schedule && (
            <div className="flex flex-row justify-between items-center my-2 mt-4 gap-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">Frequency</label>

                <input
                  type="number"
                  value={frequency}
                  onChange={(e) => setFrequency(parseInt(e.target.value))}
                  className="w-full mt-2 px-4 py-2 border border-background rounded"
                // disabled={!isEdit}
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">Frequency Unit</label>
                <select
                  value={frequencyUnit}
                  onChange={(e) => handleFrequencyUnitChange(e.target.value)}
                  className="w-full mt-2 px-4 py-2 border border-background rounded"
                // disabled={!isEdit}
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
          )}


          <div className="mt-6 flex justify-between space-x-3">
            <button type="button" onClick={onClose} className="btn2">Cancel</button>
            {!isEdit ? (
                <button type="submit" className="btn1" disabled={isProcessing}>{`${isProcessing ? 'Processing..': 'Schedule Task'}`}</button>
              ):(
                <button type="submit" className="btn1" disabled={isProcessing}>{`${isProcessing ? 'Processing..': 'Update Task'}`}</button>
              )}
          </div>
        </form>
      </div>
    </div>
  );
}
