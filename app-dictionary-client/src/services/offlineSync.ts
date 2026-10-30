import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { isNetworkError } from '../utils/errors';
import { isOnline, onOnlineChange, startConnectivity, tryProbe } from './connectivity';
import * as store from './offlineStore';
import { QueuedFormat } from './offlineStore';

const BATCH_SIZE = 500;

let pending = 0;
const pendingListeners = new Set<(n: number) => void>();
const syncedListeners = new Set<() => void>();

function setPending(n: number) {
  pending = n;
  pendingListeners.forEach((l) => l(n));
}

export function pendingCount() {
  return pending;
}

export function usePendingCount(): number {
  const [value, setValue] = useState(pending);
  useEffect(() => {
    setValue(pending);
    pendingListeners.add(setValue);
    return () => {
      pendingListeners.delete(setValue);
    };
  }, []);
  return value;
}

/** Runs after queued answers were uploaded (refresh caches, reminders, achievements...). */
export function onQueueSynced(listener: () => void) {
  syncedListeners.add(listener);
  return () => {
    syncedListeners.delete(listener);
  };
}

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Stores an answer for upload. Uploads right away when the server is reachable. */
export async function enqueueAnswer(wordId: number, known: boolean, format: QueuedFormat) {
  const size = await store.appendAnswer({
    clientId: makeId(),
    wordId,
    known,
    format,
    answeredAt: new Date().toISOString(),
  });
  setPending(size);
  if (isOnline()) flushQueue();
}

let flushing: Promise<void> | null = null;

/** Uploads everything that is waiting. Safe to call at any time; concurrent calls share one upload. */
export function flushQueue(): Promise<void> {
  if (!flushing) {
    flushing = doFlush().finally(() => {
      flushing = null;
    });
  }
  return flushing;
}

async function doFlush() {
  if (!store.hasOfflineUser()) return;
  let uploaded = false;
  for (;;) {
    const queue = await store.loadQueue();
    setPending(queue.length);
    if (queue.length === 0) break;
    const chunk = queue.slice(0, BATCH_SIZE);
    try {
      await apiClient.post('/flashcards/answers/batch', { answers: chunk });
    } catch (e: any) {
      const status = e?.response?.status;
      // No answer, a server fault, an expired session or a rate limit: keep everything and try later.
      // Anything else means the server rejected these entries for good; dropping them stops them from
      // blocking the answers behind them forever.
      if (isNetworkError(e) || !status || status >= 500 || status === 401 || status === 429) break;
    }
    setPending(await store.removeFromQueue(chunk.map((a) => a.clientId)));
    uploaded = true;
  }
  if (uploaded) syncedListeners.forEach((l) => l());
}

let initialised = false;

/** Starts connectivity tracking and uploads waiting answers now and whenever the server comes back. */
export async function initOfflineSync() {
  startConnectivity(() => apiClient.get('/review/summary', { timeout: 6000 }));
  if (initialised) return;
  initialised = true;
  onOnlineChange((online) => {
    if (online) flushQueue();
  });
  setPending((await store.loadQueue()).length);
  flushQueue();
}

/** For the "sync now" tap on the banner. */
export async function syncNow() {
  await tryProbe();
  if (isOnline()) await flushQueue();
}
