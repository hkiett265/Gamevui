'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useJetJetStore } from '@/games/jetjet/store';
import { Play, HelpCircle, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { jetJetAudio } from '../engine/audio/jetJetAudio';

export const MainMenu: React.FC = () => {
  const { gameState, startGame, isMuted, toggleMute } = useJetJetStore();
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  if (gameState !== 'MENU') return null;

  const handlePlayClick = () => {
    jetJetAudio.init();
    jetJetAudio.startAmbience();
    startGame();
  };

  const handleMuteClick = () => {
    const muted = toggleMute();
    jetJetAudio.setMuted(muted);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '40px 20px',
        zIndex: 100,
        background: 'radial-gradient(circle at center, rgba(15,23,42,0.3) 0%, rgba(2,6,23,0.85) 100%)',
        fontFamily: 'var(--font-heading), system-ui, sans-serif'
      }}
    >
      {/* TOP BRAND BAR */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.4rem' }}>🏍️</span>
          <span style={{ color: '#06b6d4', fontWeight: 900, letterSpacing: 1.5, fontSize: '0.95rem' }}>
            HỒ KIỆT – GAMEVUI 24H
          </span>
        </div>

        <Link
          href="/"
          prefetch={true}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 10,
            padding: '8px 16px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            textDecoration: 'none',
            fontSize: '0.85rem',
            fontWeight: 700
          }}
        >
          <ArrowLeft size={16} />
          <span>Về Portal</span>
        </Link>
      </div>

      {/* CENTER HERO TITLE */}
      <div style={{ textAlign: 'center', maxWidth: 680 }}>
        <div
          style={{
            display: 'inline-block',
            background: '#ef4444',
            color: '#ffffff',
            padding: '4px 14px',
            borderRadius: 20,
            fontSize: '0.8rem',
            fontWeight: 900,
            letterSpacing: 2,
            marginBottom: 16,
            boxShadow: '0 0 15px #ef4444'
          }}
        >
          GAME 3D MINI OPEN-WORLD
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 900,
            color: '#ffffff',
            lineHeight: 1.1,
            margin: '0 0 10px 0',
            textShadow: '0 0 35px rgba(6,182,212,0.8), 0 4px 10px rgba(0,0,0,0.8)'
          }}
        >
          JET JET <span style={{ color: '#eab308' }}>MIỀN TÂY 3D</span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.3rem)',
            color: '#38bdf8',
            fontWeight: 700,
            margin: '0 0 16px 0',
            letterSpacing: 0.5
          }}
        >
          Hành Trình Biến Hình — Uống Nước Đổi Phong Cách!
        </p>

        <p style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: 32 }}>
          Trải nghiệm mini open-world đậm chất miền Tây sông nước. Leo lên chiếc Exciter thể thao,
          lướt qua đường làng, ghé tiệm Tạp Hóa Cô Ba mua chai nước tăng lực đỏ để kích hoạt chế độ biến hình rực lửa!
        </p>

        {/* PRIMARY CTA BUTTONS */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
          <button
            type="button"
            onClick={handlePlayClick}
            style={{
              background: 'linear-gradient(135deg, #ef4444, #f97316)',
              border: 'none',
              borderRadius: 14,
              padding: '16px 36px',
              color: '#ffffff',
              fontSize: '1.2rem',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 0 25px rgba(239,68,68,0.7)',
              transition: 'transform 0.15s ease'
            }}
          >
            <Play size={22} fill="#ffffff" />
            <span>BẮT ĐẦU CHƠI</span>
          </button>

          <button
            type="button"
            onClick={() => setShowHowToPlay(true)}
            style={{
              background: 'rgba(15,23,42,0.8)',
              border: '2px solid #38bdf8',
              borderRadius: 14,
              padding: '16px 24px',
              color: '#38bdf8',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <HelpCircle size={20} />
            <span>CÁCH CHƠI</span>
          </button>
        </div>
      </div>

      {/* BOTTOM HINTS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, color: '#94a3b8', fontSize: '0.82rem' }}>
        <span>WASD: Di chuyển</span>
        <span>•</span>
        <span>F: Lên / Xuống xe</span>
        <span>•</span>
        <span>E: Mua & Uống nước</span>
        <span>•</span>
        <span>Shift: Tăng tốc Jet</span>
      </div>

      {/* HOW TO PLAY MODAL */}
      {showHowToPlay && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200
          }}
        >
          <div
            style={{
              background: '#0f172a',
              border: '2px solid #06b6d4',
              borderRadius: 20,
              padding: '28px 32px',
              maxWidth: 520,
              color: '#ffffff'
            }}
          >
            <h2 style={{ color: '#eab308', margin: '0 0 16px 0', fontSize: '1.6rem', fontWeight: 900 }}>
              HƯỚNG DẪN ĐIỀU KHIỂN
            </h2>
            <ul style={{ paddingLeft: 20, lineHeight: 1.8, fontSize: '0.95rem', color: '#e2e8f0' }}>
              <li><strong>Khi đi bộ:</strong> Dùng <code>WASD</code> để đi lại, giữ <code>Shift</code> để chạy nhanh.</li>
              <li><strong>Lên xe Exciter:</strong> Đến gần xe máy và bấm <code>[F]</code>.</li>
              <li><strong>Lái xe máy:</strong> <code>W</code> rồ ga tăng tốc, <code>S</code> phanh / lùi, <code>A/D</code> bẻ lái và nghiêng người ôm cua.</li>
              <li><strong>Đến tiệm Tạp Hóa Cô Ba:</strong> Đi theo cột mốc Waypoint màu đỏ phía trên.</li>
              <li><strong>Xuống xe & Mua nước:</strong> Dừng trước tiệm, bấm <code>[F]</code> xuống xe, vào quầy bấm <code>[E]</code> để lấy chai nước đỏ.</li>
              <li><strong>Biến hình JET JET:</strong> Bấm <code>[E]</code> để uống nước, xem phân cảnh biến hình sang phong cách Denim Streetwear cực ngầu!</li>
            </ul>

            <button
              type="button"
              onClick={() => setShowHowToPlay(false)}
              style={{
                marginTop: 20,
                width: '100%',
                background: '#06b6d4',
                color: '#0f172a',
                border: 'none',
                borderRadius: 12,
                padding: '12px',
                fontSize: '1rem',
                fontWeight: 900,
                cursor: 'pointer'
              }}
            >
              ĐÃ HIỂU!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
