export type ThemeName = 'light' | 'dark';

const light = {
  primary: '#4F46E5',
  primaryDark: '#4338CA',
  secondary: '#10B981',
  danger: '#EF4444',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  text: '#111827',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  // Tinted chips and their text: a soft background with a darker text of the same hue.
  amberText: '#B45309',
  amberBg: '#FEF3C7',
  orangeText: '#EA580C',
  orangeBg: '#FFEDD5',
  indigoText: '#3730A3',
  indigoBg: '#EEF2FF',
  greenText: '#065F46',
  greenBg: '#D1FAE5',
};

export type Palette = typeof light;

const dark: Palette = {
  // Lighter than the day value: the day indigo reads at about 2.5:1 on the dark surface.
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  secondary: '#10B981',
  danger: '#EF4444',
  background: '#0B1120',
  surface: '#1A2335',
  text: '#F1F5F9',
  textMuted: '#94A3B8',
  border: '#2D3A52',
  amberText: '#FBBF24',
  amberBg: '#F59E0B26',
  orangeText: '#FB923C',
  orangeBg: '#F9731626',
  indigoText: '#A5B4FC',
  indigoBg: '#6366F126',
  greenText: '#6EE7B7',
  greenBg: '#10B98126',
};

/**
 * The live palette. Screens read it while rendering, so switching theme only needs the screens to render
 * again (the app remounts its tree on a switch). Never copy a colour into a module-level constant:
 * use {@link themed} for anything that must follow the theme.
 */
export const colors: Palette = { ...light };

let current: ThemeName = 'light';

export function applyTheme(name: ThemeName) {
  current = name;
  Object.assign(colors, name === 'dark' ? dark : light);
}

export function currentTheme(): ThemeName {
  return current;
}

/**
 * A value built from {@link colors} (styles, lookup tables) that is rebuilt once per theme and always
 * reflects the active one. Use it instead of computing such values at import time, which would freeze
 * them in whichever theme was active when the file loaded.
 */
export function themed<T extends object>(factory: () => T): T {
  const cache: Partial<Record<ThemeName, T>> = {};
  const get = (): T => (cache[current] ??= factory());
  // An array target keeps Array.isArray() true for tables written as arrays.
  const target = (Array.isArray(get()) ? [] : {}) as T;
  return new Proxy(target, {
    get: (_t, prop) => Reflect.get(get(), prop),
    has: (_t, prop) => Reflect.has(get(), prop),
  });
}
