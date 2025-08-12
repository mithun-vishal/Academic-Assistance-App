import React, { useState } from 'react';
import { LogIn, Eye, EyeOff, Users, GraduationCap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const demoUsers = [
    { email: 'arjun.student@sns.edu', role: 'Student', name: 'Arjun Kumar' },
    { email: 'priya.teacher@sns.edu', role: 'Teacher', name: 'Dr. Priya Sharma' },
    { email: 'admin@sns.edu', role: 'Admin', name: 'Admin User' },
    { email: 'owner@sns.edu', role: 'Owner', name: 'College Owner' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid credentials. Please check your email and password.');
    }
  };

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Smart Doubt Solver</h1>
              <p className="text-sm text-gray-600">SNS College of Technology</p>
            </div>
          </div>
          <p className="text-gray-600">Sign in to access your learning dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your college email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3 text-center">Quick Demo Access</p>
            <div className="space-y-2">
              {demoUsers.map((user) => (
                <button
                  key={user.email}
                  onClick={() => handleDemoLogin(user.email)}
                  className="w-full flex items-center justify-between p-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>{user.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{user.role}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Protected by enterprise-grade security
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>© 2025 SNS College of Technology. All rights reserved.</p>
          <p className="mt-1">Powered by Smart Doubt Solver AI</p>
        </div>
      </div>
    </div>
  );
};