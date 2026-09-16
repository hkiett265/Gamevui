'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Home, Flame, Sparkles, Heart, Sun, Moon, Gamepad2, X } from 'lucide-react';
import { PortalTab } from '@/types/game';
import { useTheme } from '@/hooks/useTheme';
import { useGameSearch } from '@/hooks/useGameSearch';

interface HeaderProps {
  activeTab?: PortalTab;
  onTabChange?: (tab: PortalTab) => void;
  favoritesCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab = 'home',
  onTabChange,
  favoritesCount = 0
}) => {
  const { toggleTheme } = useTheme();
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isOpen,
    setIsOpen,
    clearSearch,
    containerRef
  } = useGameSearch();

  return (
    <header className="portal-header">
      <div className="portal-header-inner">
        {/* BRAND LOGO */}
        <Link href="/" className="brand-logo-link">
          <div className="brand-avatar-box">
            <Image
              src="/images/brand/mascot.jpg"
              alt="Hồ Kiệt Mascot"
              width={48}
              height={48}
              className="brand-avatar-img"
              priority
            />
          </div>
          <div className="brand-text-col">
            <span className="brand-name">Hồ Kiệt</span>
            <span className="brand-sub">GameVui 24h</span>
          </div>
        </Link>

        {/* SEARCH BAR CONTAINER */}
        <div className="search-bar-container" ref={containerRef}>
          <input
            type="text"
            className="search-input-box"
            placeholder="Tìm kiếm game bạn yêu thích..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchQuery.trim().length > 0) setIsOpen(true);
            }}
          />
          {searchQuery ? (
            <button
              className="search-icon-btn"
              onClick={clearSearch}
              title="Xóa tìm kiếm"
            >
              <X size={18} />
            </button>
          ) : (
            <button className="search-icon-btn" title="Tìm kiếm">
              <Search size={18} />
            </button>
          )}

          {/* Autocomplete Dropdown */}
          {isOpen && (
            <div className="search-dropdown">
              {searchResults.length > 0 ? (
                searchResults.map((game) => (
                  <Link
                    key={game.id}
                    href={`/game/${game.slug}`}
                    className="search-item"
                    onClick={clearSearch}
                  >
                    <div className="play-thumb-mini">
                      <Image
                        src={game.thumbnail}
                        alt={game.title}
                        fill
                        className="game-thumb-img"
                      />
                    </div>
                    <div className="brand-text-col">
                      <span className="game-title-text">{game.title}</span>
                      <span className="game-category-text">{game.category}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="search-empty-notice">
                  Không tìm thấy game &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          )}
        </div>

        {/* NAVIGATION LINKS */}
        <nav>
          <ul className="portal-nav-links">
            <li>
              <button
                className={`portal-nav-item ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => onTabChange?.('home')}
              >
                <Home size={17} />
                <span>Trang chủ</span>
              </button>
            </li>
            <li>
              <button
                className={`portal-nav-item ${activeTab === 'categories' ? 'active' : ''}`}
                onClick={() => onTabChange?.('categories')}
              >
                <Gamepad2 size={17} />
                <span>Thể loại</span>
              </button>
            </li>
            <li>
              <button
                className={`portal-nav-item ${activeTab === 'new' ? 'active' : ''}`}
                onClick={() => onTabChange?.('new')}
              >
                <Sparkles size={17} color="var(--cyan)" />
                <span>Game mới</span>
              </button>
            </li>
            <li>
              <button
                className={`portal-nav-item ${activeTab === 'hot' ? 'active' : ''}`}
                onClick={() => onTabChange?.('hot')}
              >
                <Flame size={17} color="var(--orange)" />
                <span>Game hot</span>
              </button>
            </li>
            <li>
              <button
                className={`portal-nav-item ${activeTab === 'favorites' ? 'active' : ''}`}
                onClick={() => onTabChange?.('favorites')}
              >
                <Heart
                  size={17}
                  color="var(--pink)"
                  fill={favoritesCount > 0 ? 'var(--pink)' : 'none'}
                />
                <span>Yêu thích</span>
                {favoritesCount > 0 && (
                  <span className="nav-fav-badge">
                    {favoritesCount}
                  </span>
                )}
              </button>
            </li>
          </ul>
        </nav>

        {/* RIGHT ACTIONS: THEME TOGGLE, LOGIN, REGISTER */}
        <div className="header-actions">
          <div
            className="theme-toggle-switch"
            onClick={toggleTheme}
            title="Đổi giao diện Sáng / Tối"
          >
            <Sun size={15} color="var(--yellow)" />
            <Moon size={15} color="var(--text-muted)" />
            <div className="theme-thumb" />
          </div>

          <button
            className="btn-login"
            onClick={() => alert('Chức năng Đăng nhập cho thành viên GameVui 24h')}
          >
            Đăng nhập
          </button>
          <button
            className="btn-register"
            onClick={() => alert('Đăng ký tài khoản miễn phí tại Hồ Kiệt GameVui 24h')}
          >
            Đăng ký
          </button>
        </div>
      </div>
    </header>
  );
};
