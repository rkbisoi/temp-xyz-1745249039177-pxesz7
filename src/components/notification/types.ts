export interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
    timestamp: string;
    isRead: boolean;
    taskId?: number;
  }