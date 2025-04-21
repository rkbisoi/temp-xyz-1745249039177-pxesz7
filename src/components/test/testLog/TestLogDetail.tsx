import { X } from 'lucide-react';
import { TestLog } from '../types';

interface TestLogDetailProps {
  testLog: TestLog
  onClose: () => void;
}

export default function TestLogDetail({ testLog, onClose }: TestLogDetailProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Test Execution Results
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Suite ID</h4>
              <p className="mt-1 text-sm text-gray-900">{testLog.id}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700">Executed By</h4>
              <p className="mt-1 text-sm text-gray-900">{testLog.executedBy}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700">Overall Result</h4>
            <span className={`mt-1 inline-block px-2 py-1 text-xs rounded-full ${
              testLog.result === 'Pass' ? 'bg-green-100 text-green-800' :
              testLog.result === 'Fail' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {testLog.result}
            </span>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Execution Summary</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Tests</p>
                <p className="text-2xl font-semibold text-gray-900">{testLog.logs.total_tests}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Passed Tests</p>
                <p className="text-2xl font-semibold text-green-700">{testLog.logs.passed_tests}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Failed Tests</p>
                <p className="text-2xl font-semibold text-red-700">{testLog.logs.failed_tests}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Steps</p>
                <p className="text-2xl font-semibold text-gray-900">{testLog.logs.total_steps}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Passed Steps</p>
                <p className="text-2xl font-semibold text-green-700">{testLog.logs.passed_steps}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Success Rate</p>
                <p className="text-2xl font-semibold text-gray-900">{testLog.logs.success_rate}</p>
              </div>
            </div>
          </div>

          {testLog.defects.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Failed Tests</h4>
              <div className="space-y-4">
                {testLog.defects.map((defect, index) => (
                  <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex justify-between items-start">
                      <h5 className="font-medium text-gray-900">{defect.name}</h5>
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                        {defect.status}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Duration:</span> {defect.duration}
                      </div>
                      <div>
                        <span className="text-gray-500">Steps Executed:</span> {defect.steps_executed}
                      </div>
                      <div>
                        <span className="text-gray-500">Steps Passed:</span> {defect.steps_passed}
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      <div className="text-gray-500">Error Message:</div>
                      <div className="whitespace-pre-line text-red-700 mt-1 -pt-4 px-4 pb-4 bg-red-100 rounded">
                        {defect.message}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {testLog.passedCases.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Passed Tests</h4>
              <div className="space-y-2">
                {testLog.passedCases.map((passedCase, index) => (
                  <div key={index} className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <div className="flex justify-between items-start">
                      <h5 className="font-medium text-gray-900">{passedCase.name}</h5>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        PASS
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Duration:</span> {passedCase.duration || 'N/A'}
                      </div>
                      <div>
                        <span className="text-gray-500">Steps:</span> {passedCase.steps_executed || 'N/A'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Detailed Summary</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-line text-sm text-gray-700">
                {testLog.summary}
              </pre>
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
            className="px-4 py-2 bg-intelQEDarkBlue text-white rounded-md hover:bg-blue-600"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
}