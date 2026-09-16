'use client';

import React, { useState, useMemo } from 'react';
import { PortalLayout } from '@/components/portal/PortalLayout';
import { HeroCarousel } from '@/components/portal/HeroCarousel';
import { QuickCategoryRow } from '@/components/portal/QuickCategoryRow';
import { GameSection } from '@/components/portal/GameSection';
import { GameCard } from '@/components/portal/GameCard';
import { PromoBanners } from '@/components/portal/PromoBanners';
import { GameService } from '@/services/gameService';
import { CATEGORIES } from '@/data/categories';
import { PortalTab, Game } from '@/types/game';
import { useFavorites } from '@/hooks/useFavorites';

export default function HomePage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [activeTab, setActiveTab] = useState<PortalTab>('home');
  const [gamesVersion, setGamesVersion] = useState(0);
  const { favorites, favoritesCount } = useFavorites();

  React.useEffect(() => {
    GameService.fetchGamesFromApi().then(() => {
      setGamesVersion((v) => v + 1);
    });
  }, []);

  // Compute view data using GameService (Separation of Concerns / Specification Pattern)
  const viewData = useMemo(() => {
    if (activeTab === 'favorites') {
      const favGames = GameService.getFavoriteGames(favorites);
      return {
        isCustom: true,
        title: `❤️ Trò chơi yêu thích (${favGames.length})`,
        games: favGames
      };
    }

    if (activeTab === 'hot') {
      return {
        isCustom: true,
        title: '🔥 Game Hot thịnh hành',
        games: GameService.getGamesByCategory('hot')
      };
    }

    if (activeTab === 'new') {
      return {
        isCustom: true,
        title: '✨ Game mới cập nhật',
        games: GameService.getGamesByCategory('new')
      };
    }

    if (selectedCategoryId !== 'all') {
      const cat = CATEGORIES.find((c) => c.id === selectedCategoryId);
      const catGames = GameService.getGamesByCategory(selectedCategoryId);
      return {
        isCustom: true,
        title: `🎮 Thể loại: ${cat?.name || 'Trò chơi'}`,
        games: catGames
      };
    }

    // Default view: 6 Featured and 6 Latest games matching reference
    return {
      isCustom: false,
      featured: GameService.getFeaturedGames(),
      latest: GameService.getLatestGames()
    };
  }, [activeTab, selectedCategoryId, favorites, gamesVersion]);

  const handleQuickFilterSelect = (filterId: string) => {
    if (filterId === 'hot' || filterId === 'new' || filterId === 'multiplayer') {
      setSelectedCategoryId(filterId);
      setActiveTab('home');
    } else if (filterId === 'popular') {
      setActiveTab('hot');
    } else {
      setSelectedCategoryId('all');
      setActiveTab('home');
    }
  };

  const handleResetFilter = () => {
    setSelectedCategoryId('all');
    setActiveTab('home');
  };

  return (
    <PortalLayout
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab);
        if (tab === 'home') setSelectedCategoryId('all');
      }}
      selectedCategoryId={selectedCategoryId}
      onSelectCategory={(catId) => {
        setSelectedCategoryId(catId);
        setActiveTab('home');
      }}
      favoritesCount={favoritesCount}
    >
      {/* HERO BANNER CAROUSEL */}
      <HeroCarousel />

      {/* QUICK CATEGORY CARDS (8 ITEMS) */}
      <QuickCategoryRow onSelectQuickFilter={handleQuickFilterSelect} />

      {/* DYNAMIC CONTENT SECTIONS */}
      {viewData.isCustom ? (
        <div className="custom-category-wrap">
          <div className="custom-category-header">
            <h2 className="game-section-title">{viewData.title}</h2>
            <button
              onClick={handleResetFilter}
              className="game-section-view-all"
              type="button"
            >
              ← Quay lại tất cả game
            </button>
          </div>

          {viewData.games && viewData.games.length === 0 ? (
            <div className="empty-state-card">
              <p className="empty-state-title">
                Chưa có trò chơi nào trong danh sách này.
              </p>
              <button
                onClick={handleResetFilter}
                className="btn-login"
                type="button"
              >
                Xem tất cả game
              </button>
            </div>
          ) : (
            <div className="game-cards-grid">
              {viewData.games?.map((game: Game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* SECTION 1: GAME NỔI BẬT */}
          <GameSection
            title="Game nổi bật"
            iconType="flame"
            games={viewData.featured || []}
            onViewAllClick={() => setSelectedCategoryId('hot')}
          />

          {/* SECTION 2: GAME MỚI NHẤT */}
          <GameSection
            title="Game mới nhất"
            iconType="sparkle"
            games={viewData.latest || []}
            onViewAllClick={() => setSelectedCategoryId('new')}
          />
        </>
      )}

      {/* 3 PROMOTIONAL BANNERS */}
      <PromoBanners />
    </PortalLayout>
  );
}
