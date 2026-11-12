import apiClient from './client';

export interface SentenceStatus {
  enabled: boolean;
  remainingToday: number;
  dailyLimit: number;
  dailyGoal: number;
  doneToday: number;
  goodToday: number;
}

export type SentenceMode = 'TODAY' | 'WEAK' | 'ALL';

export interface SentenceStats {
  total: number;
  averageScore: number;
  good: number;
  dailyGoal: number;
  goalDays: number;
  last7: { date: string; count: number }[];
}

export function getSentenceWords(mode: SentenceMode) {
  return apiClient.get<number[]>('/sentences/words', { params: { mode } }).then((r) => r.data);
}

export function getSentenceStats() {
  return apiClient.get<SentenceStats>('/sentences/stats').then((r) => r.data);
}

export interface SentenceResult {
  score: number;
  usesWord: boolean;
  corrected: string;
  feedback: string;
  xpGained: number;
  remainingToday: number;
}

export function getSentenceStatus() {
  return apiClient.get<SentenceStatus>('/sentences/status').then((r) => r.data);
}

/** The AI can take a while, so this call gets a longer timeout than the default. */
export function checkSentence(wordId: number, sentence: string) {
  return apiClient
    .post<SentenceResult>('/sentences/check', { wordId, sentence }, { timeout: 60000 })
    .then((r) => r.data);
}
