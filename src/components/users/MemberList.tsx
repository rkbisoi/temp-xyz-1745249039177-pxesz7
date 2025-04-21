import { useEffect, useState } from 'react';
import ListView from '../shared/ListView';
import InviteUserForm from './InviteUserForm';
import { ListConfig } from '../shared/types';
import { UserItem } from '../../types';
import { getUserId } from '../../utils/storage';
import { API_URL } from '../../data';
import { Unlink } from 'lucide-react';

const userConfig: ListConfig = {
    title: 'Members',
    addButtonText: 'Add Member',
    searchPlaceholder: 'Search members...',
    itemsName: 'users',
    showStatus: true,
    showRole: true,
    showMember: true,
    statusOptions: ['active', 'inactive'],
    sortOptions: [
        { key: 'name', label: 'Name' },
        { key: 'role', label: 'Role' },
        { key: 'lastLogin', label: 'Last Login' }
    ],
    bulkActions: [
        // { label: 'Activate', action: 'activate', icon: <CheckCircle2 className="h-4 w-4" /> },
        // { label: 'Deactivate', action: 'deactivate', icon: <Ban className="h-4 w-4" /> },
        { label: 'Delink', action: 'delink', icon: <Unlink className='h-4 w-4' /> }
    ]
};

interface MemberListProps {
    onUserView?: (id: number) => void;
    defaultView?: 'grid' | 'list';
    projId: number;
    appId: number;
    isApp: boolean
}

export default function MemberList({
    onUserView = () => { },
    defaultView = 'grid',
    projId = -1,
    appId = -1,
    isApp = true
}: MemberListProps) {

    const [isInviteFormOpen, setIsInviteFormOpen] = useState(false);
    const [users, setUsers] = useState<UserItem[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = getUserId();
                if (!userId) {
                    console.warn("User ID is missing");
                    return;
                }

                if (isApp && appId < 0) {
                    console.log("App ID :", appId)
                    console.warn("Invalid Application ID");
                    return;
                }

                if (!isApp && projId < 0) {
                    console.log("Proj ID :", projId)
                    console.warn("Invalid Project ID");
                    return;
                }

                if (isApp) {
                    var url = `${API_URL}/getUsersByApplication/${appId}`

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
                    // console.log("Users Response:", data.data);

                    if (data?.data.linkedUsers && Array.isArray(data.data.linkedUsers)) {
                        const convertedUsers: UserItem[] = data.data.linkedUsers.map((user: any) => ({
                            id: user.userId,
                            name: user.firstName + " " + user.lastName,
                            email: user.email,
                            update_seq_no: user.updateSeqNo,
                            role: 'admin',
                            status: 'active',
                            position: "",
                            lastLogin: ""
                        }));

                        setUsers(convertedUsers);
                    } else {
                        console.warn("Invalid response structure:", data);
                    }

                } else {
                    var url = `${API_URL}/getUsersByPrj/${projId}`

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
                    // console.log("Users Response:", data.data);

                    if (data?.data.users && Array.isArray(data.data.users)) {
                        const convertedUsers: UserItem[] = data.data.users.map((user: any) => ({
                            id: user.userId,
                            name: user.firstName + " " + user.lastName,
                            email: user.email,
                            update_seq_no: user.updateSeqNo,
                            role: 'admin',
                            status: 'active',
                            position: "",
                            lastLogin: ""
                        }));

                        setUsers(convertedUsers);
                    } else {
                        console.warn("Invalid response structure:", data);
                    }

                }


            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleAddItem = () => {
        setIsInviteFormOpen(true);
    };

    return (
        <div className="mt-2">
            <div className="max-w-8xl mx-auto">
                <ListView
                    items={users}
                    config={userConfig}
                    onItemView={onUserView}
                    onAddItem={handleAddItem}
                    defaultView={defaultView}
                    projectId={projId} 
                    applicationId={appId} 
                    isApp={isApp}               
                    />
                <InviteUserForm
                    isOpen={isInviteFormOpen}
                    onClose={() => setIsInviteFormOpen(false)}
                />
            </div>
        </div>
    );
}