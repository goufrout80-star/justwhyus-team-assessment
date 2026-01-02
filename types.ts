export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum Language {
  EN = 'en',
  FR = 'fr',
  AR = 'ar'
}

export interface Question {
  id: number;
  section: string; // "Mindset", "Skills", "Values", "Puzzle"
  text: {
    en: string;
    fr?: string;
    ar?: string;
  };
  isPuzzle: boolean;
}

// MongoDB: users collection
export interface UserProfile {
  id: string; // _id
  name: string; // username
  pin: string; 
  role: UserRole;
  language?: Language;
  createdAt?: string;
}

// MongoDB: sessions collection
export interface Session {
  userId: string;
  currentSection: string;
  currentIndex: number;
  startedAt: number;
  lastActiveAt: number;
  totalTimeSpent: number; // in seconds
  isCompleted: boolean;
  completedAt?: number; // Timestamp when user finished
}

// MongoDB: answers collection (for both Questions and Puzzles)
export interface Answer {
  userId: string;
  questionId: number;
  section: string;
  answerText: string;
  timeSpent: number; // seconds spent on this specific question
  updatedAt: number;
}

// MongoDB: activity_logs collection
export interface ActivityLog {
  id: string;
  userId: string;
  action: 'LOGIN' | 'ANSWER_SAVE' | 'PAUSE' | 'RESUME' | 'COMPLETE' | 'ADMIN_RESET';
  timestamp: number;
  metadata?: any;
}

// Combined state for frontend convenience
export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isAdmin: boolean;
}