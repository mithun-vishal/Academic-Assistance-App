import axios from 'axios';
import { Resource } from '../types';

const API_URL = 'http://localhost:5000/api/resources';

export async function fetchResources(): Promise<Resource[]> {
  const response = await axios.get<Resource[]>(API_URL);
  return response.data;
}
