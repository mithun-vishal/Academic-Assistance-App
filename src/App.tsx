import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { Navbar } from './components/Layout/Navbar';
import { Sidebar } from './components/Layout/Sidebar';
import { BottomNavigation } from './components/Layout/BottomNavigation';
import { ChatInterface } from './components/Chat/ChatInterface';
import { TestList } from './components/Tests/TestList';
import { ResourceHub } from './components/Resources/ResourceHub';
import { AnalyticsDashboard } from './components/Analytics/AnalyticsDashboard';
import { AdminPanel } from './components/Admin/AdminPanel';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface />;
      case 'tests':
      case 'results':
        return <TestList />;
      case 'resources':
        return <ResourceHub />;
      case 'analytics':
      case 'dashboard':
        return <AnalyticsDashboard />;
      case 'admin':
      case 'settings':
      case 'users':
        return <AdminPanel />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar - Both Mobile and Desktop */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
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
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Smart Doubt Solver...</p>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <LoginForm />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;