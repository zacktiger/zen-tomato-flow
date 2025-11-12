export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

export interface FocusSession {
  id: string;
  taskId?: string;
  taskTitle?: string;
  duration: number; // in minutes
  completedAt: number;
  type: 'focus' | 'break';
}

export interface MoodEntry {
  id: string;
  mood: number; // 1-5 scale
  note?: string;
  timestamp: number;
  sessionId?: string;
}
