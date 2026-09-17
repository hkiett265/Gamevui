'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Home, Flame, Sparkles, Heart, Sun, Moon, Gamepad2, X, LogOut, User as UserIcon } from 'lucide-react';
import { PortalTab } from '@/types/game';
import { useTheme } from '@/hooks/useTheme';
import { useGameSearch } from '@/hooks/useGameSearch';
import { useAuthStore } from '@/stores/useAuthStore';
import { AuthModal } from './AuthModal';

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
  const { user, openLoginModal, openRegisterModal, logout, checkAuth } = useAuthStore();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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

          {user ? (
            /* Logged in User Profile Pill & Dropdown */
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 12px 5px 6px',
                  borderRadius: 9999,
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  cursor: 'pointer',
                  boxShadow: '0 0 12px rgba(56, 189, 248, 0.2)'
                }}
                title="Tài khoản cá nhân"
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 9999,
                    overflow: 'hidden',
                    background: '#0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <UserIcon size={18} color="#ffffff" />
                  )}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>
                  {user.username}
                </span>
              </div>

              {/* User Dropdown */}
              {showUserDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '120%',
                    width: 190,
                    background: '#0f172a',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 14,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
                    padding: 8,
                    zIndex: 50,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4
                  }}
                >
                  <div style={{ padding: '8px 10px', fontSize: '11px', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div>Tài khoản: <strong style={{ color: '#38bdf8' }}>{user.username}</strong></div>
                    {user.email && (
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 2 }}>
                        {user.email}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      setShowUserDropdown(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 10px',
                      borderRadius: 8,
                      background: 'transparent',
                      border: 'none',
                      color: '#f87171',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <LogOut size={16} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Logged out Action Buttons */
            <>
              <button
                className="btn-login"
                onClick={openLoginModal}
              >
                Đăng nhập
              </button>
              <button
                className="btn-register"
                onClick={openRegisterModal}
              >
                Đăng ký
              </button>
            </>
          )}
        </div>
      </div>

      {/* Global Auth Modal */}
      <AuthModal />
    </header>
  );
};
