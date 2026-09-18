'use client';

import React, { useEffect, useState } from 'react';
import { useGameStore } from '@/games/chicken-mayhem/store';
import { soundSystem } from '@/games/chicken-mayhem/audio/soundSystem';

export const CountdownOverlay: React.FC = () => {
  const { gameState, startGame } = useGameStore();
  const [step, setStep] = useState<'READY' | '3' | '2' | '1' | 'GO'>('READY');

  useEffect(() => {
    if (gameState !== 'COUNTDOWN') {
      setStep('READY');
      return;
    }

    // Step 0: READY (0ms)
    setStep('READY');
    soundSystem.playCountdown(false);

    // Step 1: 3 (700ms)
    const t1 = setTimeout(() => {
      setStep('3');
      soundSystem.playCountdown(false);
    }, 700);

    // Step 2: 2 (1400ms)
    const t2 = setTimeout(() => {
      setStep('2');
      soundSystem.playCountdown(false);
    }, 1400);

    // Step 3: 1 (2100ms)
    const t3 = setTimeout(() => {
      setStep('1');
      soundSystem.playCountdown(false);
    }, 2100);

    // Step 4: GO! (2800ms)
    const t4 = setTimeout(() => {
      setStep('GO');
      soundSystem.playCountdown(true);
    }, 2800);

    // Step 5: Start Game (3400ms)
    const t5 = setTimeout(() => {
      startGame();
    }, 3400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [gameState, startGame]);

  if (gameState !== 'COUNTDOWN') return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        userSelect: 'none',
        background: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(2px)'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div
          key={step}
          className="text-8xl sm:text-9xl md:text-[12rem] font-black tracking-tight drop-shadow-2xl animate-bounce"
          style={{
            color: step === 'GO' ? '#22c55e' : step === 'READY' ? '#f59e0b' : '#facc15',
            textShadow: '0 8px 0 #451a03, 0 16px 30px rgba(0,0,0,0.8)',
            WebkitTextStroke: '4px #451a03'
          }}
        >
          {step}
        </div>
        {step === 'READY' && (
          <p className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg tracking-widest uppercase mt-4 animate-pulse">
            GET YOUR SHOTGUN READY!
          </p>
        )}
      </div>
    </div>
  );
};
