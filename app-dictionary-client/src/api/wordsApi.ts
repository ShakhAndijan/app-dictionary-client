import apiClient from './client';
import { Word } from '../types';

export function getWords() {
  return apiClient.get<Word[]>('/words').then((r) => r.data);
}

export function addWord(data: { english: string; uzbek: string; definition?: string }) {
  return apiClient.post<Word>('/words', data).then((r) => r.data);
}

export function updateWord(
  id: number,
  data: Partial<{ english: string; uzbek: string; definition: string }>
) {
  return apiClient.put<Word>(`/words/${id}`, data).then((r) => r.data);
}

export function deleteWord(id: number) {
  return apiClient.delete(`/words/${id}`).then((r) => r.data);
}
