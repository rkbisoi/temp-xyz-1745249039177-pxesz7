import { useState, useEffect } from 'react';
import { Clock, Search, SlidersHorizontal, Timer, Database, BookOpen, Puzzle, ArrowUpDown, Trash2, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { ExecutionLog } from '../types';
import { API_URL } from '../../../data';
import { convertGMTToLocal, getTimeAgo } from '../../../utils/utils';
import { getUserNameById } from '../../../services/userService';
import { useDialog } from '../../shared/DialogProvider';
import toast from 'react-hot-toast';
import { deleteExecutionLogs } from '../../../services/executionLogService';

interface ExecutionLogListProps {
    projectId: number;
    executionId: number;
}

type SortField = 'execTime' | 'execTimeTaken' | 'createdBy';
type SortOrder = 'asc' | 'desc';

export default function ExecutionLogList({ projectId, executionId = -1 }: ExecutionLogListProps) {
    const { showDialog } = useDialog();
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
    const [logs, setLogs] = useState<ExecutionLog[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        isScheduled: '',
        hasRerun: '',
        createdBy: ''
    });
    const [sort, setSort] = useState<{ field: SortField | null, order: SortOrder }>({
        field: null,
        order: 'desc'
    });
    const [loading, setLoading] = useState(true);
    const [uniqueUsers, setUniqueUsers] = useState<number[]>([]);
    const [userNames, setUserNames] = useState<Record<number, string>>({});
    const [selectedExecutionLogs, setSelectedExecutionLogs] = useState<Set<number>>(new Set());
    const [selectedExecutionLog, setSelectedExecutionLog] = useState<ExecutionLog | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;




    useEffect(() => {
        const fetchLogs = async () => {
            // const mockData = mockExecutionLogs;
            // setLogs(mockData);

            // // Extract unique user IDs
            // const userIds = [...new Set(mockData.map(log => log.createdBy))].filter(
            //     (id): id is number => typeof id === 'number'
            // );
            // setUniqueUsers(userIds);

            setLoading(false);

            try {
                var url = `${API_URL}/execution-logs?project_id=${projectId}`

                if(executionId > 0){
                    url = `${API_URL}/execution_logs/schedule/${executionId}`
                }

                const response = await fetch(url, {
                    credentials: 'include'
                });

                if (!response.ok) {
                    setLogs([]);
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                if (data.success && Array.isArray(data.data)) {
                    setLogs(data.data);

                    // Extract unique user IDs from actual data
                    const userIds = [...new Set(data.data.map((log: ExecutionLog) => log.createdBy))].filter(
                        (id): id is number => typeof id === 'number'
                    );
                    setUniqueUsers(userIds);

                    // Fetch usernames for all unique creator IDs
                    const userPromises = userIds.map(id => getUserNameById(id));
                    const users = await Promise.all(userPromises);

                    const userMap = users.reduce((acc, name, index) => {
                        const userId = userIds[index];
                        if (name && typeof userId === 'number') {
                            acc[userId] = name;
                        }
                        return acc;
                    }, {} as Record<number, string>);

                    setUserNames(userMap);

                } else {
                    throw new Error('Invalid data format received');
                }

                setCurrentPage(1);
            } catch (error) {
                console.error('Error fetching execution logs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [projectId]);

    const handleSort = (field: SortField) => {
        setSort(prev => ({
            field,
            order: prev.field === field && prev.order === 'desc' ? 'asc' : 'desc'
        }));
    };

    const sortedAndFilteredLogs = () => {
        // First apply filters
        let result = logs.filter(log => {
            const matchesSearch = log.instruction.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesScheduled = filters.isScheduled === '' || log.isScheduleLog === (filters.isScheduled === 'true');
            const matchesRerun = filters.hasRerun === '' || (log.is_rerun > 0) === (filters.hasRerun === 'true');
            const matchesCreatedBy = filters.createdBy === '' || log.createdBy.toString() === filters.createdBy;

            return matchesSearch && matchesScheduled && matchesRerun && matchesCreatedBy;
        });

        // Then apply sorting
        if (sort.field) {
            result = [...result].sort((a, b) => {
                let comparison = 0;

                if (sort.field === 'execTime') {
                    // Convert to timestamps for proper date comparison
                    const dateA = new Date(a.execTime).getTime();
                    const dateB = new Date(b.execTime).getTime();
                    comparison = dateA - dateB;
                } else if (sort.field === 'execTimeTaken') {
                    comparison = a.execTimeTaken - b.execTimeTaken;
                } else if (sort.field === 'createdBy') {
                    comparison = a.createdBy - b.createdBy;
                }

                return sort.order === 'asc' ? comparison : -comparison;
            });
        }

        return result;
    };

    const formatDuration = (milliseconds: number) => {
        const seconds = Math.floor(milliseconds / 1000); // Convert to seconds
        const remainingMilliseconds = milliseconds % 1000; // Get remaining milliseconds

        if (seconds < 60) return `${seconds}s ${remainingMilliseconds}ms`;

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        return `${minutes}m ${remainingSeconds}s ${remainingMilliseconds}ms`;
    };


    const renderSortIcon = (field: SortField) => {
        return (
            <button
                onClick={() => handleSort(field)}
                className={`ml-1 p-1 rounded hover:bg-gray-200 ${sort.field === field ? 'text-blue-500' : 'text-gray-400'}`}
                title={`Sort by ${field}`}
            >
                <ArrowUpDown className="h-3 w-3" />
            </button>
        );
    };

    if (loading) {
        return <div className="p-4 text-center">Loading execution logs...</div>;
    }



    const handleRowAction = (action: string, itemId: number) => {
        showDialog({
            title: `Confirm ${action}`,
            message: `Are you sure you want to ${action.toLowerCase()} this execution log?`,
            type: 'confirm',
            confirmLabel: 'Confirm',
            cancelLabel: 'Cancel',
            onConfirm: async () => {
                console.log(`${action} execution log ${itemId}`);
                if(action === 'Delete'){
                    try {
                        console.log(`Performing Delete on:`, itemId);
            
                        if (!itemId || itemId <= 0) {
                            toast.error("No execution log selected for deletion.");
                            return;
                        }
            
                        let success = await deleteExecutionLogs([itemId]);
            
                        if (success) {
                            toast.success("Execution Log deleted successfully!");
                            setSelectedExecutionLog(null);
                        } else {
                            toast.error("Failed to delete execution log.");
                        }
                    } catch (error) {
                        console.error("Error deleting execution log:", error);
                        toast.error("An unexpected error occurred during deletion.");
                    }
                }
            }
        });
    };

    const handleDeleteAction = async () => {

        try {
            console.log(`Performing Delete on:`, selectedExecutionLogs);

            if (!selectedExecutionLogs || selectedExecutionLogs.size === 0) {
                toast.error("No execution logs selected for deletion.");
                return;
            }

            let success = await deleteExecutionLogs([...selectedExecutionLogs]);

            if (success) {
                toast.success("Execution Logs deleted successfully!");
                setSelectedExecutionLogs(new Set());
            } else {
                toast.error("Failed to delete some or all execution logs.");
            }
        } catch (error) {
            console.error("Error deleting execution logs:", error);
            toast.error("An unexpected error occurred during deletion.");
        }

    }

    const handleBulkAction = async(action: string) => {

        showDialog({
            title: `Confirm ${action}`,
            message: `Are you sure you want to ${action.toLowerCase()} the selected execution logs?`,
            type: 'confirm',
            confirmLabel: 'Confirm',
            cancelLabel: 'Cancel',
            onConfirm: async () => {
                console.log(`${action} execution logs:`, selectedExecutionLogs);
                if(action === 'Delete'){
                    await handleDeleteAction()
                }
                setSelectedExecutionLogs(new Set());
            }
        });
    };

     // Pagination calculations
  
    const displayLogs = sortedAndFilteredLogs();


    const totalPages = Math.ceil(displayLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedLogs = displayLogs.slice(startIndex, endIndex);

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };




    return (
        <div className="">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold text-gray-900 ml-2">Execution Logs</h2>
            </div>

            <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search execution logs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border rounded-md"
                    />
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-2 border rounded-md hover:bg-gray-50"
                    title="Show filters"
                >
                    <SlidersHorizontal className="h-5 w-5" />
                </button>
            </div>

            {showFilters && (
                <div className="flex flex-wrap gap-4 justify-end mb-4">
                    <select
                        value={filters.isScheduled}
                        onChange={(e) => setFilters(prev => ({ ...prev, isScheduled: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                        <option value="">All Types</option>
                        <option value="true">Scheduled</option>
                        <option value="false">Manual</option>
                    </select>

                    <select
                        value={filters.hasRerun}
                        onChange={(e) => setFilters(prev => ({ ...prev, hasRerun: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                        <option value="">All Execution Types</option>
                        <option value="true">Rerun</option>
                        <option value="false">Original</option>
                    </select>

                    <select
                        value={filters.createdBy}
                        onChange={(e) => setFilters(prev => ({ ...prev, createdBy: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                        <option value="">All Users</option>
                        {uniqueUsers.map(userId => (
                            <option key={userId} value={userId}>
                                {userNames[userId] || `User ${userId}`}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {selectedExecutionLogs.size > 0 && (
                <div className="fixed bottom-4 right-10 flex gap-4 bg-white shadow-lg p-2 rounded-lg border">
                    <span className="flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                        {selectedExecutionLogs.size} Test Logs Selected
                    </span>
                    <button
                        onClick={() => handleBulkAction('Delete')}
                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                    </button>
                    {/* <button
                        onClick={() => handleBulkAction('Copy')}
                        className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                    </button> */}
                    {/* <button
                            onClick={() => handleBulkAction('Move')}
                            className="flex items-center px-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-md"
                        >
                            <FolderInput className="h-4 w-4 mr-1" />
                            Move
                        </button> */}
                </div>
            )}

            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                {displayLogs.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        No execution logs available or found matching your criteria.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="pl-6 pr-2 py-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedExecutionLogs.size === displayLogs.length}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => setSelectedExecutionLogs(new Set(e.target.checked ? displayLogs.map((log) => log.execId) : []))}
                                        />
                                    </th>
                                    <th className="pr-6 pl-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Instruction
                                    </th> */}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Resources
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Execution Time
                                        {renderSortIcon('execTime')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Duration
                                        {renderSortIcon('execTimeTaken')}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created By
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Test Suite
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedLogs.map((log) => (
                                    <tr key={log.execId} className="hover:bg-gray-50">
                                        <td className="pl-6 pr-2 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedExecutionLogs.has(log.execId)}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={() => {
                                                    const newSelected = new Set(selectedExecutionLogs);
                                                    newSelected.has(log.execId) ? newSelected.delete(log.execId) : newSelected.add(log.execId);
                                                    setSelectedExecutionLogs(newSelected);
                                                }}
                                            />
                                        </td>
                                        <td className="pr-6 pl-2 py-4 whitespace-nowrap text-sm text-gray-500">
                                            #{log.execId}
                                        </td>
                                        {/* <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{log.instruction}</div>
                                            {log.is_rerun > 0 && log.parent_exec_id && (
                                                <span className="text-xs text-gray-500">Rerun of #{log.parent_exec_id}</span>
                                            )}
                                        </td> */}
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">

                                                <div className="flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                    <Puzzle className="h-3 w-3 mr-1" />
                                                    {log.componentIds.length || 0}
                                                </div>


                                                <div className="flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                    <Database className="h-3 w-3 mr-1" />
                                                    {log.dataModelIds.length || 0}
                                                </div>


                                                <div className="flex items-center text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                                    <BookOpen className="h-3 w-3 mr-1" />
                                                    {log.knowledgeIds.length || 0}
                                                </div>

                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Clock className="h-4 w-4 mr-1" />
                                                {getTimeAgo(convertGMTToLocal(log.execTime))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Timer className="h-4 w-4 mr-1" />
                                                {formatDuration(log.execTimeTaken)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {userNames[log.createdBy] || `User ${log.createdBy}`}
                                            {/* User {log.createdBy} */}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded-full ${log.isScheduleLog
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {log.isScheduleLog ? 'Scheduled' : 'Manual'}
                                            </span>
                                        </td>
                                        {log.usedIds ? (<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {log.usedIds.suite_id ? `#${log.usedIds.suite_id}` : 'N/A'}
                                        </td>) : (
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                N/A
                                            </td>
                                        )}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveDropdown(activeDropdown === log.execId ? null : log.execId);
                                                    }}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    <MoreVertical className="h-5 w-5" />
                                                </button>
                                                {activeDropdown === log.execId && (
                                                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                                        <div className="py-1">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleRowAction('Delete', log.execId);
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
                )}

            </div>

            
{displayLogs.length > 0 && (
        <div className="flex justify-between items-center mt-4 px-4">
          <span className="text-sm text-gray-700">
            Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
            {' '} - Total {displayLogs.length} items
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
        </div>
    );
}