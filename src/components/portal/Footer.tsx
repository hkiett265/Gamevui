'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="portal-footer">
      <div className="portal-footer-inner">
        {/* TOP ROW */}
        <div className="footer-top-row">
          {/* BRAND */}
          <Link href="/" className="brand-logo-link">
            <div className="brand-avatar-box">
              <Image
                src="/images/brand/mascot.jpg"
                alt="Hồ Kiệt Mascot"
                width={44}
                height={44}
                className="brand-avatar-img"
              />
            </div>
            <div className="brand-text-col">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="brand-name" style={{ fontSize: '1.2rem' }}>
                  Hồ Kiệt
                </span>
                <span style={{ color: '#ff2a85', fontWeight: 800 }}>-</span>
                <span className="brand-sub" style={{ fontSize: '0.95rem' }}>
                  GameVui 24h
                </span>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Chơi là vui - Mỗi ngày là một niềm vui!
              </span>
            </div>
          </Link>

          {/* POLICY LINKS */}
          <ul className="footer-nav-links">
            <li>
              <Link href="#about">Giới thiệu</Link>
            </li>
            <li>
              <Link href="#contact">Liên hệ</Link>
            </li>
            <li>
              <Link href="#terms">Điều khoản</Link>
            </li>
            <li>
              <Link href="#privacy">Bảo mật</Link>
            </li>
            <li>
              <Link href="#support">Hỗ trợ</Link>
            </li>
          </ul>

          {/* SOCIAL ICONS */}
          <div className="footer-social-row">
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              title="Facebook"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              title="YouTube"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            {/* TikTok */}
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              title="TikTok"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </a>

            {/* Discord */}
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              title="Discord"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </a>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="footer-bottom-row">
          <span>
            © 2024 Hồ Kiệt - GameVui 24h. Tất cả quyền được bảo lưu.
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            Made with <Heart size={14} fill="#ef4444" color="#ef4444" /> in Vietnam
          </span>
        </div>
      </div>
    </footer>
  );
};
