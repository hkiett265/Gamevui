'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'hokiet_gamevui_favorites';
const EVENT_NAME = 'hokiet_favorites_updated';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const loadFavorites = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      } else {
        setFavorites([]);
      }
    } catch {
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    loadFavorites();

    const handleSync = () => loadFavorites();
    window.addEventListener(EVENT_NAME, handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener(EVENT_NAME, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [loadFavorites]);

  const toggleFavorite = useCallback((gameId: string) => {
    try {
      const current: string[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      let updated: string[];

      if (current.includes(gameId)) {
        updated = current.filter((id) => id !== gameId);
      } else {
        updated = [...current, gameId];
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setFavorites(updated);
      window.dispatchEvent(new Event(EVENT_NAME));
    } catch (e) {
      console.warn('Error saving favorite', e);
    }
  }, []);

  const isFavorite = useCallback(
    (gameId: string) => {
      if (!isMounted) return false;
      return favorites.includes(gameId);
    },
    [favorites, isMounted]
  );

  return {
    favorites,
    favoritesCount: isMounted ? favorites.length : 0,
    isFavorite,
    toggleFavorite,
    isMounted
  };
}
