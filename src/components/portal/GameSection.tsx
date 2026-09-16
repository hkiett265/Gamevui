'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, Sparkles, ArrowRight } from 'lucide-react';
import { Game } from '@/types/game';
import { GameCard } from './GameCard';

interface GameSectionProps {
  title: string;
  iconType?: 'flame' | 'sparkle' | 'trophy';
  games: Game[];
  viewAllLink?: string;
  onViewAllClick?: () => void;
}

export const GameSection: React.FC<GameSectionProps> = ({
  title,
  iconType = 'flame',
  games,
  viewAllLink = '#',
  onViewAllClick
}) => {
  return (
    <section className="game-section">
      {/* SECTION HEADER */}
      {title && (
        <div className="game-section-header">
          <div className="game-section-title-wrap">
            <div className="section-icon-badge">
              {iconType === 'flame' && (
                <Flame size={22} color="var(--orange)" fill="var(--orange)" />
              )}
              {iconType === 'sparkle' && (
                <Sparkles size={22} color="var(--green)" fill="var(--green)" />
              )}
            </div>
            <h2 className="game-section-title">{title}</h2>
          </div>

          {onViewAllClick ? (
            <button
              onClick={onViewAllClick}
              className="game-section-view-all"
              type="button"
            >
              <span>Xem tất cả</span>
              <ArrowRight size={15} />
            </button>
          ) : (
            <Link href={viewAllLink} className="game-section-view-all">
              <span>Xem tất cả</span>
              <ArrowRight size={15} />
            </Link>
          )}
        </div>
      )}

      {/* 6-COLUMN GAME GRID */}
      <div className="game-cards-grid">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
};
