import { Bell, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { IntelQEWhiteLogo } from './Icons';
import { useEffect, useRef, useState } from 'react';
import NotificationSidebar from './notification/NotificationSidebar';
import { Link } from 'react-router-dom';
import ToggleActiveTestsButton from './shared/ToggleActiveTestsButton';
import TAL from '../../resource/TAL.jpeg';
import Devops1 from '../../resource/devops1.png'

interface NavbarProps { }

export default function Navbar({ }: NavbarProps) {
  const { signOut, user } = useAuth();
  const [isNotificationSidebarOpen, setIsNotificationSidebarOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isDropdownOpen) {
      const timeout = setTimeout(() => {
        setDropdownOpen(false);
      }, 5000); // collapse after 5 seconds

      return () => clearTimeout(timeout);
    }
  }, [isDropdownOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Successfully logged out');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  // const [selectedApp, setSelectedApp] = useState('App1');

  // const handleAppChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const newApp = e.target.value;
  //   setSelectedApp(newApp);
  //   console.log('App changed to:', newApp);
  // };

  return (
    <nav className="bg-white shadow-sm pr-4 fixed right-0 left-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center bg-intelQEDarkBlue border-b border-intelQELightBlue h-14 w-[99px]">
          <div className="flex flex-col items-center ml-0.5">
            <IntelQEWhiteLogo />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className='inline-flex -mb-1.5'>
            <img src={TAL} alt="TAL Logo" className=" h-6 object-cover mt-2" /> <span className='text-3xl text-gray-500 font-bold ml-2 mt-0.5'>AI Platform</span>
          </div>

          <p className="inline-flex text-[9px] mt-1.5 m text-gray-500">Powered By <img src={Devops1} className='h-3 object-cover ml-1' /></p>
        </div>

        <div className="flex items-center space-x-2">
          {/* <div className="mt-1">
            <select
              value={selectedApp}
              onChange={handleAppChange}
              className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-md px-2 py-1 focus:outline-none"
            >
              <option value="App1">Customer Backend Portal</option>
              <option value="App2">Application 2</option>
              <option value="App3">Application 3</option>
            </select>
          </div> */}
          <button
            className="p-2 rounded-lg hover:bg-gray-100 relative"
            onClick={() => setIsNotificationSidebarOpen(true)}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="h-7 w-7 rounded-full bg-intelQEDarkBlue flex items-center justify-center p-1">
            <span className="text-white text-sm font-medium p-1">
              {user?.firstName?.charAt(0).toUpperCase()}{user?.lastName?.charAt(0).toUpperCase()}
            </span>
          </button>
        </div>
      </div>
      {isDropdownOpen && (
        <div ref={dropdownRef} className="absolute right-1 top-12  bg-white p-2 rounded-lg shadow-lg border border-1 border-gray-200 z-50">
          <div className='flex flex-row justify-betwwen mb-2'>
            <div className="h-12 w-12 rounded-full bg-intelQEDarkBlue flex items-center justify-center m-1">
              <span className="text-white text-2xl font-medium">
                {user?.firstName?.charAt(0).toUpperCase()}{user?.lastName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className='flex flex-col justify-start ml-3 mt-1.5'>
              <p className='text-lg font-semibold truncate w-48'>{user?.firstName + ' ' + user?.lastName} </p>
              <p className='text-sm -mt-1 text-gray-600 font-medium truncate w-48'>{user?.email} </p>
            </div>

          </div>
          <ul className="space-y-1 text-gray-600">
            <Link to="/profile"><li className="text-sm px-2 py-2 hover:bg-sky-100 cursor-pointer bg-gray-50 rounded z-20 flex flex-row justify-start"><User className='h-5 w-5 mr-3' /> <span>Profile</span></li></Link>
            <li className="px-2 py-2 hover:bg-sky-100 cursor-pointer bg-gray-50 rounded z-20"><ToggleActiveTestsButton /></li>
            <button
              onClick={handleSignOut}
              className="w-full"
            >
              <li className='px-2 py-2 text-sm hover:bg-red-100 cursor-pointer bg-gray-50 rounded z-20 flex flex-row justify-start'>
                <LogOut className="h-5 w-5 text-red-600 mr-3" />
                <span>Logout</span>
              </li>

            </button>
          </ul>
        </div>
      )}
      <NotificationSidebar
        isOpen={isNotificationSidebarOpen}
        onClose={() => setIsNotificationSidebarOpen(false)}
      />
    </nav>
  );
}