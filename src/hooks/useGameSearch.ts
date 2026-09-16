'use client';

import { useState, useEffect, useRef } from 'react';
import { Game } from '@/types/game';
import { GameService } from '@/services/gameService';

export function useGameSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(() => {
      const results = GameService.searchGames(searchQuery);
      setSearchResults(results);
      setIsOpen(true);
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsOpen(false);
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isOpen,
    setIsOpen,
    clearSearch,
    containerRef
  };
}
