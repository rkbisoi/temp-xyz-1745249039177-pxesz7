import { Card, CardContent, CardHeader, CardTitle } from '../../shared/Card';
import { Deployment } from '../interface';

interface DeploymentsCardProps {
  deployments: Deployment[];
}

export default function DeploymentsCard({ deployments }: DeploymentsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">Recent Deployments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deployments.map((deployment, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div>
                <div className="font-medium">{deployment.environment}</div>
                <div className="text-sm text-gray-500">v{deployment.version}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">{deployment.deployedAt}</div>
                <div className="text-xs text-gray-400">by {deployment.deployedBy}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}