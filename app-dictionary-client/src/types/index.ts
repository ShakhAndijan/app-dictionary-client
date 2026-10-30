export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  dailyGoal: number;
}

export interface Word {
  id: number;
  english: string;
  uzbek: string;
  definition: string | null;
  createdAt: string;
  state: WordState;
  lapses: number;
  weak: boolean;
  imageVersion: number | null;
  favorite: boolean;
  /** ISO date of the next scheduled review; null/absent for a word never answered. */
  nextReviewDate?: string | null;
}

export type WordState = 'NEW' | 'LEARNING' | 'MASTERED';

export interface ReviewSummary {
  dueCount: number;
  newCount: number;
  learningCount: number;
  masteredCount: number;
  totalWords: number;
  weakCount: number;
  dailyGoal: number;
  todayDone: number;
}

export type QuizPromptType = 'english' | 'uzbek' | 'definition';

export interface DailyStats {
  date: string;
  wordsAdded: number;
  quizzesTaken: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracyPercent: number;
}

export interface MonthlyStats {
  month: string;
  wordsAdded: number;
  quizzesTaken: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracyPercent: number;
}

export interface StatsSummary {
  totalWords: number;
  totalQuizzes: number;
  totalCorrect: number;
  totalIncorrect: number;
  accuracyPercent: number;
  activeDays: number;
  currentStreak: number;
  bestStreak: number;
  formats: FormatStats[];
}

export type AnswerFormat = 'TYPED' | 'CHOICE' | 'FLASHCARD' | 'LISTENING' | 'MATCHING' | 'SPEED';

export interface FormatStats {
  format: AnswerFormat;
  total: number;
  correct: number;
  accuracyPercent: number;
}
