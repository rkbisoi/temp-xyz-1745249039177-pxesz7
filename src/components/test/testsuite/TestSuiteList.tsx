import { useState, useMemo, useEffect } from 'react';
import { Clock, User, SlidersHorizontal, Search, Copy, Trash2, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

import TestSuiteForm from './TestSuiteForm.tsx';
import { TestSuite } from '../types.ts';
import { deleteTestSuites, fetchTestSuitesByPrjId } from '../../../services/testsuiteService.ts';
import { convertGMTToLocal, formatUserName, getTestSuiteStatus, getTimeAgo } from '../../../utils/utils.ts';
import { useDialog } from '../../shared/DialogProvider.tsx';
import toast from 'react-hot-toast';
import TestSuiteDetails from './TestSuiteDetails.tsx';
import { emitter } from '../../../utils/eventEmitter.ts';

interface TestSuiteListProps {
  projId: number
}

export default function TestSuiteList({
  projId = -1
}: TestSuiteListProps) {
  const [selectedSuite, setSelectedSuite] = useState<TestSuite | null>(null);
  const [filters, setFilters] = useState({
    user: '',
    status: '',
    dateSort: 'newest' // Default to newest first
  });
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [selectedTestSuites, setSelectedTestSuites] = useState<Set<number>>(new Set());
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  const { showDialog } = useDialog();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTestSuites = await fetchTestSuitesByPrjId(projId);
        setTestSuites(fetchedTestSuites);

        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    emitter.on('refreshTestSuiteList', () => {
      fetchData();
    });
  }, [projId]);



  const uniqueUsers = [...new Set(testSuites.map(suite => suite.createdByUser))]

  // Extract unique statuses from test suites
  const uniqueStatuses = [...new Set(testSuites.map(suite => getTestSuiteStatus(suite)))];

  const filteredAndSortedSuites = useMemo(() => {
    // First filter the suites
    const filtered = testSuites.filter(suite => {
      const userMatch = !filters.user || suite.createdByUser === filters.user;
      const statusMatch = !filters.status || getTestSuiteStatus(suite) === filters.status;
      const searchMatch =
        !searchTerm ||
        suite.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        suite.description.toLowerCase().includes(searchTerm.toLowerCase());

      return userMatch && statusMatch && searchMatch;
    });

    // Then sort by date
    return [...filtered].sort((a, b) => {
      // Parse dates in format MM/DD/YYYY HH:MM:SS
      const parseCustomDate = (dateStr: string) => {
        if (!dateStr) return 0;

        const [datePart, timePart] = dateStr.split(' ');
        const [month, day, year] = datePart.split('/');
        const [hours, minutes, seconds] = timePart.split(':');

        // JavaScript months are 0-indexed, so subtract 1 from month
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

      return filters.dateSort === 'newest'
        ? dateB - dateA  // Newest first
        : dateA - dateB; // Oldest first
    });
  }, [filters, searchTerm, testSuites]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedSuites.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSuites = filteredAndSortedSuites.slice(startIndex, endIndex);

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

  const handleClose = () => {
    setShowForm(false);
  };

  const handleDeleteAction = async () => {
    try {
      console.log(`Performing Delete on:`, selectedTestSuites);

      if (!selectedTestSuites || selectedTestSuites.size === 0) {
        toast.error("No test suites selected for deletion.");
        return;
      }

      const filteredTestSuites = testSuites.filter(suite => selectedTestSuites.has(suite.id));


      let success = await deleteTestSuites(filteredTestSuites);

      if (success) {
        toast.success("Test Suites deleted successfully!");
        setSelectedTestSuites(new Set());
        emitter.emit("refreshTestSuiteList")
      } else {
        toast.error("Failed to delete some or all test suites.");
      }
    } catch (error) {
      console.error("Error deleting test suites:", error);
      toast.error("An unexpected error occurred during deletion.");
    }
  }

  const handleBulkAction = async (action: string) => {
    showDialog({
      title: `Confirm ${action}`,
      message: `Are you sure you want to ${action.toLowerCase()} the selected test suites?`,
      type: 'confirm',
      confirmLabel: 'Confirm',
      cancelLabel: 'Cancel',
      onConfirm: async () => {
        console.log(`${action} test suites:`, selectedTestSuites);
        if (action === 'Delete') {
          await handleDeleteAction();
        }
        setSelectedTestSuites(new Set());
      }
    });
  };

  const handleRowAction = (action: string, suiteId: number) => {
    showDialog({
      title: `Confirm ${action}`,
      message: `Are you sure you want to ${action.toLowerCase()} this test suite?`,
      type: 'confirm',
      confirmLabel: 'Confirm',
      cancelLabel: 'Cancel',
      onConfirm: async () => {
        console.log(`${action} test suite ${suiteId}`);
        if (action === 'Delete') {
          try {
            console.log(`Performing Delete on:`, suiteId);

            if (!suiteId || suiteId <= 0) {
              toast.error("Invalid test suite selected for deletion.");
              return;
            }

            const filteredTestSuites = testSuites.filter(suite => (suiteId === suite.id));

            let success = await deleteTestSuites(filteredTestSuites);

            if (success) {
              toast.success("Test Suite deleted successfully!");
              setSelectedSuite(null);

              emitter.emit("refreshTestSuiteList")
            } else {
              toast.error("Failed to delete test suite.");
            }
          } catch (error) {
            console.error("Error deleting test suite:", error);
            toast.error("An unexpected error occurred during deletion.");
          }
        }
      }
    });
  };

  if (selectedSuite) {
    return <TestSuiteDetails suite={selectedSuite} onBack={() => setSelectedSuite(null)} />;
  }

  return (
    <div className="p-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Test Suites</h2>
        <div className="flex gap-4">
          <button className='btn1' onClick={() => setShowForm(true)}>Create Test Suite</button>
        </div>
      </div>

      <div className="mb-2">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search test suites..."
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
              value={filters.user}
              onChange={(e) => setFilters(prev => ({ ...prev, user: e.target.value }))}
              className="rounded-md border border-gray-300"
            >
              <option value="">All Users</option>
              {uniqueUsers.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>

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
              value={filters.dateSort}
              onChange={(e) => setFilters(prev => ({ ...prev, dateSort: e.target.value }))}
              className="rounded-md border border-gray-300"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        )}

        {selectedTestSuites.size > 0 && (
          <div className="fixed bottom-4 right-10 flex gap-4 bg-white shadow-lg p-2 rounded-lg border">
            <span className="flex items-center px-4 py-2 text-sm font-medium text-gray-700">
              {selectedTestSuites.size} Test Suite Selected
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
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="pl-6 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedTestSuites.size === filteredAndSortedSuites.length && filteredAndSortedSuites.length > 0}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedTestSuites(new Set(filteredAndSortedSuites.map(suite => suite.id)));
                    } else {
                      setSelectedTestSuites(new Set());
                    }
                  }}
                  className="rounded border-gray-300 text-intelQEDarkBlue focus:ring-intelQEDarkBlue mt-1"
                />
              </th>
              <th className="pr-4 pl-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Test Suite
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Test Cases
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Test Logs
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created By
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated At
              </th>
              {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th> */}
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedSuites.map((suite) => (
              <tr
                key={suite.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedSuite(suite)}
              >
                <td className="pl-6 pr-2 py-4">
                  <input
                    type="checkbox"
                    checked={selectedTestSuites.has(suite.id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      e.stopPropagation();
                      const newSelected = new Set(selectedTestSuites);
                      if (e.target.checked) {
                        newSelected.add(suite.id);
                      } else {
                        newSelected.delete(suite.id);
                      }
                      setSelectedTestSuites(newSelected);
                    }}
                    className="rounded border-gray-300 text-intelQEDarkBlue focus:ring-intelQEDarkBlue"
                  />
                </td>
                <td className="pr-6 pl-2 py-4 whitespace-nowrap text-sm text-gray-500">
                  #{suite.id}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {/* {getStatusIcon(getTestSuiteStatus(suite))} */}
                    <div className="ml-3">
                      <div title={`${suite.name}`} className="text-sm font-semibold text-gray-900 min-w-48 max-w-80 truncate">{suite.name}</div>
                      <div title={`${suite.description}`} className="text-xs text-gray-500 min-w-48 max-w-80 truncate">{suite.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500 text-center mr-2">{suite.totalTestCases}</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Total: {suite.totalTestSuiteLogs}</span>
                    <div className="text-xs mt-1">
                      <span className="text-green-600 mr-2">Passed: {suite.totalPassed}</span>
                      <span className="text-red-600 mr-2">Failed: {suite.totalFailed}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {formatUserName(suite.updatedByUser)}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {getTimeAgo(convertGMTToLocal(suite.updatedAt))}
                  </div>
                </td>
                {/* <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 py-1 rounded-full ${getStatusBadgeColor(getTestSuiteStatus(suite))}`}>
                    {getTestSuiteStatus(suite)}
                  </span>
                </td> */}
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === suite.id ? null : suite.id);
                      }}
                      className="text-gray-400 hover:text-gray-600 flex items-center justify-center"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                    {activeDropdown === suite.id && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowAction('Copy', suite.id);
                            }}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowAction('Delete', suite.id);
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

      {filteredAndSortedSuites.length > 0 && (
        <div className="flex justify-between items-center mt-4 px-4">
          <span className="text-sm text-gray-700">
            Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
            {' '} - Total {filteredAndSortedSuites.length} items
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

      {filteredAndSortedSuites.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No test suites found matching your filters.
        </div>
      )}

      {showForm && (
        <TestSuiteForm
          projectId={projId}
          onClose={handleClose}
          testSuites={testSuites}
        />
      )}
    </div>
  );
}