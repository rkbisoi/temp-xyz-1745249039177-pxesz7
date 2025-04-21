import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Step1 from './Step1';
// import Step2 from './Step2';
import Step3 from './Step3';
import { X } from 'lucide-react';
import { TestCase, TestSuite } from '../types';
import { createCustomTestSuite, fetchTestCasesByTestSuiteId } from '../../../services/testsuiteService';
import { emitter } from '../../../utils/eventEmitter';

interface TestSuiteFormProps {
    testSuites: TestSuite[]
    projectId: number;
    // onSubmit: (data: any) => void;
    onClose: () => void;
}
export type TestSuiteFormData = {
    project_id: number;
    name: string;
    description: string;
    // testScript: File | null;
    test_cases: Set<number>;
};

// function filterTestCases(testSuites: any, testCaseIds:any) {
//     return testSuites.flatMap((suite:any) => 
//         suite.testCases
//             .filter((tc:any) => testCaseIds.has(tc.id))
//             .map(({ id, suiteId, status, createdBy, updatedBy, createdAt, updatedAt, ...rest }) => rest)
//     );
// }


// function filterTestCases(testSuites: TestSuite[], testCaseIds: Set<number>): Omit<TestCase, 'id' | 'suiteId' | 'status' | 'createdBy' | 'updatedBy' | 'createdAt' | 'updatedAt'>[] {
//     return testSuites.flatMap(suite =>
//         suite.testCases
//             .filter(testCase => testCaseIds.has(testCase.id))
//             .map(({ id, suiteId, status, createdBy, updatedBy, createdAt, updatedAt, ...rest }) => rest)
//     );
// }


const TestSuiteForm: React.FC<TestSuiteFormProps> = ({ projectId, testSuites, onClose }) => {
    // console.log("ProjectId : ", projectId, " testSuites : ", testSuites)
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<TestSuiteFormData>({
        project_id: projectId,
        name: '',
        description: '',
        // testScript: null as File | null,
        test_cases: new Set<number>(),
    });
    const [availableTestCases, setAvailableTestCases] = useState<TestCase[]>([]);

    // const handleNext = () => setStep((prev) => prev + 1);
    const handleNext = () => setStep((prev) => prev + 2);
    const handlePrev = () => setStep((prev) => prev - 2);

    const handleSetFormData = (data: Partial<typeof formData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
    };

    useEffect(() => {
        const fetchTestCases = async () => {
            // setIsLoading(true);
            try {
                // Fetch test cases for each test suite
                const testCasesPromises = testSuites.map(suite => 
                    fetchTestCasesByTestSuiteId(suite.id)
                );

                const allTestCasesResults = await Promise.all(testCasesPromises);
                
                // Flatten the results and remove duplicates
                const uniqueTestCases = Array.from(new Set(
                    allTestCasesResults.flat().map(tc => tc.id)
                )).map(id => 
                    allTestCasesResults.flat().find(tc => tc.id === id)
                ).filter(Boolean) as TestCase[];

                setAvailableTestCases(uniqueTestCases);
            } catch (error) {
                console.error('Error fetching test cases:', error);
                toast.error('Failed to load test cases');
            } finally {
                // setIsLoading(false);
            }
        };

        fetchTestCases();
    }, [testSuites]);
    

    // const handleSubmit = () => {
    //     if (!formData.project_id || !formData.name || !formData.description || !formData.testScript) {
    //         toast.error('Please complete all required fields.');
    //         return;
    //     }
    //     onSubmit({
    //         project_id: formData.project_id,
    //         name: formData.name,
    //         description: formData.description,
    //         testScript: formData.testScript,
    //         isCustom: false,
    //         test_cases: Array.from(formData.test_cases),
    //     });
    //     onClose();
    // };

    const handleSubmit = async () => {
        if (!formData.project_id || !formData.name) {
            toast.error('Please complete all required fields.');
            return;
        }

        const selectedTestCases = availableTestCases.filter(tc => 
            formData.test_cases.has(tc.id)
        );
        
        const newTestSuite = {
            project_id: formData.project_id,
            name: formData.name,
            description: formData.description,
            // testScript: "",
            isCustom: true,
            test_cases: selectedTestCases.map(({ id, suiteId, status, createdBy, updatedBy, createdAt, updatedAt, ...rest }) => rest),
            // filterTestCases(testSuites, formData.test_cases),
        }
        console.log("Created Test Suite : ", newTestSuite)
        // onSubmit(newTestSuite);

        const response = await createCustomTestSuite(newTestSuite)

        if (response.success) {
            emitter.emit('refreshTestSuiteList')
            toast.success("Custom Test Suite Created Successfully!");
            onClose();
        }else{
            toast.error("Error Creating Custom Test Suite")
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

            <div className="bg-white rounded-lg w-full max-w-xl p-1 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-intelQEDarkBlue"
                >
                    <X className="w-5 h-5" />
                </button>
                {step === 1 && <Step1 formData={formData} setFormData={handleSetFormData} nextStep={handleNext} />}
                {/* {step === 2 && <Step2 formData={formData} setFormData={handleSetFormData} prevStep={handlePrev} nextStep={handleNext} />} */}
                {step === 3 && (
                    <Step3
                        formData={formData}
                        testSuites={testSuites}
                        availableTestCases={availableTestCases}
                        selectedTestCases={formData.test_cases}
                        setSelectedTestCases={(newSelected) =>
                            setFormData(prev => ({ ...prev, test_cases: newSelected }))
                        }
                        prevStep={handlePrev}
                        submitForm={handleSubmit}
                    />
                )}

            </div>
        </div>
    );
};

export default TestSuiteForm;
