'use client';

import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/stores/useGameStore';
import { Volume2, VolumeX, Play, HelpCircle, Trophy, Crosshair } from 'lucide-react';
import { soundSystem } from '@/audio/soundSystem';

export const MainMenu: React.FC = () => {
  const { gameState, startCountdown, highScore, isMuted, toggleSound } = useGameStore();
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  useEffect(() => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      try {
        document.exitPointerLock();
      } catch {}
    }
  }, []);

  if (gameState !== 'MENU') return null;

  const handlePlay = () => {
    soundSystem.playUiClick();
    startCountdown();
  };

  return (
    <div
      className="menu-layer"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px',
        boxSizing: 'border-box',
        pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.5) 100%)'
      }}
    >
      {/* Top Header */}
      <div
        style={{
          width: '100%',
          maxWidth: '1000px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'auto'
        }}
      >
        <div className="hud-badge" style={{ padding: '8px 16px' }}>
          <Trophy style={{ width: 22, height: 22, color: '#facc15' }} />
          <div>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#fde047', letterSpacing: '1px' }}>
              HIGH SCORE
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'monospace' }}>
              {highScore.toLocaleString()}
            </div>
          </div>
        </div>

        <button
          onClick={toggleSound}
          className="hud-badge"
          style={{ cursor: 'pointer', padding: '10px 18px', gap: '8px' }}
        >
          {isMuted ? (
            <VolumeX style={{ width: 20, height: 20, color: '#f87171' }} />
          ) : (
            <Volume2 style={{ width: 20, height: 20, color: '#4ade80' }} />
          )}
          <span style={{ fontSize: '13px', fontWeight: 800 }}>
            {isMuted ? 'SOUND OFF' : 'SOUND ON'}
          </span>
        </button>
      </div>

      {/* Center Title & Play Button */}
      <div className="menu-center" style={{ margin: 'auto 0', pointerEvents: 'auto' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '9999px',
            background: 'rgba(245, 158, 11, 0.95)',
            color: '#451a03',
            fontWeight: 900,
            fontSize: '12px',
            letterSpacing: '1.5px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            marginBottom: '12px'
          }}
        >
          <span>🐔 3D LOW-POLY ARCADE SHOOTER</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(48px, 9vw, 96px)',
            fontWeight: 900,
            lineHeight: 0.95,
            color: '#facc15',
            textShadow: '0 8px 0 #78350f, 0 16px 25px rgba(0,0,0,0.7)',
            WebkitTextStroke: '3px #451a03',
            margin: 0
          }}
        >
          CHICKEN
          <br />
          <span style={{ color: '#ffffff' }}>MAYHEM 3D</span>
        </h1>

        <p
          style={{
            margin: '14px 0 0 0',
            fontSize: '22px',
            fontWeight: 700,
            fontStyle: 'italic',
            color: '#fef08a',
            textShadow: '0 2px 4px rgba(0,0,0,0.6)'
          }}
        >
          “Ready. Aim. Cluck!”
        </p>

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '28px'
          }}
        >
          <button
            onClick={handlePlay}
            className="btn-cartoon"
            style={{ padding: '16px 36px', fontSize: '24px' }}
          >
            <Play style={{ width: 28, height: 28, fill: '#ffffff' }} />
            <span>PLAY NOW</span>
          </button>

          <button
            onClick={() => {
              soundSystem.playUiClick();
              setShowHowToPlay(true);
            }}
            className="hud-badge"
            style={{ padding: '16px 26px', fontSize: '18px', fontWeight: 800, cursor: 'pointer' }}
          >
            <HelpCircle style={{ width: 24, height: 24, color: '#fcd34d' }} />
            <span>HOW TO PLAY</span>
          </button>
        </div>

        {/* Desktop Hint */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '20px',
            padding: '6px 14px',
            borderRadius: '9999px',
            background: 'rgba(0,0,0,0.5)',
            fontSize: '13px',
            fontWeight: 600,
            color: '#e2e8f0',
            backdropFilter: 'blur(4px)'
          }}
        >
          <Crosshair style={{ width: 16, height: 16, color: '#f59e0b' }} />
          <span>Best experienced with mouse on Desktop 🖥️</span>
        </div>
      </div>

      {/* Bottom Footer */}
      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
        Mouse to Aim • Left-Click to Shoot • R to Reload • ESC to Pause
      </div>

      {/* --- HOW TO PLAY MODAL --- */}
      {showHowToPlay && (
        <div className="modal-overlay" onClick={() => setShowHowToPlay(false)}>
          <div
            className="wood-card"
            onClick={(e) => e.stopPropagation()}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '2px solid rgba(255,255,255,0.2)',
                paddingBottom: '12px'
              }}
            >
              <h2 style={{ margin: 0, fontSize: '26px', fontWeight: 900, color: '#fcd34d' }}>
                HOW TO PLAY
              </h2>
              <button
                onClick={() => setShowHowToPlay(false)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#dc2626',
                  color: '#fff',
                  border: 'none',
                  fontSize: '18px',
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            {/* Target Types Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '10px',
                fontSize: '13px'
              }}
            >
              <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>🐔</span>
                <div>
                  <div style={{ fontWeight: 800, color: '#fde047' }}>Normal Chicken</div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1' }}>Steady run • +10 PTS</div>
                </div>
              </div>
              <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>🐓</span>
                <div>
                  <div style={{ fontWeight: 800, color: '#fbbf24' }}>Fast Chicken</div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1' }}>Sprints quickly • +25 PTS</div>
                </div>
              </div>
              <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>🪽</span>
                <div>
                  <div style={{ fontWeight: 800, color: '#7dd3fc' }}>Flying Chicken</div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1' }}>Flaps in sky • +30 PTS</div>
                </div>
              </div>
              <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>👑</span>
                <div>
                  <div style={{ fontWeight: 800, color: '#facc15' }}>Golden Chicken</div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1' }}>Rare sparkle • +100 PTS!</div>
                </div>
              </div>
              <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>🤪</span>
                <div>
                  <div style={{ fontWeight: 800, color: '#c084fc' }}>Crazy Chicken</div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1' }}>Zig-zag path • +40 PTS</div>
                </div>
              </div>
              <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>🎯</span>
                <div>
                  <div style={{ fontWeight: 800, color: '#6ee7b7' }}>Bonus Targets</div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1' }}>Balloons & Boards • +20-50 PTS</div>
                </div>
              </div>
            </div>

            {/* Pro Tips */}
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '14px',
                background: 'rgba(69, 26, 3, 0.7)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                fontSize: '12px',
                lineHeight: 1.5,
                color: '#fde68a'
              }}
            >
              <strong style={{ color: '#fff' }}>MẸO CHƠI:</strong>
              <ul style={{ paddingLeft: '16px', margin: '4px 0 0 0' }}>
                <li>Bắn trúng đầu gà (Headshot) nhận thêm <strong>+20 Điểm Thưởng</strong>!</li>
                <li>Bắn trúng liên tiếp để nhân điểm <strong>Combo x2, x3, x5</strong>!</li>
                <li>Nhấn <strong>R</strong> để nạp đạn bất kỳ lúc nào.</li>
              </ul>
            </div>

            <button
              onClick={() => setShowHowToPlay(false)}
              className="btn-cartoon"
              style={{ width: '100%', padding: '12px' }}
            >
              ĐÃ HIỂU!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
