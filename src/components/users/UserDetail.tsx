import { ArrowLeft, Mail, Shield, User } from 'lucide-react';
import { ProjectItem, UserItem } from '../../types';
import { useEffect, useState } from 'react';
import { API_URL } from '../../data';
import { fetchAllProjects } from '../../services/projectService';
import LinkedIn from '../../../resource/linkedin.png';
import Git from '../../../resource/git.png';

interface UserDetailProps {
  userId: number;
  onBack: () => void;
}

const mockDigitalTwinData = {
  behaviorPatterns: ['Analytical', 'Detail-Oriented', 'Collaborative'],
  strengths: ['Quick Decision Making', 'Adaptive Learning', 'High Accuracy'],
  suggestedRoles: ['AI Quality Engineer', 'Data Analyst', 'Process Optimizer'],
  efficiencyScore: 92,
};

export default function UserDetail({ userId, onBack }: UserDetailProps) {
  const [user, setUser] = useState<UserItem>();
  const [projects, setProjects] = useState<ProjectItem[]>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/GetUserProfile/${userId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        if (data?.data) {
          setUser({
            id: data.data.userId,
            name: data.data.firstName + ' ' + data.data.lastName,
            email: data.data.email,
            role: data.data.admin ? 'admin' : 'user',
            status: 'active',
            position: 'AI Quality Specialist',
            lastLogin: '2 days ago',
            description: 'AI Quality Engineer specializing in testing, validating, and optimizing machine learning models for enterprise applications. With a background in software engineering and AI ethics, Alex ensures AI systems are robust, unbiased, and high-performing.',
            lastUpdated: '2025-03-01',
            createDate: '2022-08-10',
            update_seq_no: data.data.updateSeqNo,
            projectIds: data.data.Project_IDs,
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProjects = await fetchAllProjects();
        if (fetchedProjects.length > 0) setProjects(fetchedProjects);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft className="h-5 w-5 mr-2" /> Back to Users
      </button>
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="flex items-start justify-between mb-6">
          <div className='flex flex-row justify-start'>
            <div className='h-28 w-28 rounded-full bg-gray-100 items-center p-4'>
              <User className='h-20 w-20 text-gray-500' />
            </div>
            <div className='ml-4 mt-2'>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{user?.name}</h1>
              <div className='flex flex-col'>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-1" /> <span className="capitalize">{user?.role}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${user?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user?.status}
                  </span>
                </div>
                <div className="flex row items-center mt-1.5">
                <img src={LinkedIn} alt="LinkedIn" className=" h-4 object-cover rounded mr-1.5 mt-0.5" />
                <img src={Git} alt="Github" className=" h-4 object-cover rounded mr-1.5 mt-0.5" />
                <Mail className="h-4 w-4 mr-1 text-gray-500 mt-0.5" /> <span className='text-sm mb-0.5'>{user?.email}</span>
                </div>

              </div>

            </div>
           
          </div>
            {/* <div className='flex flex-col'>
            <div className="flex items-center mb-2">
              <img src={LinkedIn} alt="LinkedIn" className=" h-5 object-cover rounded mr-1.5 mt-0.5" />
              <span className='text-sm text-gray-600'>{user?.email}</span>
            </div>
            <div className="flex items-center">
              <img src={Git} alt="Github" className=" h-5 object-cover rounded mr-1.5 mt-0.5" />
              <span className='text-sm text-gray-600'>{user?.email}</span>
            </div>
            </div> */}
          
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              <div className="flex items-center text-sm font-semibold">
                <span>{user?.position}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <span>{user?.description}</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-sm text-gray-900 mb-2">IntelQE Overview</h3>
            <div className="space-y-2">
              <div className="flex flex-col justify-start text-sm">
                <span className='text-gray-600 mb-0.5 text-xs'>Behavior Patterns</span>
                <span>{mockDigitalTwinData.behaviorPatterns.join(', ')}</span>
              </div>
              <div className="flex flex-col justify-start text-sm">
                <span className='text-gray-600 mb-0.5 text-xs'>Strengths</span>
                <span>{mockDigitalTwinData.strengths.join(', ')}</span>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span className='text-gray-600 mb-0.5 text-xs'>Efficiency Score</span>
                  <span>{mockDigitalTwinData.efficiencyScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-intelQEDarkBlue rounded-full h-2"
                    style={{ width: `${mockDigitalTwinData.efficiencyScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {projects && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-medium text-gray-900 mb-4">Project Access</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-sky-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Role</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.createdBy === userId ? 'Owner' : 'Member'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}