import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { THEMES } from '../constants/themes';

const THEME_TRANSITION_MS = 450;
const darkQuery = () => window.matchMedia?.('(prefers-color-scheme: dark)');
const systemTheme = () => (darkQuery()?.matches ? THEMES.DARK : THEMES.LIGHT);
const isTheme = (value) => Object.values(THEMES).includes(value);

/**
 * Light/dark theme, applied as data-theme on <html>.
 *
 * A theme the user picked is saved to localStorage and wins. Until they pick
 * one (stored as null), the app follows the OS setting and keeps following it
 * if it changes. index.html applies the same logic before React loads, so the
 * page never flashes the wrong theme.
 */
export function useTheme() {
  const [savedTheme, setSavedTheme] = useLocalStorage(STORAGE_KEYS.THEME, null, isTheme);
  const [osTheme, setOsTheme] = useState(systemTheme);
  const theme = savedTheme ?? osTheme;
  const isFirstRender = useRef(true);

  useEffect(() => {
    const query = darkQuery();
    if (!query) return undefined;
    const onChange = (e) => setOsTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    // Cross-fade colours on a switch, but not on the initial page load.
    let timer;
    if (!isFirstRender.current) {
      root.classList.add('theme-transition');
      timer = setTimeout(() => root.classList.remove('theme-transition'), THEME_TRANSITION_MS);
    }
    isFirstRender.current = false;
    root.dataset.theme = theme;
    return () => clearTimeout(timer);
  }, [theme]);

  const toggleTheme = useCallback(
    () => setSavedTheme(theme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK),
    [theme, setSavedTheme]
  );

  return { theme, isDark: theme === THEMES.DARK, toggleTheme };
}
