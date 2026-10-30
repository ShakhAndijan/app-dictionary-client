import { ReviewSummary, Word } from '../types';
import { QuizMode } from '../api/quizApi';
import { dayKey } from '../utils/date';

// The same limits the server uses for its daily queue and free practice.
const REVIEWS_PER_DAY = 40;
const NEW_PER_DAY = 10;
const WEAK_LIMIT = 30;
const FREE_DECK_SIZE = 20;

function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function isDue(w: Word, today: string) {
  return w.state !== 'NEW' && (!w.nextReviewDate || w.nextReviewDate <= today);
}

function dueWords(words: Word[], today: string) {
  return words
    .filter((w) => isDue(w, today))
    .sort((a, b) => (a.nextReviewDate ?? '').localeCompare(b.nextReviewDate ?? ''))
    .slice(0, REVIEWS_PER_DAY);
}

function newWords(words: Word[]) {
  return words
    .filter((w) => w.state === 'NEW')
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .slice(0, NEW_PER_DAY);
}

/** Builds a deck from the phone's copy of the words, the way the server would. */
export function buildOfflineDeck(mode: QuizMode, words: Word[]): Word[] {
  const today = dayKey(new Date());
  switch (mode) {
    case 'DUE':
      return [...dueWords(words, today), ...newWords(words)];
    case 'WEAK':
      return words
        .filter((w) => w.weak)
        .sort((a, b) => b.lapses - a.lapses)
        .slice(0, WEAK_LIMIT);
    case 'FAVORITES':
      return shuffled(words.filter((w) => w.favorite)).slice(0, FREE_DECK_SIZE);
    case 'TODAY':
      return shuffled(words.filter((w) => dayKey(new Date(w.createdAt)) === today)).slice(0, FREE_DECK_SIZE);
    default:
      return shuffled(words).slice(0, FREE_DECK_SIZE);
  }
}

/** The review summary computed from the phone's words; goal and progress come from the last known values. */
export function summarizeOffline(words: Word[], cached: ReviewSummary | null, answeredOffline: number): ReviewSummary {
  const today = dayKey(new Date());
  return {
    dueCount: dueWords(words, today).length,
    newCount: newWords(words).length,
    learningCount: words.filter((w) => w.state === 'LEARNING').length,
    masteredCount: words.filter((w) => w.state === 'MASTERED').length,
    totalWords: words.length,
    weakCount: words.filter((w) => w.weak).length,
    dailyGoal: cached?.dailyGoal ?? 10,
    todayDone: (cached?.todayDone ?? 0) + answeredOffline,
  };
}
