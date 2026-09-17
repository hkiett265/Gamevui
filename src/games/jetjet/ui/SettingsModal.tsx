'use client';

import React from 'react';
import { useJetJetStore } from '@/games/jetjet/store';
import { Volume2, VolumeX, X, Sliders } from 'lucide-react';
import { jetJetAudio } from '../audio/jetJetAudio';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setSettingsOpen,
    isMuted,
    toggleMute,
    masterVolume,
    musicVolume,
    sfxVolume,
    setAudioSettings
  } = useJetJetStore();

  if (!isSettingsOpen) return null;

  const handleMasterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setAudioSettings(val, musicVolume, sfxVolume);
    jetJetAudio.setVolumes(val, musicVolume, sfxVolume);
  };

  const handleMusicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setAudioSettings(masterVolume, val, sfxVolume);
    jetJetAudio.setVolumes(masterVolume, val, sfxVolume);
  };

  const handleSfxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setAudioSettings(masterVolume, musicVolume, val);
    jetJetAudio.setVolumes(masterVolume, musicVolume, val);
  };

  const handleMuteClick = () => {
    const muted = toggleMute();
    jetJetAudio.setMuted(muted);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        userSelect: 'none',
        fontFamily: 'var(--font-heading), system-ui, sans-serif'
      }}
    >
      <div
        style={{
          background: '#0f172a',
          border: '2px solid #06b6d4',
          borderRadius: 20,
          padding: '28px 32px',
          width: 440,
          boxShadow: '0 0 35px rgba(6,182,212,0.5)',
          color: '#ffffff',
          position: 'relative'
        }}
      >
        <button
          type="button"
          onClick={() => setSettingsOpen(false)}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer'
          }}
        >
          <X size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Sliders size={24} color="#eab308" />
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#eab308' }}>
            CÀI ĐẶT ÂM THANH
          </h2>
        </div>

        {/* MUTE BUTTON */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Âm thanh:</span>
          <button
            type="button"
            onClick={handleMuteClick}
            style={{
              background: isMuted ? '#ef4444' : '#22c55e',
              border: 'none',
              borderRadius: 10,
              padding: '8px 18px',
              color: '#ffffff',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            <span>{isMuted ? 'Đang Tắt' : 'Đang Bật'}</span>
          </button>
        </div>

        {/* MASTER VOLUME SLIDER */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.9rem', color: '#cbd5e1' }}>
            <span>Tổng (Master):</span>
            <span>{Math.round(masterVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={masterVolume}
            onChange={handleMasterChange}
            style={{ width: '100%', accentColor: '#06b6d4', cursor: 'pointer' }}
          />
        </div>

        {/* MUSIC VOLUME SLIDER */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.9rem', color: '#cbd5e1' }}>
            <span>Nhạc nền (Music):</span>
            <span>{Math.round(musicVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={musicVolume}
            onChange={handleMusicChange}
            style={{ width: '100%', accentColor: '#eab308', cursor: 'pointer' }}
          />
        </div>

        {/* SFX VOLUME SLIDER */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.9rem', color: '#cbd5e1' }}>
            <span>Hiệu ứng / Pô xe (SFX):</span>
            <span>{Math.round(sfxVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={sfxVolume}
            onChange={handleSfxChange}
            style={{ width: '100%', accentColor: '#ef4444', cursor: 'pointer' }}
          />
        </div>

        <button
          type="button"
          onClick={() => setSettingsOpen(false)}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #0284c7, #0369a1)',
            border: 'none',
            borderRadius: 12,
            padding: '12px',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          LƯU & ĐÓNG
        </button>
      </div>
    </div>
  );
};
