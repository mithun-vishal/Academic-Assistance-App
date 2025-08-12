import React from 'react';
import { MessageCircle, FileText, BookOpen, BarChart3, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import clsx from 'clsx';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const { user } = useAuth();

  const getNavItems = () => {
    const commonItems = [
      { id: 'chat', label: 'Chat', icon: MessageCircle },
      { id: 'resources', label: 'Resources', icon: BookOpen },
    ];

    const roleSpecificItems = {
      student: [
        { id: 'tests', label: 'Tests', icon: FileText },
        { id: 'results', label: 'Results', icon: BarChart3 },
      ],
      teacher: [
        { id: 'tests', label: 'Tests', icon: FileText },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      ],
      admin: [
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'settings', label: 'Settings', icon: User },
      ],
      owner: [
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'admin', label: 'Admin', icon: User },
      ]
    };

    return [...commonItems, ...roleSpecificItems[user?.role as keyof typeof roleSpecificItems] || []];
  };

  const navItems = getNavItems().slice(0, 4); // Limit to 4 items for mobile

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 sm:hidden z-40">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={clsx(
                "flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors duration-200",
                isActive ? "text-blue-600" : "text-gray-600"
              )}
            >
              <Icon className={clsx(
                "h-5 w-5",
                isActive ? "text-blue-600" : "text-gray-500"
              )} />
              <span className={clsx(
                "text-xs font-medium",
                isActive ? "text-blue-600" : "text-gray-600"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};