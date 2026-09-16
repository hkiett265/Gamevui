'use client';

import React from 'react';
import Image from 'next/image';
import { Award, Heart, Gamepad2 } from 'lucide-react';

export const RightSidebar: React.FC = () => {
  return (
    <aside className="portal-right-sidebar">
      {/* WELCOME PANEL */}
      <div className="right-sidebar-panel">
        <div className="panel-avatar-wrap">
          <Image
            src="/images/brand/mascot.jpg"
            alt="Hồ Kiệt Mascot"
            width={76}
            height={76}
            className="panel-avatar-img"
          />
        </div>

        <span className="welcome-sub">Chào mừng đến với</span>
        <h3 className="welcome-brand">GameVui 24h</h3>
        <p className="welcome-desc">
          Cùng Hồ Kiệt khám phá thế giới game bất tận!
        </p>

        <div className="welcome-actions-col">
          <button
            className="btn-sidebar-login"
            onClick={() => alert('Đăng nhập tài khoản GameVui 24h')}
          >
            Đăng nhập
          </button>
          <button
            className="btn-sidebar-register"
            onClick={() => alert('Đăng ký tài khoản miễn phí')}
          >
            Đăng ký miễn phí
          </button>
        </div>
      </div>

      {/* STATS PANEL */}
      <div className="stats-panel">
        <div className="stat-item-row">
          <div className="stat-icon-circle" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <Award size={20} />
          </div>
          <div className="stat-text-col">
            <span className="stat-number">1000+</span>
            <span className="stat-label">Game hấp dẫn</span>
          </div>
        </div>

        <div className="stat-item-row">
          <div className="stat-icon-circle" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <Heart size={20} fill="#34d399" />
          </div>
          <div className="stat-text-col">
            <span className="stat-number">100%</span>
            <span className="stat-label">Miễn phí</span>
          </div>
        </div>

        <div className="stat-item-row">
          <div className="stat-icon-circle" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' }}>
            <Gamepad2 size={20} />
          </div>
          <div className="stat-text-col">
            <span className="stat-number">Chơi ngay</span>
            <span className="stat-label">Không cần cài đặt</span>
          </div>
        </div>
      </div>

      {/* LIVE LEADERBOARD FROM MYSQL */}
      <LeaderboardWidget />
    </aside>
  );
};

const LeaderboardWidget: React.FC = () => {
  const [entries, setEntries] = React.useState<Array<{ id: string; playerName: string; score: number }>>([]);

  React.useEffect(() => {
    fetch('/api/leaderboard?slug=ban-ga-3d&limit=3')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.entries)) {
          setEntries(data.entries);
        }
      })
      .catch(() => {});
  }, []);

  if (entries.length === 0) return null;

  return (
    <div className="stats-panel" style={{ marginTop: '14px', borderTop: '2px solid var(--pink)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <span style={{ fontSize: '1.1rem' }}>🏆</span>
        <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--yellow)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Top Bắn Gà 3D (Live)
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {entries.map((item, idx) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '6px 10px',
              borderRadius: '8px',
              border: idx === 0 ? '1px solid rgba(250, 204, 21, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
              <span
                style={{
                  fontWeight: 900,
                  fontSize: '0.8rem',
                  color: idx === 0 ? '#facc15' : idx === 1 ? '#94a3b8' : '#cd7f32',
                  width: '18px'
                }}
              >
                #{idx + 1}
              </span>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '90px' }}>
                {item.playerName}
              </span>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--cyan)' }}>
              {item.score.toLocaleString()}đ
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
