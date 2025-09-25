import React, { useState } from 'react';
import { 
  Users, 
  Settings, 
  Shield, 
  Megaphone,  
  Database,
  FileCheck,
  UserPlus,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('users');

  if (user?.role !== 'admin' && user?.role !== 'owner') {
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
    { id: 'resources', label: 'Resource Approval', icon: FileCheck },
    { id: 'security', label: 'Security Settings', icon: Shield },
    { id: 'system', label: 'System Settings', icon: Settings },
    { id: 'database', label: 'Database Management', icon: Database }
  ];

  const mockUsers = [
    { id: '1', name: 'Arjun Kumar', email: 'arjun@sns.edu', role: 'student', status: 'active', lastLogin: '2 hours ago' },
    { id: '2', name: 'Dr. Priya Sharma', email: 'priya@sns.edu', role: 'teacher', status: 'active', lastLogin: '1 hour ago' },
    { id: '3', name: 'Rajesh Patel', email: 'rajesh@sns.edu', role: 'student', status: 'inactive', lastLogin: '2 days ago' },
    { id: '4', name: 'Anita Singh', email: 'anita@sns.edu', role: 'teacher', status: 'active', lastLogin: '30 minutes ago' }
  ];

  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
          <UserPlus className="h-4 w-4" />
          <span>Add User</span>
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'teacher' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Disable</button>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Announcements</h3>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
          <Megaphone className="h-4 w-4" />
          <span>Create Announcement</span>
        </button>
      </div>

      <div className="bg-white p-6 border border-gray-200 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-4">Create New Announcement</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter announcement title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter announcement message"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="general">General</option>
                <option value="urgent">Urgent</option>
                <option value="event">Event</option>
                <option value="exam">Exam</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">All Users</option>
                <option value="students">Students Only</option>
                <option value="teachers">Teachers Only</option>
                <option value="admins">Admins Only</option>
              </select>
            </div>
          </div>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Send Announcement
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Recent Announcements</h4>
        <div className="space-y-3">
          <div className="bg-white p-4 border border-gray-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h5 className="font-medium text-gray-900">Semester Exam Schedule</h5>
                <p className="text-sm text-gray-600 mt-1">The final exam schedule has been released. Please check your individual timetables.</p>
                <p className="text-xs text-gray-500 mt-2">Sent to: All Students • 2 hours ago</p>
              </div>
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Urgent</span>
            </div>
          </div>
          <div className="bg-white p-4 border border-gray-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h5 className="font-medium text-gray-900">System Maintenance</h5>
                <p className="text-sm text-gray-600 mt-1">Scheduled maintenance on Sunday from 2 AM to 6 AM. System will be unavailable.</p>
                <p className="text-xs text-gray-500 mt-2">Sent to: All Users • 1 day ago</p>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">General</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-4">General Settings</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">College Name</label>
              <input
                type="text"
                defaultValue="SNS College of Technology"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
              <input
                type="text"
                defaultValue="2024-2025"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default Language</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
                <option value="te">Telugu</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-4">AI Assistant Settings</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Enable AI Chat</span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Multi-language Support</span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Voice Recognition</span>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'users':
        return renderUserManagement();
      case 'announcements':
        return renderAnnouncements();
      case 'system':
        return renderSystemSettings();
      default:
        return (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">⚙️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Feature Coming Soon</h3>
            <p className="text-gray-600">This admin feature is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
        <p className="text-gray-600">Manage users, settings, and system configuration</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {adminSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${
                    activeSection === section.id ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  <span className="font-medium">{section.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};