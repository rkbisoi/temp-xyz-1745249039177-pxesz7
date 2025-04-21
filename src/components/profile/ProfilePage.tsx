// import { useState, useEffect } from 'react';
// import { useAuth } from '../../contexts/AuthContext';
// import { ArrowLeft, Mail, Shield, Building, Calendar } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { API_URL } from '../../data';
// import toast from 'react-hot-toast';

// interface UserProfile {
//   firstName: string;
//   lastName: string;
//   email: string;
//   role: string;
//   organization: string;
//   joinDate: string;
// }

// export default function ProfilePage() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [isEditing, setIsEditing] = useState(false);
//   const [profile, setProfile] = useState<UserProfile>({
//     firstName: '',
//     lastName: '',
//     email: '',
//     role: '',
//     organization: '',
//     joinDate: new Date().toISOString().split('T')[0]
//   });

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await fetch(`${API_URL}/GetUserProfile/${user?.userId}`, {
//           credentials: 'include'
//         });
//         const data = await response.json();
//         if (data.success) {
//           setProfile({
//             firstName: data.data.firstName,
//             lastName: data.data.lastName,
//             email: data.data.email,
//             role: data.data.admin ? 'Admin' : 'User',
//             organization: data.data.orgName || 'Not specified',
//             joinDate: new Date(data.data.createDate).toLocaleDateString()
//           });
//         }
//       } catch (error) {
//         console.error('Error fetching profile:', error);
//       }
//     };

//     if (user?.userId) {
//       fetchProfile();
//     }
//   }, [user]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`${API_URL}/updateProfile/${user?.userId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify({
//           firstName: profile.firstName,
//           lastName: profile.lastName
//         }),
//       });

//       const data = await response.json();
//       if (data.success) {
//         toast.success('Profile updated successfully');
//         setIsEditing(false);
//       } else {
//         toast.error('Failed to update profile');
//       }
//     } catch (error) {
//       toast.error('Error updating profile');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 pt-20 px-4">
//       <div className="max-w-4xl mx-auto">
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
//         >
//           <ArrowLeft className="h-5 w-5 mr-2" />
//           Back
//         </button>

//         <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
//             <button
//               onClick={() => setIsEditing(!isEditing)}
//               className={`px-4 py-2 rounded-md text-sm font-medium ${
//                 isEditing
//                   ? 'bg-gray-200 text-gray-600'
//                   : 'bg-intelQEDarkBlue text-white hover:bg-sky-700'
//               }`}
//             >
//               {isEditing ? 'Cancel' : 'Edit Profile'}
//             </button>
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">First Name</label>
//                 <input
//                   type="text"
//                   value={profile.firstName}
//                   onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
//                   disabled={!isEditing}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-intelQEDarkBlue focus:ring-intelQEDarkBlue disabled:bg-gray-50"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Last Name</label>
//                 <input
//                   type="text"
//                   value={profile.lastName}
//                   onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
//                   disabled={!isEditing}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-intelQEDarkBlue focus:ring-intelQEDarkBlue disabled:bg-gray-50"
//                 />
//               </div>
//             </div>

//             <div className="mt-6 space-y-4">
//               <div className="flex items-center text-gray-600">
//                 <Mail className="h-5 w-5 mr-2" />
//                 <span>{profile.email}</span>
//               </div>

//               <div className="flex items-center text-gray-600">
//                 <Shield className="h-5 w-5 mr-2" />
//                 <span>{profile.role}</span>
//               </div>

//               <div className="flex items-center text-gray-600">
//                 <Building className="h-5 w-5 mr-2" />
//                 <span>{profile.organization}</span>
//               </div>

//               <div className="flex items-center text-gray-600">
//                 <Calendar className="h-5 w-5 mr-2" />
//                 <span>Joined: {profile.joinDate}</span>
//               </div>
//             </div>

//             {isEditing && (
//               <div className="mt-6 flex justify-end">
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-intelQEDarkBlue text-white rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-intelQEDarkBlue"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Mail, Shield, Lock, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../data';
import toast from 'react-hot-toast';
import ChangePasswordForm from './ChangePasswordForm';
import { getUserId, getUserUpdSeqNo } from '../../utils/storage';

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    organization: string;
    joinDate: string;
    isEnabled2FA: boolean;
}

export default function ProfilePage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);
    const usrId = getUserId()
    var updSeqNo = 0;

    if (user?.userId === usrId) {
        updSeqNo = getUserUpdSeqNo()
    }

    const [profile, setProfile] = useState<UserProfile>({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        organization: '',
        joinDate: new Date().toISOString().split('T')[0],
        isEnabled2FA: false
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${API_URL}/GetUserProfile/${user?.userId}`, {
                    credentials: 'include'
                });
                const data = await response.json();
                if (data.success) {
                    setProfile({
                        firstName: data.data.firstName,
                        lastName: data.data.lastName,
                        email: data.data.email,
                        role: data.data.admin ? 'Admin' : 'User',
                        organization: data.data.orgName || 'Not specified',
                        joinDate: new Date(data.data.createDate).toLocaleDateString(),
                        isEnabled2FA: data.data.isEnabled2FA || false
                    });
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        if (user?.userId) {
            fetchProfile();
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/updateProfile/${user?.userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    firstName: profile.firstName,
                    lastName: profile.lastName
                }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success('Profile updated successfully');
                setIsEditing(false);
            } else {
                toast.error('Failed to update profile');
            }
        } catch (error) {
            toast.error('Error updating profile');
        }
    };

    const update2FA = async () => {

        if(updSeqNo < 0){
            toast.error("Invalid User Data");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/update2fa/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    userId: user?.userId,
                    isEnabled_2FA: !profile.isEnabled2FA,
                    update_seq_no: updSeqNo
                }),
            });

            const data = await response.json();
            if (data.success) {
                setProfile(prev => ({ ...prev, isEnabled2FA: !prev.isEnabled2FA }));
                toast.success(`2FA ${profile.isEnabled2FA ? 'disabled' : 'enabled'} successfully`);
            } else {
                toast.error('Failed to update 2FA settings');
            }
        } catch (error) {
            toast.error('Error updating 2FA settings');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-8 px-4">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back
                </button>

                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`px-4 py-2 rounded-md text-sm font-medium ${isEditing
                                    ? 'bg-gray-200 text-gray-600'
                                    : 'bg-intelQEDarkBlue text-white hover:bg-sky-700'
                                }`}
                        >
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    value={profile.firstName}
                                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                    disabled={!isEditing}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-intelQEDarkBlue focus:ring-intelQEDarkBlue disabled:bg-gray-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    value={profile.lastName}
                                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                    disabled={!isEditing}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-intelQEDarkBlue focus:ring-intelQEDarkBlue disabled:bg-gray-50"
                                />
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div className="flex items-center text-gray-600">
                                <Mail className="h-5 w-5 mr-2" />
                                <span>{profile.email}</span>
                            </div>

                            <div className="flex items-center text-gray-600">
                                <Shield className="h-5 w-5 mr-2" />
                                <span>{profile.role}</span>
                            </div>

                            {/* <div className="flex items-center text-gray-600">
                <Building className="h-5 w-5 mr-2" />
                <span>{profile.organization}</span>
              </div> */}

                            {/* <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-2" />
                <span>Joined: {profile.joinDate}</span>
              </div> */}
                        </div>

                        {isEditing && (
                            <div className="mt-6 flex justify-end">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-intelQEDarkBlue text-white rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-intelQEDarkBlue"
                                >
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </form>

                    <div className="mt-8 border-t pt-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Lock className="h-5 w-5 mr-2 text-gray-500" />
                                    <span className="text-gray-700">Password</span>
                                </div>
                                <button
                                    onClick={() => setIsPasswordFormOpen(true)}
                                    className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Change Password
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <QrCode className="h-5 w-5 mr-2 text-gray-500" />
                                    <span className="text-gray-700">Two-Factor Authentication</span>
                                </div>
                                <button
                                    onClick={update2FA}
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-intelQEDarkBlue focus:ring-offset-2 ${profile.isEnabled2FA ? 'bg-intelQEDarkBlue' : 'bg-gray-200'
                                        }`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${profile.isEnabled2FA ? 'translate-x-5' : 'translate-x-0'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ChangePasswordForm
                isOpen={isPasswordFormOpen}
                onClose={() => setIsPasswordFormOpen(false)}
                userId={user?.userId || 0}
            />
        </div>
    );
}