'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { RacingHUD } from './ui/RacingHUD';
import { RacingMainMenu } from './ui/RacingMainMenu';
import { RacingGameOverModal } from './ui/RacingGameOverModal';
import { nitroAudio } from './audio/nitroAudio';
import { useNitroRacerStore } from '@/games/racing/store';

// Dynamically import Canvas with SSR disabled
const NitroCanvas = dynamic(
  () => import('./NitroCanvas').then((mod) => mod.NitroCanvas),
  {
    ssr: false,
    loading: () => (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', background: '#050510', color: '#00ffff'
      }}>
        <div style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: 5 }} className="animate-pulse">
          LOADING ENGINE...
        </div>
      </div>
    )
  }
);

export const NitroContainer: React.FC = () => {
  useEffect(() => {
    // Game Loop Timer
    let lastTime = performance.now();
    let animationFrameId: number;
    
    const loop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      
      const store = useNitroRacerStore.getState();
      if (store.gameStatus === 'playing') {
        store.tickTime(delta);
      }
      
      animationFrameId = requestAnimationFrame(loop);
    };
    
    animationFrameId = requestAnimationFrame(loop);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      try {
        nitroAudio.cleanup();
        useNitroRacerStore.getState().resetGame();
      } catch {}
    };
  }, []);

  return (
    <main style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', userSelect: 'none' }}>
      <NitroCanvas />
      <RacingHUD />
      <RacingMainMenu />
      <RacingGameOverModal />
    </main>
  );
};
