'use client';

import React from 'react';
import { useGameStore } from '@/games/chicken-mayhem/store';
import { Volume2, VolumeX, Pause, Trophy, Clock, Target, Flame } from 'lucide-react';

export const HUD: React.FC = () => {
  const {
    gameState,
    score,
    highScore,
    timeLeft,
    ammo,
    maxAmmo,
    combo,
    multiplier,
    isReloading,
    reload,
    pauseGame,
    isMuted,
    toggleSound
  } = useGameStore();

  if (gameState !== 'PLAYING') return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = Math.floor(timeLeft % 60);
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const isTension = timeLeft <= 10;

  return (
    <div
      className="hud-layer"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px 24px',
        boxSizing: 'border-box'
      }}
    >
      {/* --- TOP ROW --- */}
      <div
        className="hud-row-top"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          width: '100%'
        }}
      >
        {/* Left: Score & Combo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="hud-badge" style={{ padding: '8px 18px' }}>
            <Target style={{ width: 26, height: 26, color: '#f59e0b' }} />
            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#fcd34d', letterSpacing: '1px' }}>
                SCORE
              </div>
              <div style={{ fontSize: '32px', fontWeight: 900, fontFamily: 'monospace', lineHeight: 1 }}>
                {score.toLocaleString()}
              </div>
            </div>
          </div>

          {combo >= 2 && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '9999px',
                background: 'linear-gradient(90deg, #dc2626, #f59e0b)',
                border: '2px solid #fde047',
                color: '#fff',
                fontWeight: 900,
                fontSize: '12px',
                letterSpacing: '1px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
              }}
            >
              <Flame style={{ width: 16, height: 16, color: '#fef08a', fill: '#facc15' }} />
              <span>x{multiplier} MULTIPLIER ({combo} HITS)</span>
            </div>
          )}
        </div>

        {/* Center: Timer Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            className={`hud-badge ${isTension ? 'pulse-tension' : ''}`}
            style={{
              padding: '8px 20px',
              borderColor: isTension ? '#ef4444' : undefined,
              background: isTension ? 'rgba(127, 29, 29, 0.85)' : undefined
            }}
          >
            <Clock style={{ width: 24, height: 24, color: isTension ? '#f87171' : '#38bdf8' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#7dd3fc', letterSpacing: '1px' }}>
                TIME LEFT
              </div>
              <div style={{ fontSize: '32px', fontWeight: 900, fontFamily: 'monospace', lineHeight: 1 }}>
                {formattedTime}
              </div>
            </div>
          </div>

          <div className="timer-bar-wrap">
            <div
              className={`timer-bar-fill ${isTension ? 'tension' : ''}`}
              style={{ width: `${(timeLeft / 60) * 100}%` }}
            />
          </div>
        </div>

        {/* Right: High Score, Sound & Pause Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', pointerEvents: 'auto' }}>
          <div className="hud-badge" style={{ padding: '8px 14px' }}>
            <Trophy style={{ width: 20, height: 20, color: '#facc15' }} />
            <div>
              <div style={{ fontSize: '9px', fontWeight: 800, color: '#fde047', letterSpacing: '1px' }}>
                BEST
              </div>
              <div style={{ fontSize: '18px', fontWeight: 900, fontFamily: 'monospace', lineHeight: 1 }}>
                {highScore.toLocaleString()}
              </div>
            </div>
          </div>

          <button onClick={toggleSound} className="hud-btn" title="Toggle Sound">
            {isMuted ? (
              <VolumeX style={{ width: 20, height: 20, color: '#f87171' }} />
            ) : (
              <Volume2 style={{ width: 20, height: 20, color: '#4ade80' }} />
            )}
          </button>

          <button onClick={pauseGame} className="hud-btn" title="Pause (ESC)">
            <Pause style={{ width: 20, height: 20, color: '#ffffff' }} />
          </button>
        </div>
      </div>

      {/* --- BOTTOM ROW --- */}
      <div
        className="hud-row-bottom"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          width: '100%'
        }}
      >
        {/* Help text */}
        <div
          className="hud-badge"
          style={{ fontSize: '12px', color: '#cbd5e1', padding: '6px 14px' }}
        >
          <strong style={{ color: '#fff' }}>W A S D</strong>: Di chuyển (Giữ <strong style={{ color: '#facc15' }}>Shift</strong> để chạy) | <strong style={{ color: '#fff' }}>CLICK</strong>: Bắn | <strong style={{ color: '#fff' }}>R</strong>: Nạp Đạn | <strong style={{ color: '#fff' }}>ESC</strong>: Tạm Dừng
        </div>

        {/* Ammo Display */}
        <div onClick={() => reload()} className="ammo-badge" title="Nhấn R hoặc click để nạp đạn">
          <div className="ammo-shells-row">
            {Array.from({ length: maxAmmo }).map((_, i) => {
              const isLoaded = i < ammo;
              return (
                <div
                  key={i}
                  className={`ammo-shell-graphic ${isLoaded ? 'loaded' : 'spent'}`}
                />
              );
            })}
          </div>

          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '14px' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#fcd34d', letterSpacing: '1px' }}>
              {isReloading ? 'RELOADING...' : 'AMMO'}
            </div>
            <div style={{ fontSize: '26px', fontWeight: 900, fontFamily: 'monospace', lineHeight: 1 }}>
              {ammo} <span style={{ fontSize: '14px', color: '#94a3b8' }}>/ {maxAmmo}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
