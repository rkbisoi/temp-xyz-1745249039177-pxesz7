import { useState } from 'react';
import { Search } from 'lucide-react';

export default function LogsTab() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedProject, setSelectedProject] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Application Logs</h2>
        <div className="flex space-x-2">
          <select 
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="custom">Custom range</option>
          </select>
          <button className="px-4 py-2 bg-gray-200 rounded-md text-gray-700">
            Export Logs
          </button>
        </div>
      </div>

      <div className="mb-4 flex space-x-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full border rounded-md"
          />
        </div>
        <select 
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="border rounded-md"
        >
          <option value="all">All Levels</option>
          <option value="error">Error</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
          <option value="debug">Debug</option>
        </select>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="border rounded-md"
        >
          <option value="all">All Projects</option>
          <option value="api">API Testing</option>
          <option value="ui">UI Testing</option>
          <option value="performance">Performance Testing</option>
        </select>
      </div>

      <div className="bg-gray-100 rounded-md p-4 font-mono text-sm h-96 overflow-y-auto">
        <div className="text-green-600">[2025-04-14 09:12:53] [INFO] Test suite 'API Authentication' started</div>
        <div className="text-green-600">[2025-04-14 09:12:54] [INFO] Test case 'Valid login credentials' passed</div>
        <div className="text-green-600">[2025-04-14 09:12:55] [INFO] Test case 'Remember me functionality' passed</div>
        <div className="text-green-600">[2025-04-14 09:12:56] [INFO] Test case 'Password reset flow' passed</div>
        <div className="text-yellow-600">[2025-04-14 09:12:57] [WARNING] Test case 'Rate limiting' - Slow response detected (2.3s)</div>
        <div className="text-green-600">[2025-04-14 09:12:58] [INFO] Test suite 'API Authentication' completed</div>
        <div className="text-green-600">[2025-04-14 09:13:00] [INFO] Test suite 'Payment Processing' started</div>
        <div className="text-green-600">[2025-04-14 09:13:01] [INFO] Test case 'Credit card payment' passed</div>
        <div className="text-red-600">[2025-04-14 09:13:02] [ERROR] Test case 'PayPal integration' failed: Timeout waiting for PayPal API response</div>
        <div className="text-red-600">[2025-04-14 09:13:03] [ERROR] Stack trace: TimeoutError: Promise timed out after 5000ms</div>
        <div className="text-yellow-600">[2025-04-14 09:13:04] [WARNING] Test case 'Refund process' -  Flaky test detected, passed on retry</div>
        <div className="text-green-600">[2025-04-14 09:13:05] [INFO] Test suite 'Payment Processing' completed</div>
      </div>
    </div>
  );
}