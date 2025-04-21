import { useEffect, useMemo, useState } from 'react';
import { Copy, Trash2, Clock, User } from 'lucide-react';
import { TestCase } from '../types';
import { convertGMTToLocal, formatUserName, getTimeAgo } from '../../../utils/utils';
import TestCaseDetail from './TestCaseDetail';
import { deleteTestCases } from '../../../services/testCaseService';
import { fetchTestCasesByTestSuiteId } from '../../../services/testsuiteService';

import { useDataList } from '../../shared/DataListHook';
import { useActions } from '../../shared/ActionHook';
import { emitter } from '../../../utils/eventEmitter';
import { Column, DataTable } from '../../shared/DataTable';
import { FilterDropdown, RowActionsMenu, SearchFilterBar } from '../../shared/ReusableComponents';

interface TestCaseListProps {
    testSuiteId: number;
}

export default function TestCaseList({ testSuiteId }: TestCaseListProps) {

    const [testCases, setTestCases] = useState<TestCase[]>([]);

    const filterTestCase = (testCase: TestCase, searchTerm: string, filters: Record<string, string>) => {
        const userMatch = !filters.user || testCase.createdByUser === filters.user;
        const statusMatch = !filters.status || testCase.status === filters.status;
        const searchMatch = !searchTerm ||
            testCase.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            testCase.description.toLowerCase().includes(searchTerm.toLowerCase());

        return userMatch && statusMatch && searchMatch;
    };

    // Sort test suites by date
    const sortTestCase = (a: TestCase, b: TestCase, sortOrder: string) => {
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

        const dateA = parseCustomDate(a.updatedAt);
        const dateB = parseCustomDate(b.updatedAt);

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
        selectedItem: selectedTestCase,
        totalItems,
        setSearchTerm,
        setFilters,
        setShowFilters,
        setActiveDropdown,
        setSelectedItem: setSelectedTestCase,
        toggleItemSelection,
        toggleAllSelection,
        handleNextPage,
        handlePrevPage,
        clearSelectedItems
    } = useDataList<TestCase>({
        initialData: testCases,
        getItemId: (tc: { id: any; }) => tc.id,
        filterFunction: filterTestCase,
        sortFunction: sortTestCase,
        initialFilters: { dateSort: 'newest' }
    });


    const { handleDeleteAction, handleCopyAction, confirmAction } = useActions<TestCase>({
        itemType: 'testCase',
        deleteFunc: async (ids) => {
            const suitesToDelete = testCases.filter(tc => ids.includes(tc.id)).map(tc => tc.id);;
            return await deleteTestCases(suitesToDelete);
        },
        onSuccess: () => {
            emitter.emit('refreshTestCaseList');
        },
        selectedItems: selectedTestCases,
        clearSelection: clearSelectedItems,
        getItems: (selectedIds) => testCases.filter(tc => selectedIds.has(tc.id))
    });


    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedTestSuites = await fetchTestCasesByTestSuiteId(testSuiteId);
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

        emitter.on('refreshTestCaseList', refreshListener);

        return () => {
            emitter.off('refreshTestCaseList', refreshListener);
        };
    }, [testSuiteId]);


    // Extract unique filter options
    const uniqueUsers = useMemo(() =>
        [...new Set(testCases.map(tc => tc.createdByUser))],
        [testCases]
    );

    const uniqueStatuses = useMemo(() =>
        [...new Set(testCases.map(tc => tc.status))],
        [testCases]
    );

    const uniquePriorities = useMemo(() =>
        [...new Set(testCases.map(tc => tc.priority))],
        [testCases]
    );


    const columns: Column<TestCase>[] = [
        {
            header: 'ID',
            accessor: tc => <>#{tc.id}</>,
            cellClassName: 'pr-6 pl-2 py-4 whitespace-nowrap text-sm text-gray-500'
        },
        {
            header: 'Test Case',
            accessor: tc => (
                <div className="flex items-center">
                    <div className="ml-3">
                        <div title={tc.name} className="text-sm font-semibold text-gray-900 min-w-48 max-w-80 truncate">
                            {tc.name}
                        </div>
                        <div title={tc.description} className="text-xs text-gray-500 min-w-48 max-w-80 truncate">
                            {tc.description}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Steps',
            accessor: tc => (
                <div className="flex flex-col">
                    <span className="text-sm text-gray-500 text-center">{tc.steps_json_data.length || 0}</span>
                </div>
            ),
            cellClassName: 'px-6 py-4 whitespace-nowrap'
        },
        {
            header: 'Priority',
            accessor: tc => (
                <div className="flex flex-col items-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${tc.priority === 'high' ? 'bg-red-100 text-red-800' :
                        tc.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                        }`}>
                        {tc.priority}
                    </span>
                </div>
            ),
            cellClassName: 'px-4 py-4 whitespace-nowrap'
        },
        {
            header: 'Created By',
            accessor: tc => (
                <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {formatUserName(tc.updatedByUser)}
                </div>
            ),
            cellClassName: 'px-4 py-4 whitespace-nowrap text-sm text-gray-500'
        },
        {
            header: 'Updated At',
            accessor: tc => (
                <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {getTimeAgo(convertGMTToLocal(tc.updatedAt))}
                </div>
            ),
            cellClassName: 'px-4 py-4 whitespace-nowrap text-sm text-gray-500'
        }
    ];

    // Render row actions menu
    const renderRowActions = (tc: TestCase) => (
        <RowActionsMenu
            isOpen={activeDropdown === tc.id}
            onToggle={() => setActiveDropdown(activeDropdown === tc.id ? null : tc.id)}
            options={[
                {
                    label: 'Copy',
                    icon: <Copy className="h-4 w-4 mr-2" />,
                    onClick: () => handleCopyAction(tc.id)
                },
                {
                    label: 'Delete',
                    icon: <Trash2 className="h-4 w-4 mr-2" />,
                    onClick: () => handleDeleteAction(tc.id),
                    className: 'text-red-600'
                }
            ]}
        />
    );

    const handleTestCaseClick = (testCase: TestCase) => {
        setSelectedTestCase(testCase);
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
                            label="All Priority"
                            value={filters.priority || ''}
                            options={uniquePriorities.map(priority => ({ value: priority, label: priority }))}
                            onChange={(value) => setFilters({ ...filters, priority: value })}
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
                getItemId={(tc) => tc.id}
                selectedItems={selectedTestCases}
                onToggleSelection={toggleItemSelection}
                onToggleAllSelection={toggleAllSelection}
                onRowClick={handleTestCaseClick}
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

            {selectedTestCase && (
                <TestCaseDetail
                    testCase={selectedTestCase}
                    onClose={() => setSelectedTestCase(null)}
                />
            )}
        </div>
    );

}