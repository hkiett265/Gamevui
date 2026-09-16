'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useGameStore } from '@/stores/useGameStore';

export const Crosshair: React.FC = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const { gameState, hitMarkerActive, hitMarkerKey, combo, multiplier, isReloading, gunRecoil, isPointerLocked } =
    useGameStore();

  const [showHitMarker, setShowHitMarker] = useState(false);

  // Follow mouse when pointer is not locked
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  // Hit marker trigger
  useEffect(() => {
    if (hitMarkerActive) {
      setShowHitMarker(true);
      const timer = setTimeout(() => setShowHitMarker(false), 140);
      return () => clearTimeout(timer);
    }
  }, [hitMarkerActive, hitMarkerKey]);

  if (gameState !== 'PLAYING' && gameState !== 'COUNTDOWN') return null;

  const isFiring = gunRecoil > 0.4;
  const spreadSize = isFiring ? 46 : 28;
  const crosshairLeft = isPointerLocked ? '50%' : `${pos.x}px`;
  const crosshairTop = isPointerLocked ? '50%' : `${pos.y}px`;

  return (
    <div
      style={{
        position: 'fixed',
        left: crosshairLeft,
        top: crosshairTop,
        transform: 'translate(-50%, -50%)',
        zIndex: 50,
        pointerEvents: 'none'
      }}
    >
      {/* 1. Crosshair Outer Ring / Pips */}
      <div
        style={{
          position: 'relative',
          width: `${spreadSize}px`,
          height: `${spreadSize}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'width 0.08s ease, height 0.08s ease'
        }}
      >
        {/* Center Dot */}
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#ef4444',
            border: '1.5px solid #ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
          }}
        />

        {/* 4 Reticle Ticks */}
        {/* Top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            width: 3,
            height: 8,
            backgroundColor: '#ffffff',
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.6)'
          }}
        />
        {/* Bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: 3,
            height: 8,
            backgroundColor: '#ffffff',
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.6)'
          }}
        />
        {/* Left */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: 8,
            height: 3,
            backgroundColor: '#ffffff',
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.6)'
          }}
        />
        {/* Right */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            width: 8,
            height: 3,
            backgroundColor: '#ffffff',
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.6)'
          }}
        />
      </div>

      {/* 2. Hit Marker 'X' (flashes red/white) */}
      {showHitMarker && (
        <div
          className="hit-marker-anim"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg width="38" height="38" viewBox="0 0 36 36" fill="none">
            <line x1="8" y1="8" x2="28" y2="28" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
            <line x1="28" y1="8" x2="8" y2="28" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
            <line x1="10" y1="10" x2="26" y2="26" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <line x1="26" y1="10" x2="10" y2="26" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* 3. Combo Badge next to reticle */}
      {combo >= 2 && (
        <div
          style={{
            position: 'absolute',
            left: '26px',
            top: '-20px',
            padding: '2px 8px',
            borderRadius: '9999px',
            fontWeight: 900,
            fontSize: '11px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: '#facc15',
            backgroundColor: 'rgba(0,0,0,0.75)',
            border: '1px solid rgba(250, 204, 21, 0.7)',
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            whiteSpace: 'nowrap',
            textShadow: '0 2px 4px rgba(0,0,0,0.8)'
          }}
        >
          x{multiplier} COMBO ({combo})
        </div>
      )}

      {/* Reloading Indicator */}
      {isReloading && (
        <div
          style={{
            position: 'absolute',
            top: '28px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '11px',
            fontWeight: 900,
            letterSpacing: '2px',
            color: '#fbbf24',
            textTransform: 'uppercase',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '4px 10px',
            borderRadius: '6px',
            border: '1px solid rgba(251, 191, 36, 0.4)',
            whiteSpace: 'nowrap'
          }}
        >
          RELOADING...
        </div>
      )}
    </div>
  );
};
