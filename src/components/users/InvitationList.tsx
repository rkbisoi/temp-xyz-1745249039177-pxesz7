import { useState } from 'react';
import { InvitationItem } from '../../types';
import { Mail, Shield} from 'lucide-react';
import { getStatusColor } from '../../utils/utils';

const mockInvitations: InvitationItem[] = [
  {
    id: 1,
    email: 'pending@example.com',
    role: 'user',
    status: 'pending',
    expiresAt: '22h remaining',
    lastUpdated: '',
    name: 'John Doe',
    description: '',
    sentBy: '',
    createDate: '',
    update_seq_no: 0
  },
  {
    id: 2,
    email: 'accepted@example.com',
    role: 'admin',
    status: 'accepted',
    expiresAt: 'Accepted',
    lastUpdated: '',
    name: 'Sam Altman',
    description: '',
    sentBy: '',
    createDate: '',
    update_seq_no: 0
  }
];

export default function InvitationList() {
  const [invitations] = useState<InvitationItem[]>(mockInvitations);

  // const getStatusIcon = (status: string) => {
  //   switch (status) {
  //     case 'accepted':
  //       return <CheckCircle className="h-5 w-5 text-green-500" />;
  //     case 'expired':
  //       return <XCircle className="h-5 w-5 text-red-500" />;
  //     default:
  //       return <Clock className="h-5 w-5 text-yellow-500" />;
  //   }
  // };

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case 'accepted':
  //       return 'bg-green-100 text-green-800';
  //     case 'expired':
  //       return 'bg-red-100 text-red-800';
  //     default:
  //       return 'bg-yellow-100 text-yellow-800';
  //   }
  // };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expires
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invitations.map((invitation) => (
              <tr key={invitation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(invitation.status)}`}>
                    {invitation.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{invitation.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900 capitalize">{invitation.role}</span>
                  </div>
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {invitation.sentAt}
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {invitation.expiresAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {invitation.status === 'pending' && (
                    <button className="text-red-600 hover:text-red-900">
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}