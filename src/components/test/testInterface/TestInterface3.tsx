import { useEffect, useState } from 'react';
import { CalendarDays, Loader2, Play, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from '../../../data';
import InstructionTabs from '../InstructionTabs';
import CreateScheduleForm from '../../scheduler/CreateScheduleForm';
import { getProjectById } from '../../../services/projectService';
import { ProjectItem } from '../../../types';
import { useTestRunner } from './TestRunner';
import Select, { MultiValue } from 'react-select';
import CustomMultiSelect from '../../shared/CustomMultiselect';


interface TestingInterfaceProps {
    projectId: number;
    project: ProjectItem | undefined;
}

interface TestConfig {
    application: string;
    testType: string;
    section: MultiValue<{ value: string; label: string }>;
    testData: string;
    additionalPrompt: string;
}

interface Instruction {
    id: string;
    content: string;
}

type Option = { label: string; value: string };

export default function TestInterface2({ projectId, project }: TestingInterfaceProps) {
    const sectionOptions = [
        { value: 'Authentication', label: 'Authentication' },
        { value: 'Dashboard', label: 'Dashboard' },
        { value: 'API Endpoints', label: 'API Endpoints' },
        // add more options as needed
    ];
    const [config, setConfig] = useState<TestConfig>({
        application: '',
        testType: '',
        section: sectionOptions,
        testData: '',
        additionalPrompt: '',
    });

    const [isSaving, setIsSaving] = useState(false);
    const [selectedInstruction, setSelectedInstruction] = useState('Master');
    const [instructionContents, setInstructionContents] = useState<Instruction[]>(
        [{ id: 'Master', content: '' }] // Default value
    );

    const [isFormOpen, setIsFormOpen] = useState(false);
    //   const { runTest, isRunning } = useTestRunner(); 
    const { runTest } = useTestRunner();
    const [selectedSections, setSelectedSections] = useState<Option[]>([]);



    // Load instructions when project changes
    useEffect(() => {
        if (project?.instruction) {
            try {
                const parsedInstructions = JSON.parse(project.instruction);
                setInstructionContents(parsedInstructions);
                // Select the first instruction by default
                if (parsedInstructions.length > 0) {
                    setSelectedInstruction(parsedInstructions[0].id);
                }
            } catch (error) {
                console.error("Error parsing project instructions:", error);
                // Fallback to default
                setInstructionContents([{ id: 'Master', content: '' }]);
            }
        }
    }, [project]);

    const handleInstructionContentChange = (id: string, content: string) => {
        setInstructionContents(prev => {
            // Check if the instruction with this id already exists
            const existingIndex = prev.findIndex(inst => inst.id === id);

            if (existingIndex >= 0) {
                // Update existing instruction
                return prev.map(inst =>
                    inst.id === id ? { ...inst, content } : inst
                );
            } else {
                // Add new instruction
                return [...prev, { id, content }];
            }
        });
    };

    const saveInstructions = async () => {
        setIsSaving(true);
        try {
            // Fetch the latest project data to get the current update_seq_no
            const latestProject = await getProjectById(projectId);

            if (!latestProject) {
                throw new Error("Failed to fetch latest project data");
            }

            const response = await fetch(`${API_URL}/projects/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    projectId: projectId,
                    update_seq_no: latestProject.update_seq_no,
                    instruction: JSON.stringify(instructionContents)
                }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            toast.success('Instructions saved successfully');
        } catch (error) {
            console.error('Error saving instructions:', error);
            toast.error('Failed to save instructions');
        } finally {
            setIsSaving(false);
        }
    };

    const handleRunTest = async () => {
        const selectedInstructionContent = instructionContents.find(
            inst => inst.id === selectedInstruction
        )?.content;

        if (!selectedInstructionContent) {
            toast.error('No instruction content found');
            return;
        }

        try {
            await runTest({
                projectId,
                instructionContent: selectedInstructionContent,
                instructionLabel: selectedInstruction
            });
        } catch (error) {
            // Error handling is done inside the hook
        }
    };

    return (
        <div className="max-h-screen">
            <div className="max-w-full mx-auto">
                <div className={`bg-white rounded shadow-sm p-4 mb-4 transition-all duration-500 relative border border-gray-100`}>
                    <div className={`mb-4 transition-all duration-500 block`}>
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                            {/* <div className="space-y-4 w-1/3">
                                <div>
                                    <label htmlFor="application" className="block text-sm font-medium text-gray-700">
                                        Application
                                    </label>
                                    <select
                                        id="application"
                                        className="mt-1 block w-full rounded p-2 text-sm border border-gray-400 shadow-sm focus:border-intelQEDarkBlue focus:ring-intelQEDarkBlue"
                                        value={config.application}
                                        onChange={(e) => setConfig((c) => ({ ...c, application: e.target.value }))}
                                    >
                                        <option value="">Application 1</option>
                                        <option value="web">Application 2</option>
                                        <option value="mobile">Application 3</option>
                                        <option value="api">Application 4</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="testType" className="block text-sm font-medium text-gray-700">
                                        Test Type
                                    </label>
                                    <select
                                        id="testType"
                                        className="mt-1 block w-full rounded p-2 text-sm border border-gray-400 shadow-sm focus:border-intelQEDarkBlue focus:ring-intelQEDarkBlue"
                                        value={config.testType}
                                        onChange={(e) => setConfig((c) => ({ ...c, testType: e.target.value }))}
                                    >
                                        <option value="functional">Functional Testing</option>
                                        <option value="load">Load Testing</option>
                                        <option value="unit">Unit Testing</option>
                                        <option value="integration">Integration Testing</option>
                                        <option value="e2e">End-to-End Testing</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="section" className="block text-sm font-medium text-gray-700">
                                        Application Section
                                    </label>
                                    <input
                                        id="section"
                                        type="text"
                                        className="mt-1 block w-full rounded p-2 text-sm border border-gray-400 shadow-sm focus:border-intelQEDarkBlue focus:ring-intelQEDarkBlue"
                                        placeholder="e.g., Authentication, Dashboard, API Endpoints"
                                        value={config.section}
                                        onChange={(e) => setConfig((c) => ({ ...c, section: e.target.value }))}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="testData" className="block text-sm font-medium text-gray-700">
                                        Test Data
                                    </label>
                                    <select
                                        id="testData"
                                        className="mt-1 block w-full rounded p-2 text-sm border border-gray-400 shadow-sm focus:border-intelQEDarkBlue focus:ring-intelQEDarkBlue"
                                        value={config.testData}
                                        onChange={(e) => setConfig((c) => ({ ...c, testData: e.target.value }))}
                                    >
                                        <option value="">Data 1</option>
                                        <option value="unit">Data 2</option>
                                        <option value="integration">Data 3</option>
                                    </select>
                                </div>
                            </div> */}

                            <div className="w-full w-2/3 h-[480px]">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-md font-bold text-intelQEDarkBlue -mt-2">
                                        Test Instructions
                                    </label>
                                    <div className='flex flex-row justify-end space-x-4'>
                                        {/* <Select
                                            isMulti
                                            options={sectionOptions}
                                            className="react-select-container text-sm"
                                            classNamePrefix="select"
                                            placeholder="e.g., Authentication, Dashboard, API Endpoints"
                                            value={config.section}
                                            onChange={(selectedOptions) =>
                                                setConfig((c) => ({
                                                    ...c,
                                                    section: selectedOptions,
                                                }))
                                            }
                                        /> */}
                                        <CustomMultiSelect
                                            options={[
                                                { value: "auth", label: "Authentication" },
                                                { value: "dashboard", label: "Dashboard" },
                                                { value: "api", label: "API Endpoints" },
                                            ]}
                                            selected={selectedSections}
                                            onChange={setSelectedSections}
                                            placeholder="e.g., Authentication, Dashboard, API Endpoints"
                                        />
                                        <div>
                                            <select
                                                id="testData"
                                                className="block w-full min-w-[100px] font-medium rounded py-[3px] h-7 px-2 text-sm border border-gray-400 shadow-sm focus:border-intelQEDarkBlue focus:ring-intelQEDarkBlue"
                                                value={config.testData}
                                                onChange={(e) => setConfig((c) => ({ ...c, testData: e.target.value }))}
                                            >
                                                <option value="">Data 1</option>
                                                <option value="unit">Data 2</option>
                                                <option value="integration">Data 3</option>
                                            </select>
                                        </div>
                                        <button
                                            onClick={saveInstructions}
                                            disabled={isSaving}
                                            className="flex text-sm items-center justify-center py-[3px] h-7 px-1.5 border border-intelQEDarkBlue rounded shadow-sm text-sm font-medium text-intelQEDarkBlue bg-white hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-intelQEDarkBlue disabled:bg-gray-200 disabled:text-gray-500 transition-all duration-500"
                                        >
                                            {isSaving ? (
                                                <>
                                                    <Loader2 className="animate-spin h-4 w-4 mr-1" />
                                                    <span>Saving...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-4 w-4 mr-1" />
                                                    <span>Save</span>
                                                </>
                                            )}
                                        </button>
                                    </div>

                                </div>
                                <div className="border rounded h-[440px]">
                                    <InstructionTabs
                                        selectedInstruction={selectedInstruction}
                                        onInstructionChange={setSelectedInstruction}
                                        onInstructionContentChange={handleInstructionContentChange}
                                        instructionContents={instructionContents}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row justify-between gap-4 mt-1">
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="flex items-center justify-center py-2 px-4 border border-intelQEDarkBlue rounded shadow-sm text-sm font-medium text-intelQEDarkBlue bg-white hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-intelQEDarkBlue disabled:bg-sky-400 transition-all duration-500 w-full"
                        >
                            <CalendarDays className="h-5 w-5" />
                            <span className="ml-2">Schedule Task ({selectedInstruction})</span>
                        </button>
                        <button
                            onClick={handleRunTest}
                            //   disabled={isRunning}
                            className="flex items-center justify-center py-2 px-4 border border-transparent rounded text-sm font-medium text-white bg-intelQEDarkBlue hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-intelQEDarkBlue disabled:bg-gray-200 disabled:text-gray-700 w-full min-w-[300px]"
                        >
                            {/* {isRunning ? (
                                <>
                                <Loader2 className="animate-spin h-5 w-5" />
                                <span className="ml-2">Running Test...</span>
                                </>
                            ) : ( */}
                            <>
                                <Play className="h-5 w-5" />
                                <span className="ml-2">Start Testing ({selectedInstruction})</span>
                            </>
                            {/* )} */}
                        </button>
                    </div>
                </div>
            </div>

            <CreateScheduleForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={() => {
                    setIsFormOpen(false);
                }}
                projectId={projectId}
                contextExecId={0}
                testSuiteId={0}
                isEdit={false}
                schId={-1}
            />
        </div>
    );
}