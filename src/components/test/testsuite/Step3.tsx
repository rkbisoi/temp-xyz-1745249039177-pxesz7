// import { useState, useEffect } from 'react';
// import { Check, Search } from 'lucide-react';
// import { TestSuite } from '../types';

// type TestCase = {
//   id: number;
//   name: string;
//   description: string;
// };

// type Step3Props = {
//   testSuites: TestSuite[];
//   selectedTestCases: Set<number>;
//   setSelectedTestCases: (selectedIds: Set<number>) => void;
//   prevStep: () => void;
//   submitForm: () => void;
// };

// const Step3: React.FC<Step3Props> = ({
//   testSuites,
//   selectedTestCases,
//   setSelectedTestCases,
//   prevStep,
//   submitForm,
// }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set(selectedTestCases));

//   // Sync selectedIds with props when selectedTestCases changes
//   useEffect(() => {
//     setSelectedIds(new Set(selectedTestCases));
//   }, [selectedTestCases]);

//   // Filter test cases based on search term
//   // const filteredTestCases = testCases.filter((testCase) =>
//   //   testCase.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   //   (testCase.description || '').toLowerCase().includes(searchTerm.toLowerCase())
//   // );

//   // Toggle selection of a test case
//   const toggleSelection = (id: number) => {
//     const newSelected = new Set(selectedIds);
//     newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
//     setSelectedIds(newSelected);
//   };

//   // Handle form submission
//   const handleSubmit = () => {
//     setSelectedTestCases(selectedIds);
//     submitForm();
//   };

//   return (
//     <div className="p-4 bg-white rounded-lg">
//       {/* Header */}
//       <h2 className="text-lg font-semibold mb-2 text-intelQEDarkBlue">Select Test Cases</h2>

//       {/* Search Bar */}
//       <div className="mb-2 relative">
//         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//         <input
//           type="text"
//           placeholder="Search test cases..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//         />
//       </div>

//       {/* List of Test Cases */}
//       {/* <div className="max-h-96 overflow-y-auto mb-4 bg-gray-100 p-1 rounded-lg">
//         {filteredTestCases.length > 0 ? (
//           filteredTestCases.map((testCase) => (
//             <button
//               key={testCase.id}
//               type="button"
//               className={`flex items-center justify-between w-full px-4 p-2 mb-1 bg-white rounded-lg border cursor-pointer focus:outline-none ${
//                 selectedIds.has(testCase.id)
//                   ? 'border-sky-500 bg-sky-100'
//                   : 'border-gray-300 hover:bg-gray-50'
//               }`}
//               onClick={() => toggleSelection(testCase.id)}
//               aria-pressed={selectedIds.has(testCase.id)}
//             >

//               <div className=''>
//                 <h3 className="text-sm font-medium flex items-start justify-start">{testCase.name}</h3>
//                 <p className="text-xs text-gray-500 truncate flex items-start justify-start">
//                   {testCase.description || 'No description available'}
//                 </p>
//               </div>


//               {selectedIds.has(testCase.id) && <Check className="h-4 w-4 text-blue-500" />}
//             </button>
//           ))
//         ) : (
//           <p className="text-center text-gray-500">No test cases found.</p>
//         )}
//       </div> */}

//       {/* Action Buttons */}
//       <div className="flex justify-between">
//         <button onClick={prevStep} className="btn2">
//           Back
//         </button>
//         <button onClick={handleSubmit} className="btn1">
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Step3;

import { useState, useEffect } from 'react';
import { Check, Search, ChevronDown, ChevronUp, CheckSquare, Square } from 'lucide-react';
import { TestSuiteFormData } from './TestSuiteForm';

type TestCase = {
  suiteId: number;
  id: number;
  name: string;
  description: string;
};

type TestSuite = {
  id: number;
  name: string;
  description: string;
};

type Step3Props = {
  formData: TestSuiteFormData;
  testSuites: TestSuite[];
  availableTestCases: TestCase[]
  selectedTestCases: Set<number>;
  setSelectedTestCases: (selectedIds: Set<number>) => void;
  prevStep: () => void;
  submitForm: () => void;
};

const Step3: React.FC<Step3Props> = ({
  formData,
  testSuites,
  selectedTestCases,
  availableTestCases,
  setSelectedTestCases,
  prevStep,
  submitForm,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSuites, setExpandedSuites] = useState<Set<number>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set(selectedTestCases));

  // Sync selectedIds with props when selectedTestCases changes
  useEffect(() => {
    setSelectedIds(new Set(selectedTestCases));
  }, [selectedTestCases]);

  // Toggle expansion of a test suite
  const toggleExpansion = (suiteId: number) => {
    const newExpanded = new Set(expandedSuites);
    newExpanded.has(suiteId) ? newExpanded.delete(suiteId) : newExpanded.add(suiteId);
    setExpandedSuites(newExpanded);
  };

  // Select all test cases in a test suite
  const selectAllInSuite = (suiteId: number) => {
    const suite = testSuites.find((s) => s.id === suiteId);
    if (!suite) return;

    const newSelected = new Set(selectedIds);
    // availableTestCases.forEach((testCase) => newSelected.add(testCase.id));
    availableTestCases.forEach((testCase) => {
      if (testCase.suiteId === suiteId) {
        newSelected.add(testCase.id);
      }
    });
    setSelectedIds(newSelected);
  };

  // Deselect all test cases in a test suite
  const deselectAllInSuite = (suiteId: number) => {
    const suite = testSuites.find((s) => s.id === suiteId);
    if (!suite) return;

    const newSelected = new Set(selectedIds);
    // availableTestCases.forEach((testCase) => newSelected.delete(testCase.id));
    availableTestCases.forEach((testCase) => {
      if (testCase.suiteId === suiteId) {
        newSelected.delete(testCase.id);
      }
    });
    setSelectedIds(newSelected);
  };

  // Toggle selection of a single test case
  const toggleSelection = (id: number) => {
    const newSelected = new Set(selectedIds);
    newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
    setSelectedIds(newSelected);
  };

  // Handle form submission
  const handleSubmit = () => {
    setSelectedTestCases(selectedIds);
    formData.test_cases = selectedIds
    console.log("Final Submit : ", formData)
    submitForm();
  };

  // Filter test suites and test cases based on search term
  const filteredSuites = testSuites
    .map((suite) => ({
      ...suite,
      testCases: availableTestCases.filter(
        (tc) =>
          tc.suiteId == suite.id &&
          (tc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (tc.description || '').toLowerCase().includes(searchTerm.toLowerCase()))
      ),
    }))
    .filter(
      (suite) =>
        suite.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        suite.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        suite.testCases.length > 0
    );

  return (
    <div className="p-4 bg-white rounded-lg">
      {/* Header */}
      <h2 className="text-lg text-intelQEDarkBlue font-semibold mb-2">Select Test Cases</h2>

      {/* Search Bar */}
      <div className="mb-2 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search test suites or cases..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* List of Test Suites */}
      <div className="max-h-96 overflow-y-auto mb-2 bg-sky-50 p-1 rounded-md border border-sky-100">
        {filteredSuites.length > 0 ? (
          filteredSuites.map((suite) => {
            const isExpanded = expandedSuites.has(suite.id);
            const isSuiteSelected = suite.testCases.every((tc) => selectedIds.has(tc.id));

            return (
              <div key={suite.id} className="mb-2">
                {/* Test Suite Header */}
                <div
                  className={`flex items-center justify-between px-4 py-2 rounded-lg border cursor-pointer ${isSuiteSelected ? 'bg-intelQEBlue text-white' : 'bg-gray-50 border-gray-300  hover:bg-gray-100'}`}
                  onClick={() => toggleExpansion(suite.id)}
                >
                  <div>
                    <h3 className="text-sm font-medium w-[440px] truncate">{suite.name}</h3>
                    <p className={`text-xs w-[440px] truncate ${isSuiteSelected ? 'text-gray-100' : 'text-gray-500'}`}>
                      {suite.description || 'No description available'}
                    </p>
                  </div>
                  <div className='flex flex-row justify-end'>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        isSuiteSelected
                          ? deselectAllInSuite(suite.id)
                          : selectAllInSuite(suite.id);
                      }}
                      className={`px-2 py-1 text-xs rounded ${isSuiteSelected ? 'text-white' : 'text-gray-500'}`}
                      title={isSuiteSelected ? 'Deselect All' : 'Select All'}
                    >
                      {isSuiteSelected ? (
                        <CheckSquare className="h-4 w-4" />

                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                    {isExpanded ? (
                      <ChevronUp className={`h-5 w-5 mt-0.5 ${isSuiteSelected ? 'text-white' : 'text-gray-500'}`} />
                    ) : (
                      <ChevronDown className={`h-5 w-5 mt-0.5 ${isSuiteSelected ? 'text-white' : 'text-gray-500'}`} />
                    )}
                  </div>
                </div>

                {/* Test Cases */}
                {isExpanded && (
                  <div className="bg-white rounded-lg mt-1 ml-2 ">
                    {suite.testCases.length > 0 ? (
                      suite.testCases.map((testCase) => (
                        <button
                          key={testCase.id}
                          type="button"
                          className={`flex items-center justify-between w-full px-4 p-2 rounded-lg border border-gray-200 mb-1 cursor-pointer focus:outline-none ${selectedIds.has(testCase.id)
                              ? 'bg-sky-100 border-sky-500'
                              : 'hover:bg-gray-50'
                            }`}
                          onClick={() => toggleSelection(testCase.id)}
                          aria-pressed={selectedIds.has(testCase.id)}
                        >
                          <div>
                            <h3 className="text-sm font-medium flex items-start justify-start w-[450px] truncate">{testCase.name}</h3>
                            <p className="text-xs text-gray-500 w-[450px] truncate flex items-start justify-start">
                              {testCase.description || 'No description available'}
                            </p>
                          </div>
                          {selectedIds.has(testCase.id) && (
                            <Check className="h-4 w-4 text-intelQEDarkBlue" />
                          )}
                        </button>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-2">No matching test cases.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">No test suites or cases found.</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button onClick={prevStep} className="btn2">
          Back
        </button>
        <button onClick={handleSubmit} className="btn1">
          Submit
        </button>
      </div>
    </div>
  );
};

export default Step3;