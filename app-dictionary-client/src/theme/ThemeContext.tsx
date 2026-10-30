import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { applyTheme, ThemeName } from './colors';

export type ThemeMode = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'theme_mode';

interface ThemeValue {
  /** What the user chose; "system" follows the phone. */
  mode: ThemeMode;
  /** What is actually shown. */
  scheme: ThemeName;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeValue | undefined>(undefined);

function systemScheme(): ThemeName {
  return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [system, setSystem] = useState<ThemeName>(systemScheme);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved === 'light' || saved === 'dark' || saved === 'system') setModeState(saved);
      })
      .catch(() => undefined)
      .finally(() => setLoaded(true));
    const sub = Appearance.addChangeListener(({ colorScheme }) => setSystem(colorScheme === 'dark' ? 'dark' : 'light'));
    return () => sub.remove();
  }, []);

  const scheme: ThemeName = mode === 'system' ? system : mode;
  // Before the children render, so their first render already sees the right palette.
  applyTheme(scheme);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => undefined);
  }, []);

  // Wait for the saved choice, otherwise a dark-mode user would see a flash of the day theme.
  if (!loaded) return null;

  return <ThemeContext.Provider value={{ mode, scheme, setMode }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}

/** Remounts everything below it when the theme changes, so every screen redraws with the new palette. */
export function ThemedTree({ children }: { children: React.ReactNode }) {
  const { scheme } = useTheme();
  return <React.Fragment key={scheme}>{children}</React.Fragment>;
}
