'use client';

import React from 'react';
import { Header } from './Header';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { Footer } from './Footer';
import { PortalTab } from '@/types/game';

interface PortalLayoutProps {
  children: React.ReactNode;
  activeTab: PortalTab;
  onTabChange: (tab: PortalTab) => void;
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  favoritesCount?: number;
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
  selectedCategoryId,
  onSelectCategory,
  favoritesCount = 0
}) => {
  return (
    <div className="portal-root">
      {/* HEADER */}
      <Header
        activeTab={activeTab}
        onTabChange={onTabChange}
        favoritesCount={favoritesCount}
      />

      {/* 3-COLUMN DESKTOP GRID */}
      <div className="portal-layout-wrapper">
        <LeftSidebar
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={onSelectCategory}
        />

        <main className="portal-main-content">
          {children}
        </main>

        <RightSidebar />
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};
