import { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from '../../data';

interface InviteUserFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InviteUserForm({ isOpen, onClose }: InviteUserFormProps) {
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle invitation logic here
    console.log('Inviting user:', { email, isAdmin, message });
    const response = await fetch(`${API_URL}/inviteUser`, {
      method: "POST",
      body: JSON.stringify({
        email: email,
        isAdmin: isAdmin
      }),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
    });
    const data = await response.json();

    if (data.success) {
      toast.success('User Invited Successfully!');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Invite User</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-intelQEDarkBlue focus:outline-none focus:ring-1 focus:ring-intelQEDarkBlue"
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAdmin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-intelQEDarkBlue focus:ring-intelQEDarkBlue"
              />
              <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-700">
                Grant admin privileges
              </label>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Personal Message (Optional)
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-intelQEDarkBlue focus:outline-none focus:ring-1 focus:ring-intelQEDarkBlue"
                placeholder="Add a personal message to the invitation email..."
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn1"
            >
              Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}