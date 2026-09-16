'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Gamepad2,
  Heart,
  Share2,
  Star,
  Award,
  Sparkles,
  Flame,
  Check
} from 'lucide-react';
import { Header } from '@/components/portal/Header';
import { Footer } from '@/components/portal/Footer';
import { GameCard } from '@/components/portal/GameCard';
import { GameService } from '@/services/gameService';
import { useFavorites } from '@/hooks/useFavorites';

export default function GameDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const game = GameService.getGameBySlug(slug);

  const { isFavorite, toggleFavorite, favoritesCount } = useFavorites();
  const [copied, setCopied] = useState(false);

  if (!game) {
    return (
      <div className="portal-root">
        <Header favoritesCount={favoritesCount} />
        <div className="empty-state-card" style={{ margin: '80px auto', maxWidth: 600 }}>
          <h1 className="game-section-title">Không tìm thấy trò chơi</h1>
          <p className="panel-body-text">
            Trò chơi bạn đang tìm kiếm có thể đã được chuyển hoặc không tồn tại.
          </p>
          <div style={{ marginTop: 20 }}>
            <Link href="/" className="hero-btn-play">
              ← Quay lại Trang chủ
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${game.title} - Hồ Kiệt GameVui 24h`,
        text: game.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const favoriteActive = isFavorite(game.id);
  const relatedGames = GameService.getRelatedGames(game.id, 6);

  return (
    <div className="portal-root">
      <Header favoritesCount={favoritesCount} />

      <main className="game-detail-container">
        {/* BACK NAVIGATION LINK */}
        <Link href="/" className="game-detail-back-link">
          <ArrowLeft size={18} />
          <span>Quay lại Trang chủ</span>
        </Link>

        {/* HERO SHOWCASE CARD */}
        <div className="game-detail-hero">
          <div className="game-detail-banner-box">
            <Image
              src={game.banner || game.thumbnail}
              alt={game.title}
              fill
              priority
              className="hero-bg-img"
            />
            <div className="game-detail-overlay" />

            {/* FLOAT CONTENT LAYER */}
            <div className="game-detail-float-content">
              <div>
                <div className="game-detail-badges-row">
                  <span className="game-cat-badge">{game.category}</span>
                  {game.badge && (
                    <span className="game-badge-tag badge-hot">{game.badge}</span>
                  )}
                  <span className="game-rating-tag">
                    <Star size={16} fill="var(--yellow)" />
                    {game.rating} / 5.0
                  </span>
                </div>

                <h1 className="game-detail-title">{game.title}</h1>
                {game.subtitle && (
                  <p className="game-detail-subtitle">{game.subtitle}</p>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="game-detail-actions">
                <button
                  type="button"
                  onClick={() => toggleFavorite(game.id)}
                  className={`game-action-btn ${favoriteActive ? 'is-active' : ''}`}
                >
                  <Heart
                    size={18}
                    fill={favoriteActive ? 'var(--pink)' : 'none'}
                    color={favoriteActive ? 'var(--pink)' : 'currentColor'}
                  />
                  <span>{favoriteActive ? 'Đã yêu thích' : 'Yêu thích'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="game-action-btn"
                >
                  {copied ? (
                    <Check size={18} color="var(--green)" />
                  ) : (
                    <Share2 size={18} />
                  )}
                  <span>{copied ? 'Đã copy link!' : 'Chia sẻ'}</span>
                </button>

                <Link href={`/play/${game.slug}`} className="hero-btn-play">
                  <Gamepad2 size={22} />
                  <span>CHƠI NGAY</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="game-detail-grid">
          {/* MAIN INFO COLUMN */}
          <div className="custom-category-wrap">
            {/* Description */}
            <div className="game-card-panel">
              <h2 className="panel-header-title">
                <Sparkles size={20} color="var(--pink)" />
                Giới thiệu trò chơi
              </h2>
              <p className="panel-body-text">{game.description}</p>
            </div>

            {/* Instructions */}
            {game.instructions && (
              <div className="game-card-panel">
                <h2 className="panel-header-title">
                  <Award size={20} color="var(--yellow)" />
                  Hướng dẫn chơi
                </h2>
                <p className="panel-body-text">{game.instructions}</p>
              </div>
            )}
          </div>

          {/* SIDEBAR METADATA & TAGS */}
          <div className="custom-category-wrap">
            <div className="game-card-panel">
              <h3 className="panel-header-title">Thông tin trò chơi</h3>
              <div className="info-table">
                <div className="info-row">
                  <span className="info-label">Thể loại</span>
                  <span className="info-val">{game.category}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Lượt chơi</span>
                  <span className="info-val" style={{ color: 'var(--cyan)' }}>
                    {game.playCount}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Đánh giá</span>
                  <span className="info-val" style={{ color: 'var(--yellow)' }}>
                    ⭐ {game.rating} / 5
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Nhà phát triển</span>
                  <span className="info-val" style={{ color: 'var(--pink)' }}>
                    {game.developer || 'Hồ Kiệt'}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Năm phát hành</span>
                  <span className="info-val">{game.releaseDate || '2024'}</span>
                </div>
              </div>
            </div>

            {/* TAGS */}
            <div className="game-card-panel">
              <h3 className="panel-header-title">Từ khóa / Tags</h3>
              <div className="tag-cloud">
                {game.tags.map((tag, idx) => (
                  <span key={idx} className="tag-item">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RELATED GAMES */}
        <div>
          <h2 className="panel-header-title" style={{ marginBottom: 18 }}>
            <Flame size={22} color="var(--orange)" fill="var(--orange)" />
            Có thể bạn cũng thích
          </h2>
          <div className="game-cards-grid">
            {relatedGames.map((relGame) => (
              <GameCard key={relGame.id} game={relGame} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
