'use client';

import React, { useEffect } from 'react';
import { useGameStore } from '@/stores/useGameStore';
import { Play, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';
import { soundSystem } from '@/audio/soundSystem';

export const PauseModal: React.FC = () => {
  const {
    gameState,
    resumeGame,
    startCountdown,
    resetGame,
    pauseGame,
    isMuted,
    toggleSound
  } = useGameStore();

  // Listen for ESC key
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

  useEffect(() => {
    if (gameState === 'PAUSED') {
      if (typeof document !== 'undefined' && document.pointerLockElement) {
        try {
          document.exitPointerLock();
        } catch {}
      }
    }
  }, [gameState]);

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
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(6px)',
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
          textAlign: 'center'
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: '36px',
            fontWeight: 900,
            color: '#facc15',
            textShadow: '0 4px 0 #451a03'
          }}
        >
          GAME PAUSED
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '12px', marginTop: '8px' }}>
          {/* Resume */}
          <button
            onClick={() => {
              soundSystem.playUiClick();
              resumeGame();
            }}
            className="btn-cartoon btn-green py-4 text-xl flex items-center justify-center gap-3"
          >
            <Play className="w-6 h-6 fill-white" />
            <span>RESUME</span>
          </button>

          {/* Restart */}
          <button
            onClick={() => {
              soundSystem.playUiClick();
              startCountdown();
            }}
            className="btn-cartoon py-4 text-xl flex items-center justify-center gap-3"
          >
            <RotateCcw className="w-6 h-6" />
            <span>RESTART</span>
          </button>

          {/* Main Menu */}
          <button
            onClick={() => {
              soundSystem.playUiClick();
              resetGame();
            }}
            className="hud-badge py-3.5 text-lg font-bold flex items-center justify-center gap-2 hover:border-amber-400 transition cursor-pointer"
          >
            <Home className="w-5 h-5 text-amber-300" />
            <span>MAIN MENU</span>
          </button>
        </div>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-green-400" />}
          <span>Sound: {isMuted ? 'Muted' : 'Enabled'}</span>
        </button>
      </div>
    </div>
  );
};
