import { useEffect, useMemo, useState } from 'react';
import { Copy, Trash2, User } from 'lucide-react';
import { TestLog } from '../types';
import { convertGMTToLocal, formatUserName, getTimeAgo } from '../../../utils/utils';
import { deleteTestCases } from '../../../services/testCaseService';
import { fetchTestLogsByTestSuiteId } from '../../../services/testsuiteService';

import { useDataList } from '../../shared/DataListHook';
import { useActions } from '../../shared/ActionHook';
import { emitter } from '../../../utils/eventEmitter';
import { Column, DataTable } from '../../shared/DataTable';
import { FilterDropdown, RowActionsMenu, SearchFilterBar } from '../../shared/ReusableComponents';
import TestLogDetail from './TestLogDetail';

interface TestLogListProps {
    testSuiteId: number;
}

export default function TestLogList({ testSuiteId }: TestLogListProps) {

    const [testLogs, setTestCases] = useState<TestLog[]>([]);

    const filterTestCase = (log: TestLog, logSearchTerm: string, logFilters: Record<string, string>) => {
        const matchesSearch = (
            log.summary.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
            log.executedBy.toLowerCase().includes(logSearchTerm.toLowerCase())
        );

        const matchesStatus = !logFilters.status || log.result === logFilters.status;
        const matchesExecutedBy = !logFilters.executedBy || log.executedBy === logFilters.executedBy;
        const matchesDefectCount = !logFilters.defectCount || log.defects.length.toString() === logFilters.defectCount;

        return matchesSearch && matchesStatus && matchesExecutedBy && matchesDefectCount;
    };

    // Sort test suites by date
    const sortTestCase = (a: TestLog, b: TestLog, sortOrder: string) => {
        // Parse dates in format MM/DD/YYYY HH:MM:SS
        const parseCustomDate = (dateStr: string) => {
            if (!dateStr) return 0;

            const [datePart, timePart] = dateStr.split(' ');
            const [month, day, year] = datePart.split('/');
            const [hours, minutes, seconds] = timePart.split(':');

            return new Date(
                parseInt(year),
                parseInt(month) - 1,
                parseInt(day),
                parseInt(hours),
                parseInt(minutes),
                parseInt(seconds)
            ).getTime();
        };

        const dateA = parseCustomDate(a.executionTime);
        const dateB = parseCustomDate(b.executionTime);

        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    };


    // Initialize the data list hook with test suites
    const {
        filteredData: filteredTestCases,
        paginatedData,
        selectedItems: selectedTestCases,
        filters,
        searchTerm,
        showFilters,
        currentPage,
        totalPages,
        activeDropdown,
        selectedItem: selectedTestLog,
        totalItems,
        setSearchTerm,
        setFilters,
        setShowFilters,
        setActiveDropdown,
        setSelectedItem: setSelectedTestLog,
        toggleItemSelection,
        toggleAllSelection,
        handleNextPage,
        handlePrevPage,
        clearSelectedItems
    } = useDataList<TestLog>({
        initialData: testLogs,
        getItemId: (log: { id: any; }) => log.id,
        filterFunction: filterTestCase,
        sortFunction: sortTestCase,
        initialFilters: { dateSort: 'newest' }
    });


    const { handleDeleteAction, handleCopyAction, confirmAction } = useActions<TestLog>({
        itemType: 'testCase',
        deleteFunc: async (ids) => {
            const suitesToDelete = testLogs.filter(log => ids.includes(log.id)).map(log => log.id);;
            return await deleteTestCases(suitesToDelete);
        },
        onSuccess: () => {
            emitter.emit('refreshTestLogList');
        },
        selectedItems: selectedTestCases,
        clearSelection: clearSelectedItems,
        getItems: (selectedIds) => testLogs.filter(log => selectedIds.has(log.id))
    });


    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedTestSuites = await fetchTestLogsByTestSuiteId(testSuiteId);
                setTestCases(fetchedTestSuites);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

        // Set up event listener for refreshing the list
        const refreshListener = () => {
            fetchData();
        };

        emitter.on('refreshTestLogList', refreshListener);

        return () => {
            emitter.off('refreshTestLogList', refreshListener);
        };
    }, [testSuiteId]);


    // Extract unique filter options
    const uniqueUsers = useMemo(() =>
        [...new Set(testLogs.map(log => log.createdByUser))],
        [testLogs]
    );

    const uniqueStatuses = useMemo(() =>
        [...new Set(testLogs.map(log => log.result))],
        [testLogs]
    );


    const columns: Column<TestLog>[] = [
        {
            header: 'ID',
            accessor: log => <>#{log.id}</>,
            cellClassName: 'pl-2 py-4 whitespace-nowrap text-sm text-gray-500'
        },
        {
            header: 'Execution Time',
            accessor: log => (
                getTimeAgo(convertGMTToLocal(log.executionTime))
            ),
            cellClassName: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500'
        },
        {
            header: 'Executed By',
            accessor: log => (
                log.executedBy
            ),
            cellClassName: `px-6 py-4 whitespace-nowrap text-sm text-intelQEDarkBlue`
        },
        {
            header: 'Test Cases',
            accessor: log => (
                log.logs.total_tests
            ),
            cellClassName: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500 pl-8'
        },
        {
            header: 'Passed',
            accessor: log => (
                log.passedCases.length
            ),
            cellClassName: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500 pl-8'
        },
        {
            header: 'Failed',
            accessor: log => (
                log.defects.length
            ),
            cellClassName: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500 pl-8'
        },
        {
            header: 'Status',
            accessor: log => (
                <span className={`px-2 py-1 text-xs rounded-full ${log.result === 'Pass' ? 'bg-green-100 text-green-800 text-center' :
                    log.result === 'Fail' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                    }`}>
                    {log.result}
                </span>
            ),
            cellClassName: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500'
        },
        {
            header: 'Created By',
            accessor: log => (
                <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {formatUserName(log.updatedByUser)}
                </div>
            ),
            cellClassName: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500'
        },
    ];

    // Render row actions menu
    const renderRowActions = (log: TestLog) => (
        <RowActionsMenu
            isOpen={activeDropdown === log.id}
            onToggle={() => setActiveDropdown(activeDropdown === log.id ? null : log.id)}
            options={[
                {
                    label: 'Copy',
                    icon: <Copy className="h-4 w-4 mr-2" />,
                    onClick: () => handleCopyAction(log.id)
                },
                {
                    label: 'Delete',
                    icon: <Trash2 className="h-4 w-4 mr-2" />,
                    onClick: () => handleDeleteAction(log.id),
                    className: 'text-red-600'
                }
            ]}
        />
    );

    const handleTestLogClick = (testLog: TestLog) => {
        setSelectedTestLog(testLog);
    };


    return (
        <div className="p-2">


            <div className="mb-2">
                <SearchFilterBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    showFilters={showFilters}
                    onToggleFilters={() => setShowFilters(!showFilters)}
                    placeholder="Search test cases..."
                />

                {showFilters && (
                    <div className="flex gap-4 justify-end rounded-md mb-4">
                        <FilterDropdown
                            label="All Users"
                            value={filters.user || ''}
                            options={uniqueUsers.map(user => ({ value: user, label: user }))}
                            onChange={(value) => setFilters({ ...filters, user: value })}
                        />

                        <FilterDropdown
                            label="All Statuses"
                            value={filters.status || ''}
                            options={uniqueStatuses.map(status => ({ value: status, label: status }))}
                            onChange={(value) => setFilters({ ...filters, status: value })}
                        />

                        

                        <FilterDropdown
                            label="Sort By Date"
                            value={filters.dateSort || 'newest'}
                            options={[
                                { value: 'newest', label: 'Newest First' },
                                { value: 'oldest', label: 'Oldest First' }
                            ]}
                            onChange={(value) => setFilters({ ...filters, dateSort: value })}
                        />
                    </div>
                )}
            </div>

            <DataTable
                data={paginatedData}
                columns={columns}
                getItemId={(log) => log.id}
                selectedItems={selectedTestCases}
                onToggleSelection={toggleItemSelection}
                onToggleAllSelection={toggleAllSelection}
                onRowClick={handleTestLogClick}
                renderRowActions={renderRowActions}
                onBulkDelete={handleDeleteAction}
                onBulkCopy={handleCopyAction}
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                onPrevPage={handlePrevPage}
                onNextPage={handleNextPage}
                emptyMessage="No test suites found matching your filters."
            />

            {selectedTestLog && (
                            <TestLogDetail
                                testLog={selectedTestLog}
                                onClose={() => setSelectedTestLog(null)}
                            />
                        )}
        </div>
    );

}