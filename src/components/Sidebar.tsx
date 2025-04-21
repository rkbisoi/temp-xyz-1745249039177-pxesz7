import { 
  // LayoutDashboard, 
  Database, 
  FolderKanban, 
  BookOpen,
  Boxes,
  Users,
  CalendarClock,
  Share2,
  Puzzle,
  Layers,
  Goal
} from 'lucide-react';
import { isUserAdmin } from '../utils/storage';

interface SidebarProps {
  onMenuClick: (view: string) => void;
  activeView: string;
}

interface MenuItem {
  icon: React.ElementType;
  label: string;
  id: string;
}

export default function Sidebar({ activeView, onMenuClick }: SidebarProps) {
  const isAdmin = isUserAdmin(); 

  const menuItems: (MenuItem | null)[] = [
    // { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
    { icon: Goal, label: 'QE Goals', id: 'applications' },
    { icon: Layers, label: 'Projects', id: 'projects' },
    { icon: Share2, label: 'Ntelg', id: 'workflows' },
    { icon: BookOpen, label: 'Knowledge', id: 'knowledge' }, 
    { icon: Puzzle, label: 'Components', id: 'components' },  
    { icon: Database, label: 'Data', id: 'data' },
    { icon: CalendarClock, label: 'Scheduler', id: 'scheduler' },
    isAdmin ? { icon: Users, label: 'Users', id: 'users' } : null 
  ];

  // Remove null values and assert type
  const filteredMenuItems: MenuItem[] = menuItems.filter((item): item is MenuItem => item !== null);

  return (
    <aside 
      className="fixed left-0 top-0 h-screen bg-intelQEDarkBlue border-r border-gray-200 transition-all duration-300 z-50 w-[100px]"
    >
      <nav className="mt-14">
        {filteredMenuItems.map((item, index) => (
          <button
            key={item.id}
            onClick={() => onMenuClick(item.id)}
            className={`w-full flex flex-col items-center px-3 md:py-[11px] lg:py-5 text-white hover:bg-intelQEBlue transition-colors justify-center relative 
              ${index === filteredMenuItems.length - 1 ? '' : 'border-b border-intelQELightBlue'}
              ${activeView === item.id ? 'bg-intelQEBlue' : ''}`}
            aria-current={activeView === item.id ? 'page' : undefined}
          >
            <span
              className={`absolute rounded-r left-0 top-0 h-full w-[4px] bg-intelQELightBlue ${
                activeView === item.id ? '' : 'hidden'
              }`}
            ></span>
            <item.icon className="h-5 w-5" />
            <span className="mt-2 tracking-wide text-[11px]">
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
