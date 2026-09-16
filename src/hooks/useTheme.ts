'use client';

import { useState, useEffect, useCallback } from 'react';

export type Theme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'hokiet_gamevui_theme';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
        document.body.setAttribute('data-theme', savedTheme);
      } else {
        document.body.setAttribute('data-theme', 'dark');
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const nextTheme: Theme = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        document.body.setAttribute('data-theme', nextTheme);
      } catch {
        // ignore
      }
      return nextTheme;
    });
  }, []);

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    isMounted
  };
}
