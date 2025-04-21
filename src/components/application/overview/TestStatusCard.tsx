import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

import { TestStats } from '../interface';
import { Card, CardContent, CardHeader, CardTitle } from '../../shared/Card';

interface TestStatusCardProps {
  testStats: TestStats;
}

export default function TestStatusCard({ testStats }: TestStatusCardProps) {
  const testStatusData = [
    { name: 'Passed', value: testStats.passed, color: '#10B981' },
    { name: 'Failed', value: testStats.failed, color: '#EF4444' },
    { name: 'Skipped', value: testStats.skipped, color: '#F59E0B' }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">Test Status</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="w-32 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={testStatusData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={50}
                paddingAngle={2}
                dataKey="value"
              >
                {testStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-4 mt-2">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span className="text-xs">Passed: {testStats.passed}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
            <span className="text-xs">Failed: {testStats.failed}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
            <span className="text-xs">Skipped: {testStats.skipped}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}