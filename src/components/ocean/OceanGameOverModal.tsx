'use client';

import React, { useEffect, useState } from 'react';
import { useOceanFishStore } from '@/stores/useOceanFishStore';
import { RotateCcw, Home, Trophy, Coins, Award, Zap, Crosshair } from 'lucide-react';
import confetti from 'canvas-confetti';

import { useAuthStore } from '@/stores/useAuthStore';

export const OceanGameOverModal: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const {
    gameState,
    score,
    highScore,
    coins,
    shotsFired,
    fishCaught,
    bossesDefeated,
    maxCombo,
    startGame,
    resetGame
  } = useOceanFishStore();

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const isNewHighScore = score > 0 && score >= highScore;

  // Auto-submit score to MySQL Leaderboard
  useEffect(() => {
    if (gameState === 'GAME_OVER' && score > 0) {
      setSaveStatus('saving');
      fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameSlug: 'ban-ca-dai-duong',
          playerName: user?.username || 'Xạ Thủ Đại Dương',
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

  // Confetti on new high score
  useEffect(() => {
    if (gameState === 'GAME_OVER' && isNewHighScore) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  }, [gameState, isNewHighScore]);

  // Ensure mouse cursor is released and visible
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
        background: 'rgba(2, 6, 23, 0.85)',
        backdropFilter: 'blur(8px)',
        cursor: 'default',
        pointerEvents: 'auto'
      }}
    >
      <div
        className="wood-card"
        style={{
          width: '100%',
          maxWidth: '520px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          textAlign: 'center',
          position: 'relative',
          background: 'linear-gradient(180deg, #0f172a 0%, #03274c 100%)',
          border: '2px solid #38bdf8',
          boxShadow: '0 0 40px rgba(56, 189, 248, 0.4)',
          borderRadius: 24,
          padding: '28px 22px'
        }}
      >
        {/* Banner */}
        <div
          style={{
            display: 'inline-block',
            padding: '6px 22px',
            borderRadius: 9999,
            background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
            color: '#ffffff',
            fontWeight: 900,
            fontSize: '14px',
            letterSpacing: '1px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
            marginTop: '-42px',
            border: '2px solid #ffffff'
          }}
        >
          ⏰ KẾT THÚC CHUYẾN SĂN
        </div>

        {/* High Score Celebration Badge */}
        {isNewHighScore && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: 9999,
              background: '#facc15',
              color: '#451a03',
              fontWeight: 900,
              fontSize: '12px',
              letterSpacing: '1px',
              boxShadow: '0 0 15px rgba(250, 204, 21, 0.6)'
            }}
          >
            <Trophy style={{ width: 16, height: 16 }} />
            <span>KỶ LỤC MỚI ĐƯỢC THIẾT LẬP!</span>
          </div>
        )}

        {/* Final Score */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#bae6fd', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            TỔNG ĐIỂM THU HOẠCH
          </span>
          <div
            style={{
              fontSize: '52px',
              fontWeight: 900,
              fontFamily: 'monospace',
              color: '#facc15',
              letterSpacing: '-1px',
              textShadow: '0 0 25px rgba(250, 204, 21, 0.5)'
            }}
          >
            {score.toLocaleString()}
          </div>

          {saveStatus === 'saved' && (
            <div style={{ fontSize: '12px', color: '#4ade80', fontWeight: 700, marginTop: '4px' }}>
              ✓ Đã lưu thành tích Bắn Cá vào MySQL!
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
          {/* Gold Earned */}
          <div style={{ padding: '8px 10px', borderRadius: '14px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', fontSize: '11px', fontWeight: 800 }}>
              <Coins style={{ width: 14, height: 14, color: '#facc15' }} />
              <span>VÀNG CÒN LẠI</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 900, fontFamily: 'monospace', color: '#facc15', marginTop: '2px' }}>
              {coins.toLocaleString()}
            </div>
          </div>

          {/* Fish Caught */}
          <div style={{ padding: '8px 10px', borderRadius: '14px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', fontSize: '11px', fontWeight: 800 }}>
              <Award style={{ width: 14, height: 14, color: '#38bdf8' }} />
              <span>CÁ BẮT ĐƯỢC</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 900, fontFamily: 'monospace', color: '#38bdf8', marginTop: '2px' }}>
              {fishCaught}
            </div>
          </div>

          {/* Max Combo */}
          <div style={{ padding: '8px 10px', borderRadius: '14px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', fontSize: '11px', fontWeight: 800 }}>
              <Zap style={{ width: 14, height: 14, color: '#f97316' }} />
              <span>MAX COMBO</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 900, fontFamily: 'monospace', color: '#f97316', marginTop: '2px' }}>
              x{maxCombo}
            </div>
          </div>

          {/* Shots Fired */}
          <div style={{ padding: '8px 10px', borderRadius: '14px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', fontSize: '11px', fontWeight: 800 }}>
              <Crosshair style={{ width: 14, height: 14, color: '#94a3b8' }} />
              <span>PHÁT BẮN</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 900, fontFamily: 'monospace', color: '#ffffff', marginTop: '2px' }}>
              {shotsFired}
            </div>
          </div>

          {/* Bosses Defeated */}
          <div style={{ padding: '8px 10px', borderRadius: '14px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', fontSize: '11px', fontWeight: 800 }}>
              <Trophy style={{ width: 14, height: 14, color: '#ef4444' }} />
              <span>BOSS ĐÃ HẠ</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 900, fontFamily: 'monospace', color: '#ef4444', marginTop: '2px' }}>
              {bossesDefeated}
            </div>
          </div>

          {/* Catch Efficiency */}
          <div style={{ padding: '8px 10px', borderRadius: '14px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', fontSize: '11px', fontWeight: 800 }}>
              <Trophy style={{ width: 14, height: 14, color: '#a855f7' }} />
              <span>HIỆU SUẤT</span>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 900, fontFamily: 'monospace', color: '#a855f7', marginTop: '2px' }}>
              {shotsFired > 0 ? Math.round((fishCaught / shotsFired) * 100) : 0}%
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', width: '100%', gap: '10px', marginTop: '6px' }}>
          <button
            onClick={startGame}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '18px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
              border: '1px solid #bae6fd',
              color: '#ffffff',
              fontWeight: 900,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.5)'
            }}
          >
            <RotateCcw style={{ width: 22, height: 22 }} />
            <span>CHƠI LẠI</span>
          </button>

          <button
            onClick={resetGame}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '16px',
              fontWeight: 800,
              borderRadius: 14,
              background: 'rgba(30, 41, 59, 0.85)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer'
            }}
          >
            <Home style={{ width: 20, height: 20, color: '#facc15' }} />
            <span>MENU CHÍNH</span>
          </button>
        </div>
      </div>
    </div>
  );
};
