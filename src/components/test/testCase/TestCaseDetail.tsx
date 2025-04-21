import { X } from 'lucide-react';
import { TestCase } from '../types';

interface TestCaseDetailProps {
  testCase: TestCase;
  onClose: () => void;
}

export default function TestCaseDetail({ testCase, onClose }: TestCaseDetailProps) {
  console.log("Test Case Detail : ", testCase)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-lg font-bold text-intelQEDarkBlue mb-4">
          Test Case Details
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-md font-semibold text-gray-900">
              {testCase.name}
            </h3>
            <p className="text-gray-600 mt-1 text-sm">
              {testCase.description}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">
              Expected OutCome : 
            </p>
            <p className="text-gray-600 mt-1 text-sm">
              {testCase.expected_outcome}
            </p>
          </div>

          <div className='flex flex-col justify-between'>
            <div className='flex flex-row justify-start'>
              <h4 className="text-sm font-medium text-gray-700">Priority : </h4>
              <span className={`ml-1 inline-block px-2 py-1 text-xs rounded-full ${testCase.priority === 'high' ? 'bg-red-100 text-red-800' :
                  testCase.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                }`}>
                {testCase.priority}
              </span>
            </div>

            <div className='flex flex-row justify-start mt-2'>
              <h4 className="text-sm font-medium text-gray-700">Status : </h4>
              <span className={`ml-1 inline-block px-2 py-1 text-xs rounded-full ${testCase.status === 'Pass' ? 'bg-green-100 text-green-800' :
                  testCase.status === 'Fail' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                }`}>
                {testCase.status}
              </span>
            </div>
          </div>

          <div className='flex flex-col justify-between'>

            <div className='flex flex-row justify-start'>
              <h4 className="text-sm font-semibold text-gray-700">Created At : </h4>
              <p className="ml-1 text-sm text-gray-600">{testCase.createdAt}</p>
            </div>
            <div className='flex flex-row justify-start'>
              <h4 className="text-sm font-semibold text-gray-700">Updated At : </h4>
              <p className="ml-1 text-sm text-gray-600">{testCase.updatedAt}</p>
            </div>

          </div>

          <div>
            <h4 className="text-sm font-medium text-intelQEDarkBlue mb-2">Test Steps</h4>
            <div className="border rounded-lg divide-y">
              {testCase.steps_json_data.map((step, index) => (
                <div key={index} className="p-4">
                  <div className="flex items-center">
                    <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-700">
                      {index + 1}
                    </span>
                    <div className='flex flex-col'>
                      <span className="ml-4 text-sm font-semibold text-gray-900">{step.description}</span>
                      <span className="text-xs ml-4 text-gray-500">Action : {step.action}</span>
                      <span className="text-xs ml-4 text-gray-500">Value : {step.value}</span>
                      <span className="text-xs ml-4 text-gray-500">Locator : {step.locator}</span>
                      <span className="text-xs ml-4 text-gray-500">Input : {step.input}</span>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>


        </div>

        <div className="mt-6 flex justify-between space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-intelQEDarkBlue text-white rounded-md"
          >
            Edit Test Case
          </button>
        </div>
      </div>
    </div>
  );
}