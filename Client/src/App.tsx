import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { Navbar } from './components/Layout/Navbar';
import { Sidebar } from './components/Layout/Sidebar';
import { BottomNavigation } from './components/Layout/BottomNavigation';
import { ChatInterface } from './components/Chat/ChatInterface';
import { TestList } from './components/Tests/TestList';
import { ResourceHub } from './components/Resources/ResourceHub';
import { AnalyticsDashboard } from './components/Analytics/AnalyticsDashboard';
import { AdminPanel } from './components/Admin/AdminPanel';
import { TeacherDashboard } from './components/Teacher/TeacherDashboard';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [subView, setSubView] = useState<string | null>(null);

  const handleNavigate = (tab: string, view: string | null = null) => {
    setActiveTab(tab);
    setSubView(view);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface />;
      case 'tests':
      case 'results':
        return <TestList initialViewState={(subView as any) || 'list'} />;
      case 'resources':
        return <ResourceHub setActiveTab={(tab) => handleNavigate(tab)} initialShowForm={subView === 'upload'} />;
      case 'dashboard':
        return <TeacherDashboard onAction={handleNavigate} />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'admin':
        return <AdminPanel initialSection="announcements" />;
      case 'users':
        return <AdminPanel initialSection="users" />;
      case 'settings':
        return <AdminPanel initialSection="system" />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="h-screen flex overflow-hidden" style={{background: 'radial-gradient(ellipse at top left, #eef2ff 0%, #f8fafc 45%, #f0f9ff 100%)'}}>
      {/* Sidebar - Both Mobile and Desktop */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => handleNavigate(tab)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <Navbar onToggleSidebar={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto pb-16 sm:pb-0">
          {renderContent()}
        </main>

        {/* Bottom Navigation - Mobile */}
        <BottomNavigation activeTab={activeTab} onTabChange={(tab) => handleNavigate(tab)} />
      </div>
    </div>
  );
};

const AuthPages: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);

  if (showRegister) {
    return <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />;
  }
  return <LoginForm onSwitchToRegister={() => setShowRegister(true)} />;
};

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Smart Doubt Solver...</p>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <AuthPages />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;