'use client';

import React, { useEffect, useRef } from 'react';
import { OceanEngine } from '@/games/ocean-fish/engine/OceanEngine';
import { useOceanFishStore } from '@/games/ocean-fish/store';
import { OceanHUD } from './ui/OceanHUD';
import { OceanMainMenu } from './ui/OceanMainMenu';
import { OceanPauseModal } from './ui/OceanPauseModal';
import { OceanGameOverModal } from './ui/OceanGameOverModal';

export const OceanFishContainer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<OceanEngine | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const {
    gameState,
    levelUpCannon,
    levelDownCannon,
    setCannonLevel,
    useFreezeSkill,
    useBombSkill
  } = useOceanFishStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new OceanEngine(canvas);
    engineRef.current = engine;
    engine.start();

    const handleResize = () => {
      engine.handleResize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.stop();
      engineRef.current = null;
    };
  }, []);

  // Handle pointer interaction (Aiming & Shooting)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (engineRef.current && useOceanFishStore.getState().gameState === 'PLAYING') {
        engineRef.current.setAim(e.clientX, e.clientY);
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      // Ignore if clicking on interactive HUD buttons
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'BUTTON' || target.closest('button'))) {
        return;
      }

      if (engineRef.current && useOceanFishStore.getState().gameState === 'PLAYING') {
        engineRef.current.setAim(e.clientX, e.clientY);
        const rect = canvas.getBoundingClientRect();
        engineRef.current.shoot(e.clientX - rect.left, e.clientY - rect.top);
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerdown', handlePointerDown);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  // Keyboard Shortcuts (Space / +/- / Numbers 1-5 / F for Freeze / B for Bomb)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = useOceanFishStore.getState();
      if (state.gameState !== 'PLAYING') return;

      if (e.code === 'Space') {
        e.preventDefault();
        levelUpCannon();
      } else if (e.key === '+' || e.key === '=') {
        levelUpCannon();
      } else if (e.key === '-' || e.key === '_') {
        levelDownCannon();
      } else if (e.key >= '1' && e.key <= '5') {
        setCannonLevel(parseInt(e.key, 10));
      } else if (e.key === 'f' || e.key === 'F') {
        useFreezeSkill();
      } else if (e.key === 'b' || e.key === 'B') {
        const used = useBombSkill();
        if (used && engineRef.current) {
          engineRef.current.triggerBomb();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [levelUpCannon, levelDownCannon, setCannonLevel, useFreezeSkill, useBombSkill]);

  const handleTriggerBomb = () => {
    if (engineRef.current) {
      engineRef.current.triggerBomb();
    }
  };

  return (
    <main
      ref={containerRef}
      className="game-viewport"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        userSelect: 'none',
        background: '#0c2240',
        cursor: gameState === 'PLAYING' ? 'crosshair' : 'default'
      }}
    >
      {/* 2D HTML5 Ocean Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          zIndex: 1,
          cursor: gameState === 'PLAYING' ? 'crosshair' : 'default'
        }}
      />

      {/* Floating 2D UI Layers */}
      <OceanHUD onTriggerBomb={handleTriggerBomb} />
      <OceanMainMenu />
      <OceanPauseModal />
      <OceanGameOverModal />
    </main>
  );
};
