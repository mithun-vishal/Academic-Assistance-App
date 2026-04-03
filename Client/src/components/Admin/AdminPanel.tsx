import React, { useState, useEffect } from 'react';
import { Users, Settings, Megaphone, AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../Axios/axiosInstance';
import { format } from 'date-fns';

type Role = 'student' | 'teacher' | 'admin';

interface AppUser {
  _id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
}

const ROLE_STYLES: Record<Role, string> = {
  admin: 'bg-purple-100 text-purple-800',
  teacher: 'bg-green-100 text-green-800',
  student: 'bg-blue-100 text-blue-800',
};

interface AdminPanelProps {
  initialSection?: 'users' | 'announcements' | 'system';
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ initialSection = 'users' }) => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState(initialSection);
  const [usersList, setUsersList] = useState<AppUser[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementBody, setAnnouncementBody] = useState('');
  const [isSubmittingAnnouncement, setIsSubmittingAnnouncement] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = () => {
    axiosInstance.get('/auth/users')
      .then(res => setUsersList(res.data))
      .catch(err => console.error('Failed fetching users', err));
  };

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRoleChange = async (userId: string, newRole: Role) => {
    setUpdatingId(userId);
    try {
      await axiosInstance.patch(`/auth/users/${userId}/role`, { role: newRole });
      setUsersList(prev =>
        prev.map(u => u._id === userId ? { ...u, role: newRole } : u)
      );
      showToast('Role updated successfully!', 'success');
    } catch {
      showToast('Failed to update role. Try again.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementBody.trim()) return;
    
    setIsSubmittingAnnouncement(true);
    try {
      await axiosInstance.post('/notifications/announce', {
        title: announcementTitle,
        message: announcementBody
      });
      showToast('Announcement sent to all users!', 'success');
      setAnnouncementTitle('');
      setAnnouncementBody('');
    } catch (err) {
      showToast('Failed to send announcement.', 'error');
    } finally {
      setIsSubmittingAnnouncement(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to access the admin panel.</p>
      </div>
    );
  }

  const adminSections = [
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'system', label: 'System Settings', icon: Settings },
  ];

  const renderUserManagement = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
          <p className="text-sm text-gray-500 mt-0.5">Change any user's role using the dropdown.</p>
        </div>
        <span className="text-sm text-gray-500">{usersList.length} users</span>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Change Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {usersList.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-400 text-sm">Loading users...</td>
                </tr>
              )}
              {usersList.map((usr) => (
                <tr key={usr._id} className="hover:bg-gray-50 transition-colors">
                  {/* User info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white ${usr.role === 'admin' ? 'bg-purple-500' : usr.role === 'teacher' ? 'bg-green-500' : 'bg-blue-500'}`}>
                        {usr.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{usr.name}</p>
                        <p className="text-xs text-gray-500">{usr.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Current role badge */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${ROLE_STYLES[usr.role]}`}>
                      {usr.role}
                    </span>
                  </td>

                  {/* Role change dropdown */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {usr._id === user?.id ? (
                      <span className="text-xs text-gray-400 italic">You (cannot change)</span>
                    ) : (
                      <div className="relative inline-block">
                        <select
                          value={usr.role}
                          disabled={updatingId === usr._id}
                          onChange={(e) => handleRoleChange(usr._id, e.target.value as Role)}
                          className="appearance-none pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                          <option value="admin">Admin</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-2 h-4 w-4 text-gray-400 pointer-events-none" />
                        {updatingId === usr._id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-lg">
                            <div className="h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Joined date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {usr.createdAt ? format(new Date(usr.createdAt), 'MMM d, yyyy') : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnnouncements = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Create Announcement</h3>
      <p className="text-sm text-gray-500 mt-0.5">Send a notification to all users.</p>
      
      <form onSubmit={handleCreateAnnouncement} className="bg-white p-6 border border-gray-200 rounded-xl space-y-4 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={announcementTitle}
            onChange={(e) => setAnnouncementTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="e.g., Scheduled Maintenance"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            value={announcementBody}
            onChange={(e) => setAnnouncementBody(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
            placeholder="Write your announcement here..."
            required
          />
        </div>
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmittingAnnouncement || !announcementTitle.trim() || !announcementBody.trim()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmittingAnnouncement ? (
              <><div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</>
            ) : (
              <><Megaphone className="h-4 w-4" /> Send Announcement</>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
      <div className="bg-white p-10 border border-gray-200 rounded-xl text-center">
        <div className="text-5xl mb-4">⚙️</div>
        <h3 className="text-base font-medium text-gray-900 mb-1">Feature Coming Soon</h3>
        <p className="text-sm text-gray-500">This admin feature is under active development.</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'users': return renderUserManagement();
      case 'announcements': return renderAnnouncements();
      case 'system': return renderSystemSettings();
      default: return null;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in ${
          toast.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <CheckCircle2 className="h-4 w-4" />
          {toast.msg}
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
        <p className="text-gray-500 text-sm mt-1">Manage users, roles and platform settings.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar nav */}
        <div className="lg:w-56 flex-shrink-0">
          <nav className="space-y-1">
            {adminSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as 'users' | 'announcements' | 'system')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-colors duration-200 ${
                    activeSection === section.id
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${activeSection === section.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};