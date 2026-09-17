'use client';

import React, { useState } from 'react';
import { Trophy, RotateCcw, Home, Loader2 } from 'lucide-react';
import { useNitroRacerStore } from '@/games/racing/store';

export const RacingGameOverModal: React.FC = () => {
  const store = useNitroRacerStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  if (store.gameStatus !== 'gameover' && store.gameStatus !== 'victory') return null;

  const score = Math.floor(store.score);
  const distance = Math.floor(store.distance);
  
  let rank = 'C';
  if (score > 50000) rank = 'S';
  else if (score > 30000) rank = 'A';
  else if (score > 15000) rank = 'B';

  const handleSubmitScore = async () => {
    if (!store.playerName.trim()) return;
    setIsSubmitting(true);
    try {
      await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameSlug: 'dua-xe-sieu-toc',
          playerName: store.playerName,
          score: score,
          combo: store.closeCallsCount
        })
      });
      setSubmitted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
    }}>
      <div style={{
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
        border: '2px solid #00ffff', borderRadius: '24px', padding: '40px',
        width: '90%', maxWidth: '500px', textAlign: 'center',
        boxShadow: '0 0 40px rgba(0,255,255,0.2)'
      }}>
        <Trophy size={64} color="#ffcc00" style={{ margin: '0 auto 20px' }} />
        
        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', margin: '0 0 10px' }}>HẾT THỜI GIAN</h2>
        
        <div style={{ 
          fontSize: '4rem', fontWeight: 900, color: '#00ffff', 
          textShadow: '0 0 20px rgba(0,255,255,0.5)', margin: '20px 0' 
        }}>
          {score.toLocaleString()}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 30 }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: 15, borderRadius: 12 }}>
            <div style={{ color: '#888', fontSize: '0.9rem' }}>QUÃNG ĐƯỜNG</div>
            <div style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700 }}>{distance}m</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: 15, borderRadius: 12 }}>
            <div style={{ color: '#888', fontSize: '0.9rem' }}>CLOSE CALLS</div>
            <div style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700 }}>{store.closeCallsCount}</div>
          </div>
          <div style={{ gridColumn: 'span 2', background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)', padding: 15, borderRadius: 12 }}>
            <div style={{ color: '#ffd700', fontSize: '0.9rem' }}>XẾP HẠNG</div>
            <div style={{ color: '#fff', fontSize: '2rem', fontWeight: 900 }}>RANK {rank}</div>
          </div>
        </div>

        {!submitted ? (
          <div style={{ marginBottom: 30 }}>
            <input 
              type="text" 
              placeholder="Nhập tên của bạn..." 
              value={store.playerName}
              onChange={e => store.setPlayerName(e.target.value)}
              style={{
                width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #333',
                background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '1.1rem', textAlign: 'center',
                marginBottom: 15
              }}
            />
            <button 
              onClick={handleSubmitScore}
              disabled={isSubmitting || !store.playerName.trim()}
              style={{
                width: '100%', padding: '15px', borderRadius: '12px', border: 'none',
                background: 'linear-gradient(90deg, #00ffff, #0066ff)', color: '#fff',
                fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer',
                opacity: (!store.playerName.trim() || isSubmitting) ? 0.5 : 1
              }}
            >
              {isSubmitting ? <Loader2 className="animate-spin" style={{ margin: '0 auto' }} /> : 'LƯU KỶ LỤC'}
            </button>
          </div>
        ) : (
          <div style={{ color: '#00ffaa', fontWeight: 600, fontSize: '1.1rem', marginBottom: 30 }}>
            Đã lưu kỷ lục thành công!
          </div>
        )}

        <div style={{ display: 'flex', gap: 15 }}>
          <button 
            onClick={() => { store.resetGame(); store.setGameStatus('playing'); }}
            style={{
              flex: 1, padding: '15px', borderRadius: '12px', border: 'none',
              background: '#333', color: '#fff', fontSize: '1.1rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer'
            }}
          >
            <RotateCcw size={20} /> ĐUA LẠI
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            style={{
              flex: 1, padding: '15px', borderRadius: '12px', border: 'none',
              background: '#222', color: '#888', fontSize: '1.1rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer'
            }}
          >
            <Home size={20} /> THOÁT
          </button>
        </div>
      </div>
    </div>
  );
};
