import { Notification } from '../components/notification/types';

export const notifications: Notification[] = [
  {
    id: 1,
    title: 'Test Execution Completed',
    message: 'Project 1 tests completed successfully',
    type: 'success',
    timestamp: '2024-03-19T15:30',
    isRead: false,
    taskId: 1
  },
  {
    id: 2,
    title: 'Test Execution Failed',
    message: 'Project 2 tests failed due to connection error',
    type: 'error',
    timestamp: '2024-03-19T14:45',
    isRead: true,
    taskId: 2
  }
];