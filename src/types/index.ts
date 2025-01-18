export const CRISIS_KEYWORDS = [
  'suicide',
  'kill myself',
  'end my life',
  'want to die',
  'harm myself',
  'self harm',
  'hurt myself',
  'emergency',
  'crisis',
  'urgent help',
  'immediate help',
  'life threatening',
  'overdose',
  'kill',
  'die',
  'end it',
  'hopeless',
  'worthless'
];

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  username?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  lastMessageAt: Date;
}

export interface User {
  username: string;
  password: string;
  avatar: string;
}

export type Mood = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface MoodEntry {
  id: string;
  value: Mood;
  timestamp: Date;
  activities: string[];
  sleepHours: number;
  energyLevel: number;
  anxietyLevel: number;
  thoughts: string;
  triggers: string[];
  copingStrategies: string[];
}

export interface Exercise {
  id: string;
  title: string;
  type: 'mindfulness' | 'breathing' | 'physical' | 'relaxation';
  duration: number;
  steps: string[];
  completed: boolean;
  timestamp?: Date;
  effectiveness?: number;
  description: string;
  benefits: string[];
  imageUrl: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface ThoughtRecord {
  id: string;
  timestamp: Date;
  situation: string;
  automaticThoughts: string[];
  emotions: { name: string; intensity: number }[];
  evidenceFor: string[];
  evidenceAgainst: string[];
  balancedThought: string;
  newEmotions: { name: string; intensity: number }[];
}

export interface Goal {
  id: string;
  title: string;
  category: 'mental' | 'emotional' | 'physical' | 'social';
  steps: {
    description: string;
    completed: boolean;
    deadline: Date
  }[];
  progress: number;
  rewards: string[];
  supportNeeded: string[];
  reflections: { date: Date; content: string }[];
}

export interface MeditationSession {
  id: string;
  title: string;
  duration: number;
  type: 'breathing' | 'body-scan' | 'visualization' | 'loving-kindness';
  audioUrl: string;
  transcript: string;
  backgroundSound: string;
  guidedSteps: {
    timestamp: number;
    instruction: string
  }[];
}

export interface CrisisResource {
  name: string;
  type: 'hotline' | 'text' | 'emergency';
  contact: string;
  availableHours: string;
  description: string;
}
