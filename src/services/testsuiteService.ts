import { TestSuite, TestCase, TestLog } from "../components/test/types";
import { API_URL } from "../data";
import { formatUserName } from "../utils/utils";

export const fetchTestLogsByTestSuiteId = async (testSuiteId: number): Promise<TestLog[]> => {
    try {
        const response = await fetch(`${API_URL}/test-suite-logs/${testSuiteId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Test Logs for Suite ${testSuiteId}:`, data);

        if (data?.data && Array.isArray(data?.data)) {
            return data.data.map((testLog: any) => ({
                id: testLog.testSuiteLogID,
                summary: testLog.summary,
                defects: testLog.defects,
                executionTime: testLog.executionTime,
                logs: testLog.logs,
                passedCases: testLog.passed_case,
                executedBy: testLog.executedBy,
                result: testLog.result,
                isActive: testLog.isActive,
                updateSeqNo: testLog.updateSeqNo,
                createdBy: testLog.createdBy,
                updatedBy: testLog.updatedBy,
                updatedByUser: formatUserName(testLog.updatedByUser.userName),
                createdByUser: formatUserName(testLog.createdByUser.userName)
            }));
        } else {
            console.warn("Invalid response structure for test cases:", data);
            return [];
        }
    } catch (error) {
        console.error(`Error fetching test cases for suite ${testSuiteId}:`, error);
        return [];
    }
};

export const fetchTestCasesByTestSuiteId = async (testSuiteId: number): Promise<TestCase[]> => {
    try {
        const response = await fetch(`${API_URL}/testsuite/${testSuiteId}/testcases`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Test Cases for Suite ${testSuiteId}:`, data);

        if (data?.data && Array.isArray(data?.data)) {
            return data.data.map((testCase: any) => ({
                id: testCase.caseID,
                name: testCase.caseName,
                description: testCase.caseDesc,
                type: testCase.type,
                expected_outcome: testCase.expectedOutcome,
                isCustom: testCase.isCustom,
                priority: testCase.priority === '' ? 'high' : testCase.priority,
                steps_json_data: testCase.steps_json_data || [],
                suiteId: testCase.suiteID,
                createdAt: testCase.createdAt,
                createdBy: testCase.createdBy,
                updatedAt: testCase.updatedAt,
                updatedBy: testCase.updatedBy,
                isActive: testCase.isActive,
                status: testCase.status,
                updatedByUser: formatUserName(testCase.updatedByUser.userName),
                createdByUser: formatUserName(testCase.createdByUser.userName)
            }));
        } else {
            console.warn("Invalid response structure for test cases:", data);
            return [];
        }
    } catch (error) {
        console.error(`Error fetching test cases for suite ${testSuiteId}:`, error);
        return [];
    }
};

export const fetchTestSuitesByProjectId = async (projectId: number): Promise<TestSuite[]> => {
    try {
        const response = await fetch(`${API_URL}/testsuite/project/${projectId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Test Suite List Response:", data);

        if (data?.data && Array.isArray(data?.data)) {
            const testSuites = await Promise.all(
                data.data.map(async (testSuite: any) => {
                    const testCases = await fetchTestCasesByTestSuiteId(testSuite.suiteID);
                    const testLogs = await fetchTestLogsByTestSuiteId(testSuite.suiteID)
                    return {
                        id: testSuite.suiteID,
                        name: testSuite.suiteName,
                        description: testSuite.suiteDesc,
                        update_seq_no: testSuite.updateSeqNo,
                        projectId: testSuite.projID,
                        createdAt: testSuite.createdAt,
                        createdBy: testSuite.createdBy,
                        isCustom: testSuite.isCustom,
                        isActive: testSuite.isActive,
                        updatedAt: testSuite.updatedAt,
                        updatedBy: testSuite.updatedBy,
                        testScript: testSuite.testScript,
                        testCases,
                        testLogs
                    };
                })
            );

            return testSuites;
        } else {
            console.warn("Invalid response structure:", data);
            return [];
        }
    } catch (error) {
        console.error("Error fetching test suites:", error);
        return [];
    }
};


export const fetchTestSuitesByPrjId = async (projectId: number): Promise<TestSuite[]> => {
    try {
        const response = await fetch(`${API_URL}/testsuite/project/${projectId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Test Suite List Response:", data);

        if (data?.data && Array.isArray(data?.data)) {
            return data.data.map((testSuite: any) => ({
                id: testSuite.suiteID,
                name: testSuite.suiteName,
                description: testSuite.suiteDesc,
                update_seq_no: testSuite.updateSeqNo,
                projectId: testSuite.projID,
                createdAt: testSuite.createdAt,
                createdBy: testSuite.createdBy,
                isCustom: testSuite.isCustom,
                isActive: testSuite.isActive,
                updatedAt: testSuite.updatedAt,
                updatedBy: testSuite.updatedBy,
                testScript: testSuite.testScript,
                totalFailed: testSuite.totalFailed,
                totalPassed: testSuite.totalPassed,
                totalTestCases: testSuite.totalTestCases,
                totalTestSuiteLogs: testSuite.totalTestSuiteLogs,
                updatedByUser: formatUserName(testSuite.updatedByUser.userName),
                createdByUser: formatUserName(testSuite.createdByUser.userName)
            }));

        } else {
            console.warn("Invalid response structure:", data);
            return [];
        }
    } catch (error) {
        console.error("Error fetching test suites:", error);
        return [];
    }
};


export const deleteTestSuites = async (testSuites: TestSuite[]): Promise<boolean> => {
    try {
        const requests = testSuites.map((testSuite) => {
            return fetch(`${API_URL}/testsuite/${testSuite.id}?update_seq_no=${testSuite.update_seq_no}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
        });

        const responses = await Promise.all(requests);


        for (const response of responses) {
            if (!response.ok) {
                throw new Error(`Failed to link knowledge to project. Status: ${response.status}`);
            }
        }
        return true;
    } catch (error) {
        console.error("Error deleting test suites", error);
        return false;
    }
};


export const createCustomTestSuite = async (testSuite: any) => {
    try {

        const response = await fetch(`${API_URL}/create/testsuite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(testSuite),
        });

        if (!response.ok) {
            const responseData = await response.json();
            const errorMessage = responseData.error || responseData.message || 'Failed to create user';
            throw new Error(errorMessage);
        }

        return response.json();
    } catch (error) {
        console.error('Error creating user:', error);
        throw error; // Re-throw the specific error to be handled by the calling function
    }
};
