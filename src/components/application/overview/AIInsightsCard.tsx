import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../shared/Card';

interface AIInsightsCardProps {
  insights: string[];
}

export default function AIInsightsCard({ insights }: AIInsightsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">AI Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {insights.map((insight, index) => (
            <li key={index} className="flex items-start">
              <AlertCircle size={16} className="text-amber-500 mr-2 mt-1 flex-shrink-0" />
              <span className="text-xs text-gray-500">{insight}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}