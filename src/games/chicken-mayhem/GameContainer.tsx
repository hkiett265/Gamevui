'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useGameStore } from '@/games/chicken-mayhem/store';
import { Crosshair } from './Crosshair';
import { HUD } from './ui/HUD';
import { MainMenu } from './ui/MainMenu';
import { CountdownOverlay } from './ui/CountdownOverlay';
import { EventBanner } from './ui/EventBanner';
import { PauseModal } from './ui/PauseModal';
import { GameOverModal } from './ui/GameOverModal';

// Dynamically import GameCanvas with SSR disabled to prevent hydration errors and WebGL context issues
const GameCanvas = dynamic(
  () => import('./GameCanvas').then((mod) => mod.GameCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-sky-300 select-none">
        <div className="text-6xl animate-bounce">🐔</div>
        <div className="mt-4 text-2xl font-black text-amber-900 tracking-wider">
          LOADING CHICKEN MAYHEM 3D...
        </div>
      </div>
    )
  }
);

export const GameContainer: React.FC = () => {
  const { initHighScore, reload, gameState } = useGameStore();

  // Initialize high score from localStorage
  useEffect(() => {
    initHighScore();
  }, [initHighScore]);

  // Keyboard controls (R for reload)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'r' || e.key === 'R') && gameState === 'PLAYING') {
        reload();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, reload]);

  return (
    <main
      className="game-viewport"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        userSelect: 'none',
        cursor: gameState === 'PLAYING' ? 'none' : 'default'
      }}
    >
      {/* 3D WebGL Canvas */}
      <GameCanvas />

      {/* Crosshair */}
      <Crosshair />

      {/* 2D UI Layers */}
      <HUD />
      <MainMenu />
      <CountdownOverlay />
      <EventBanner />
      <PauseModal />
      <GameOverModal />
    </main>
  );
};
