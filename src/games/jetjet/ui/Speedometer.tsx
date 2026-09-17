'use client';

import React from 'react';
import { useJetJetStore } from '@/games/jetjet/store';
import { Zap } from 'lucide-react';

export const Speedometer: React.FC = () => {
  const { isRiding, speedKmh, rpm, gear, isBoosting, isTransformed } = useJetJetStore();

  if (!isRiding) return null;

  const absSpeed = Math.round(Math.abs(speedKmh));
  // Needle rotation: -120deg at 0 km/h, +120deg at 120 km/h
  const needleAngle = -120 + Math.min(absSpeed / 120, 1) * 240;
  const rpmPercent = Math.min((rpm - 1000) / 8000, 1) * 100;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 24,
        right: 28,
        width: 190,
        height: 190,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(15,23,42,0.92) 0%, rgba(2,6,23,0.98) 100%)',
        border: '3px solid rgba(6,182,212,0.6)',
        boxShadow: '0 0 25px rgba(6,182,212,0.4), inset 0 0 15px rgba(0,0,0,0.8)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        userSelect: 'none',
        fontFamily: 'var(--font-heading), system-ui, sans-serif'
      }}
    >
      {/* Outer ticks ring */}
      <svg
        width="190"
        height="190"
        viewBox="0 0 190 190"
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      >
        <circle
          cx="95"
          cy="95"
          r="80"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="3"
          strokeDasharray="4 6"
        />
        {/* RPM Arc */}
        <circle
          cx="95"
          cy="95"
          r="72"
          fill="none"
          stroke="url(#rpmGradient)"
          strokeWidth="6"
          strokeDasharray="280"
          strokeDashoffset={280 - (280 * rpmPercent) / 100}
          strokeLinecap="round"
          transform="rotate(150 95 95)"
        />
        <defs>
          <linearGradient id="rpmGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="65%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
      </svg>

      {/* Speedometer needle */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 4,
          height: 65,
          background: 'linear-gradient(to top, #ef4444, #f97316)',
          transformOrigin: '50% 100%',
          transform: `translate(-50%, -100%) rotate(${needleAngle}deg)`,
          borderRadius: 2,
          boxShadow: '0 0 8px #ef4444',
          transition: 'transform 0.06s linear'
        }}
      />
      {/* Center cap */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: '#38bdf8',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 10px #06b6d4'
        }}
      />

      {/* Digital Speed read-out */}
      <div style={{ marginTop: 22, textAlign: 'center' }}>
        <div style={{ fontSize: '2.6rem', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>
          {absSpeed}
        </div>
        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#06b6d4', letterSpacing: 1.5 }}>
          KM/H
        </div>
      </div>

      {/* Gear indicator */}
      <div
        style={{
          marginTop: 6,
          background: 'rgba(6,182,212,0.2)',
          border: '1px solid #06b6d4',
          padding: '2px 8px',
          borderRadius: 4,
          fontSize: '0.75rem',
          fontWeight: 800,
          color: '#38bdf8'
        }}
      >
        GEAR {gear}
      </div>

      {/* Jet Mode / Boost Badge */}
      {isTransformed && (
        <div
          style={{
            position: 'absolute',
            bottom: -22,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: isBoosting ? '#ef4444' : 'rgba(239,68,68,0.25)',
            border: '1px solid #ef4444',
            padding: '2px 10px',
            borderRadius: 12,
            color: '#ffffff',
            fontSize: '0.7rem',
            fontWeight: 800,
            letterSpacing: 0.5,
            boxShadow: isBoosting ? '0 0 12px #ef4444' : 'none'
          }}
        >
          <Zap size={12} fill="#ffffff" />
          <span>{isBoosting ? 'JET BOOSTING!' : 'JET READY [SHIFT]'}</span>
        </div>
      )}
    </div>
  );
};
