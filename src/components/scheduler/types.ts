export interface ScheduledTask {
  id: number;
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
  update_seq_number?: number,
  pause?: boolean,
  contextExecId?: number,
  testSuiteId?: number
  completed?: boolean
}

