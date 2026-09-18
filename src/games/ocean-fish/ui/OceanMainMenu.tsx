'use client';

import React from 'react';
import { useOceanFishStore } from '@/games/ocean-fish/store';
import { Play, Trophy, Volume2, VolumeX, Sparkles, ShieldAlert, Award } from 'lucide-react';
import { FISH_DEFINITIONS } from '@/games/ocean-fish/engine/fishTypes';

export const OceanMainMenu: React.FC = () => {
  const { gameState, startGame, highScore, isMuted, toggleSound } = useOceanFishStore();

  if (gameState !== 'MENU') return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'radial-gradient(circle at center, rgba(3, 105, 161, 0.85) 0%, rgba(12, 34, 64, 0.95) 100%)',
        backdropFilter: 'blur(8px)',
        cursor: 'default',
        pointerEvents: 'auto'
      }}
    >
      <div
        className="wood-card"
        style={{
          width: '100%',
          maxWidth: '560px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          textAlign: 'center',
          background: 'linear-gradient(180deg, #0f172a 0%, #03274c 100%)',
          border: '2px solid #38bdf8',
          boxShadow: '0 0 40px rgba(56, 189, 248, 0.35)',
          borderRadius: 24,
          padding: '28px 24px'
        }}
      >
        {/* Top Sound Toggle & Highscore Header */}
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 12,
              background: 'rgba(250, 204, 21, 0.15)',
              border: '1px solid #facc15'
            }}
          >
            <Trophy style={{ width: 18, height: 18, color: '#facc15' }} />
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#fef08a' }}>
              KỶ LỤC: {highScore.toLocaleString()}
            </span>
          </div>

          <button
            onClick={toggleSound}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? (
              <VolumeX style={{ width: 18, height: 18, color: '#f87171' }} />
            ) : (
              <Volume2 style={{ width: 18, height: 18, color: '#38bdf8' }} />
            )}
          </button>
        </div>

        {/* Title */}
        <div style={{ margin: '8px 0 4px' }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 900,
              color: '#38bdf8',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            <Sparkles style={{ width: 16, height: 16 }} />
            <span>HỒ KIỆT STUDIO ARCADE</span>
            <Sparkles style={{ width: 16, height: 16 }} />
          </div>

          <h1
            style={{
              fontSize: '38px',
              fontWeight: 900,
              margin: '4px 0',
              background: 'linear-gradient(180deg, #ffffff 0%, #38bdf8 60%, #0284c7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 4px 20px rgba(56, 189, 248, 0.5)',
              letterSpacing: '-0.5px'
            }}
          >
            BẮN CÁ ĐẠI DƯƠNG
          </h1>

          <p style={{ color: '#bae6fd', fontSize: '14px', margin: 0, fontWeight: 600 }}>
            Khám phá rạn san hô lung linh & săn tìm Cá Rồng Vàng Thần Thoại!
          </p>
        </div>

        {/* Fish Species & Rewards Grid */}
        <div
          style={{
            width: '100%',
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: 16,
            padding: '12px 14px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', marginBottom: 8, letterSpacing: '0.5px' }}>
            BẢNG THƯỞNG SINH VẬT BIỂN
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 8,
              fontSize: '11px'
            }}
          >
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: 8 }}>
              <div style={{ fontSize: '18px' }}>🐠</div>
              <div style={{ fontWeight: 800, color: '#ffffff' }}>Cá Hề</div>
              <div style={{ color: '#facc15', fontWeight: 900 }}>+10 Vàng</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: 8 }}>
              <div style={{ fontSize: '18px' }}>🐡</div>
              <div style={{ fontWeight: 800, color: '#ffffff' }}>Cá Nóc</div>
              <div style={{ color: '#facc15', fontWeight: 900 }}>+65 Vàng</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: 8 }}>
              <div style={{ fontSize: '18px' }}>🐢</div>
              <div style={{ fontWeight: 800, color: '#ffffff' }}>Rùa Biển</div>
              <div style={{ color: '#facc15', fontWeight: 900 }}>+180 Vàng</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: 8 }}>
              <div style={{ fontSize: '18px' }}>🦈</div>
              <div style={{ fontWeight: 800, color: '#ffffff' }}>Cá Mập</div>
              <div style={{ color: '#facc15', fontWeight: 900 }}>+900 Vàng</div>
            </div>
          </div>
        </div>

        {/* Controls Instructions */}
        <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6' }}>
          🎯 <strong>Cách chơi:</strong> Di chuyển chuột để nhắm pháo • Click chuột trái để bắn lưới năng lượng •
          Phím <strong>Space</strong> hoặc nút <strong>+ / -</strong> để nâng cấp pháo •
          Kỹ năng <strong>❄️ Đóng Băng</strong> & <strong>💣 Bom Nổ</strong> ở góc phải.
        </div>

        {/* Start Game Button */}
        <button
          onClick={startGame}
          style={{
            width: '100%',
            padding: '16px 24px',
            borderRadius: 18,
            background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
            border: '2px solid #e0f2fe',
            boxShadow: '0 0 25px rgba(56, 189, 248, 0.7)',
            color: '#ffffff',
            fontSize: '20px',
            fontWeight: 900,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            cursor: 'pointer',
            marginTop: 6,
            transition: 'transform 0.15s ease'
          }}
        >
          <Play style={{ width: 24, height: 24, fill: '#ffffff' }} />
          <span>BẮT ĐẦU SĂN CÁ</span>
        </button>
      </div>
    </div>
  );
};
