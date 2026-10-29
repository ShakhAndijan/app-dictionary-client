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

export interface WordImagePayload {
  contentType: string;
  data: string;
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
