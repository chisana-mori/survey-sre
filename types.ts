
export interface VentingPost {
  id: string;
  emoji: string;
  content: string;
  likes: string;
  rank?: number;
  rotation: number;
}

export interface SurveyState {
  tasks: string[];
  feedback: string;
  aiTasks: string[];
  aiHelp: string;
  mood: string;
}

export type AppRoute = '/' | '/survey' | '/venting';
