import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, Copy, Trash2, MoreVertical } from 'lucide-react';
import { TestLog } from '../types';
import { convertGMTToLocal, getTimeAgo } from '../../../utils/utils';
import { useDialog } from '../../shared/DialogProvider';
import toast from 'react-hot-toast';
import { deleteTestLogs } from '../../../services/testLogService';
import TestLogDetail from './TestLogDetail';
import { fetchTestLogsByTestSuiteId } from '../../../services/testsuiteService';


interface TestLogListProps {
    testSuiteId: number;
}

export default function TestLogList({ testSuiteId }: TestLogListProps) {
    const [showFilters, setShowFilters] = useState(false);
    const [selectedTestLogs, setSelectedTestLogs] = useState<Set<number>>(new Set());
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const [selectedTestLog, setSelectedTestLog] = useState<TestLog | null>(null);

    const [testLogs, setTestLogs] = useState<TestLog[] | null>(null)


    useEffect(() => {
        const fetchData = async () => {
            try {
                const test_cases = await fetchTestLogsByTestSuiteId(testSuiteId)

                setTestLogs(test_cases)

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);




    // Filter states for test logs
    const [logSearchTerm, setLogSearchTerm] = useState('');
    const [logFilters, setLogFilters] = useState({
        status: '',
        executedBy: '',
        defectCount: ''
    });

    const { showDialog } = useDialog();


    // Filter test logs based on search term and filters
    const filteredTestLogs = testLogs?.filter(log => {
        const matchesSearch = (
            log.summary.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
            log.executedBy.toLowerCase().includes(logSearchTerm.toLowerCase())
        );

        const matchesStatus = !logFilters.status || log.result === logFilters.status;
        const matchesExecutedBy = !logFilters.executedBy || log.executedBy === logFilters.executedBy;
        const matchesDefectCount = !logFilters.defectCount || log.defects.length.toString() === logFilters.defectCount;

        return matchesSearch && matchesStatus && matchesExecutedBy && matchesDefectCount;
    });


    // Get unique values for log filters
    const uniqueLogStatuses = [...new Set(testLogs?.map(log => log.result))];
    const uniqueExecutors = [...new Set(testLogs?.map(log => log.executedBy))];

    const handleDeleteAction = async () => {

        try {
            console.log(`Performing Delete on:`, selectedTestLogs);

            if (!selectedTestLogs || selectedTestLogs.size === 0) {
                toast.error("No test logs selected for deletion.");
                return;
            }

            let success = await deleteTestLogs([...selectedTestLogs]);

            if (success) {
                toast.success("Test Logs deleted successfully!");
                setSelectedTestLogs(new Set());
            } else {
                toast.error("Failed to delete some or all test logs.");
            }
        } catch (error) {
            console.error("Error deleting test logs:", error);
            toast.error("An unexpected error occurred during deletion.");
        }

    }

    const handleBulkAction = async (action: string) => {
        showDialog({
            title: `Confirm ${action}`,
            message: `Are you sure you want to ${action.toLowerCase()} the selected test logs?`,
            type: 'confirm',
            confirmLabel: 'Confirm',
            cancelLabel: 'Cancel',
            onConfirm: async () => {
                console.log(`${action} test logs:`, selectedTestLogs);
                if (action === 'Delete') {
                    await handleDeleteAction()
                }
                setSelectedTestLogs(new Set());
            }
        });
    };

    const handleRowAction = (action: string, itemId: number) => {
        showDialog({
            title: `Confirm ${action}`,
            message: `Are you sure you want to ${action.toLowerCase()} this test log?`,
            type: 'confirm',
            confirmLabel: 'Confirm',
            cancelLabel: 'Cancel',
            onConfirm: async () => {
                console.log(`${action} testLog ${itemId}`);
                if (action === 'Delete') {
                    try {
                        console.log(`Performing Delete on:`, itemId);

                        if (!itemId || itemId <= 0) {
                            toast.error("Invalid test log selected for deletion.");
                            return;
                        }

                        let success = await deleteTestLogs([itemId]);

                        if (success) {
                            toast.success("Test Log deleted successfully!");
                            setSelectedTestLog(null);
                        } else {
                            toast.error("Failed to delete test log.");
                        }
                    } catch (error) {
                        console.error("Error deleting test log:", error);
                        toast.error("An unexpected error occurred during deletion.");
                    }
                }
            }
        });
    };

    const handleTestLogClick = (testLog: TestLog) => {
        setSelectedTestLog(testLog);
    };


    return (
        <div className="p-2">
            <div className="mb-2">
                <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search test logs..."
                            value={logSearchTerm}
                            onChange={(e) => setLogSearchTerm(e.target.value)}
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
                            value={logFilters.status}
                            onChange={(e) => setLogFilters(prev => ({ ...prev, status: e.target.value }))}
                            className="rounded-md border border-gray-300"
                        >
                            <option value="">All Statuses</option>
                            {uniqueLogStatuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>

                        <select
                            value={logFilters.executedBy}
                            onChange={(e) => setLogFilters(prev => ({ ...prev, executedBy: e.target.value }))}
                            className="rounded-md border border-gray-300"
                        >
                            <option value="">All Executors</option>
                            {uniqueExecutors.map(executor => (
                                <option key={executor} value={executor}>{executor}</option>
                            ))}
                        </select>

                        <select
                            value={logFilters.defectCount}
                            onChange={(e) => setLogFilters(prev => ({ ...prev, defectCount: e.target.value }))}
                            className="rounded-md border border-gray-300"
                        >
                            <option value="">All Defect Counts</option>
                            <option value="0">No Defects</option>
                            <option value="1">1 Defect</option>
                            <option value="2">2 Defects</option>
                            <option value="3">3+ Defects</option>
                        </select>
                    </div>
                )}
                {selectedTestLogs.size > 0 && (
                    <div className="fixed bottom-4 right-10 flex gap-4 bg-white shadow-lg p-2 rounded-lg border">
                        <span className="flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                            {selectedTestLogs.size} Test Logs Selected
                        </span>
                        <button
                            onClick={() => handleBulkAction('Delete')}
                            className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                        </button>
                        <button
                            onClick={() => handleBulkAction('Copy')}
                            className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                        >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                        </button>
                        {/* <button
                            onClick={() => handleBulkAction('Move')}
                            className="flex items-center px-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-md"
                        >
                            <FolderInput className="h-4 w-4 mr-1" />
                            Move
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
                                    checked={selectedTestLogs.size === filteredTestLogs?.length}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedTestLogs(new Set(filteredTestLogs?.map(tl => tl.id)));
                                        } else {
                                            setSelectedTestLogs(new Set());
                                        }
                                    }}
                                    className="rounded border-gray-300 text-intelQEDarkBlue focus:ring-intelQEDarkBlue"
                                />
                            </th>
                            <th className="pr-6 pl-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Execution Time
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Executed By
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Defects
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTestLogs?.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50" onClick={() => handleTestLogClick(log)}>
                                <td className="pl-6 pr-2 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedTestLogs.has(log.id)}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            const newSelected = new Set(selectedTestLogs);
                                            if (e.target.checked) {
                                                newSelected.add(log.id);
                                            } else {
                                                newSelected.delete(log.id);
                                            }
                                            setSelectedTestLogs(newSelected);
                                        }}
                                        className="rounded border-gray-300 text-intelQEDarkBlue focus:ring-intelQEDarkBlue"
                                    />
                                </td>
                                <td className="pr-6 pl-2 py-4 whitespace-nowrap text-sm text-gray-500">
                                    #{log.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {getTimeAgo(convertGMTToLocal(log.executionTime))}
                                </td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${log.executedBy == 'intelQE' ?'text-intelQEDarkBlue' : 'text-gray-500'}`}>
                                    {log.executedBy}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {log.defects.length}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs rounded-full ${log.result === 'Pass' ? 'bg-green-100 text-green-800' :
                                        log.result === 'Fail' ? 'bg-red-100 text-red-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                        {log.result}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveDropdown(activeDropdown === log.id ? null : log.id);
                                            }}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <MoreVertical className="h-5 w-5" />
                                        </button>
                                        {activeDropdown === log.id && (
                                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                                <div className="py-1">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRowAction('Delete', log.id);
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

            {selectedTestLog && (
                <TestLogDetail
                    testLog={selectedTestLog}
                    onClose={() => setSelectedTestLog(null)}
                />
            )}

        </div>
    );
}