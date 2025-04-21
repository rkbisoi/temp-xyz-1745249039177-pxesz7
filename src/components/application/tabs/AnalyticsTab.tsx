import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { AlertCircle, Check, Code } from 'lucide-react';
import { ApplicationData, CoverageItem } from '../interface';
import { Card, CardContent, CardHeader, CardTitle } from '../../shared/Card';

interface AnalyticsTabProps {
  data: ApplicationData;
}

export default function AnalyticsTab({ data }: AnalyticsTabProps) {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
      {/* Test Coverage Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-medium">Test Coverage by Type</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.coverageData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Coverage %" fill="#3B82F6">
                {data.coverageData.map((entry: CoverageItem, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* AI Analysis */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-medium">AI Test Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
            <div className="flex">
              <AlertCircle size={20} className="text-amber-500 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-amber-800">Coverage Gap Detected</p>
                <p className="text-amber-700 text-sm">
                  AI analysis detected that error handling scenarios are insufficiently tested
                  across multiple API endpoints. Consider adding more negative test cases.
                </p>
              </div>
            </div>
          </div>

          <h3 className="font-medium mb-2">Test Quality Recommendations</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <Check size={16} className="text-green-500 mr-2 mt-1" />
              <span className="text-sm">Add more mock data variations for edge cases</span>
            </li>
            <li className="flex items-start">
              <Check size={16} className="text-green-500 mr-2 mt-1" />
              <span className="text-sm">Increase validation testing for payment flow</span>
            </li>
            <li className="flex items-start">
              <Check size={16} className="text-green-500 mr-2 mt-1" />
              <span className="text-sm">Implement more comprehensive API authentication tests</span>
            </li>
          </ul>

          {/* <h3 className="font-medium mt-4 mb-2">Automated Test Generation</h3>
          <button className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center">
            <Code size={16} className="mr-2" />
            Generate AI Test Cases
          </button> */}
        </CardContent>
      </Card>

      {/* Test History */}
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-medium">Test History</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { date: 'Apr 7', passed: 245, failed: 42 },
                { date: 'Apr 8', passed: 256, failed: 38 },
                { date: 'Apr 9', passed: 262, failed: 32 },
                { date: 'Apr 10', passed: 270, failed: 28 },
                { date: 'Apr 11', passed: 273, failed: 25 },
                { date: 'Apr 12', passed: 278, failed: 32 }
              ]}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="passed" name="Tests Passed" stackId="a" fill="#10B981" />
              <Bar dataKey="failed" name="Tests Failed" stackId="a" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}