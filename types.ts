
export enum AppView {
  HOME = 'home',
  SURVEY_STEP_1 = 'survey_1',
  SURVEY_STEP_2 = 'survey_2',
  VENTING_WALL = 'venting_wall'
}

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
  aiHelp: string;
  aiTasks: string[];
  mood: string;
}
