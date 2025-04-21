// src/types/interfaces.ts

export interface ApplicationData {
    name: string;
    description: string;
    createdAt: string;
    lastModified: string;
    totalProjects: number;
    apiEndpoints: number;
    routes: number;
    environments: string[];
    languages: string[];
    testStats: TestStats;
    coverageData: CoverageItem[];
    aiInsights: string[];
    recentActivity: ActivityItem[];
    projects: Project[];
    apis: ApiEndpoint[];
    deployments?: Deployment[];
  }
  
  export interface TestStats {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
  }
  
  export interface CoverageItem {
    name: string;
    value: number;
  }
  
  export interface ActivityItem {
    type: string;
    name: string;
    status: string;
    time: string;
  }
  
  export interface Project {
    id: number;
    name: string;
    type: string;
    testsCount: number;
    passRate: number;
    lastRun: string;
    description?: string;
    owner?: string;
  }
  
  export interface ApiEndpoint {
    id: number;
    path: string;
    method: string;
    description: string;
    testCoverage: number;
    responseTime?: number;
    authRequired?: boolean;
    parameters?: ApiParameter[];
  }
  
  export interface ApiParameter {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }
  
  export interface LogEntry {
    timestamp: string;
    level: 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG';
    message: string;
    source?: string;
    stackTrace?: string;
  }
  
  export interface Deployment {
    id: number;
    environment: string;
    version: string;
    status: string;
    deployedAt: string;
    deployedBy: string;
  }
  
  export interface FilterState {
    searchTerm: string;
    filters: Record<string, any>;
  }