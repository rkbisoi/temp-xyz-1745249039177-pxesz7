interface TestCase {
    id: string;
    name: string;
    status: 'passed' | 'failed' | 'pending' | 'running';
    duration: string;
    lastRun: string;
    priority: 'high' | 'medium' | 'low';
    assignee: string;
  }
  
  interface TestSuite {
    id: string;
    name: string;
    description: string;
    status: 'passed' | 'failed' | 'pending' | 'running';
    lastRun: string;
    totalTests: number;
    passed: number;
    failed: number;
    pending: number;
    testCases: TestCase[];
    user: string;
    date: string;
  }

export const mockTestSuites: TestSuite[] = [
  {
    id: '1',
    name: 'Authentication Test Suite',
    description: 'Tests covering user authentication flows including login, registration, and password reset',
    status: 'passed',
    lastRun: '2h ago',
    totalTests: 15,
    passed: 13,
    failed: 0,
    pending: 2,
    user: 'John Doe',
    date: '2024-03-10',
    testCases: [
      {
        id: 'TC1',
        name: 'User Login with Valid Credentials',
        status: 'passed',
        duration: '1.5s',
        lastRun: '2h ago',
        priority: 'high',
        assignee: 'John Doe'
      },
      {
        id: 'TC2',
        name: 'User Registration Form Validation',
        status: 'passed',
        duration: '2.1s',
        lastRun: '2h ago',
        priority: 'high',
        assignee: 'Jane Smith'
      },
      {
        id: 'TC3',
        name: 'Password Reset Flow',
        status: 'pending',
        duration: '-',
        lastRun: 'Never',
        priority: 'medium',
        assignee: 'Unassigned'
      }
    ]
  },
  {
    id: '2',
    name: 'Payment Processing Suite',
    description: 'End-to-end tests for payment processing including different payment methods and error scenarios',
    status: 'failed',
    lastRun: '1h ago',
    totalTests: 10,
    passed: 8,
    failed: 2,
    pending: 0,
    user: 'Jane Smith',
    date: '2024-03-09',
    testCases: [
      {
        id: 'TC4',
        name: 'Credit Card Payment Processing',
        status: 'failed',
        duration: '3.2s',
        lastRun: '1h ago',
        priority: 'high',
        assignee: 'Mike Johnson'
      },
      {
        id: 'TC5',
        name: 'PayPal Integration Test',
        status: 'passed',
        duration: '2.8s',
        lastRun: '1h ago',
        priority: 'medium',
        assignee: 'Sarah Wilson'
      }
    ]
  },
  {
    id: '3',
    name: 'User Profile Management',
    description: 'Tests covering user profile updates, preferences, and settings management',
    status: 'running',
    lastRun: 'Running',
    totalTests: 8,
    passed: 5,
    failed: 0,
    pending: 3,
    user: 'Mike Johnson',
    date: '2024-03-08',
    testCases: [
      {
        id: 'TC6',
        name: 'Profile Picture Upload',
        status: 'running',
        duration: 'Running',
        lastRun: 'Now',
        priority: 'medium',
        assignee: 'Alex Brown'
      },
      {
        id: 'TC7',
        name: 'User Settings Update',
        status: 'pending',
        duration: '-',
        lastRun: 'Never',
        priority: 'low',
        assignee: 'Unassigned'
      }
    ]
  }
];