import { UserItem } from "../types";

export const users: UserItem[] = [
  {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      position: 'Senior Test Engineer',
      role: 'admin',
      status: 'active',
      lastLogin: '2h ago',
      lastUpdated: '1d ago',
      description: ""
  },
  {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      position: 'Test Automation Engineer',
      role: 'user',
      status: 'active',
      lastLogin: '1d ago',
      lastUpdated: '3d ago',
      description: ""
  },
  // Add more mock users as needed
];