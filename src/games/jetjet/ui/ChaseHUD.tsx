'use client';

import React from 'react';
import { useJetJetStore } from '@/games/jetjet/store';
import { Star, ShieldAlert } from 'lucide-react';

export const ChaseHUD: React.FC = () => {
  const { gameState, chaseStars, chaseEscapeTimer, chaseEscapeRequired, isEscaping } = useJetJetStore();

  if (gameState !== 'CHASE') return null;

  const escapePercent = Math.min((chaseEscapeTimer / chaseEscapeRequired) * 100, 100);

  return (
    <div
      style={{
        position: 'absolute',
        top: 85,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        zIndex: 50,
        pointerEvents: 'none',
        fontFamily: 'var(--font-heading), system-ui, sans-serif'
      }}
    >
      {/* STARS ROW */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(15,23,42,0.92)',
          border: '2px solid #ef4444',
          borderRadius: 20,
          padding: '6px 18px',
          boxShadow: '0 0 20px rgba(239,68,68,0.7)'
        }}
      >
        <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#ef4444', letterSpacing: 1 }}>
          TRUY ĐUỔI:
        </span>
        {[1, 2, 3].map((starIdx) => (
          <Star
            key={starIdx}
            size={22}
            fill={starIdx <= chaseStars ? '#ef4444' : 'none'}
            color={starIdx <= chaseStars ? '#ef4444' : '#64748b'}
            style={{
              animation: starIdx <= chaseStars ? 'pulse 0.8s infinite alternate' : 'none'
            }}
          />
        ))}
      </div>

      {/* ESCAPE PROGRESS BAR */}
      <div
        style={{
          width: 220,
          background: 'rgba(15,23,42,0.85)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 10,
          overflow: 'hidden',
          padding: 2
        }}
      >
        <div
          style={{
            height: 10,
            borderRadius: 8,
            width: `${escapePercent}%`,
            background: isEscaping
              ? 'linear-gradient(90deg, #22c55e, #84cc16)'
              : 'linear-gradient(90deg, #ef4444, #f97316)',
            transition: 'width 0.2s linear'
          }}
        />
      </div>

      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: isEscaping ? '#22c55e' : '#f97316' }}>
        {isEscaping ? 'ĐANG CẮT ĐUÔI... GIỮ KHOẢNG CÁCH!' : 'CÓ XE BÁM ĐUÔI PHÍA SAU! TĂNG GA!'}
      </div>
    </div>
  );
};
