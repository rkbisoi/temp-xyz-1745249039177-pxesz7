// Existing types...

export interface TestRunStep {
    id: string;
    title: string;
    status: 'processing' | 'error' | 'completed' | 'stopped';
    output: string[];
  }
  
//   export interface TestExecution {
//     id: string;
//     name: string;
//     status: 'running' | 'completed' | 'error' | 'stopped';
//     steps: TestStep[];
//     startTime: Date;
//     endTime?: Date;
//   }


export interface TestExecution {
    id: string;
    exec_id: string;
    name: string;
    status: 'running' | 'completed' | 'error' | 'stopped';
    steps: TestRunStep[];
    startTime: Date;
    endTime?: Date;
    projectId: number;
    projectName?: string;
  }