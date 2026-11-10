import apiClient from './client';

export interface SentenceStatus {
  enabled: boolean;
  remainingToday: number;
  dailyLimit: number;
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
