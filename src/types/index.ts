export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin' | 'owner';
  department?: string;
  year?: number;
  avatar?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'file' | 'test';
}

export interface Test {
  id: string;
  title: string;
  description: string;
  subject: string;
  duration: number; // in minutes
  totalMarks: number;
  questions: Question[];
  createdBy: string;
  createdAt: Date;
  scheduledAt?: Date;
  dueDate?: Date;
  status: 'draft' | 'scheduled' | 'active' | 'completed';
  assignedTo: string[]; // student IDs
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  marks: number;
  explanation?: string;
}

export interface TestResult {
  id: string;
  testId: string;
  studentId: string;
  answers: number[];
  score: number;
  percentage: number;
  submittedAt: Date;
  timeTaken: number; // in minutes
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'article' | 'image' | 'presentation';
  subject: string;
  year?: number;
  tags: string[];
  uploadedBy: string;
  uploadedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  url: string;
  fileSize?: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'urgent' | 'event' | 'exam';
  targetRoles: string[];
  createdBy: string;
  createdAt: Date;
  expiresAt?: Date;
}

export interface Analytics {
  totalStudents: number;
  totalTeachers: number;
  totalTests: number;
  totalResources: number;
  activeUsers: number;
  testCompletionRate: number;
  averageScore: number;
  resourceUsage: number;
}