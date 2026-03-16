export type Mood = 'Happy' | 'Neutral' | 'Sad' | 'Anxious';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role: 'student' | 'mentor';
  createdAt: string;
}

export interface Task {
  id?: string;
  userId: string;
  title: string;
  subject: string;
  description?: string;
  deadline: string;
  completed: boolean;
  type: 'assignment' | 'classwork';
  createdAt: string;
}

export interface CheckIn {
  id?: string;
  userId: string;
  mood: Mood;
  timestamp: string;
}

export interface ChatMessage {
  id?: string;
  groupId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isAnonymous?: boolean;
}

export interface ChatGroup {
  id?: string;
  name: string;
  description: string;
  members: string[];
}

export interface AiChatMessage {
  id?: string;
  userId: string;
  question: string;
  answer: string;
  timestamp: string;
}
