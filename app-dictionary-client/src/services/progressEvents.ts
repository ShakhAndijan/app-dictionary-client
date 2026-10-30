type Listener = () => void;

const listeners = new Set<Listener>();

/** Asks the app to look for newly unlocked achievements (call after any activity that can earn one). */
export function requestProgressCheck() {
  listeners.forEach((l) => l());
}

export function onProgressCheck(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
