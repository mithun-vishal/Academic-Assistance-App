import React from 'react';
import {
  MessageCircle,
  FileText,
  BookOpen,
  BarChart3,
  TrendingUp,
  Users,
  Shield,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import clsx from 'clsx';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isOpen, onClose }) => {
  const { user } = useAuth();

  const getMenuItems = () => {
    const commonItems = [
      { id: 'chat', label: 'AI Assistant', icon: MessageCircle, color: 'text-blue-600' },
      { id: 'resources', label: 'Resources', icon: BookOpen, color: 'text-gray-600 dark:text-gray-400' },
    ];

    const roleSpecificItems = {
      student: [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'text-gray-600 dark:text-gray-400' },
        { id: 'tests', label: 'My Tests', icon: FileText, color: 'text-gray-600 dark:text-gray-400' },
      ],
      teacher: [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'text-gray-600 dark:text-gray-400' },
        { id: 'tests', label: 'All Tests', icon: FileText, color: 'text-gray-600 dark:text-gray-400' },
        { id: 'users', label: 'Users', icon: Users, color: 'text-gray-600 dark:text-gray-400' },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp, color: 'text-gray-600 dark:text-gray-400' },
      ],
      admin: [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'text-gray-600 dark:text-gray-400' },
        { id: 'tests', label: 'All Tests', icon: FileText, color: 'text-gray-600 dark:text-gray-400' },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-gray-600 dark:text-gray-400' },
        { id: 'admin', label: 'Admin Panel', icon: Shield, color: 'text-gray-600 dark:text-gray-400' },
      ]
    };

    return [...commonItems, ...roleSpecificItems[user?.role as keyof typeof roleSpecificItems] || []];
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={clsx(
        "fixed left-0 top-0 h-full w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-xl transform transition-all duration-300 ease-in-out z-50 border-r border-indigo-50 dark:border-gray-700",
        "lg:relative lg:translate-x-0 lg:shadow-none lg:z-auto",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 lg:hidden">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow" style={{background: 'linear-gradient(135deg, #6366f1, #3b82f6)'}}>
              <span className="text-white font-bold text-base">SNS</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white text-lg">Menu</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 lg:mt-0 lg:pt-8">
          <div className="px-6 mb-6 lg:hidden">
            <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <img
                src={user?.avatar || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150'}
                alt={user?.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-600"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          <ul className="space-y-2 px-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onTabChange(item.id);
                      if (window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                    className={clsx(
                      "w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-left transition-all duration-200 relative",
                      activeTab === item.id
                        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold shadow-sm"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900"
                    )}
                  >
                    <Icon className={clsx(
                      "h-4 w-4 flex-shrink-0",
                      activeTab === item.id ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400"
                    )} />
                    <span className="text-sm">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Role indicator */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-900" style={{background: 'linear-gradient(135deg, #eef2ff, #e0f2fe)'}}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">
                  {user?.role?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <span className="text-sm font-semibold text-blue-900 dark:text-blue-300 capitalize">
                  {user?.role} Dashboard
                </span>
                <p className="text-xs text-blue-600 dark:text-blue-400">SNS College</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};