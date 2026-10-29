import apiClient from './client';
import { Word } from '../types';
import { QuizMode } from './quizApi';

export function getFlashcardDeck(mode: QuizMode) {
  return apiClient.get<Word[]>('/flashcards', { params: { mode } }).then((r) => r.data);
}

export function answerFlashcard(wordId: number, known: boolean) {
  return apiClient.post('/flashcards/answer', { wordId, known }).then((r) => r.data);
}
