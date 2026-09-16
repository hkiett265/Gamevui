'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Heart } from 'lucide-react';
import { Game } from '@/types/game';
import { useFavorites } from '@/hooks/useFavorites';

interface GameCardProps {
  game: Game;
  isFavoriteOverride?: boolean;
  onToggleFavoriteOverride?: (gameId: string) => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  isFavoriteOverride,
  onToggleFavoriteOverride
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  const favoriteActive =
    isFavoriteOverride !== undefined ? isFavoriteOverride : isFavorite(game.id);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onToggleFavoriteOverride) {
      onToggleFavoriteOverride(game.id);
    } else {
      toggleFavorite(game.id);
    }
  };

  return (
    <Link href={`/game/${game.slug}`} className="game-card">
      <div className="game-thumb-box">
        {/* THUMBNAIL IMAGE */}
        <Image
          src={game.thumbnail}
          alt={game.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          className="game-thumb-img"
        />

        {/* BADGE */}
        {game.badge && (
          <span
            className={`game-badge-tag ${
              game.badge === 'HOT'
                ? 'badge-hot'
                : game.badge === 'NEW'
                ? 'badge-new'
                : 'badge-hot'
            }`}
          >
            {game.badge}
          </span>
        )}

        {/* FAVORITE HEART BUTTON */}
        <button
          className={`game-card-fav-btn ${favoriteActive ? 'is-fav' : ''}`}
          onClick={handleHeartClick}
          title={favoriteActive ? 'Bỏ thích' : 'Thêm vào yêu thích'}
          aria-label="Toggle Favorite"
        >
          <Heart
            size={15}
            fill={favoriteActive ? 'var(--red)' : 'none'}
            color={favoriteActive ? 'var(--red)' : '#ffffff'}
          />
        </button>

        {/* HOVER PLAY OVERLAY */}
        <div className="game-hover-overlay">
          <div className="game-play-circle">
            <Play size={18} fill="#451a03" />
          </div>
        </div>
      </div>

      {/* METADATA */}
      <div className="game-meta-col">
        <span className="game-title-text" title={game.title}>
          {game.title}
        </span>
        <span className="game-category-text">{game.category}</span>
      </div>
    </Link>
  );
};
