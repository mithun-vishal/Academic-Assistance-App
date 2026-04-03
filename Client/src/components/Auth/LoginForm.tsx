import React, { useState, useEffect } from 'react';
import { LogIn, Eye, EyeOff, GraduationCap, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const { login, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Captcha State
  const [captchaQ, setCaptchaQ] = useState({ text: '', answer: 0 });
  const [userCaptchaAnswer, setUserCaptchaAnswer] = useState('');

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 15) + 1;
    const b = Math.floor(Math.random() * 15) + 1;
    setCaptchaQ({ text: `${a} + ${b}`, answer: a + b });
    setUserCaptchaAnswer('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Pre-flight Captcha validation
    if (parseInt(userCaptchaAnswer) !== captchaQ.answer) {
      setError('Captcha validation failed. Try again.');
      generateCaptcha();
      return;
    }

    try {
      await login(email, password);
    } catch (err: unknown) {
      // Backend guarantees "User not found" on 404 explicitly
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Invalid credentials. Please check your email and password.');
      }
      
      // Always reset captcha on failure to prevent brute forcing
      generateCaptcha();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background: 'linear-gradient(135deg, #eef2ff 0%, #f0f9ff 50%, #ecfdf5 100%)'}}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edubridge</h1>
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

            {/* Captcha Block */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center space-x-4">
              <div className="flex items-center text-gray-500">
                <ShieldAlert className="w-5 h-5 mr-2" />
                <span className="font-semibold">{captchaQ.text} = </span>
              </div>
              <input 
                type="number"
                value={userCaptchaAnswer}
                onChange={(e) => setUserCaptchaAnswer(e.target.value)}
                className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Captcha answer"
                required
              />
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

          {onSwitchToRegister && (
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={onSwitchToRegister}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Create Account
                </button>
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>© 2026 SNS College of Technology. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};