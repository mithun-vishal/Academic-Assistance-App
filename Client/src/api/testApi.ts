import axiosInstance from '../Axios/axiosInstance';

export interface TestData {
  title: string;
  description: string;
  subject: string;
  duration: number;
  totalMarks: number;
  questions: {
    questionText: string;
    options: string[];
    correctAnswer: number;
  }[];
}

export async function fetchTests() {
  const response = await axiosInstance.get('/tests');
  return response.data;
}

export async function createTest(data: TestData) {
  const response = await axiosInstance.post('/tests', data);
  return response.data;
}

export async function submitTest(data: { testId: string, answers: number[], timeTaken: number }) {
  const response = await axiosInstance.post('/tests/submit', data);
  return response.data;
}

export async function fetchResults() {
  const response = await axiosInstance.get('/tests/results');
  return response.data;
}

export async function fetchTestResults(testId: string) {
  const response = await axiosInstance.get(`/tests/results/${testId}`);
  return response.data;
}
