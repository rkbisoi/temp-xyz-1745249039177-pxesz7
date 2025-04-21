import { Card, CardContent, CardHeader, CardTitle } from '../../shared/Card';
import { ApplicationData } from '../interface';

interface SummaryCardProps {
  data: ApplicationData;
}

export default function SummaryCard({ data }: SummaryCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">Application Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Projects</span>
            <span className="font-medium">{data.totalProjects}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">API Endpoints</span>
            <span className="font-medium">{data.apiEndpoints}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Routes</span>
            <span className="font-medium">{data.routes}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Created</span>
            <span className="font-medium">{data.createdAt}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Last Modified</span>
            <span className="font-medium">{data.lastModified}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}