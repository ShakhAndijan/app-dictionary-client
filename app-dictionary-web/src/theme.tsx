import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeValue {
  mode: ThemeMode;
  scheme: 'light' | 'dark';
  setMode: (m: ThemeMode) => void;
}

const KEY = 'theme_mode';
const Ctx = createContext<ThemeValue>({ mode: 'system', scheme: 'light', setMode: () => undefined });

function systemDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function readMode(): ThemeMode {
  try {
    const v = localStorage.getItem(KEY);
    if (v === 'light' || v === 'dark' || v === 'system') return v;
  } catch {
    // storage blocked
  }
  return 'system';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(readMode);
  const [sysDark, setSysDark] = useState(systemDark);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const on = () => setSysDark(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const scheme = mode === 'system' ? (sysDark ? 'dark' : 'light') : mode;

  useEffect(() => {
    document.documentElement.dataset.theme = scheme;
  }, [scheme]);

  const setMode = (m: ThemeMode) => {
    setModeState(m);
    try {
      localStorage.setItem(KEY, m);
    } catch {
      // storage blocked
    }
  };

  return <Ctx.Provider value={{ mode, scheme, setMode }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);
