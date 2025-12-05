export enum AppMode {
  LEARN = 'LEARN',
  VISUALIZE = 'VISUALIZE',
  ASSESS = 'ASSESS',
}

export interface SlideContent {
  id: string;
  title: string;
  content: string[];
  imageDesc?: string; // Description of image from PDF for context
  bulletPoints: string[];
}

export interface Question {
  id: string;
  type: 'MCQ' | 'ESSAY';
  text: string;
  options?: string[]; // Only for MCQ
  correctOptionIndex?: number; // Only for MCQ
  context?: string; // Context from slides to help AI grade
}

export interface AssessmentResult {
  questionId: string;
  isCorrect?: boolean; // For MCQ
  score?: number; // 0-100 for Essay
  feedback: string;
  userAnswer: string;
}
