export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Word {
  id: number;
  english: string;
  uzbek: string;
  definition: string | null;
  createdAt: string;
}

export type QuizPromptType = 'english' | 'uzbek' | 'definition';

export interface DailyStats {
  date: string;
  wordsAdded: number;
  quizzesTaken: number;
  correctAnswers: number;
  incorrectAnswers: number;
}

export interface MonthlyStats {
  month: string;
  wordsAdded: number;
  quizzesTaken: number;
  correctAnswers: number;
  incorrectAnswers: number;
}
