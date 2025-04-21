import { useState, useEffect, useRef } from 'react';
import { Minimize2, ChevronDown, ChevronUp, Check, Loader2, XCircle, Ban, Loader } from 'lucide-react';
import { TestExecution } from './types';
import TestEnvModal from '../selenium/TestEnvModal';
import { SELENIUM_URL } from '../../../data';
import { IconSelenium } from '../../Icons';

interface TestRunDetailPopupProps {
    test: TestExecution;
    onClose: () => void;
    onMinimize: () => void;
    onStop: (testId: string) => void;
    isMinimized: boolean;
}

export default function TestRunDetailPopup({ test, onClose, onMinimize, onStop, isMinimized }: TestRunDetailPopupProps) {
    const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [isTestModalOpen, setIsTestModalOpen] = useState(false)

    // Auto-expand the current processing step
    useEffect(() => {
        const processingStep = test.steps.find(step => step.status === 'processing');
        if (processingStep) {
            setExpandedSteps(prev => {
                const newExpanded = new Set(prev);
                newExpanded.add(processingStep.id);
                return newExpanded;
            });
        }
    }, [test.steps]);

    useEffect(() => {
        if (messagesEndRef.current && !isMinimized) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [test.steps, isMinimized]);

    const toggleStep = (stepId: string) => {
        const newExpanded = new Set(expandedSteps);
        if (newExpanded.has(stepId)) {
            newExpanded.delete(stepId);
        } else {
            newExpanded.add(stepId);
        }
        setExpandedSteps(newExpanded);
    };

    if (isMinimized) {
        return (
            // <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 w-64 cursor-pointer border border-gray-200 z-49"
            //     onClick={onMinimize}>
            //     <div className="flex items-center justify-between">
            //         <div className="flex items-center space-x-2">
            //             {test.status === 'running' && <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />}
            //             {test.status === 'completed' && <Check className="h-4 w-4 text-green-500" />}
            //             {test.status === 'error' && <XCircle className="h-4 w-4 text-red-500" />}
            //             {test.status === 'stopped' && <Ban className="h-4 w-4 text-yellow-500" />}
            //             <span className="font-medium text-sm truncate">{test.name}</span>
            //         </div>
            //         <Maximize2 className="h-4 w-4 text-gray-500" />
            //     </div>
            // </div>
            <></>
        );
    }

    const expandLastStepAndScrollToBottom = () => {
        const lastStep = test.steps[test.steps.length - 1];
        if (lastStep) {
            // Expand the last step
            setExpandedSteps(prev => {
                const newExpanded = new Set(prev);
                newExpanded.add(lastStep.id);
                return newExpanded;
            });

            // Scroll to the bottom
            setTimeout(() => {
                if (messagesEndRef.current) {
                    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100); // Small delay to ensure the DOM updates before scrolling
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl m-4 flex flex-col min-h-[500px] max-h-[90vh]">

                <div className="flex items-center justify-between px-4 py-2 border-b">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-lg font-semibold text-intelQEDarkBlue">{test.name}</h2>
                        { test.steps.length > 0 && <div className="flex items-center bg-gray-100 border border-gray-300 px-2 py-1 rounded-md">
                            {(test.status === 'running' && test.steps.length > 0) && <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />}
                            {test.status === 'completed' && <Check className="h-4 w-4 text-green-500" />}
                            {test.status === 'error' && <XCircle className="h-4 w-4 text-red-500" />}
                            {test.status === 'stopped' && <Ban className="h-4 w-4 text-yellow-500" />}
                            { test.steps.length > 0 && <span className="text-sm font-medium ml-2">
                                {test.status === 'running' ? 'Running' :
                                    test.status === 'completed' ? 'Completed' :
                                        test.status === 'error' ? 'Error' : 'Stopped'}
                            </span>}
                        </div>}
                    </div>
                    <div className="flex items-center space-x-2">
                        {test.steps.length > 0 && test.steps[test.steps.length - 1].id === '[test_suite_running]' && <button
                            onClick={() => setIsTestModalOpen(true)}
                            className="p-1 bg-white text-white border border-green-500 rounded-md"
                            title="Close"
                        >
                            <IconSelenium />
                        </button>}
                        {(test.status === 'running' && test.steps.length > 0) && (
                            <button
                                onClick={() => onStop(test.id)}
                                className="px-2 py-1 mr-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center space-x-1"
                            >
                                <Ban className="h-4 w-4" />
                                <span className="text-sm ml-2">Stop Test</span>
                            </button>
                        )}
                        <button
                            onClick={onMinimize}
                            className="p-1.5 hover:bg-gray-100 rounded-lg border border-gray-300"
                            title="Minimize"
                        >
                            <Minimize2 className="h-4 w-4 text-gray-500" />
                            {/* <X className="h-5 w-5 text-gray-500" /> */}
                        </button>
                        {/* <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full"
                            title="Close"
                        >
                            <X className="h-5 w-5 text-gray-500" />
                        </button> */}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {test.status === 'running' && (test.steps.length == 0) && (
                        <div className="flex items-center py-40 justify-center space-x-2">
                            <Loader className="h-5 w-5 text-blue-500 animate-spin" />

                            <span className="text-lg text-gray-500 font-medium">
                                Starting Test
                            </span>
                        </div>)}
                    {test.steps.map((step) => (
                        <div
                            key={step.id}
                            className={`bg-white rounded shadow p-4 ${step.status === 'completed' ? 'border-l-4 border-green-500' :
                                    step.status === 'processing' ? 'border-l-4 border-blue-500' :
                                        step.status === 'error' ? 'border-l-4 border-red-500' :
                                            step.status === 'stopped' ? 'border-l-4 border-yellow-500' :
                                                'border-l-4 border-gray-200'
                                }`}
                        >
                            <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => toggleStep(step.id)}
                            >
                                <div className="flex items-center space-x-3">
                                    {step.status === 'completed' && <Check className="h-5 w-5 text-green-500" />}
                                    {step.status === 'processing' && <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />}
                                    {step.status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                                    {step.status === 'stopped' && <Ban className="h-5 w-5 text-yellow-500" />}
                                    <span className="font-medium">{step.title}</span>
                                </div>
                                {expandedSteps.has(step.id) ? (
                                    <ChevronUp className="h-5 w-5 text-gray-500" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-gray-500" />
                                )}
                            </div>
                            {expandedSteps.has(step.id) && step.output && (
                                <div className="mt-4 pl-8 pr-4 py-3 bg-gray-50 rounded">
                                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">{step.output.join('\n')}</pre>
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                {/* Floating Button */}
                {test.steps.length > 0 && (
                    <button
                        className="absolute bottom-3 right-3 bg-intelQEDarkBlue text-white p-2 rounded-full shadow-lg border hover:bg-white hover:border-intelQEDarkBlue hover:text-intelQEDarkBlue transition-colors z-10"
                        onClick={expandLastStepAndScrollToBottom}
                        title="Expand Last Step and Scroll to Bottom"
                    >
                        <ChevronDown className="h-4 w-4" />
                    </button>
                )}
            </div>
            <TestEnvModal
                isMinimized={!isTestModalOpen}
                onClose={() => setIsTestModalOpen(false)}
                url={SELENIUM_URL} 
            />
        </div>
    );
}