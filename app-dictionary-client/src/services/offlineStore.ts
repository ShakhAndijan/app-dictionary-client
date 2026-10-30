import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReviewSummary, User, Word } from '../types';
import { dayKey } from '../utils/date';

export type QueuedFormat = 'FLASHCARD' | 'MATCHING' | 'SPEED';

/** An answer given without internet, waiting to be uploaded. `clientId` makes the upload safe to repeat. */
export interface QueuedAnswer {
  clientId: string;
  wordId: number;
  known: boolean;
  format: QueuedFormat;
  answeredAt: string;
}

interface LocalDone {
  date: string;
  ids: number[];
}

const PREFIX = 'offline:v1';
const LAST_USER_KEY = `${PREFIX}:lastUser`;

// Everything is stored per user so two accounts on one phone never see each other's words or answers.
let userId: number | null = null;

export function setOfflineUser(id: number | null) {
  userId = id;
}

export function hasOfflineUser() {
  return userId !== null;
}

const keyOf = (name: string) => `${PREFIX}:${userId}:${name}`;

async function read<T>(name: string): Promise<T | null> {
  if (userId === null) return null;
  try {
    const raw = await AsyncStorage.getItem(keyOf(name));
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

async function write(name: string, value: unknown) {
  if (userId === null) return;
  try {
    await AsyncStorage.setItem(keyOf(name), JSON.stringify(value));
  } catch {
    // A full or unavailable disk only costs us the offline copy; never break the online flow for it.
  }
}

// Writers read-modify-write, so they take turns.
let chain: Promise<unknown> = Promise.resolve();
function locked<T>(fn: () => Promise<T>): Promise<T> {
  const next = chain.then(fn, fn);
  chain = next.catch(() => undefined);
  return next;
}

export async function saveLastUser(user: User) {
  try {
    await AsyncStorage.setItem(LAST_USER_KEY, JSON.stringify(user));
  } catch {
    // Optional: only lets the app open without internet.
  }
}

export async function loadLastUser(): Promise<User | null> {
  try {
    const raw = await AsyncStorage.getItem(LAST_USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function loadWords() {
  return read<Word[]>('words');
}

export function saveWords(words: Word[]) {
  return locked(() => write('words', words));
}

export function loadSummary() {
  return read<ReviewSummary>('summary');
}

export function saveSummary(summary: ReviewSummary) {
  return locked(() => write('summary', summary));
}

export async function loadQueue(): Promise<QueuedAnswer[]> {
  return (await read<QueuedAnswer[]>('queue')) ?? [];
}

/** How many distinct words were answered offline today (the server does not know about them yet). */
export async function answeredOfflineToday(): Promise<number> {
  const done = await read<LocalDone>('done');
  return done && done.date === dayKey(new Date()) ? done.ids.length : 0;
}

function addDays(days: number) {
  return dayKey(new Date(Date.now() + days * 86400000));
}

/**
 * Queues an answer and updates the cached word the way the server roughly will, so the next offline deck
 * does not offer the same word again. The server stays the source of truth: its numbers replace these
 * once the queue has been uploaded.
 */
export function appendAnswer(entry: QueuedAnswer): Promise<number> {
  return locked(async () => {
    const queue = (await read<QueuedAnswer[]>('queue')) ?? [];
    queue.push(entry);
    await write('queue', queue);

    const today = dayKey(new Date());
    const done = await read<LocalDone>('done');
    const ids = done && done.date === today ? done.ids : [];
    if (!ids.includes(entry.wordId)) ids.push(entry.wordId);
    await write('done', { date: today, ids });

    const words = await read<Word[]>('words');
    if (words) {
      await write(
        'words',
        words.map((w) => {
          if (w.id !== entry.wordId) return w;
          const state = w.state === 'NEW' ? 'LEARNING' : w.state;
          return entry.known
            ? { ...w, state, nextReviewDate: addDays(1) }
            : { ...w, state, lapses: w.lapses + 1, nextReviewDate: today };
        })
      );
    }
    return queue.length;
  });
}

export function removeFromQueue(clientIds: string[]): Promise<number> {
  return locked(async () => {
    const sent = new Set(clientIds);
    const rest = ((await read<QueuedAnswer[]>('queue')) ?? []).filter((a) => !sent.has(a.clientId));
    await write('queue', rest);
    return rest.length;
  });
}
