'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Maximize2, Minimize2, Heart, Gamepad2, Info } from 'lucide-react';
import { GameService } from '@/services/gameService';
import { useFavorites } from '@/hooks/useFavorites';

export default function FallbackPlayGamePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const game = GameService.getGameBySlug(slug);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
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

  if (!game) {
    return (
      <div className="play-page-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <h1 className="game-section-title" style={{ marginBottom: 12 }}>Không tìm thấy trò chơi</h1>
        <Link href="/" className="hero-btn-play" prefetch={true}>
          Quay lại Trang chủ
        </Link>
      </div>
    );
  }

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
                <span style={{ fontSize: '0.75rem', color: 'var(--cyan)', marginLeft: 8 }}>
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
        {game.gameUrl && (game.gameUrl.startsWith('http://') || game.gameUrl.startsWith('https://') || game.gameUrl.startsWith('/games/')) ? (
          <div style={{ width: '100%', height: '100%', position: 'relative', background: '#000000' }}>
            <iframe
              src={game.gameUrl}
              title={game.title}
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen; gamepad"
              allowFullScreen
            />
          </div>
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', background: 'var(--bg-portal)' }}>
            <Image src={game.banner || game.thumbnail} alt={game.title} fill style={{ objectFit: 'cover', opacity: 0.2 }} />
            <div className="empty-state-card" style={{ position: 'relative', zIndex: 10, maxWidth: 540 }}>
              <div style={{ width: 76, height: 76, borderRadius: 20, overflow: 'hidden', margin: '0 auto 16px', border: '2px solid var(--pink)', boxShadow: 'var(--pink-glow)' }}>
                <Image src={game.thumbnail} alt={game.title} width={76} height={76} style={{ objectFit: 'cover' }} />
              </div>
              <h2 className="game-section-title" style={{ fontSize: '1.8rem', marginBottom: 6 }}>{game.title}</h2>
              <p style={{ color: 'var(--cyan)', fontWeight: 700, marginBottom: 12 }}>{game.subtitle || game.category}</p>
              <p className="panel-body-text" style={{ marginBottom: 24 }}>{game.description}</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                <Link href="/play/jet-jet-mien-tay-3d" className="hero-btn-play">
                  <Gamepad2 size={20} />
                  <span>Chơi Jet Jet Miền Tây 3D</span>
                </Link>
                <Link href={`/game/${game.slug}`} className="btn-login">Xem hướng dẫn</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
