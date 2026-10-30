import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

type Listener = (online: boolean) => void;

const RETRY_MS = 15000;

// "Online" needs both: the phone has a connection AND our server actually answered the last time we asked.
// The second part matters: Wi-Fi without internet, or a server that is down, looks connected to the OS.
let networkOk = true;
let serverOk = true;
let online = true;
const listeners = new Set<Listener>();
let probe: (() => Promise<unknown>) | null = null;
let retryTimer: ReturnType<typeof setInterval> | null = null;

function recompute() {
  const next = networkOk && serverOk;
  if (next === online) return;
  online = next;
  listeners.forEach((l) => l(next));
  if (!next && !retryTimer) {
    retryTimer = setInterval(() => {
      tryProbe();
    }, RETRY_MS);
  } else if (next && retryTimer) {
    clearInterval(retryTimer);
    retryTimer = null;
  }
}

/** Called by the API client after every request: a response means the server is reachable. */
export function reportServerReachable(ok: boolean) {
  serverOk = ok;
  // An answer from the server beats whatever the OS thinks (e.g. a VPN that reports "no internet").
  if (ok) networkOk = true;
  recompute();
}

export function isOnline() {
  return online;
}

export function onOnlineChange(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Asks the server something cheap; the API client's own bookkeeping flips us back online on success. */
export async function tryProbe() {
  if (!probe) return;
  try {
    await probe();
  } catch {
    // Still offline; the next attempt is already scheduled.
  }
}

let started = false;

export function startConnectivity(probeFn: () => Promise<unknown>) {
  probe = probeFn;
  if (started) return;
  started = true;
  NetInfo.addEventListener((state) => {
    networkOk = state.isConnected !== false && state.isInternetReachable !== false;
    // A returning connection is worth an immediate try rather than waiting for the timer.
    if (networkOk && !serverOk) tryProbe();
    recompute();
  });
  AppState.addEventListener('change', (s) => {
    if (s === 'active' && !online) tryProbe();
  });
}

export function useOnline(): boolean {
  const [value, setValue] = useState(online);
  useEffect(() => {
    setValue(online);
    return onOnlineChange(setValue);
  }, []);
  return value;
}
