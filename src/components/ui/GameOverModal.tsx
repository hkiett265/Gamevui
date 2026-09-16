'use client';

import React, { useEffect } from 'react';
import { useGameStore } from '@/stores/useGameStore';
import { RotateCcw, Home, Trophy, Target, Award, Zap, Crosshair } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundSystem } from '@/audio/soundSystem';

export const GameOverModal: React.FC = () => {
  const {
    gameState,
    score,
    highScore,
    chickensHit,
    shotsFired,
    maxCombo,
    goldenChickensHit,
    headshots,
    startCountdown,
    resetGame
  } = useGameStore();

  const [playerName, setPlayerName] = React.useState('Xạ Thủ Hồ Kiệt');
  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const isNewHighScore = score > 0 && score >= highScore;
  const accuracy = shotsFired > 0 ? Math.round((chickensHit / shotsFired) * 100) : 0;

  useEffect(() => {
    if (gameState === 'GAME_OVER' && score > 0) {
      // Auto submit score to MySQL
      setSaveStatus('saving');
      fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameSlug: 'ban-ga-3d',
          playerName: playerName || 'Người chơi ẩn danh',
          score,
          combo: maxCombo
        })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setSaveStatus('saved');
          } else {
            setSaveStatus('error');
          }
        })
        .catch(() => {
          setSaveStatus('error');
        });
    }
  }, [gameState, score, maxCombo]);

  useEffect(() => {
    if (gameState === 'GAME_OVER' && isNewHighScore) {
      // Fire celebratory confetti cannons
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.warn('Confetti error', e);
      }
    }
  }, [gameState, isNewHighScore]);

  useEffect(() => {
    if (gameState === 'GAME_OVER') {
      if (typeof document !== 'undefined' && document.pointerLockElement) {
        try {
          document.exitPointerLock();
        } catch {}
      }
    }
  }, [gameState]);

  if (gameState !== 'GAME_OVER') return null;

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
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(8px)',
        cursor: 'default',
        pointerEvents: 'auto'
      }}
    >
      <div
        className="wood-card"
        style={{
          width: '100%',
          maxWidth: '500px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        {/* Banner */}
        <div
          style={{
            display: 'inline-block',
            padding: '6px 20px',
            borderRadius: '9999px',
            background: '#dc2626',
            color: '#fff',
            fontWeight: 900,
            fontSize: '14px',
            letterSpacing: '1px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
            marginTop: '-40px',
            border: '2px solid #fff'
          }}
        >
          ⏰ TIME'S UP!
        </div>

        {/* High Score Celebration Badge */}
        {isNewHighScore && (
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400 text-yellow-950 font-black text-xs uppercase tracking-widest shadow animate-bounce">
            <Trophy className="w-4 h-4" />
            <span>NEW HIGH SCORE!</span>
          </div>
        )}

        {/* Final Score */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-yellow-200 uppercase tracking-widest">
            FINAL SCORE
          </span>
          <div
            className="text-5xl sm:text-6xl font-black font-mono text-yellow-300 tracking-tight"
            style={{ textShadow: '0 4px 0 #451a03' }}
          >
            {score.toLocaleString()}
          </div>
          {saveStatus === 'saved' && (
            <div style={{ fontSize: '12px', color: '#4ade80', fontWeight: 700, marginTop: '4px' }}>
              ✓ Đã lưu thành tích vào MySQL!
            </div>
          )}
          {saveStatus === 'saving' && (
            <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 600, marginTop: '4px' }}>
              Đang lưu vào bảng xếp hạng...
            </div>
          )}
        </div>

        {/* Detailed Stats Grid */}
        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            margin: '4px 0',
            textAlign: 'left'
          }}
        >
          {/* Chickens Hit */}
          <div style={{ padding: '8px 10px', borderRadius: '14px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', fontSize: '11px', fontWeight: 800 }}>
              <Target style={{ width: 14, height: 14, color: '#4ade80' }} />
              <span>GÀ ĐÃ BẮN</span>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'monospace', color: '#ffffff', marginTop: '2px' }}>
              {chickensHit}
            </div>
          </div>

          {/* Accuracy */}
          <div style={{ padding: '8px 10px', borderRadius: '14px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', fontSize: '11px', fontWeight: 800 }}>
              <Crosshair style={{ width: 14, height: 14, color: '#38bdf8' }} />
              <span>ĐỘ CHÍNH XÁC</span>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'monospace', color: '#ffffff', marginTop: '2px' }}>
              {accuracy}%
            </div>
          </div>

          {/* Best Combo */}
          <div style={{ padding: '8px 10px', borderRadius: '14px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', fontSize: '11px', fontWeight: 800 }}>
              <Zap style={{ width: 14, height: 14, color: '#f59e0b' }} />
              <span>MAX COMBO</span>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'monospace', color: '#fde047', marginTop: '2px' }}>
              x{maxCombo}
            </div>
          </div>

          {/* Shots Fired */}
          <div style={{ padding: '8px 10px', borderRadius: '14px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', fontSize: '11px', fontWeight: 800 }}>
              <Target style={{ width: 14, height: 14, color: '#94a3b8' }} />
              <span>TỔNG PHÁT BẮN</span>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'monospace', color: '#ffffff', marginTop: '2px' }}>
              {shotsFired}
            </div>
          </div>

          {/* Golden Chickens */}
          <div style={{ padding: '8px 10px', borderRadius: '14px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', fontSize: '11px', fontWeight: 800 }}>
              <Award style={{ width: 14, height: 14, color: '#facc15' }} />
              <span>GÀ VÀNG</span>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'monospace', color: '#facc15', marginTop: '2px' }}>
              {goldenChickensHit}
            </div>
          </div>

          {/* Headshots */}
          <div style={{ padding: '8px 10px', borderRadius: '14px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', fontSize: '11px', fontWeight: 800 }}>
              <Trophy style={{ width: 14, height: 14, color: '#f87171' }} />
              <span>HEADSHOTS</span>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'monospace', color: '#f87171', marginTop: '2px' }}>
              {headshots}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', width: '100%', gap: '10px', marginTop: '6px' }}>
          <button
            onClick={() => {
              soundSystem.playUiClick();
              startCountdown();
            }}
            className="btn-cartoon btn-green"
            style={{ flex: 1, padding: '12px', fontSize: '18px', cursor: 'pointer' }}
          >
            <RotateCcw style={{ width: 22, height: 22 }} />
            <span>PLAY AGAIN</span>
          </button>

          <button
            onClick={() => {
              soundSystem.playUiClick();
              resetGame();
            }}
            className="hud-badge"
            style={{ flex: 1, padding: '12px', fontSize: '16px', fontWeight: 800, cursor: 'pointer', justifyContent: 'center' }}
          >
            <Home style={{ width: 20, height: 20, color: '#fcd34d' }} />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
