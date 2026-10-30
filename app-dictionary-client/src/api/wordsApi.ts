import apiClient from './client';
import { Word } from '../types';
import { isNetworkError } from '../utils/errors';
import { isOnline } from '../services/connectivity';
import { loadWords, saveWords } from '../services/offlineStore';
import { flushQueue, pendingCount } from '../services/offlineSync';

/**
 * The user's words. Every successful load refreshes the phone's copy; without internet that copy is used,
 * so the list, flashcards and games keep working.
 */
export async function getWords(): Promise<Word[]> {
  if (!isOnline()) {
    const cached = await loadWords();
    if (cached) return cached;
  }
  try {
    // Answers given offline go first, so the server's numbers already include them.
    if (pendingCount() > 0) await flushQueue().catch(() => undefined);
    const words = await apiClient.get<Word[]>('/words').then((r) => r.data);
    saveWords(words);
    return words;
  } catch (e) {
    if (isNetworkError(e)) {
      const cached = await loadWords();
      if (cached) return cached;
    }
    throw e;
  }
}

export function addWord(data: { english: string; uzbek: string; definition?: string }) {
  return apiClient.post<Word>('/words', data).then((r) => r.data);
}

export function updateWord(
  id: number,
  data: Partial<{ english: string; uzbek: string; definition: string; favorite: boolean }>
) {
  return apiClient.put<Word>(`/words/${id}`, data).then((r) => r.data);
}

export function deleteWord(id: number) {
  return apiClient.delete(`/words/${id}`).then((r) => r.data);
}

export interface WordImagePayload {
  contentType: string;
  data: string;
}

export interface WordSuggestion {
  english: string;
  uzbek: string | null;
  definition: string | null;
  example: string | null;
  phonetic: string | null;
}

/** Looks up a translation and definition for the add-word form; nothing is saved. */
export function suggestWord(english: string) {
  return apiClient.get<WordSuggestion>('/words/suggest', { params: { english } }).then((r) => r.data);
}

export function setWordImage(id: number, image: WordImagePayload) {
  return apiClient.put<Word>(`/words/${id}/image`, image).then((r) => r.data);
}

export function getWordImage(id: number) {
  return apiClient.get<WordImagePayload>(`/words/${id}/image`).then((r) => r.data);
}

export function deleteWordImage(id: number) {
  return apiClient.delete<Word>(`/words/${id}/image`).then((r) => r.data);
}
