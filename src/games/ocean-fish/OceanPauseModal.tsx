'use client';

import React, { useEffect } from 'react';
import { useOceanFishStore } from '@/games/ocean-fish/store';
import { Play, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';

export const OceanPauseModal: React.FC = () => {
  const {
    gameState,
    resumeGame,
    startGame,
    resetGame,
    pauseGame,
    isMuted,
    toggleSound
  } = useOceanFishStore();

  // Listen for ESC key to toggle pause/resume
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (gameState === 'PLAYING') {
          pauseGame();
        } else if (gameState === 'PAUSED') {
          resumeGame();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, pauseGame, resumeGame]);

  if (gameState !== 'PAUSED') return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'rgba(2, 6, 23, 0.8)',
        backdropFilter: 'blur(8px)',
        cursor: 'default',
        pointerEvents: 'auto'
      }}
    >
      <div
        className="wood-card"
        style={{
          width: '100%',
          maxWidth: '420px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          textAlign: 'center',
          background: 'linear-gradient(180deg, #0f172a 0%, #03274c 100%)',
          border: '2px solid #38bdf8',
          boxShadow: '0 0 30px rgba(56, 189, 248, 0.4)',
          borderRadius: 24,
          padding: '28px 24px'
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: '32px',
            fontWeight: 900,
            color: '#38bdf8',
            textShadow: '0 0 15px rgba(56, 189, 248, 0.6)'
          }}
        >
          TẠM DỪNG
        </h2>

        <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0 }}>
          Trò chơi đang tạm dừng. Nhấn ESC hoặc nút dưới để tiếp tục săn cá!
        </p>

        {/* Buttons List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '8px' }}>
          {/* Resume */}
          <button
            onClick={resumeGame}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
              border: '1px solid #bae6fd',
              color: '#ffffff',
              fontSize: '17px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              cursor: 'pointer',
              boxShadow: '0 0 15px rgba(56, 189, 248, 0.5)'
            }}
          >
            <Play style={{ width: 20, height: 20, fill: '#ffffff' }} />
            <span>TIẾP TỤC BẮN</span>
          </button>

          {/* Restart */}
          <button
            onClick={startGame}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 14,
              background: 'rgba(30, 41, 59, 0.85)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              cursor: 'pointer'
            }}
          >
            <RotateCcw style={{ width: 18, height: 18, color: '#4ade80' }} />
            <span>CHƠI LẠI VÁN MỚI</span>
          </button>

          {/* Main Menu */}
          <button
            onClick={resetGame}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 14,
              background: 'rgba(30, 41, 59, 0.85)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              cursor: 'pointer'
            }}
          >
            <Home style={{ width: 18, height: 18, color: '#facc15' }} />
            <span>VỀ SẢNH CHÍNH</span>
          </button>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            borderRadius: 12,
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#94a3b8',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            marginTop: 4
          }}
        >
          {isMuted ? (
            <>
              <VolumeX style={{ width: 16, height: 16, color: '#f87171' }} />
              <span>Âm thanh: ĐANG TẮT</span>
            </>
          ) : (
            <>
              <Volume2 style={{ width: 16, height: 16, color: '#38bdf8' }} />
              <span>Âm thanh: ĐANG BẬT</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
