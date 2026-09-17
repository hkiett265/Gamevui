'use client';

import dynamic from 'next/dynamic';
import { PlayPageShell } from '@/components/play/PlayPageShell';

const NitroContainer = dynamic(
  () => import('@/games/racing/NitroContainer').then((mod) => mod.NitroContainer),
  {
    ssr: false,
    loading: () => (
      <div className="empty-state-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#050510' }}>
        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#00ffff', fontFamily: 'var(--font-heading)' }} className="animate-pulse">
          INITIALIZING CYBER ENGINE...
        </div>
      </div>
    )
  }
);

export default function DuaXeSieuTocPlayPage() {
  return <PlayPageShell slug="dua-xe-sieu-toc" GameContainer={NitroContainer} subtitleColor="#00ffff" />;
}
