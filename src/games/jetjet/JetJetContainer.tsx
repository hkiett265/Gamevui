'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { JetJetHUD } from './ui/JetJetHUD';
import { MainMenu } from './ui/MainMenu';
import { TransformationBanner } from './ui/TransformationBanner';
import { jetJetAudio } from './audio/jetJetAudio';
import { useJetJetStore } from '@/games/jetjet/store';

// Dynamically import Canvas with SSR disabled
const JetJetCanvas = dynamic(
  () => import('./JetJetCanvas').then((mod) => mod.JetJetCanvas),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          userSelect: 'none'
        }}
      >
        <div style={{ fontSize: '4.5rem', marginBottom: 16 }}>🏍️</div>
        <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#eab308', letterSpacing: 1.5 }}>
          ĐANG TẢI JET JET MIỀN TÂY 3D...
        </div>
        <div style={{ fontSize: '0.9rem', color: '#38bdf8', marginTop: 8 }}>
          Khởi tạo xe Exciter & đường làng sông nước
        </div>
      </div>
    )
  }
);

export const JetJetContainer: React.FC = () => {
  // Cleanup audio & reset on unmount
  useEffect(() => {
    return () => {
      try {
        jetJetAudio.cleanup();
        useJetJetStore.getState().resetGame();
      } catch {}
    };
  }, []);

  return (
    <main
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      {/* 3D WEBGL VIEWPORT */}
      <JetJetCanvas />

      {/* 2D UI & HUD LAYERS */}
      <JetJetHUD />
      <MainMenu />
      <TransformationBanner />
    </main>
  );
};
