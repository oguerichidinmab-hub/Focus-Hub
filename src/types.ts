import { Timestamp } from 'firebase/firestore';

export type Mood = 'Happy' | 'Neutral' | 'Sad' | 'Anxious' | 'Stressed' | 'Tired' | 'Lonely' | 'Motivated';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role: 'student' | 'mentor';
  createdAt: string;
  onboarded?: boolean;
  nickname?: string;
  grade?: string;
  strugglingSubjects?: string[];
  studyGoals?: string[];
  reminderTimes?: string[];
  hasExtramural?: boolean;
  supportPreferences?: string[];
  streak?: {
    current: number;
    lastCompletedDate: string | null;
    milestones: string[];
  };
}

export interface Task {
  id?: string;
  userId: string;
  title: string;
  subject: string;
  description?: string;
  dueDate: Timestamp;
  completed: boolean;
  type: 'homework' | 'test' | 'extramural';
  lessonTime?: string; // For extramural lessons
  lessonDays?: string[]; // For extramural lessons
  createdAt: Timestamp;
}

export interface CheckIn {
  id?: string;
  userId: string;
  mood: Mood;
  timestamp: Timestamp;
  note?: string;
}

export interface CommunityPost {
  id?: string;
  userId: string;
  authorName: string;
  content: string;
  category: 'win' | 'tip' | 'encouragement' | 'question';
  likes: string[]; // Array of user UIDs
  createdAt: Timestamp;
}

export interface SupportResource {
  id: string;
  title: string;
  description: string;
  category: 'stress' | 'study' | 'confidence' | 'help' | 'mental-health';
  type: 'article' | 'video' | 'helpline';
  url: string;
  icon: string;
}
