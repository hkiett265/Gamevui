'use client';

import React from 'react';
import Link from 'next/link';
import { useJetJetStore } from '@/games/jetjet/store';
import { Speedometer } from './Speedometer';
import { ChaseHUD } from './ChaseHUD';
import { SettingsModal } from './SettingsModal';
import { Volume2, VolumeX, ArrowLeft, Navigation, Flag, Settings as SettingsIcon } from 'lucide-react';
import { jetJetAudio } from '../audio/jetJetAudio';

export const JetJetHUD: React.FC = () => {
  const {
    gameState,
    missionTitle,
    missionDesc,
    distanceToWaypoint,
    waypointLabel,
    interactionPrompt,
    interactionKey,
    notification,
    subtitle,
    isMuted,
    toggleMute,
    setSettingsOpen,
    isRiding
  } = useJetJetStore();

  if (gameState === 'MENU') return null;

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
        pointerEvents: 'none',
        zIndex: 40,
        fontFamily: 'var(--font-heading), system-ui, sans-serif'
      }}
    >
      {/* TOP HEADER BAR */}
      <header
        style={{
          position: 'absolute',
          top: 16,
          left: 20,
          right: 20,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          pointerEvents: 'auto'
        }}
      >
        {/* MISSION OBJECTIVE BOX */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.92)',
            border: gameState === 'CHASE' ? '2px solid #ef4444' : '2px solid rgba(234, 179, 8, 0.8)',
            borderRadius: 14,
            padding: '12px 18px',
            backdropFilter: 'blur(8px)',
            maxWidth: 380,
            boxShadow: '0 4px 20px rgba(0,0,0,0.6)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Flag size={18} color={gameState === 'CHASE' ? '#ef4444' : '#eab308'} />
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 900,
                color: gameState === 'CHASE' ? '#ef4444' : '#eab308',
                letterSpacing: 1
              }}
            >
              {missionTitle}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.4, fontWeight: 500 }}>
            {missionDesc}
          </p>
        </div>

        {/* TOP RIGHT CONTROLS: SETTINGS, MUTE & PORTAL */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            style={{
              background: 'rgba(15,23,42,0.85)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 10,
              padding: '8px 12px',
              color: '#38bdf8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Cài đặt âm thanh"
          >
            <SettingsIcon size={18} />
          </button>

          <button
            type="button"
            onClick={handleMuteClick}
            style={{
              background: 'rgba(15,23,42,0.85)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 10,
              padding: '8px 12px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX size={18} color="#ef4444" /> : <Volume2 size={18} color="#22c55e" />}
          </button>

          <Link
            href="/"
            prefetch={true}
            style={{
              background: 'linear-gradient(135deg, #0284c7, #0369a1)',
              border: 'none',
              borderRadius: 10,
              padding: '8px 16px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(2,132,199,0.4)'
            }}
          >
            <ArrowLeft size={16} />
            <span>Về Portal</span>
          </Link>
        </div>
      </header>

      {/* CHASE HUD IN MISSION 02 */}
      <ChaseHUD />

      {/* 3D WAYPOINT COMPASS TOWARDS TARGET */}
      {distanceToWaypoint > 10 && (
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: gameState === 'CHASE' ? 'rgba(34,197,94,0.95)' : 'rgba(239, 68, 68, 0.92)',
            border: '2px solid #ffffff',
            borderRadius: 24,
            padding: '6px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 0 18px rgba(0,0,0,0.5)'
          }}
        >
          <Navigation size={16} color="#ffffff" style={{ transform: 'rotate(45deg)' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#ffffff', letterSpacing: 0.5 }}>
            {waypointLabel} • {distanceToWaypoint}M
          </span>
        </div>
      )}

      {/* CONTEXTUAL INTERACTION PROMPT */}
      {interactionPrompt && (
        <button
          type="button"
          onClick={() => {
            if (interactionKey === 'E') {
              const { isRiding, hasBottle, isDrinking, distanceToShop, buyBottle, startDrinking } = useJetJetStore.getState();
              if (isRiding || isDrinking) return;
              if (distanceToShop < 10.0 || hasBottle) {
                if (!hasBottle) {
                  jetJetAudio.playBottleOpen();
                  buyBottle();
                  setTimeout(() => {
                    jetJetAudio.playGulp();
                    startDrinking();
                  }, 200);
                } else {
                  jetJetAudio.playGulp();
                  startDrinking();
                }
              }
            } else if (interactionKey === 'F') {
              const { isRiding, mountBike, dismountBike } = useJetJetStore.getState();
              if (isRiding) {
                jetJetAudio.stopEngine();
                jetJetAudio.playDismount();
                dismountBike();
              } else {
                jetJetAudio.playMount();
                jetJetAudio.startEngine();
                mountBike();
              }
            }
          }}
          style={{
            position: 'absolute',
            bottom: isRiding ? 140 : 60,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98))',
            border: '2px solid #38bdf8',
            borderRadius: 30,
            padding: '12px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            boxShadow: '0 0 25px rgba(56,189,248,0.6)',
            cursor: 'pointer',
            pointerEvents: 'auto',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease'
          }}
        >
          <div
            style={{
              background: '#38bdf8',
              color: '#0f172a',
              width: 34,
              height: 34,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.15rem'
            }}
          >
            {interactionKey || 'E'}
          </div>
          <span style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: 800 }}>
            {interactionPrompt}
          </span>
        </button>
      )}

      {/* NPC COMEDIC SUBTITLE */}
      {subtitle && (
        <div
          style={{
            position: 'absolute',
            bottom: isRiding ? 220 : 130,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.88)',
            border: '2px solid #f59e0b',
            padding: '8px 24px',
            borderRadius: 20,
            fontWeight: 900,
            fontSize: '1rem',
            color: '#fef08a',
            boxShadow: '0 4px 18px rgba(0,0,0,0.8)',
            textAlign: 'center',
            maxWidth: 550,
            letterSpacing: 0.5
          }}
        >
          {subtitle}
        </div>
      )}

      {/* ON-SCREEN TOAST NOTIFICATION */}
      {notification && (
        <div
          style={{
            position: 'absolute',
            bottom: isRiding ? 270 : 180,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(234, 179, 8, 0.95)',
            color: '#451a03',
            padding: '8px 22px',
            borderRadius: 20,
            fontWeight: 800,
            fontSize: '0.88rem',
            boxShadow: '0 4px 15px rgba(234,179,8,0.5)'
          }}
        >
          {notification}
        </div>
      )}

      {/* SPEEDOMETER IN BOTTOM-RIGHT */}
      <Speedometer />

      {/* SETTINGS MODAL */}
      <SettingsModal />
    </div>
  );
};
