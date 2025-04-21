import { ExecutionLog } from "../components/test/types";

export const mockExecutionLogs: ExecutionLog[] = [
    {
        execId: 1,
        componentIds: [101, 102],
        dataModelIds: [201, 202],
        usedIds: { suite_id: 1 },
        execTime: "10/03/2025 13:09:56",
        execTimeTaken: 120,
        instruction: "Execute test suite A",
        knowledgeIds: [301, 302],
        output: "Test executed successfully.",
        projectId: 1,
        isScheduleLog: false,
        isViewed: true,
        createdBy: 55,
        is_rerun: 0,
        parent_exec_id: null,
        childExecutions: [
            {
                execId: 2,
                componentIds: [103],
                dataModelIds: [203],
                usedIds: {},
                execTime: "2025-03-11T10:05:00Z",
                execTimeTaken: 60,
                instruction: "Execute test case B",
                knowledgeIds: [303],
                output: "Partial success.",
                projectId: 1,
                isScheduleLog: false,
                isViewed: false,
                createdBy: 55,
                is_rerun: 1,
                parent_exec_id: 1,
                childExecutions: []
            }
        ]
    },
    {
        execId: 3,
        componentIds: [104, 105],
        dataModelIds: [204, 205],
        usedIds: { suite_id: 2 },
        execTime: "10/03/2025 09:30:00",
        execTimeTaken: 150,
        instruction: "Execute test suite B",
        knowledgeIds: [304, 305],
        output: "Execution completed with warnings.",
        projectId: 2,
        isScheduleLog: true,
        isViewed: false,
        createdBy: 60,
        is_rerun: 0,
        parent_exec_id: null,
        childExecutions: []
    },
    {
        execId: 4,
        componentIds: [106],
        dataModelIds: [206],
        usedIds: {suite_id: 1},
        execTime: "09/03/2025 14:15:30",
        execTimeTaken: 90,
        instruction: "Execute test suite C",
        knowledgeIds: [306],
        output: "Execution failed due to timeout.",
        projectId: 3,
        isScheduleLog: false,
        isViewed: true,
        createdBy: 62,
        is_rerun: 1,
        parent_exec_id: null,
        childExecutions: []
    }
];