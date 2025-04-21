import { Search } from 'lucide-react';
import { ApiEndpoint } from '../interface';

interface APITabProps {
  apis: ApiEndpoint[];
}

const ApiEndpointRow = ({ api }: { api: ApiEndpoint }) => {
  return (
    <tr className="border-b text-sm">
      <td className="py-3 px-4">{api.path}</td>
      <td className="py-3 px-4">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          api.method === 'GET' ? 'bg-blue-100 text-blue-800' :
          api.method === 'POST' ? 'bg-green-100 text-green-800' :
          api.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {api.method}
        </span>
      </td>
      <td className="py-3 px-4">{api.description}</td>
      <td className="py-3 px-4">
        <div className="flex items-center">
          <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
            <div
              className={`h-2 rounded-full ${
                api.testCoverage > 90 ? 'bg-green-500' :
                api.testCoverage > 80 ? 'bg-blue-500' :
                api.testCoverage > 70 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${api.testCoverage}%` }}
            />
          </div>
          <span className="text-sm">{api.testCoverage}%</span>
        </div>
      </td>
    </tr>
  );
};

export default function APITab({ apis }: APITabProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">API Endpoints</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-gray-200 rounded-md text-gray-700">
            Import APIs
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Add Endpoint
          </button>
        </div>
      </div>

      <div className="mb-4 flex space-x-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search endpoints..."
            className="pl-10 w-full border rounded-md"
          />
        </div>
        <select className="border rounded-md">
          <option>All Methods</option>
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>
        <select className="border rounded-md">
          <option>Coverage: Any</option>
          <option>Coverage: High (90%+)</option>
          <option>Coverage: Medium (70-90%)</option>
          <option>Coverage: Low (-70%)</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Endpoint
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Method
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Test Coverage
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {apis.map(api => (
              <ApiEndpointRow key={api.id} api={api} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}