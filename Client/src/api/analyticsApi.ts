import axios from 'axios';

const API_URL = 'http://localhost:5000/api/analytics';

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalResources: number;
  totalTests: number;
  activeUsers: number;
  testCompletionRate: number;
  averageScore: number;
  resourceUsage: number;
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await axios.get(API_URL);
  return response.data;
};
