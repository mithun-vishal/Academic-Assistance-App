import React from 'react';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Award, 
  Clock, 
  BookOpen,
  AlertTriangle,
  Target
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const AnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data
  const analytics = {
    totalStudents: 245,
    totalTeachers: 18,
    totalTests: 45,
    totalResources: 123,
    activeUsers: 89,
    testCompletionRate: 87,
    averageScore: 78,
    resourceUsage: 234
  };

  const recentActivity = [
    { action: 'Test completed', user: 'Arjun Kumar', time: '2 minutes ago', type: 'success' },
    { action: 'Resource uploaded', user: 'Dr. Priya Sharma', time: '15 minutes ago', type: 'info' },
    { action: 'Low performance alert', user: 'Rajesh Patel', time: '1 hour ago', type: 'warning' },
    { action: 'New user registered', user: 'Anita Singh', time: '2 hours ago', type: 'success' }
  ];

  const topPerformingStudents = [
    { name: 'Arjun Kumar', score: 95, tests: 12 },
    { name: 'Priya Patel', score: 92, tests: 11 },
    { name: 'Rahul Sharma', score: 89, tests: 10 },
    { name: 'Anita Singh', score: 87, tests: 9 }
  ];

  const subjectPerformance = [
    { subject: 'Computer Science', avgScore: 82, students: 45 },
    { subject: 'Mathematics', avgScore: 76, students: 38 },
    { subject: 'Physics', avgScore: 74, students: 32 },
    { subject: 'Chemistry', avgScore: 78, students: 35 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <p className="text-gray-600">Comprehensive insights and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalStudents}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+12% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tests Completed</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalTests}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+8% from last week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Award className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.averageScore}%</p>
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+3% improvement</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Resources</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalResources}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+15 new this week</span>
          </div>
        </div>
      </div>

      {/* Charts and Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Students */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Students</h3>
          </div>
          <div className="space-y-3">
            {topPerformingStudents.map((student, index) => (
              <div key={student.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-600">{student.tests} tests completed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">{student.score}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <BookOpen className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Subject Performance</h3>
          </div>
          <div className="space-y-4">
            {subjectPerformance.map((subject) => (
              <div key={subject.subject} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{subject.subject}</span>
                  <span className="text-sm text-gray-600">{subject.avgScore}% avg</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${subject.avgScore}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">{subject.students} students enrolled</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Early Intervention Alerts */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Early Intervention Alerts</h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">Low Performance Alert</p>
                  <p className="text-xs text-red-700">5 students scoring below 60% consistently</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">Attendance Warning</p>
                  <p className="text-xs text-yellow-700">3 students with irregular attendance</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Resource Usage</p>
                  <p className="text-xs text-blue-700">Low engagement with uploaded materials</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};