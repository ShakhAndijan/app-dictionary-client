import apiClient from './client';
import { ReviewSummary } from '../types';
import { isNetworkError } from '../utils/errors';
import { isOnline } from '../services/connectivity';
import { answeredOfflineToday, loadSummary, loadWords, saveSummary } from '../services/offlineStore';
import { summarizeOffline } from '../services/offlineDecks';
import { flushQueue, pendingCount } from '../services/offlineSync';

async function summaryFromPhone(): Promise<ReviewSummary | null> {
  const words = await loadWords();
  if (!words) return null;
  return summarizeOffline(words, await loadSummary(), await answeredOfflineToday());
}

/** Today's review numbers; without internet they are worked out from the phone's copy of the words. */
export async function getReviewSummary(): Promise<ReviewSummary> {
  if (!isOnline()) {
    const local = await summaryFromPhone();
    if (local) return local;
  }
  try {
    if (pendingCount() > 0) await flushQueue().catch(() => undefined);
    const summary = await apiClient.get<ReviewSummary>('/review/summary').then((r) => r.data);
    saveSummary(summary);
    return summary;
  } catch (e) {
    if (isNetworkError(e)) {
      const local = await summaryFromPhone();
      if (local) return local;
    }
    throw e;
  }
}
