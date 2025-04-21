import { useState, useEffect, useMemo } from 'react';
import { Clock, User, Copy, Trash2 } from 'lucide-react';
import TestSuiteForm from './TestSuiteForm';
import { TestSuite } from '../types';
import { deleteTestSuites, fetchTestSuitesByPrjId } from '../../../services/testsuiteService';
import { convertGMTToLocal, formatUserName, getTestSuiteStatus, getTimeAgo } from '../../../utils/utils';
import { emitter } from '../../../utils/eventEmitter';
import { SearchFilterBar, FilterDropdown, RowActionsMenu } from '../../shared/ReusableComponents';
import { DataTable, Column } from '../../shared/DataTable';
import { useActions } from '../../shared/ActionHook';
import { useDataList } from '../../shared/DataListHook';
import TestSuiteDetails from './TestSuiteDetails';

interface TestSuiteListProps {
  projId: number;
}

export default function TestSuiteList({ projId = -1 }: TestSuiteListProps) {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // Filter test suites based on search and filters
  const filterTestSuite = (suite: TestSuite, searchTerm: string, filters: Record<string, string>) => {
    const userMatch = !filters.user || suite.createdByUser === filters.user;
    const statusMatch = !filters.status || getTestSuiteStatus(suite) === filters.status;
    const searchMatch = !searchTerm || 
      suite.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      suite.description.toLowerCase().includes(searchTerm.toLowerCase());

    return userMatch && statusMatch && searchMatch;
  };

  // Sort test suites by date
  const sortTestSuites = (a: TestSuite, b: TestSuite, sortOrder: string) => {
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
    filteredData: filteredTestSuites,
    paginatedData,
    selectedItems: selectedTestSuites,
    filters,
    searchTerm,
    showFilters,
    currentPage,
    totalPages,
    activeDropdown,
    selectedItem: selectedSuite,
    totalItems,
    setSearchTerm,
    setFilters,
    setShowFilters,
    setActiveDropdown,
    setSelectedItem: setSelectedSuite,
    toggleItemSelection,
    toggleAllSelection,
    handleNextPage,
    handlePrevPage,
    clearSelectedItems
  } = useDataList<TestSuite>({
    initialData: testSuites,
    getItemId: (suite: { id: any; }) => suite.id,
    filterFunction: filterTestSuite,
    sortFunction: sortTestSuites,
    initialFilters: { dateSort: 'newest' }
  });

  // Actions handlers
  const { handleDeleteAction, handleCopyAction, confirmAction } = useActions<TestSuite>({
    itemType: 'testSuite',
    deleteFunc: async (ids) => {
      const suitesToDelete = testSuites.filter(suite => ids.includes(suite.id));
      return await deleteTestSuites(suitesToDelete);
    },
    onSuccess: () => {
      emitter.emit('refreshTestSuiteList');
    },
    selectedItems: selectedTestSuites,
    clearSelection: clearSelectedItems,
    getItems: (selectedIds) => testSuites.filter(suite => selectedIds.has(suite.id))
  });

  // Fetch test suites on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTestSuites = await fetchTestSuitesByPrjId(projId);
        setTestSuites(fetchedTestSuites);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // Set up event listener for refreshing the list
    const refreshListener = () => {
      fetchData();
    };

    emitter.on('refreshTestSuiteList', refreshListener);

    return () => {
      emitter.off('refreshTestSuiteList', refreshListener);
    };
  }, [projId]);

  // Extract unique filter options
  const uniqueUsers = useMemo(() => 
    [...new Set(testSuites.map(suite => suite.createdByUser))], 
    [testSuites]
  );

  const uniqueStatuses = useMemo(() => 
    [...new Set(testSuites.map(suite => getTestSuiteStatus(suite)))], 
    [testSuites]
  );

  // Define table columns
  const columns: Column<TestSuite>[] = [
    {
      header: 'ID',
      accessor: suite => <>#{suite.id}</>,
      cellClassName: 'pr-6 pl-2 py-4 whitespace-nowrap text-sm text-gray-500'
    },
    {
      header: 'Test Suite',
      accessor: suite => (
        <div className="flex items-center">
          <div className="ml-3">
            <div title={suite.name} className="text-sm font-semibold text-gray-900 min-w-48 max-w-80 truncate">
              {suite.name}
            </div>
            <div title={suite.description} className="text-xs text-gray-500 min-w-48 max-w-80 truncate">
              {suite.description}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Test Cases',
      accessor: suite => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 text-center">{suite.totalTestCases}</span>
        </div>
      ),
      cellClassName: 'px-6 py-4 whitespace-nowrap'
    },
    {
      header: 'Test Logs',
      accessor: suite => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Total: {suite.totalTestSuiteLogs}</span>
          <div className="text-xs mt-1">
            <span className="text-green-600 mr-2">Passed: {suite.totalPassed}</span>
            <span className="text-red-600 mr-2">Failed: {suite.totalFailed}</span>
          </div>
        </div>
      ),
      cellClassName: 'px-4 py-4 whitespace-nowrap'
    },
    {
      header: 'Created By',
      accessor: suite => (
        <div className="flex items-center">
          <User className="h-4 w-4 mr-2" />
          {formatUserName(suite.updatedByUser)}
        </div>
      ),
      cellClassName: 'px-4 py-4 whitespace-nowrap text-sm text-gray-500'
    },
    {
      header: 'Updated At',
      accessor: suite => (
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          {getTimeAgo(convertGMTToLocal(suite.updatedAt))}
        </div>
      ),
      cellClassName: 'px-4 py-4 whitespace-nowrap text-sm text-gray-500'
    }
  ];

  // Render row actions menu
  const renderRowActions = (suite: TestSuite) => (
    <RowActionsMenu
      isOpen={activeDropdown === suite.id}
      onToggle={() => setActiveDropdown(activeDropdown === suite.id ? null : suite.id)}
      options={[
        {
          label: 'Copy',
          icon: <Copy className="h-4 w-4 mr-2" />,
          onClick: () => handleCopyAction(suite.id)
        },
        {
          label: 'Delete',
          icon: <Trash2 className="h-4 w-4 mr-2" />,
          onClick: () => handleDeleteAction(suite.id),
          className: 'text-red-600'
        }
      ]}
    />
  );

  if (selectedSuite) {
    return <TestSuiteDetails suite={selectedSuite} onBack={() => setSelectedSuite(null)} />;
  }

  return (
    <div className="">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-gray-900 ml-2">Test Suites</h2>
        <div className="flex gap-4">
          <button className="btn1" onClick={() => setShowForm(true)}>
            Create Test Suite
          </button>
        </div>
      </div>

      <div className="mb-2">
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          placeholder="Search test suites..."
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
        getItemId={(suite) => suite.id}
        selectedItems={selectedTestSuites}
        onToggleSelection={toggleItemSelection}
        onToggleAllSelection={toggleAllSelection}
        onRowClick={setSelectedSuite}
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

      {showForm && (
        <TestSuiteForm
          projectId={projId}
          onClose={() => setShowForm(false)}
          testSuites={testSuites}
        />
      )}
    </div>
  );
}