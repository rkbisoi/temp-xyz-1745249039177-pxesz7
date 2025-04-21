import { Check, X, Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../shared/Card';
import { ActivityItem } from '../interface';

interface RecentActivityCardProps {
  activities: ActivityItem[];
}

export default function RecentActivityCard({ activities }: RecentActivityCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <Check size={18} className="text-green-500 mr-3" />;
      case 'failed':
        return <X size={18} className="text-red-500 mr-3" />;
      case 'updated':
        return <Clock size={18} className="text-blue-500 mr-3" />;
      case 'created':
        return <FileText size={18} className="text-purple-500 mr-3" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'updated':
        return 'bg-blue-100 text-blue-800';
      case 'created':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {activities.map((activity, index) => (
            <div key={index} className="py-3 flex items-center">
              {getStatusIcon(activity.status)}
              <div className="flex-grow">
                <div className="font-medium text-sm">{activity.name}</div>
                <div className="text-xs text-gray-500">
                  {activity.type} {activity.status} · {activity.time}
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(activity.status)}`}>
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}