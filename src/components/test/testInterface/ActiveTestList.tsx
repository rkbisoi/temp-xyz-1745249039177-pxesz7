import { useState, useEffect } from 'react';
import { Loader2, Check, XCircle, Ban, MoveUpLeft, MoveUpRight, MoveDownLeft, MoveDownRight, Maximize, Minimize } from 'lucide-react';
import { TestExecution } from './types';
import { FolderKanban } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTestExecution } from '../../../contexts/TestExecutionContext';
import PositionedContainer from './PositionContainer';

const LOCAL_STORAGE_KEY = 'activeTests';
const LOCAL_VISIBLE_STORAGE_KEY = 'activeTestsVisible';
const POSITION_STORAGE_KEY = "testListPosition";

interface ActiveTestsListProps {
    tests: TestExecution[];
    onTestClick: (test: TestExecution) => void;
    onStopTest: (testId: string) => void;
    onStopAllTests: () => void;
    selectedTestId: string | null;
}

export default function ActiveTestsList({
    tests,
    onTestClick,
    onStopTest,
    onStopAllTests,
    selectedTestId,
}: ActiveTestsListProps) {
    const [expanded, setExpanded] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const [localTests, setLocalTests] = useState<TestExecution[]>(tests);

    const { setActiveTests } = useTestExecution();

    const [isVisible, setIsVisible] = useState<boolean>(() => {
        return localStorage.getItem(LOCAL_VISIBLE_STORAGE_KEY) === 'true';
    });

    const [position, setPosition] = useState<"top-left" | "top-right" | "bottom-left" | "bottom-right">(
        (localStorage.getItem(POSITION_STORAGE_KEY) as any) || "bottom-right"
    );

    useEffect(() => {
        localStorage.setItem(POSITION_STORAGE_KEY, position);
    }, [position]);

    // const handlePositionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //     setPosition(event.target.value as any);
    // };


    const handlePositionChange = (position: string) => {
        setPosition(position as any);
    };

    useEffect(() => {
        setLocalTests(tests);
    }, [tests]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsVisible(localStorage.getItem(LOCAL_VISIBLE_STORAGE_KEY) === 'true');
        };

        window.addEventListener('activeTestsVisibilityChanged', handleVisibilityChange);

        return () => {
            window.removeEventListener('activeTestsVisibilityChanged', handleVisibilityChange);
        };
    }, []);

    const runningCount = localTests.filter((test) => test.status === 'running').length;
    const completedCount = localTests.filter((test) => test.status === 'completed').length;
    const stoppedCount = localTests.filter((test) => test.status === 'stopped').length;

    if (isVisible) {
        return null;
    }

    const clearAllTests = () => {
        onStopAllTests
        setActiveTests([]);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]))
        setLocalTests([]);
        toast.success("All tests cleared successfully.")
    };


    // Group tests by project
    const testsByProject = localTests.reduce<Record<number, TestExecution[]>>((acc, test) => {
        if (!acc[test.projectId]) {
            acc[test.projectId] = [];
        }
        acc[test.projectId].push(test);
        return acc;
    }, {});

    return (
        // <div className="fixed bottom-4 right-4 z-49">
        <PositionedContainer position={position}>
            <div className={`bg-white rounded-lg shadow-lg py-2 px-3 border border-gray-200 ${minimized ? 'w-72' : 'w-96'}`}>
                <div className="flex items-center justify-between mb-1">
                    <div className="flex flex row justify-start">
                        <h3 className="text-sm font-semibold text-intelQEDarkBlue">Active Tests</h3>
                    </div>

                    <div className="flex">
                        {/* <div className="flex items-center mr-2">
                            <select
                                value={position}
                                onChange={handlePositionChange}
                                className="text-xs border rounded px-2 py-0.5 bg-gray-100"
                            >
                                <option value="top-left">
                                    Top Left
                                </option>
                                <option value="top-right">
                                    Top Right
                                </option>
                                <option value="bottom-left">
                                    Bottom Left
                                </option>
                                <option value="bottom-right">
                                    Bottom Right
                                </option>
                            </select>
                        </div> */}
                        <div className="flex items-center justify-end">
                            <div className="flex items-center mr-2 space-x-1 text-gray-500 text-sm">
                                <button
                                    onClick={() => handlePositionChange("top-left")}
                                    className={`p-1 rounded hover:bg-gray-200 ${position === "top-left" ? "bg-gray-300" : ""}`}
                                >
                                    <MoveUpLeft className="h-3 w-3" />
                                </button>
                                <button
                                    onClick={() => handlePositionChange("top-right")}
                                    className={`p-1 rounded hover:bg-gray-200 ${position === "top-right" ? "bg-gray-300" : ""}`}
                                >
                                    <MoveUpRight className="h-3 w-3" />
                                </button>
                                <button
                                    onClick={() => handlePositionChange("bottom-left")}
                                    className={`p-1 rounded hover:bg-gray-200 ${position === "bottom-left" ? "bg-gray-300" : ""}`}
                                >
                                    <MoveDownLeft className="h-3 w-3" />
                                </button>
                                <button
                                    onClick={() => handlePositionChange("bottom-right")}
                                    className={`p-1 rounded hover:bg-gray-200 ${position === "bottom-right" ? "bg-gray-300" : ""}`}
                                >
                                    <MoveDownRight className="h-3 w-3" />
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => setMinimized(!minimized)}
                            className={`p-[3px] text-xs text-gray-500 hover:bg-gray-200 rounded`}
                        >
                            {minimized ? <Maximize className='h-4 w-4' /> : <Minimize className='h-4 w-4' />}
                        </button>

                       
                    </div>
                </div>

                <div className={`flex flex-row justify-between bg-sky-50 rounded p-2 space-x-2 mb-1 mt-2`}>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-intelQEDarkBlue">Total : {tests.length}</span>
                    </div>
                    <div className='flex flex-row justify-between m-w-48  space-x-2'>

                        <div className="flex items-center space-x-2">
                            <Loader2 className={`h-4 w-4 text-blue-500 ${runningCount > 0 ? 'animate-spin' : ''}`} />
                            <span className="text-sm text-gray-600">{runningCount}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-600">{completedCount}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Ban className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm text-gray-600">{stoppedCount}</span>
                        </div>
                    </div>
                </div>

                {!minimized && (<div className={`flex flex-row justify-end mb-1 p-1`}>
                    <button
                        onClick={() => {
                            setShowMore(!showMore);
                            setExpanded(!expanded);
                        }}
                        className="py-1 text-xs text-gray-500 mr-3 hover:text-intelQEDarkBlue"
                    >
                        {expanded ? 'Collapse All' : 'Expand All'}
                    </button>

                    <button
                        onClick={clearAllTests}
                        className="flex items-center space-x-2 text-xs text-gray-500 hover:text-intelQEDarkBlue">
                        <span className="">Clear All</span>
                    </button>
                    {runningCount > 0 && !minimized && (
                            <button
                                onClick={onStopAllTests}
                                className="ml-3 px-1.5 py-1 text-xs border border-red-600 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-full hover:bg-red-700 flex items-center space-x-1"
                            >
                                <Ban className="h-4 w-4" />
                                <span className="pr-1">Stop All</span>
                            </button>
                        )}
                </div>)}

                {!minimized && (
                    <div className="space-y-4 max-h-80 overflow-y-auto rounded-lg border border-gray-200 p-2">
                        {Object.entries(testsByProject).map(([projectId, projectTests]) => (
                            <div key={projectId} className="space-y-2">
                                <div className="flex items-center text-sm text-gray-600 mb-2">
                                    <FolderKanban className="h-4 w-4 mr-2" />
                                    <span className="font-medium">{projectTests[0].projectName || `Project ${projectId}`}</span>
                                </div>
                                {projectTests.map((test) => (
                                    <div key={test.id} className="relative group">
                                        <div
                                            onClick={() => onTestClick(test)}
                                            className={`p-2 rounded-lg border flex flex-col items-center justify-between cursor-pointer transition-all ${selectedTestId === test.id
                                                ? 'border-intelQEDarkBlue bg-sky-50'
                                                : 'border-gray-200 hover:bg-gray-50'
                                                } ${expanded ? 'bg-gray-100' : ''}`}
                                        >
                                            <div className="flex items-center space-x-2 w-full">
                                                {test.status === 'running' && (
                                                    <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                                                )}
                                                {test.status === 'completed' && (
                                                    <Check className="h-4 w-4 text-green-500" />
                                                )}
                                                {test.status === 'error' && (
                                                    <XCircle className="h-4 w-4 text-red-500" />
                                                )}
                                                {test.status === 'stopped' && (
                                                    <Ban className="h-4 w-4 text-yellow-500" />
                                                )}
                                                <span className="font-medium text-sm text-intelQEDarkBlue flex-grow truncate">
                                                    {test.name}
                                                </span>
                                                {test.status === 'running' && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onStopTest(test.id);
                                                        }}
                                                        className="px-1.5 py-0.5 text-xs border border-red-600 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 rounded-full hover:bg-red-700 flex items-center space-x-1"
                                                    >
                                                        <Ban className="h-4 w-3" />
                                                        <span className="pr-0.5">Stop</span>
                                                    </button>
                                                )}
                                            </div>
                                            {(showMore || (test.status === 'running' && test.steps.length > 0)) && (
                                                <div className="p-2 mt-2 w-full text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-lg">
                                                    {test.steps.length > 0 && (
                                                        <div className="text-blue-500">
                                                            Current Step: {test.steps[test.steps.length - 1].title}
                                                        </div>
                                                    )}
                                                    <div className="text-green-500">
                                                        Steps Completed: {test.steps.filter((step) => step.status === 'completed').length}
                                                    </div>
                                                    <div className="text-gray-500">
                                                        Total Steps: {test.steps.length}
                                                    </div>
                                                    <div className="text-gray-500">
                                                        Status: {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* </div> */}
        </PositionedContainer>
    );
}

