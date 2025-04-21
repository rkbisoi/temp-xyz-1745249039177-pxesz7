import { useState } from 'react';
import { formatDateToId } from '../../../utils/utils';
import { useTestExecution } from '../../../contexts/TestExecutionContext';
import { getProjectNameById } from '../../../services/projectService';
import toast from 'react-hot-toast';
import { TestExecution } from './types';
import { LLM_URL, LLM_WEBSOCKET_URL } from '../../../data';

// Define interface for the runTest parameters
interface RunTestParams {
  projectId: number;
  instructionContent: string;
  instructionLabel: string;
  dataId?: number;
  testName?: string;
  testSuiteId?: number,
  scheduleId?: number,
  executionId?: number,
}

// Define the return type for runTest
interface RunTestResult {
  testId: string;
  execution_id: string;
}

export function useTestRunner() {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const { setActiveTests, setSelectedTestId, setMinimizedTests } = useTestExecution();

  const runTest = async ({
    projectId,
    instructionContent,
    instructionLabel,
    testSuiteId = -1,
    scheduleId = -1,
    dataId = -1,
    executionId = -1,
    testName = `Test Run ${formatDateToId()}`
  }: RunTestParams): Promise<RunTestResult> => {
    setIsRunning(true);
    const testId = Date.now().toString();
    
    try {
      const projectName = await getProjectNameById(projectId);

      const newTest: TestExecution = {
        id: testId,
        exec_id: '',
        name: testName,
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

      const response = await fetch(`${LLM_URL}/start_task/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          instruction: instructionContent,
          instruction_label: instructionLabel,
          dataId: dataId,
          prjId: projectId,
          testSuiteId: testSuiteId,
          scheduleId: scheduleId,
          executionId: executionId
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
              
              if(testSuiteId && testSuiteId > 0){
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
            } else if (message.startsWith("[WSS]-[END_OF_MESSAGE_SUCCESS]")) {
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
        setIsRunning(false);
      };

      socket.onclose = () => {
        console.log('WebSocket connection closed');
        setIsRunning(false);
      };

      return { testId, execution_id };
    } catch (error) {
      console.error('Error starting test:', error);
      toast.error('Failed to start test');
      setActiveTests(prev => prev.map(t =>
        t.id === testId
          ? { ...t, status: 'error', endTime: new Date() }
          : t
      ));
      setIsRunning(false);
      throw error;
    }
  };

  return {
    runTest,
    isRunning
  };
}