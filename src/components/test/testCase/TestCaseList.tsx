import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, Copy, Trash2, MoreVertical } from 'lucide-react';
import { TestCase } from '../types';
import { convertGMTToLocal, getTimeAgo } from '../../../utils/utils';
import { useDialog } from '../../shared/DialogProvider';
import TestCaseDetail from './TestCaseDetail';
import toast from 'react-hot-toast';
import { deleteTestCases } from '../../../services/testCaseService';
import { fetchTestCasesByTestSuiteId } from '../../../services/testsuiteService';

interface TestCaseListProps {
    testSuiteId: number;
}

export default function TestCaseList({ testSuiteId }: TestCaseListProps) {
    // console.log("Test Case List : ", testCases)
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        updatedBy: ''
    });
    const [selectedTestCases, setSelectedTestCases] = useState<Set<number>>(new Set());
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);
    const [testCases, setTestCases] = useState<TestCase[] | null>(null)

    const { showDialog } = useDialog();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const test_cases = await fetchTestCasesByTestSuiteId(testSuiteId)

                setTestCases(test_cases)

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);



    // Filter test cases based on search term and filters
    const filteredTestCases = testCases?.filter(testCase => {
        const matchesSearch = (
            testCase.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            testCase.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const matchesStatus = !filters.status || testCase.status === filters.status;
        const matchesPriority = !filters.priority || testCase.priority === filters.priority;
        const matchesUpdatedBy = !filters.updatedBy || testCase.updatedByUser === filters.updatedBy;

        return matchesSearch && matchesStatus && matchesPriority && matchesUpdatedBy;
    });


    // Get unique values for filters
    const uniqueStatuses = [...new Set(testCases?.map(tc => tc.status))];
    const uniquePriorities = [...new Set(testCases?.map(tc => tc.priority))];
    const uniqueUsers = [...new Set(testCases?.map(tc => tc.updatedByUser))];

    const handleDeleteAction = async () => {

        try {
            console.log(`Performing Delete on:`, selectedTestCases);

            if (!selectedTestCases || selectedTestCases.size === 0) {
                toast.error("No test cases selected for deletion.");
                return;
            }

            let success = await deleteTestCases([...selectedTestCases]);

            if (success) {
                toast.success("Test Cases deleted successfully!");
                setSelectedTestCases(new Set());
            } else {
                toast.error("Failed to delete some or all test cases.");
            }
        } catch (error) {
            console.error("Error deleting test cases:", error);
            toast.error("An unexpected error occurred during deletion.");
        }

    }

    const handleBulkAction = async (action: string) => {

        showDialog({
            title: `Confirm ${action}`,
            message: `Are you sure you want to ${action.toLowerCase()} the selected test cases?`,
            type: 'confirm',
            confirmLabel: 'Confirm',
            cancelLabel: 'Cancel',
            onConfirm: async () => {
                console.log(`${action} test cases:`, selectedTestCases);
                if (action === 'Delete') {
                    await handleDeleteAction()
                }
                setSelectedTestCases(new Set());
            }
        });
    };



    const handleRowAction = (action: string, itemId: number) => {
        showDialog({
            title: `Confirm ${action}`,
            message: `Are you sure you want to ${action.toLowerCase()} this test case?`,
            type: 'confirm',
            confirmLabel: 'Confirm',
            cancelLabel: 'Cancel',
            onConfirm: async () => {
                console.log(`${action} testCase ${itemId}`);
                if (action === 'Delete') {
                    try {
                        console.log(`Performing Delete on:`, itemId);

                        if (!itemId || itemId <= 0) {
                            toast.error("Invalid test case selected for deletion.");
                            return;
                        }

                        let success = await deleteTestCases([itemId]);

                        if (success) {
                            toast.success("Test Case deleted successfully!");
                            setSelectedTestCase(null);
                        } else {
                            toast.error("Failed to delete test case.");
                        }
                    } catch (error) {
                        console.error("Error deleting test case:", error);
                        toast.error("An unexpected error occurred during deletion.");
                    }
                }

            }
        });
    };

    const handleTestCaseClick = (testCase: TestCase) => {
        setSelectedTestCase(testCase);
    };

    return (

        <div className="p-2">
            <div className="mb-2">
                <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search test cases..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="p-2 border rounded-md hover:bg-gray-50"
                    >
                        <SlidersHorizontal className="h-5 w-5" />
                    </button>
                </div>

                {showFilters && (
                    <div className="flex gap-4 justify-end rounded-md mb-4">
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            className="rounded-md border border-gray-300"
                        >
                            <option value="">All Statuses</option>
                            {uniqueStatuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>

                        <select
                            value={filters.priority}
                            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                            className="rounded-md border border-gray-300"
                        >
                            <option value="">All Priorities</option>
                            {uniquePriorities.map(priority => (
                                <option key={priority} value={priority}>{priority}</option>
                            ))}
                        </select>

                        <select
                            value={filters.updatedBy}
                            onChange={(e) => setFilters(prev => ({ ...prev, updatedBy: e.target.value }))}
                            className="rounded-md border border-gray-300"
                        >
                            <option value="">All Users</option>
                            {uniqueUsers.map(user => (
                                <option key={user} value={user}>{user}</option>
                            ))}
                        </select>
                    </div>
                )}

                {selectedTestCases.size > 0 && (
                    <div className="fixed bottom-4 right-10 flex gap-4 bg-white shadow-lg p-2 rounded-lg border">
                        <span className="flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                            {selectedTestCases.size} Test Case Selected
                        </span>
                        <button
                            onClick={() => handleBulkAction('Delete')}
                            className="flex items-center px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md"
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                        </button>
                        <button
                            onClick={() => handleBulkAction('Copy')}
                            className="flex items-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                        >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                        </button>
                        {/* <button
                    onClick={() => handleBulkAction('Move')}
                    className="flex items-center px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-md"
                  >
                    <FolderInput className="h-4 w-4 mr-1" />
                    Move Selected
                  </button> */}
                    </div>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="pl-6 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <input
                                    type="checkbox"
                                    checked={selectedTestCases.size === filteredTestCases?.length}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedTestCases(new Set(filteredTestCases?.map(tc => tc.id)));
                                        } else {
                                            setSelectedTestCases(new Set());
                                        }
                                    }}
                                    className="rounded border-gray-300 text-intelQEDarkBlue focus:ring-intelQEDarkBlue"
                                />
                            </th>
                            <th className="pr-6 pl-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Test Case
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Steps
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Priority
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Updated By
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Updated At
                            </th>
                            {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th> */}
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTestCases?.map((testCase) => (
                            <tr
                                key={testCase.id}
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleTestCaseClick(testCase)}
                            >
                                <td className="pl-6 pr-2 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedTestCases.has(testCase.id)}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            const newSelected = new Set(selectedTestCases);
                                            if (e.target.checked) {
                                                newSelected.add(testCase.id);
                                            } else {
                                                newSelected.delete(testCase.id);
                                            }
                                            setSelectedTestCases(newSelected);
                                        }}
                                        className="rounded border-gray-300 text-intelQEDarkBlue focus:ring-intelQEDarkBlue"
                                    />
                                </td>
                                <td className="pr-6 pl-2 py-4 whitespace-nowrap text-sm text-gray-500">
                                    #{testCase.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div title={`${testCase.name}`} className="text-sm font-semibold text-gray-900 w-52 truncate">{testCase.name}</div>
                                    <div title={`${testCase.description}`} className="text-xs text-gray-500 w-52 truncate">{testCase.description}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {testCase.steps_json_data.length || 0}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs rounded-full ${testCase.priority === 'high' ? 'bg-red-100 text-red-800' :
                                        testCase.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                        {testCase.priority}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {testCase.updatedByUser}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {getTimeAgo(convertGMTToLocal(testCase.updatedAt))}
                                </td>
                                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-2 py-1 rounded-full ${getStatusColor(testCase.status)}`}>{testCase.status}</span>
                                </td> */}
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveDropdown(activeDropdown === testCase.id ? null : testCase.id);
                                            }}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <MoreVertical className="h-5 w-5" />
                                        </button>
                                        {activeDropdown === testCase.id && (
                                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                                <div className="py-1">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRowAction('Copy', testCase.id);
                                                        }}
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                                                    >
                                                        <Copy className="h-4 w-4 mr-2" />
                                                        Copy
                                                    </button>
                                                    {/* <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRowAction('Move', testCase.id);
                                                        }}
                                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                                                    >
                                                        <FolderInput className="h-4 w-4 mr-2" />
                                                        Move
                                                    </button> */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRowAction('Delete', testCase.id);
                                                        }}
                                                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            {selectedTestCase && (
                <TestCaseDetail
                    testCase={selectedTestCase}
                    onClose={() => setSelectedTestCase(null)}
                />
            )}
        </div>
    );
}