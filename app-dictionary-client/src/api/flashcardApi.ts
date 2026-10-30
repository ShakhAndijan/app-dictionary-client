import apiClient from './client';
import { Word } from '../types';
import { QuizMode } from './quizApi';
import { isNetworkError } from '../utils/errors';
import { isOnline } from '../services/connectivity';
import { loadWords } from '../services/offlineStore';
import { buildOfflineDeck } from '../services/offlineDecks';
import { enqueueAnswer, flushQueue, pendingCount } from '../services/offlineSync';

async function deckFromPhone(mode: QuizMode): Promise<Word[]> {
  const words = await loadWords();
  const deck = words ? buildOfflineDeck(mode, words) : [];
  if (deck.length === 0) {
    const message = "Offlayn rejimda bu to'plamda so'z yo'q";
    throw Object.assign(new Error(message), { response: { data: { message } } });
  }
  return deck;
}

/** A deck from the server, or from the phone's copy of the words when there is no internet. */
export async function getFlashcardDeck(mode: QuizMode): Promise<Word[]> {
  if (!isOnline()) return deckFromPhone(mode);
  try {
    if (pendingCount() > 0) await flushQueue().catch(() => undefined);
    return await apiClient.get<Word[]>('/flashcards', { params: { mode } }).then((r) => r.data);
  } catch (e) {
    if (isNetworkError(e)) return deckFromPhone(mode);
    throw e;
  }
}

/** Sends the answer; without internet it is kept on the phone and uploaded when the connection returns. */
export async function answerFlashcard(wordId: number, known: boolean, format: 'FLASHCARD' | 'MATCHING' = 'FLASHCARD') {
  if (!isOnline()) {
    await enqueueAnswer(wordId, known, format);
    return;
  }
  try {
    await apiClient.post('/flashcards/answer', { wordId, known, format });
  } catch (e) {
    if (!isNetworkError(e)) throw e;
    await enqueueAnswer(wordId, known, format);
  }
}
