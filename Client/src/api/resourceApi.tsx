import axiosInstance from '../Axios/axiosInstance';

export interface ResourceData {
  title: string;
  description: string;
  subject: string;
  fileUrl: string;
}

// Fetch approved resources (students)
export async function fetchResources() {
  const response = await axiosInstance.get('/resources');
  return response.data;
}

// Upload a new resource (teachers)
export async function createResource(data: ResourceData | FormData) {
  const isFormData = data instanceof FormData;
  const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
  const response = await axiosInstance.post('/resources', data, config);
  return response.data;
}

// Fetch pending resources (admin)
export async function fetchPendingResources() {
  const response = await axiosInstance.get('/resources/pending');
  return response.data;
}

// Approve a resource (admin)
export async function approveResource(id: string) {
  const response = await axiosInstance.put(`/resources/approve/${id}`);
  return response.data;
}

// Reject a resource (admin)
export async function rejectResource(id: string) {
  const response = await axiosInstance.put(`/resources/reject/${id}`);
  return response.data;
}
