import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Upload, Tag } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Resource } from '../../types';
import { format } from 'date-fns';
import { useEffect } from 'react';


export const ResourceHub: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [resources, setResources] = useState<Resource[]>([]); // <-- FIXED: add resources state

  // Mock data
  const mockResources: Resource[] = [
    {
      id: '1',
      title: 'Data Structures and Algorithms Notes',
      description: 'Comprehensive notes covering all major data structures and algorithms',
      type: 'pdf',
      subject: 'Computer Science',
      year: 2,
      tags: ['algorithms', 'data structures', 'programming'],
      uploadedBy: '2',
      uploadedAt: new Date('2025-01-15'),
      status: 'approved',
      url: '#',
      fileSize: 2048000
    },
    {
      id: '2',
      title: 'Object-Oriented Programming Video Lectures',
      description: 'Complete video series on OOP concepts with practical examples',
      type: 'video',
      subject: 'Computer Science',
      year: 1,
      tags: ['oop', 'java', 'programming'],
      uploadedBy: '2',
      uploadedAt: new Date('2025-01-10'),
      status: 'approved',
      url: '#',
      fileSize: 104857600
    },
    {
      id: '3',
      title: 'Database Design Presentation',
      description: 'Interactive presentation on database design principles and normalization',
      type: 'presentation',
      subject: 'Computer Science',
      year: 3,
      tags: ['database', 'sql', 'design'],
      uploadedBy: '2',
      uploadedAt: new Date('2025-01-08'),
      status: 'pending',
      url: '#',
      fileSize: 5120000
    }
  ];
  
  useEffect(() => {
  fetch('http://localhost:5000/api/resources')
    .then(res => res.json())
    .then(setResources);   
}, []);

  const subjects = ['all', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry'];
  const resourceTypes = ['all', 'pdf', 'video', 'presentation', 'article', 'image'];

  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === 'all' || resource.subject === selectedSubject;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const isApproved = resource.status === 'approved' || user?.role !== 'student';
    
    return matchesSearch && matchesSubject && matchesType && isApproved;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'video': return '🎥';
      case 'presentation': return '📊';
      case 'article': return '📝';
      case 'image': return '🖼️';
      default: return '📁';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Resource Hub</h2>
          <p className="text-gray-600">Access and manage educational resources</p>
        </div>
        {(user?.role === 'teacher' || user?.role === 'admin' || user?.role === 'owner') && (
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            <Upload className="h-4 w-4" />
            <span>Upload Resource</span>
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject === 'all' ? 'All Subjects' : subject}
                </option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {resourceTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <div key={resource.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getTypeIcon(resource.type)}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{resource.title}</h3>
                  <p className="text-xs text-gray-500">{resource.subject}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                resource.status === 'approved' 
                  ? 'bg-green-100 text-green-800'
                  : resource.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {resource.status}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{resource.description}</p>

            <div className="flex flex-wrap gap-1 mb-3">
              {resource.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </span>
              ))}
              {resource.tags.length > 3 && (
                <span className="text-xs text-gray-500">+{resource.tags.length - 3} more</span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <span>{formatFileSize(resource.fileSize || 0)}</span>
              <span>{format(resource.uploadedAt, 'MMM d, yyyy')}</span>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                <Eye className="h-4 w-4" />
                <span>View</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors duration-200">
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or upload new resources.</p>
        </div>
      )}
    </div>
  );

};