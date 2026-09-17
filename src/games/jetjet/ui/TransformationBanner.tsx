'use client';

import React from 'react';
import { useJetJetStore } from '@/games/jetjet/store';
import { Sparkles, Zap, Trophy, Play } from 'lucide-react';
import { jetJetAudio } from '../audio/jetJetAudio';

export const TransformationBanner: React.FC = () => {
  const { gameState, missionStep, startMission02, finishChaseSuccess } = useJetJetStore();

  // Show banner on Mission 01 transformation complete (step 5)
  if (gameState === 'TRANSFORMED_CELEBRATE' || (gameState === 'PLAYING' && missionStep === 5)) {
    return (
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.98) 100%)',
          border: '3px solid #ef4444',
          borderRadius: 24,
          padding: '26px 36px',
          textAlign: 'center',
          zIndex: 90,
          boxShadow: '0 0 35px rgba(239,68,68,0.7), 0 10px 40px rgba(0,0,0,0.8)',
          maxWidth: 520,
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <Sparkles size={24} color="#f59e0b" />
          <span style={{ fontSize: '1.9rem', fontWeight: 900, color: '#ef4444', letterSpacing: 2 }}>
            JET JET MODE!
          </span>
          <Sparkles size={24} color="#f59e0b" />
        </div>

        <p style={{ color: '#38bdf8', fontWeight: 800, fontSize: '1.05rem', margin: '0 0 14px 0' }}>
          ĐỔI PHONG CÁCH DENIM STREETWEAR THÀNH CÔNG!
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            background: 'rgba(0,0,0,0.4)',
            borderRadius: 12,
            padding: '10px',
            marginBottom: 16
          }}
        >
          <div style={{ color: '#84cc16', fontWeight: 800, fontSize: '0.85rem' }}>
            🔥 +15% TỐC ĐỘ XE
          </div>
          <div style={{ color: '#eab308', fontWeight: 800, fontSize: '0.85rem' }}>
            ⚡ +JET NITRO BOOST
          </div>
          <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: '0.85rem' }}>
            🏆 +1000 XP
          </div>
        </div>

        <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: '0 0 18px 0', lineHeight: 1.5 }}>
          Bạn đã hoàn thành <strong>Mission 01</strong>. Bạn muốn tiếp tục thử thách với cuộc rượt đuổi nghẹt thở trong <strong>Mission 02 (Phi Vụ Anh Hai)</strong> hay tự do lướt gió?
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => {
              jetJetAudio.playUiClick();
              startMission02();
            }}
            style={{
              background: 'linear-gradient(135deg, #ef4444, #f97316)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 12,
              padding: '12px 24px',
              fontWeight: 900,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 0 15px rgba(239,68,68,0.5)'
            }}
          >
            <Play size={18} fill="#ffffff" />
            <span>NHIỆM VỤ 02: PHI VỤ ANH HAI</span>
          </button>

          <button
            type="button"
            onClick={() => {
              jetJetAudio.playUiClick();
              useJetJetStore.setState({ gameState: 'FREE_ROAM', missionStep: 10 });
            }}
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: 12,
              padding: '12px 20px',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            TỰ DO DẠO CHƠI
          </button>
        </div>
      </div>
    );
  }

  // Show banner on Mission Passed (step 10)
  if (gameState === 'MISSION_PASSED') {
    return (
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, rgba(22,101,52,0.96) 0%, rgba(15,23,42,0.98) 100%)',
          border: '3px solid #22c55e',
          borderRadius: 24,
          padding: '26px 36px',
          textAlign: 'center',
          zIndex: 90,
          boxShadow: '0 0 35px rgba(34,197,94,0.7)',
          maxWidth: 480,
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <Trophy size={28} color="#eab308" />
          <span style={{ fontSize: '1.9rem', fontWeight: 900, color: '#22c55e', letterSpacing: 1.5 }}>
            MISSION PASSED!
          </span>
        </div>

        <p style={{ color: '#ffffff', fontWeight: 900, fontSize: '1.2rem', margin: '0 0 6px 0' }}>
          CHẠY ĐI ANH HAI!
        </p>
        <p style={{ color: '#fef08a', fontWeight: 800, fontSize: '1rem', margin: '0 0 16px 0' }}>
          +1500 XP ĐIỂM THƯỞNG
        </p>

        <p style={{ color: '#e2e8f0', fontSize: '0.88rem', margin: '0 0 18px 0' }}>
          Bạn đã thoát khỏi mọi sự truy đuổi! Chế độ <strong>Khám Phá Tự Do (Free Roam)</strong> đã được mở khóa hoàn toàn.
        </p>

        <button
          type="button"
          onClick={() => {
            jetJetAudio.playUiClick();
            jetJetAudio.setMusicState('EXPLORATION');
            useJetJetStore.setState({ gameState: 'FREE_ROAM' });
          }}
          style={{
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            color: '#ffffff',
            border: 'none',
            borderRadius: 12,
            padding: '12px 28px',
            fontWeight: 900,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 0 15px rgba(34,197,94,0.5)'
          }}
        >
          TIẾP TỤC DẠO CHƠI MIỀN TÂY
        </button>
      </div>
    );
  }

  return null;
};
