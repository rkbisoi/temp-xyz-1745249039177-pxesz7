import React, { createContext, useContext, useState, useEffect } from 'react';
import { TestExecution } from '../components/test/testInterface/types';
import { LLM_URL } from '../data';
import toast from 'react-hot-toast';

interface TestExecutionContextType {
    activeTests: TestExecution[];
    setActiveTests: React.Dispatch<React.SetStateAction<TestExecution[]>>;
    selectedTestId: string | null;
    setSelectedTestId: React.Dispatch<React.SetStateAction<string | null>>;
    minimizedTests: Set<string>;
    setMinimizedTests: React.Dispatch<React.SetStateAction<Set<string>>>;
    handleTestClick: (test: TestExecution) => void;
    handleMinimize: (testId: string) => void;
    handleClose: (testId: string) => void;
    stopTest: (testId: string) => void;
    stopAllTests: () => void;
}

const TestExecutionContext = createContext<TestExecutionContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'activeTests';

export function TestExecutionProvider({ children }: { children: React.ReactNode }) {
    const [activeTests, setActiveTests] = useState<TestExecution[]>(() => {
        const storedTests = localStorage.getItem(LOCAL_STORAGE_KEY);
        return storedTests ? JSON.parse(storedTests) : [];
    });
    const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
    const [minimizedTests, setMinimizedTests] = useState<Set<string>>(new Set());

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(activeTests));
    }, [activeTests]);

    const handleTestClick = (test: TestExecution) => {
        setSelectedTestId(test.id);
        setMinimizedTests(prev => {
            const updated = new Set(prev);
            updated.delete(test.id);
            return updated;
        });
    };

    const handleMinimize = (testId: string) => {
        setMinimizedTests(prev => {
            const updated = new Set(prev);
            if (prev.has(testId)) {
                updated.delete(testId);
            } else {
                updated.add(testId);
            }
            return updated;
        });
    };

    const handleClose = (testId: string) => {
        setActiveTests(prev => prev.filter(t => t.id !== testId));
        setSelectedTestId(null);
        setMinimizedTests(prev => {
            const updated = new Set(prev);
            updated.delete(testId);
            return updated;
        });
    };

    const stopTest = async (testId: string) => {
        const execId = activeTests.find((test: TestExecution) => test.id === testId)?.exec_id;


        if (execId !== '') {
            const response = await fetch(`${LLM_URL}/stop_task/${execId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            console.log('Task stopped successfully:', data);

            setActiveTests(prev => prev.map(t => {
                if (t.id === testId) {
                    // Mark the test as stopped
                    const updatedTest = { ...t, status: 'stopped' as const, endTime: new Date() };

                    // Mark the last step as stopped (if it exists)
                    if (updatedTest.steps.length > 0) {
                        const lastStep = updatedTest.steps[updatedTest.steps.length - 1];
                        lastStep.status = 'stopped' as const;
                    }

                    return updatedTest;
                }
                return t;
            }));

        } else {
            toast.error("Error Stopping the Test")
            throw new Error(`Error Stopping the Test`);
        }

    };



    const stopAllTests = async () => {
        try {
            // Extract all test IDs from activeTests
            const testIds = activeTests.filter(test => test.status === 'running').map(test => test.id);
    
            // Call stopTest for each test ID concurrently
            await Promise.all(testIds.map(testId => stopTest(testId)));
    
            console.log('All tests stopped successfully.');
        } catch (error) {
            console.error('Error stopping all tests:', error);
            toast.error('Failed to stop all tests.');
        }
    };

    return (
        <TestExecutionContext.Provider value={{
            activeTests,
            setActiveTests,
            selectedTestId,
            setSelectedTestId,
            minimizedTests,
            setMinimizedTests,
            handleTestClick,
            handleMinimize,
            handleClose,
            stopTest,
            stopAllTests
        }}>
            {children}
        </TestExecutionContext.Provider>
    );
}

export function useTestExecution() {
    const context = useContext(TestExecutionContext);
    if (context === undefined) {
        throw new Error('useTestExecution must be used within a TestExecutionProvider');
    }
    return context;
}