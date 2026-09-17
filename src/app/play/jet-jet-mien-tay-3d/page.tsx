'use client';

import dynamic from 'next/dynamic';
import { PlayPageShell } from '@/components/play/PlayPageShell';

const JetJetContainer = dynamic(
  () => import('@/games/jetjet/JetJetContainer').then((mod) => mod.JetJetContainer),
  {
    ssr: false,
    loading: () => (
      <div className="empty-state-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '4.5rem', marginBottom: 16 }}>🏍️</div>
        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--yellow)', fontFamily: 'var(--font-heading)' }}>
          ĐANG TẢI JET JET MIỀN TÂY 3D...
        </div>
      </div>
    )
  }
);

export default function JetJetPlayPage() {
  return <PlayPageShell slug="jet-jet-mien-tay-3d" GameContainer={JetJetContainer} />;
}
