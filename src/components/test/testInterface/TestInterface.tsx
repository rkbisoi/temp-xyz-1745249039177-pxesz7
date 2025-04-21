import { useEffect, useState } from 'react';
import { CalendarDays, Loader2, Play, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { TestExecution } from './types';
import { API_URL, LLM_URL, LLM_WEBSOCKET_URL } from '../../../data';
import { formatDateToId } from '../../../utils/utils';
import InstructionTabs from '../InstructionTabs';
import CreateScheduleForm from '../../scheduler/CreateScheduleForm';
import { useTestExecution } from '../../../contexts/TestExecutionContext';
import { getProjectNameById } from '../../../services/projectService';
import { ProjectItem } from '../../../types';
import { getProjectById } from '../../../services/projectService';

interface TestingInterfaceProps {
  projectId: number;
  project: ProjectItem | undefined;
}

interface TestConfig {
  application: string;
  testType: string;
  section: string;
  testData: string;
  additionalPrompt: string;
}

interface Instruction {
  id: string;
  content: string;
}

export default function TestInterface({ projectId, project }: TestingInterfaceProps) {
  const [config, setConfig] = useState<TestConfig>({
    application: '',
    testType: '',
    section: '',
    testData: '',
    additionalPrompt: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [selectedInstruction, setSelectedInstruction] = useState('Master');
  const [instructionContents, setInstructionContents] = useState<Instruction[]>(
    [{ id: 'Master', content: '' }] // Default value
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const { setActiveTests, setSelectedTestId, setMinimizedTests } = useTestExecution();

  // Load instructions when project changes
  useEffect(() => {
    if (project?.instruction) {
      try {
        const parsedInstructions = JSON.parse(project.instruction);
        setInstructionContents(parsedInstructions);
        // Select the first instruction by default
        if (parsedInstructions.length > 0) {
          setSelectedInstruction(parsedInstructions[0].id);
        }
      } catch (error) {
        console.error("Error parsing project instructions:", error);
        // Fallback to default
        setInstructionContents([{ id: 'Master', content: '' }]);
      }
    }
  }, [project]); // Only depend on project, not project.instruction

  const handleInstructionContentChange = (id: string, content: string) => {
    setInstructionContents(prev => {
      // Check if the instruction with this id already exists
      const existingIndex = prev.findIndex(inst => inst.id === id);

      if (existingIndex >= 0) {
        // Update existing instruction
        return prev.map(inst =>
          inst.id === id ? { ...inst, content } : inst
        );
      } else {
        // Add new instruction
        return [...prev, { id, content }];
      }
    });
  };

  const saveInstructions = async () => {
    setIsSaving(true);
    try {
      // Fetch the latest project data to get the current update_seq_no
      const latestProject = await getProjectById(projectId);

      if (!latestProject) {
        throw new Error("Failed to fetch latest project data");
      }

      const response = await fetch(`${API_URL}/projects/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          projectId: projectId,
          update_seq_no: latestProject.update_seq_no,
          instruction: JSON.stringify(instructionContents)
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      toast.success('Instructions saved successfully');
    } catch (error) {
      console.error('Error saving instructions:', error);
      toast.error('Failed to save instructions');
    } finally {
      setIsSaving(false);
    }
  };

  const runTests = async () => {
    const testId = Date.now().toString();
    const projectName = await getProjectNameById(projectId);

    const newTest: TestExecution = {
      id: testId,
      exec_id: '',
      name: `Test Run ${formatDateToId()}`,
      status: 'running',
      steps: [],
      startTime: new Date(),
      projectId,
      projectName
    };

    setActiveTests(prev => [...prev, newTest]);
    setSelectedTestId(testId);
    setMinimizedTests(prev => {
      const updated = new Set(prev);
      updated.delete(testId);
      return updated;
    });

    try {
      const response = await fetch(`${LLM_URL}/start_task/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          instruction: instructionContents.find(inst => inst.id === selectedInstruction)?.content,
          instruction_label: selectedInstruction,
          dataId: -1,
          prjId: projectId
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const execution_id = data.execution_id;

      const socket = new WebSocket(`${LLM_WEBSOCKET_URL}/ws/${execution_id}`);

      socket.onmessage = (event) => {
        const message = event.data;

        setActiveTests(prev => {
          const testIndex = prev.findIndex(t => t.id === testId);
          if (testIndex === -1) return prev;

          const updatedTest = { ...prev[testIndex] };

          updatedTest.exec_id = execution_id;

          if (message.startsWith("[WSS]-") && !message.startsWith("[WSS]-[ERROR]") && !message.startsWith("[WSS]-[EXECUTION_STARTED]")) {
            const [_, flag, rawTitle] = message.split(/-\s*/);
            const stepId = flag.toLowerCase();
            const title = rawTitle || flag;

            if(message.startsWith("[WSS]-[DATA]")){
              const testSuiteId = message.lastIndexOf('-') === -1 ? null : !isNaN(Number(message.slice(message.lastIndexOf('-') + 1))) ? Number(message.slice(message.lastIndexOf('-') + 1)) : null;
              // extractTestSuiteId(message)
              if(testSuiteId && testSuiteId>0){
                if (updatedTest.steps.length > 0) {
                  updatedTest.steps[updatedTest.steps.length - 1].status = 'completed';
                }
                updatedTest.steps.push({
                  id: '[test_suite]',
                  title: `Test Suite ID - ${testSuiteId}`,
                  status: 'processing',
                  output: []
                });
              }
            }else if (message.startsWith("[WSS]-[END_OF_MESSAGE_SUCCESS]")) {
              if (updatedTest.steps.length > 0) {
                updatedTest.steps[updatedTest.steps.length - 1].status = 'completed';
              }
              updatedTest.status = 'completed';
              updatedTest.endTime = new Date();
            } else {
              if (updatedTest.steps.length > 0) {
                updatedTest.steps[updatedTest.steps.length - 1].status = 'completed';
              }
              updatedTest.steps.push({
                id: stepId,
                title,
                status: 'processing',
                output: []
              });
            }
          } else if (message.startsWith("[WSS]-[ERROR]")) {
            if (updatedTest.steps.length > 0) {
              updatedTest.steps[updatedTest.steps.length - 1].status = 'error';
            }
            updatedTest.status = 'error';
            updatedTest.endTime = new Date();
          } else {
            if (updatedTest.steps.length > 0) {
              const currentStep = updatedTest.steps[updatedTest.steps.length - 1];
              currentStep.output.push(message);
            }
          }

          return [
            ...prev.slice(0, testIndex),
            updatedTest,
            ...prev.slice(testIndex + 1)
          ];
        });
      };

      socket.onerror = () => {
        setActiveTests(prev => prev.map(t =>
          t.id === testId
            ? { ...t, status: 'error', endTime: new Date() }
            : t
        ));
      };

      socket.onclose = () => {
        console.log('WebSocket connection closed');
      };

    } catch (error) {
      console.error('Error starting test:', error);
      toast.error('Failed to start test');
      setActiveTests(prev => prev.map(t =>
        t.id === testId
          ? { ...t, status: 'error', endTime: new Date() }
          : t
      ));
    }
  };

  return (
    <div className="max-h-screen">
      <div className="max-w-full mx-auto">
        <div className={`bg-white rounded shadow-sm p-4 mb-4 transition-all duration-500 relative border border-gray-100`}>
          <div className={`mb-4 transition-all duration-500 block`}>
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-4 w-1/3">
                <div>
                  <label htmlFor="application" className="block text-sm font-medium text-gray-700">
                    Application
                  </label>
                  <select
                    id="application"
                    className="mt-1 block w-full rounded p-2 text-sm border border-gray-400 shadow-sm focus:border-intelQEDarkBlue focus:ring-intelQEDarkBlue"
                    value={config.application}
                    onChange={(e) => setConfig((c) => ({ ...c, application: e.target.value }))}
                  >
                    <option value="">Application 1</option>
                    <option value="web">Application 2</option>
                    <option value="mobile">Application 3</option>
                    <option value="api">Application 4</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="testType" className="block text-sm font-medium text-gray-700">
                    Test Type
                  </label>
                  <select
                    id="testType"
                    className="mt-1 block w-full rounded p-2 text-sm border border-gray-400 shadow-sm focus:border-intelQEDarkBlue focus:ring-intelQEDarkBlue"
                    value={config.testType}
                    onChange={(e) => setConfig((c) => ({ ...c, testType: e.target.value }))}
                  >
                    <option value="functional">Functional Testing</option>
                    <option value="load">Load Testing</option>
                    <option value="unit">Unit Testing</option>
                    <option value="integration">Integration Testing</option>
                    <option value="e2e">End-to-End Testing</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="section" className="block text-sm font-medium text-gray-700">
                    Application Section
                  </label>
                  <input
                    id="section"
                    type="text"
                    className="mt-1 block w-full rounded p-2 text-sm border border-gray-400 shadow-sm focus:border-intelQEDarkBlue focus:ring-intelQEDarkBlue"
                    placeholder="e.g., Authentication, Dashboard, API Endpoints"
                    value={config.section}
                    onChange={(e) => setConfig((c) => ({ ...c, section: e.target.value }))}
                  />
                </div>

                <div>
                  <label htmlFor="testData" className="block text-sm font-medium text-gray-700">
                    Test Data
                  </label>
                  <select
                    id="testData"
                    className="mt-1 block w-full rounded p-2 text-sm border border-gray-400 shadow-sm focus:border-intelQEDarkBlue focus:ring-intelQEDarkBlue"
                    value={config.testData}
                    onChange={(e) => setConfig((c) => ({ ...c, testData: e.target.value }))}
                  >
                    <option value="">Data 1</option>
                    <option value="unit">Data 2</option>
                    <option value="integration">Data 3</option>
                  </select>
                </div>
              </div>

              <div className="w-full w-2/3 h-[480px]">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Test Instructions
                  </label>
                  <button
                    onClick={saveInstructions}
                    disabled={isSaving}
                    className="flex text-sm items-center justify-center py-0.5 px-1.5 border border-intelQEDarkBlue rounded shadow-sm text-sm font-medium text-intelQEDarkBlue bg-white hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-intelQEDarkBlue disabled:bg-gray-200 disabled:text-gray-500 transition-all duration-500"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-1" />
                        <span>Saving...</span>
                      </>

                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-1" />
                        <span>Save</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="border rounded h-[440px]">
                  <InstructionTabs
                    selectedInstruction={selectedInstruction}
                    onInstructionChange={setSelectedInstruction}
                    onInstructionContentChange={handleInstructionContentChange}
                    instructionContents={instructionContents}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-between gap-4 mt-1">
            <button
              onClick={() => setIsFormOpen(true)}
              className="flex items-center justify-center py-2 px-4 border border-intelQEDarkBlue rounded shadow-sm text-sm font-medium text-intelQEDarkBlue bg-white hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-intelQEDarkBlue disabled:bg-sky-400 transition-all duration-500 w-full"
            >
              <CalendarDays className="h-5 w-5" />
              <span className="ml-2">Schedule Task ({selectedInstruction})</span>
            </button>
            <button
              onClick={runTests}
              className="flex items-center justify-center py-2 px-4 border border-transparent rounded text-sm font-medium text-white bg-intelQEDarkBlue hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-intelQEDarkBlue disabled:bg-gray-200 disabled:text-gray-700 w-full min-w-[300px]"
            >
              <Play className="h-5 w-5" />
              <span className="ml-2">Start Testing ({selectedInstruction})</span>
            </button>
          </div>
        </div>
      </div>

      <CreateScheduleForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={() => {
          setIsFormOpen(false);
        } }
        projectId={projectId}
        contextExecId={0}
        testSuiteId={0}
        isEdit={false} 
        schId={-1}      
        />
    </div>
  );
}