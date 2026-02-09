/**
 * Core Type Definitions for oqu EdTech Platform
 */

// Legacy type - kept for backward compatibility with mock content
export type Interest = string;// Russian labels supported

export type Grade = 7 | 8 | 9 | 10 | 11;

export interface Topic {
  id: string;
  title: string;
  description: string;
  grade: Grade;
}

export interface TopicScore {
  topicId: string;
  score: number | null;
  attempts: number;
  lastAttempt?: Date;
}

export interface LessonContent {
  topicId: string;
  interest: Interest;
  cards: LessonCard[];
}

export interface LessonCard {
  id: string;
  type: 'metaphor' | 'theory' | 'example';
  title: string;
  content: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctAnswer: string;
  correctExplanation?: string; // Explanation for why correct answer is correct
  topicId: string;
}

export interface QuizOption {
  id: string;
  text: string;
  errorFeedback?: string; // Socratic explanation for why this is wrong
}

export interface Quiz {
  topicId: string;
  questions: QuizQuestion[];
}

export interface UserProgress {
  interests: string[]; // Array of user's selected interests (Russian labels)
  scores: Record<string, TopicScore>; // topicId -> score
}

export type BadgeState = 'not-started' | 'mastered' | 'needs-revision';

// History Feature Types
export interface QuizAnswer {
  questionId: string;
  questionText: string;
  selectedOptionId: string;
  selectedOptionText: string;
  correctOptionId: string;
  correctOptionText: string;
  isCorrect: boolean;
  feedback?: string;
  correctExplanation?: string; // Explanation for why correct answer is correct
}

export interface Attempt {
  id: string; // UUID
  topicId: string;
  topicTitle: string;
  timestamp: Date;
  userInterest?: string; // Optional: User's interest when taking quiz (legacy)
  correctCount: number;
  totalQuestions: number;
  percentage: number;
  answers: QuizAnswer[];
}

export interface AttemptHistory {
  attempts: Attempt[];
}
