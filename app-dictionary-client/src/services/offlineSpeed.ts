import { QuizPromptType, Word } from '../types';

export interface LocalQuestion {
  word: Word;
  promptType: QuizPromptType;
  promptText: string;
  options: string[];
  answer: string;
}

export interface LocalRound {
  pool: Word[];
  all: Word[];
  lastId: number | null;
}

export const MIN_SPEED_WORDS = 4;

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/** A speed round played from the phone's words; null when there are too few words for 4 options. */
export function startLocalRound(mode: 'ALL' | 'WEAK', all: Word[]): LocalRound | null {
  if (all.length < MIN_SPEED_WORDS) return null;
  const pool = mode === 'WEAK' ? all.filter((w) => w.weak) : all;
  if (pool.length === 0) return null;
  return { pool, all, lastId: null };
}

export function nextLocalQuestion(round: LocalRound): LocalQuestion {
  const candidates = round.pool.length > 1 ? round.pool.filter((w) => w.id !== round.lastId) : round.pool;
  const word = pickRandom(candidates);
  round.lastId = word.id;

  // Same three kinds of question the server asks; definitions only when the word has one.
  const kinds: QuizPromptType[] = word.definition ? ['english', 'uzbek', 'definition'] : ['english', 'uzbek'];
  const promptType = pickRandom(kinds);
  const promptText = promptType === 'english' ? word.english : promptType === 'uzbek' ? word.uzbek : word.definition!;
  const answerOf = (w: Word) => (promptType === 'english' ? w.uzbek : w.english);
  const answer = answerOf(word);

  const seen = new Set([answer.trim().toLowerCase()]);
  const wrong: string[] = [];
  const others = round.all.filter((w) => w.id !== word.id).sort(() => Math.random() - 0.5);
  for (const w of others) {
    const text = answerOf(w);
    const key = text.trim().toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      wrong.push(text);
    }
    if (wrong.length === 3) break;
  }
  const options = [answer, ...wrong].sort(() => Math.random() - 0.5);
  return { word, promptType, promptText, options, answer };
}
