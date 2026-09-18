'use client';

import React from 'react';
import { Play } from 'lucide-react';
import { useNitroRacerStore } from '@/games/racing/store';
import { nitroAudio } from '../engine/audio/nitroAudio';

export const RacingMainMenu: React.FC = () => {
  const store = useNitroRacerStore();
  
  if (store.gameStatus !== 'menu') return null;

  const handleStart = () => {
    nitroAudio.init();
    store.resetGame();
    store.setGameStatus('playing');
  };

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
    }}>
      <div style={{ textAlign: 'center', maxWidth: 600, padding: 20 }}>
        <h1 style={{ 
          fontSize: '4rem', fontWeight: 900, color: '#fff', fontStyle: 'italic',
          textShadow: '0 0 30px #00ffff, 2px 2px 0px #ff00ff', margin: '0 0 10px',
          letterSpacing: 2
        }}>
          NITRO VELOCITY
        </h1>
        <p style={{ color: '#00ffff', fontSize: '1.4rem', fontWeight: 600, letterSpacing: 5, marginBottom: 40 }}>
          ĐUA XE SIÊU TỐC 3D
        </p>
        
        <div style={{ 
          background: 'rgba(0,0,0,0.7)', border: '1px solid #333', borderRadius: 16, 
          padding: 24, marginBottom: 40, textAlign: 'left',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: 15, borderBottom: '1px solid #333', paddingBottom: 10 }}>HƯỚNG DẪN ĐIỀU KHIỂN</h3>
          <ul style={{ color: '#ccc', listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <li><strong style={{ color: '#fff', display: 'inline-block', width: 120 }}>W / Mũi tên Lên:</strong> Tăng tốc</li>
            <li><strong style={{ color: '#fff', display: 'inline-block', width: 120 }}>S / Mũi tên Xuống:</strong> Phanh / Lùi</li>
            <li><strong style={{ color: '#fff', display: 'inline-block', width: 120 }}>A, D / Trái, Phải:</strong> Đánh lái</li>
            <li><strong style={{ color: '#00ffff', display: 'inline-block', width: 120 }}>SPACE:</strong> Phanh tay / Drift trượt lốp</li>
            <li><strong style={{ color: '#ff00ff', display: 'inline-block', width: 120 }}>SHIFT:</strong> Kích hoạt NITRO BOOST</li>
            <li><strong style={{ color: '#fff', display: 'inline-block', width: 120 }}>Phím C:</strong> Đổi góc nhìn Camera</li>
          </ul>
        </div>
        
        <button 
          onClick={handleStart}
          style={{
            background: 'linear-gradient(45deg, #00ffff, #ff00ff)', border: 'none', borderRadius: 50,
            padding: '20px 60px', color: '#fff', fontSize: '2rem', fontWeight: 900,
            cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 15,
            boxShadow: '0 0 40px rgba(255,0,255,0.6)', transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Play size={32} fill="#fff" /> XUẤT PHÁT
        </button>
      </div>
    </div>
  );
};
