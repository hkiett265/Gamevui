'use client';

import dynamic from 'next/dynamic';
import { PlayPageShell } from '@/components/play/PlayPageShell';
import { useOceanFishStore } from '@/games/ocean-fish/store';

const OceanFishContainer = dynamic(
  () => import('@/games/ocean-fish/OceanFishContainer').then((mod) => mod.OceanFishContainer),
  {
    ssr: false,
    loading: () => (
      <div className="empty-state-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: 16 }}>🐠</div>
        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--cyan)', fontFamily: 'var(--font-heading)' }}>
          ĐANG TẢI BẮN CÁ ĐẠI DƯƠNG...
        </div>
      </div>
    )
  }
);

export default function OceanFishPlayPage() {
  return (
    <PlayPageShell
      slug="ban-ca-dai-duong"
      GameContainer={OceanFishContainer}
      onUnmount={() => useOceanFishStore.getState().resetGame()}
    />
  );
}
