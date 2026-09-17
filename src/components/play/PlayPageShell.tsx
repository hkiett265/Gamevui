'use client';

import { ComponentType, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Maximize2, Minimize2, Heart, Info } from 'lucide-react';
import { GameService } from '@/services/gameService';
import { useFavorites } from '@/hooks/useFavorites';

interface PlayPageShellProps {
  slug: string;
  GameContainer: ComponentType;
  subtitleColor?: string;
  onUnmount?: () => void;
}

export function PlayPageShell({ slug, GameContainer, subtitleColor = 'var(--cyan)', onUnmount }: PlayPageShellProps) {
  const game = GameService.getGameBySlug(slug);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (!onUnmount) return;
    return () => {
      try {
        onUnmount();
      } catch {}
    };
  }, [onUnmount]);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  if (!game) return null;
  const favoriteActive = isFavorite(game.id);

  return (
    <div ref={containerRef} className="play-page-container">
      <header className="play-page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/" className="play-back-btn" prefetch={true}>
            <ArrowLeft size={16} />
            <span>Về Portal</span>
          </Link>

          <div className="play-title-group">
            <div className="play-thumb-mini">
              <Image src={game.thumbnail} alt={game.title} fill className="game-thumb-img" />
            </div>
            <div>
              <span className="game-title-text" style={{ fontSize: '1rem' }}>
                {game.title}
              </span>
              {game.subtitle && (
                <span style={{ fontSize: '0.75rem', color: subtitleColor, marginLeft: 8 }}>
                  {game.subtitle}
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link
            href={`/game/${game.slug}`}
            prefetch={true}
            className="play-icon-btn"
            style={{ width: 'auto', padding: '0 12px', gap: 6, fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' }}
            title="Xem chi tiết hướng dẫn"
          >
            <Info size={16} />
            <span>Chi tiết</span>
          </Link>

          <button
            type="button"
            onClick={() => toggleFavorite(game.id)}
            className={`play-icon-btn ${favoriteActive ? 'is-fav' : ''}`}
            title={favoriteActive ? 'Bỏ thích' : 'Thêm vào yêu thích'}
          >
            <Heart size={18} fill={favoriteActive ? 'var(--red)' : 'none'} />
          </button>

          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="play-icon-btn"
            title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </header>

      <div className="play-game-frame">
        <GameContainer />
      </div>
    </div>
  );
}
