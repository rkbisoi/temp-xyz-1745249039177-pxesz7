import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../shared/Tabs';
import ListView from '../shared/ListView';
import InviteUserForm from './InviteUserForm';
import { ListConfig } from '../shared/types';
import { CheckCircle2, Link, Mail, Shield, Trash } from 'lucide-react';
// import { users } from '../../mockData/userData';
// import { mockInvitations } from '../../mockData/inviteData';
import { InvitationItem, UserItem } from '../../types';
import { getUserId } from '../../utils/storage';
import { API_URL } from '../../data';
import { getInviteStatus } from '../../utils/utils';

import { Ban } from 'lucide-react';


const userConfig: ListConfig = {
  title: 'Users',
  addButtonText: 'Invite User',
  searchPlaceholder: 'Search users...',
  itemsName: 'users',
  showStatus: true,
  showType: true,
  statusOptions: ['active', 'inactive'],
  sortOptions: [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'lastLogin', label: 'Last Login' }
  ],
  bulkActions: [
    { label: 'Link', action: 'link', icon: <Link className="h-4 w-4" /> },
    { label: 'Activate', action: 'activate', icon: <CheckCircle2 className="h-4 w-4" /> },
    { label: 'Deactivate', action: 'deactivate', icon: <Ban className="h-4 w-4" /> },
  ],
  showMember: false
};


const inviteConfig: ListConfig = {
  title: 'Invites',
  addButtonText: 'Invite User',
  searchPlaceholder: 'Search invites...',
  itemsName: 'users',
  showStatus: true,
  showType: true,
  statusOptions: ['pending', 'accepted', 'expired'],
  sortOptions: [
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status' },
  ],
  bulkActions: [
    { label: 'Reinvite', action: 'reinvite', icon: <Mail className="h-4 w-4" /> },
    { label: 'Delete', action: 'delete', icon: <Trash className="h-4 w-4" /> },
  ]
};


interface UserInviteListProps {
  onUserView?: (id: number) => void;
  defaultView?: 'grid' | 'list';
}

export default function UserInviteList({
  onUserView = () => { },
  defaultView = 'grid'
}: UserInviteListProps) {
  const [activeTab, setActiveTab] = useState('users');
  const [isInviteFormOpen, setIsInviteFormOpen] = useState(false);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [invitations, setInvitations] = useState<InvitationItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = getUserId();
        if (!userId) {
          console.warn("User ID is missing");
          return;
        }

        var url = `${API_URL}/fetchUsers/`

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        // console.log("User List Response:", data.data);

        if (data?.data && Array.isArray(data.data)) {
          const convertedUsers: UserItem[] = data.data.map((user: any) => ({
            id: user.userId,
            name: user.firstName + " " + user.lastName,
            email: user.email,
            update_seq_no: user.updateSeqNo,
            role: user.admin ? 'admin' : 'user',
            status: user.active ? 'active' : 'inactive',
            position: "",
            lastLogin: ""
          }));

          setUsers(convertedUsers);
        } else {
          console.warn("Invalid response structure:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = getUserId();
        if (!userId) {
          console.warn("User ID is missing");
          return;
        }

        var url = `${API_URL}/GetAllInvitation`

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        // console.log("Invite List Response:", data.data);

        if (data?.data && Array.isArray(data.data)) {
          const convertedInvites: InvitationItem[] = data.data.map((invite: any) => ({
            id: invite.inviteId,
            // name: invite.firstName + " " + invite.lastName,
            email: invite.email,
            role: invite.isAdmin ? 'admin' : 'user',
            status: getInviteStatus(invite.expiry_date, invite.isUsed),
            sentBy: invite.invitedByUserId,
            expiresAt: invite.expiry_date
          }));

          setInvitations(convertedInvites);
        } else {
          console.warn("Invalid response structure:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddItem = () => {
    // if (activeTab === 'users') {
      setIsInviteFormOpen(true);
    // }
  };

  return (
    <div className="py-4 px-4 mt-2">
      <div className="max-w-8xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-center items-center">
            <TabsList>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="invitations" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Invitations
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="users">
            <ListView
              items={users}
              config={userConfig}
              onItemView={onUserView}
              onAddItem={handleAddItem}
              defaultView={defaultView} 
              projectId={-1}  
              applicationId={-1}     
              isApp={false}          
              />
          </TabsContent>

          <TabsContent value="invitations">
            <ListView
              items={invitations}
              config={inviteConfig}
              onItemView={() => {}}
              onAddItem={handleAddItem} 
              projectId={-1}  
              applicationId={-1}     
              isApp={false}     
              />
          </TabsContent>
        </Tabs>

        <InviteUserForm
          isOpen={isInviteFormOpen}
          onClose={() => setIsInviteFormOpen(false)}
        />
      </div>
    </div>
  );
}