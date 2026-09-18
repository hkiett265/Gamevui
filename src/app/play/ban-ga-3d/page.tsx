'use client';

import dynamic from 'next/dynamic';
import { PlayPageShell } from '@/components/play/PlayPageShell';
import { useGameStore } from '@/games/chicken-mayhem/store';
import { soundSystem } from '@/games/chicken-mayhem/audio/soundSystem';

const ChickenMayhemContainer = dynamic(
  () => import('@/games/chicken-mayhem/GameContainer').then((mod) => mod.GameContainer),
  {
    ssr: false,
    loading: () => (
      <div className="empty-state-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: 16 }}>🐔</div>
        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--yellow)', fontFamily: 'var(--font-heading)' }}>
          ĐANG TẢI BẮN GÀ 3D...
        </div>
      </div>
    )
  }
);

export default function ChickenMayhemPlayPage() {
  return (
    <PlayPageShell
      slug="ban-ga-3d"
      GameContainer={ChickenMayhemContainer}
      onUnmount={() => {
        soundSystem.stopMusic();
        useGameStore.getState().resetGame();
      }}
    />
  );
}
