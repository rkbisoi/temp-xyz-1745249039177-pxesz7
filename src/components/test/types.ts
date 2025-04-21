// Mock test logs data structure
export interface TestLog {
  id: number;
  summary: string;
  executionTime: string;
  executedBy: string;
  result: string;
  isActive: boolean;
  updateSeqNo: number;
  createdBy: number;
  updatedBy: number;
  createdByUser: string;
  updatedByUser: string;
  logs: {
    total_tests: number;
    passed_tests: number;
    failed_tests: number;
    total_steps: number;
    passed_steps: number;
    success_rate: string;
  };
  defects: Array<{
    name: string;
    status: string;
    duration: string;
    steps_executed: number;
    steps_passed: number;
    message: string;
  }>;
  passedCases: Array<any>;
}

export interface TestStep {
  input: string,
  value: string,
  action: string,
  locator: string,
  assertion: string,
  description: string
}

export interface TestCase {
  id: number;
  name: string;
  description: string;
  expected_outcome: string;
  suiteId: number;
  type: string;
  steps_json_data: TestStep[];
  updatedAt: string;
  updatedBy: string;
  createdAt: string;
  createdBy: string;
  status: 'Pass' | 'Fail' | 'Pending';
  priority: 'high' | 'medium' | 'low';
  createdByUser: string;
  updatedByUser: string;
}

export interface TestSuite {
  id: number;
  name: string;
  description: string;
  type: string;
  expected_outcome: string;
  update_seq_no: number;
  projectId: number;
  createdAt: string;
  createdBy: number;
  isCustom: boolean;
  isActive: boolean;
  updatedAt: string;
  updatedBy: string;
  testScript: string;
  // testCases: TestCase[];
  // testLogs: TestLog[];
  totalFailed: number;
  totalPassed: number;
  totalTestCases: number;
  totalTestSuiteLogs: number;
  updatedByUser: string;
  createdByUser: string;
}
export interface ExecutionLog {
  execId: number;
  componentIds: number[];
  dataModelIds: number[];
  usedIds: {
    suite_id?: number;
  };
  execTime: string;
  execTimeTaken: number;
  instruction: string;
  knowledgeIds: number[];
  output: string | null;
  projectId: number;
  isScheduleLog: boolean;
  isViewed: boolean;
  createdBy: number;
  is_rerun: number;
  parent_exec_id: number | null;
  childExecutions: ExecutionLog[];
  createdByUser?: string;
}