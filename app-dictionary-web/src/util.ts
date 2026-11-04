import { AchievementTier } from './api';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function dayKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const MONTHS = ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avg', 'sen', 'okt', 'noy', 'dek'];

/** "2026-10-30" -> "30-okt" */
export function shortDate(iso: string): string {
  const [, m, d] = iso.split('-').map(Number);
  return `${d}-${MONTHS[m - 1]}`;
}

export const TIER_META: Record<AchievementTier, { label: string; color: string }> = {
  BRONZE: { label: 'Bronza', color: '#C2753A' },
  SILVER: { label: 'Kumush', color: '#8A94A6' },
  GOLD: { label: 'Oltin', color: '#E5A100' },
};

/** The browser's own text-to-speech; only English is spoken since Uzbek voices are rare. */
export function speakEnglish(text: string, slow = false): void {
  const value = text.trim();
  if (!value || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(value);
    u.lang = 'en-US';
    u.rate = slow ? 0.6 : 0.95;
    window.speechSynthesis.speak(u);
  } catch {
    // No TTS available: stay silent.
  }
}

export function stopSpeaking(): void {
  try {
    window.speechSynthesis?.cancel();
  } catch {
    // ignore
  }
}

/** Shrinks a picked image to at most `max` px and returns it as base64 JPEG for the server. */
export async function prepareImage(file: File, max = 800): Promise<{ contentType: string; data: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d')!;
  // JPEG has no transparency: without a backdrop a transparent PNG turns solid black.
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const url = canvas.toDataURL('image/jpeg', 0.8);
  return { contentType: 'image/jpeg', data: url.split(',')[1] };
}

export const DECK_TITLES: Record<string, string> = {
  DUE: 'Takrorlash',
  WEAK: "Zaif so'zlar",
  FAVORITES: "Sevimli so'zlar",
  ALL: "Tasodifiy so'zlar",
  TODAY: "Bugungi so'zlar",
};

const PROGRESS_EVENT = 'progress-check';

/** Called after any study activity; the layout then looks for freshly unlocked achievements. */
export function requestProgressCheck(): void {
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}

export function onProgressCheck(handler: () => void): () => void {
  window.addEventListener(PROGRESS_EVENT, handler);
  return () => window.removeEventListener(PROGRESS_EVENT, handler);
}
