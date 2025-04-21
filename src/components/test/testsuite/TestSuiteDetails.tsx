import { useEffect, useState } from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle, PlayCircle, ArrowLeft, Code, Play } from 'lucide-react';
import { TestSuite, TestCase } from '../types';
import { getTimeAgo, convertGMTToLocal, getTestSuiteStatus, getStatusBadgeColor } from '../../../utils/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../shared/Tabs';
import TestCaseDetail from '../testCase/TestCaseDetail';
import TestScriptDetail from '../TestScriptDetail';
import TestCaseList from '../testCase/TestCaseList2';
import TestLogList from '../testLog/TestLogList2';
import { useTestRunner } from '../testInterface/TestRunner';
import toast from 'react-hot-toast';


interface TestSuiteDetailsProps {
  suite: TestSuite;
  onBack: () => void;
}

export default function TestSuiteDetails({ suite, onBack }: TestSuiteDetailsProps) {
  const [activeTab, setActiveTab] = useState('test-cases');
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);
  const [isScriptOpen, setScriptOpen] = useState<boolean>(false)
  const { runTest } = useTestRunner();
  const [projectId, setProjectId] = useState<number>(-1);
  const [testSuiteId, setTestSuiteId] = useState<number>(-1);

  useEffect(() => {
    if (suite) {
      setProjectId(suite.projectId);
      setTestSuiteId(suite.id);
    }
  }, [suite]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Passed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'Failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'Pending':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'Running':
        return <PlayCircle className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const handleRunTest = async () => {
    try {
      await runTest({
        projectId: projectId,
        instructionContent: "execute test suite and generate summary report",
        instructionLabel: "master",
        testSuiteId: testSuiteId
      });
      toast.success('Test started successfully');
    } catch (error) {
      toast.error('Failed to start test');
    }
  };


  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Test Suites
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getStatusIcon(getTestSuiteStatus(suite))}
            <h3 className="text-xl font-bold text-gray-900">{suite.name}</h3>
          </div>

          <div className='flex flex-row justify-between'>
            <div className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
              <span className={`px-2 py-1 rounded-full ${getStatusBadgeColor(getTestSuiteStatus(suite))}`}>
                {getTestSuiteStatus(suite)}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Last Run: {getTimeAgo(convertGMTToLocal(suite.createdAt))}</span>
            </div>
          </div>

        </div>

        <p className="text-gray-600 mb-6">{suite.description}</p>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gray-50 py-2 px-4 rounded-lg">
            <div className="text-sm text-gray-500">Total Test Cases</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{suite.totalTestCases}</div>
          </div>
          <div className="bg-gray-50 py-2 px-4 rounded-lg">
            <div className="text-sm text-gray-500">Total Logs</div>
            <div className='flex flex-row justify-between'>
              <div className="text-2xl font-bold text-gray-900 mt-1">{suite.totalTestSuiteLogs}</div>
              <div className="flex flex-col text-sm">
                <div className='inline-flex justify-between'>
                  <span className="text-green-600 mr-2">Pass: </span>
                  <span className="text-green-600 mr-2">{suite.totalPassed}</span>
                </div>
                <div className='inline-flex justify-between'>
                  <span className="text-red-600 mr-2">Fail: </span>
                  <span className="text-red-600 mr-2">{suite.totalFailed}</span>
                </div>

              </div>
            </div>

          </div>
          <div className="bg-gray-50 py-2 px-4 rounded-lg">
            <div className="text-sm text-gray-500">Created By</div>
            <div className="text-md font-bold text-gray-900 mt-3">{suite.createdByUser}</div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className='mb-2 flex justify-between'>
            <TabsList>
              {/* <TabsTrigger value="test-cases">{`Test Cases (${suite.totalTestCases})`}</TabsTrigger>
              <TabsTrigger value="test-logs">{`Test Logs (${suite.totalTestSuiteLogs})`}</TabsTrigger> */}
              <TabsTrigger value="test-cases">{`Test Cases`}</TabsTrigger>
              <TabsTrigger value="test-logs">{`Test Logs`}</TabsTrigger>
            </TabsList>
            <div className='flex flex-row justify-between'>
              <button
                className={`flex flex-row justify-center border border-green-600 items-center justify-center rounded px-3 py-1 text-sm font-medium bg-green-50 w-24`}
                onClick={() => setScriptOpen(true)}
              >
                <Code className="h-5 w-5 text-sm font-bold text-green-600 mr-2" />
                <div className="text-sm font-bold text-green-600"> Script</div>
              </button>
              <button
                onClick={handleRunTest}

                className="ml-2 flex flex-row items-center justify-center py-1 px-2 border border-intelQEDarkBlue rounded text-sm font-medium text-white bg-intelQEDarkBlue hover:bg-white hover:text-intelQEDarkBlue w-40"
              >
                <>
                  <Play className="h-5 w-5" />
                  <span className="ml-2">Run Test Suite</span>
                </>
              </button>
            </div>
          </div>
          <TabsContent value="test-cases">
            <TestCaseList testSuiteId={suite.id} />
          </TabsContent>

          <TabsContent value="test-logs">
            <TestLogList testSuiteId={suite.id} />
          </TabsContent>

        </Tabs>
      </div>

      {selectedTestCase && (
        <TestCaseDetail
          testCase={selectedTestCase}
          onClose={() => setSelectedTestCase(null)}
        />
      )}

      {isScriptOpen && (<TestScriptDetail testScript={suite.testScript} onClose={() => setScriptOpen(false)} />)}
    </div>
  );
}