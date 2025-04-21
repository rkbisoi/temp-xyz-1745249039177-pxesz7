import { ScheduledTask } from '../components/scheduler/types';

export const scheduledTasks: ScheduledTask[] = [
  {
    id: 1,
    projectId: 1,
    projectName: 'Project 1',
    instructionId: 'master',
    instructionName: 'Master Instructions',
    isRepeat: true,
    startTime: '2024-03-20T09:00',
    endTime: '2024-03-25T18:00',
    status: 'scheduled',
    lastRun: '2024-03-19T15:30',
    nextRun: '2024-03-20T09:00'
  },
  {
    id: 2,
    projectId: 2,
    projectName: 'Project 2',
    instructionId: 'instruction-1',
    instructionName: 'Login Tests',
    isRepeat: false,
    executionTime: '2024-03-21T14:00',
    status: 'scheduled',
    nextRun: '2024-03-21T14:00'
  }
];