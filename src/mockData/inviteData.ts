import { InvitationItem } from "../types";

export const mockInvitations: InvitationItem[] = [
    {
        id: 1,
        email: 'pending@example.com',
        role: 'user',
        status: 'pending',
        sentAt: '2h ago',
        expiresAt: '22h remaining',
        lastUpdated: '2h ago',
        name: "John Doe",
        description: ""
    },
    {
        id: 2,
        email: 'accepted@example.com',
        role: 'admin',
        status: 'accepted',
        sentAt: '1d ago',
        expiresAt: 'Accepted',
        lastUpdated: '2h ago',
        name: "Sam Altman",
        description: ""
    }
  ];