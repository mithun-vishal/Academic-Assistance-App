import React, { useState } from 'react';
import { Clock, Users, FileText, Plus, Calendar, Award } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Test, TestResult } from '../../types';
import { format } from 'date-fns';

export const TestList: React.FC = () => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  // Mock data
  const mockTests: Test[] = [
    {
      id: '1',
      title: 'Data Structures Midterm',
      description: 'Comprehensive test covering arrays, linked lists, stacks, and queues',
      subject: 'Computer Science',
      duration: 120,
      totalMarks: 100,
      questions: [],
      createdBy: '2',
      createdAt: new Date('2025-01-10'),
      scheduledAt: new Date('2025-01-20T10:00:00'),
      dueDate: new Date('2025-01-20T12:00:00'),
      status: 'active',
      assignedTo: ['1']
    },
    {
      id: '2',
      title: 'Object-Oriented Programming Quiz',
      description: 'Quick assessment on OOP concepts and principles',
      subject: 'Computer Science',
      duration: 45,
      totalMarks: 50,
      questions: [],
      createdBy: '2',
      createdAt: new Date('2025-01-05'),
      scheduledAt: new Date('2025-01-15T14:00:00'),
      dueDate: new Date('2025-01-15T14:45:00'),
      status: 'completed',
      assignedTo: ['1']
    }
  ];

  const mockResults: TestResult[] = [
    {
      id: '1',
      testId: '2',
      studentId: '1',
      answers: [0, 1, 2, 0],
      score: 42,
      percentage: 84,
      submittedAt: new Date('2025-01-15T14:30:00'),
      timeTaken: 35
    }
  ];

  const filteredTests = mockTests.filter(test => {
    if (activeFilter === 'upcoming') return test.status === 'active';
    if (activeFilter === 'completed') return test.status === 'completed';
    return true;
  });

  const renderStudentView = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Total Tests</span>
          </div>
          <p className="text-2xl font-bold text-blue-700 mt-1">{mockTests.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">Average Score</span>
          </div>
          <p className="text-2xl font-bold text-green-700 mt-1">84%</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">Pending</span>
          </div>
          <p className="text-2xl font-bold text-orange-700 mt-1">1</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {['all', 'upcoming', 'completed'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter as any)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeFilter === filter
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Tests List */}
      <div className="space-y-4">
        {filteredTests.map((test) => {
          const result = mockResults.find(r => r.testId === test.id);
          return (
            <div key={test.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{test.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      test.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : test.status === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {test.status === 'active' ? 'Active' : 'Completed'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{test.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{test.duration} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileText className="h-4 w-4" />
                      <span>{test.totalMarks} marks</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{format(test.scheduledAt || new Date(), 'MMM d, yyyy HH:mm')}</span>
                    </div>
                  </div>

                  {result && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800">
                        <strong>Score:</strong> {result.score}/{test.totalMarks} ({result.percentage}%)
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Submitted on {format(result.submittedAt, 'MMM d, yyyy HH:mm')}
                      </p>
                    </div>
                  )}
                </div>

                <div className="ml-4">
                  {test.status === 'active' && !result ? (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      Take Test
                    </button>
                  ) : result ? (
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                      View Result
                    </button>
                  ) : (
                    <span className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg">
                      Scheduled
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderTeacherView = () => (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Test Management</h2>
          <p className="text-gray-600">Create, manage, and monitor student assessments</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
          <Plus className="h-4 w-4" />
          <span>Create Test</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Total Tests</span>
          </div>
          <p className="text-2xl font-bold text-blue-700 mt-1">{mockTests.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">Students</span>
          </div>
          <p className="text-2xl font-bold text-green-700 mt-1">45</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">Active Tests</span>
          </div>
          <p className="text-2xl font-bold text-orange-700 mt-1">1</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Avg Score</span>
          </div>
          <p className="text-2xl font-bold text-purple-700 mt-1">78%</p>
        </div>
      </div>

      {/* Tests List */}
      <div className="space-y-4">
        {mockTests.map((test) => (
          <div key={test.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-gray-900">{test.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    test.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : test.status === 'completed'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {test.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{test.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{test.duration} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileText className="h-4 w-4" />
                    <span>{test.totalMarks} marks</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{test.assignedTo.length} students</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(test.scheduledAt || new Date(), 'MMM d, yyyy HH:mm')}</span>
                  </div>
                </div>
              </div>

              <div className="ml-4 flex space-x-2">
                <button className="px-3 py-1 text-sm text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors duration-200">
                  Edit
                </button>
                <button className="px-3 py-1 text-sm text-green-600 border border-green-200 rounded-md hover:bg-green-50 transition-colors duration-200">
                  Results
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {user?.role === 'student' ? renderStudentView() : renderTeacherView()}
    </div>
  );
};