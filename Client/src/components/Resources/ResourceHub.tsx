import React, { useEffect, useState } from 'react';
import { Resource } from '../../types';
import { fetchResources } from '../../api/resourceApi';
import { Search, Filter, Download, Eye, Tag, Upload } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns';
import axios from 'axios';
import axiosInstance from '../../Axios/axiosInstance';

export const ResourceHub: React.FC = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    const loadResources = async () => {
      setLoading(true); // Ensure loading state is set at start
      setError('');     // Reset error before fetching
      try {
        const data = await fetchResources();
        setResources(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load resources.');
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, []);

  // Filter resources by search term, subject, and type
  const filteredResources = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || r.subject === selectedSubject;
    const matchesType = selectedType === 'all' || r.type === selectedType;
    return matchesSearch && matchesSubject && matchesType;
  });

  if (loading) return <p>Loading resources...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  // Collect unique subjects and types for filter dropdowns
  const subjects = Array.from(new Set(resources.map(r => r.subject)));
  const types = Array.from(new Set(resources.map(r => r.type)));

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Resources</h2>
      <div className="flex gap-4 mb-4 items-center">
        <div className="flex items-center gap-2">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <Tag size={18} />
          <select
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} />
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="all">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        {user?.role === 'teacher' && (
          <button className="flex items-center gap-2 text-blue-600">
            <Upload size={18} />
            Upload Resource
          </button>
        )}
      </div>
      {filteredResources.length === 0 ? (
        <p>No resources available.</p>
      ) : (
        <ul className="space-y-3">
          {filteredResources.map(r => (
            <li key={r.id} className="border p-3 rounded-lg">
              <h3 className="font-bold">{r.title}</h3>
              <p>{r.description}</p>
              <div className="flex gap-2 items-center mt-2">
                <a href={r.url} target="_blank" rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1">
                  <Eye size={16} /> View
                </a>
                {user?.role === 'student' && r.url && (
                  <a href={r.url} download className="text-green-600 hover:underline flex items-center gap-1">
                    <Download size={16} /> Download
                  </a>
                )}
                <span className="text-xs text-gray-500 ml-auto">
                  {r.uploadedAt && format(new Date(r.uploadedAt), 'PPP')}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// const token = localStorage.getItem("token");

// await axios.get("http://localhost:5000/api/resources", {
//   headers: {
//     Authorization: `Bearer ${token}`,
//   },
// });

// axiosInstance.get("/resources");
