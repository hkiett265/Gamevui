'use client';

import React from 'react';
import { useGameStore } from '@/stores/useGameStore';

export const EventBanner: React.FC = () => {
  const { activeEvent, gameState } = useGameStore();

  if (!activeEvent || gameState !== 'PLAYING') return null;

  return (
    <div
      className="banner-anim"
      style={{
        position: 'absolute',
        top: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        pointerEvents: 'none',
        userSelect: 'none'
      }}
    >
      <div
        className="wood-card"
        style={{
          padding: '14px 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          border: '4px solid #facc15',
          boxShadow: '0 12px 30px rgba(0,0,0,0.6)'
        }}
      >
        <div
          className="text-3xl sm:text-4xl md:text-5xl font-black text-yellow-300 tracking-wide uppercase drop-shadow-md"
          style={{ textShadow: '0 4px 0 #78350f, 0 8px 16px rgba(0,0,0,0.7)' }}
        >
          {activeEvent.title}
        </div>
        <div className="text-sm sm:text-base font-extrabold text-white mt-1 tracking-wider uppercase">
          {activeEvent.subtitle}
        </div>
        <div className="text-xs font-bold text-yellow-200/90 mt-1">
          {Math.ceil(activeEvent.duration)}s remaining
        </div>
      </div>
    </div>
  );
};
