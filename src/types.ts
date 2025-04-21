export interface BaseItem {
  id: number;
  name: string;
  description: string;
  lastUpdated?: string;
  createDate?: string;
  update_seq_no: number;
  createdByUser?: string; 
  updatedByUser?: string; 
}

export interface ProjectItem extends BaseItem {
  type: string;
  progress: number;
  members: number;
  instruction: string;
  createdBy: number;
}

export interface ApplicationItem extends BaseItem {
  type: string;
  createdBy: number;
}

export interface KnowledgeItem extends BaseItem {
  type: string;
  global: boolean;
}

export interface DataItem extends BaseItem {
  type: string;
  dataModel: Record<string, string>; 
  dataExample: string; 
  dataHeader: string[]; 
  createdBy: number;
  active: boolean;
  lastUpdated_by: number;
}


export interface UserItem extends BaseItem {
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  position: string;
  lastLogin: string;
  projectIds: number[]
}

export interface InvitationItem extends BaseItem {
  email: string;
  role: 'admin' | 'user';
  status: 'pending' | 'accepted' | 'expired';
  sentBy: string;
  expiresAt: string;
}

export interface ScheduledTaskItem extends BaseItem {
  project_id: number,
  user_id: number,
  scheduler_instruction: string,
  execute_after_in_ms: number,
  repeat_schedule: boolean,
  schStartTime: string,
  runSchTillDate: string,
  last_execution_time?: string,
  active?: true,
  created_date?: string,
  last_execution_status?: string,
  next_execution_time?: string,
  updated_by?: number,
  pause?: boolean,
  contextExecId?: number,
  testSuiteId?: number
  completed?: boolean
}

export interface LinkedItems {
  projects?: ProjectItem[];
  applications?: ApplicationItem[];
  knowledge?: KnowledgeItem[];
  data?: DataItem[];
  users?: UserItem[];
  schedules: ScheduledTaskItem[];
}

export interface WorkflowItem extends BaseItem {
  type: string;
  status: 'active' | 'draft' | 'archived';
}


export type Item =
  | ProjectItem
  | ApplicationItem
  | KnowledgeItem
  | DataItem
  | UserItem
  | InvitationItem
  | ScheduledTaskItem 
  | WorkflowItem;
