import apiClient from './client';
import { QuizPromptType } from '../types';

export type QuizMode = 'ALL' | 'TODAY';

export interface QuizProgress {
  answered: number;
  correctCount: number;
  incorrectCount: number;
  totalWords: number;
  unlimited: boolean;
  finished: boolean;
}

export interface QuizQuestion {
  sessionId: number;
  promptType: QuizPromptType;
  promptText: string;
  progress: QuizProgress;
}

export interface QuizAnswerResult {
  correct: boolean;
  correctAnswer: string;
  answeredPromptType: QuizPromptType;
  progress: QuizProgress;
  nextPromptType: QuizPromptType | null;
  nextPromptText: string | null;
}

export interface QuizSummary {
  sessionId: number;
  mode: QuizMode;
  totalAnswered: number;
  correctCount: number;
  incorrectCount: number;
  startedAt: string;
  finishedAt: string | null;
}

export function startQuiz(mode: QuizMode) {
  return apiClient.post<QuizQuestion>('/quiz/start', { mode }).then((r) => r.data);
}

export function submitQuizAnswer(sessionId: number, answer: string) {
  return apiClient.post<QuizAnswerResult>(`/quiz/${sessionId}/answer`, { answer }).then((r) => r.data);
}

export function finishQuiz(sessionId: number) {
  return apiClient.post<QuizSummary>(`/quiz/${sessionId}/finish`).then((r) => r.data);
}
