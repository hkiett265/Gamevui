'use client';

import React from 'react';
import {
  useOceanFishStore,
  CANNON_CONFIGS
} from '@/games/ocean-fish/store';
import {
  Trophy,
  Coins,
  Clock,
  Zap,
  Volume2,
  VolumeX,
  Pause,
  Plus,
  Minus,
  Snowflake,
  Bomb,
  Crosshair
} from 'lucide-react';

interface OceanHUDProps {
  onTriggerBomb: () => void;
}

export const OceanHUD: React.FC<OceanHUDProps> = ({ onTriggerBomb }) => {
  const {
    gameState,
    score,
    coins,
    timeLeft,
    cannonLevel,
    combo,
    multiplier,
    isAutoFiring,
    isMuted,
    freezeActive,
    freezeCooldown,
    freezeDuration,
    bombCharges,
    levelUpCannon,
    levelDownCannon,
    toggleAutoFire,
    toggleSound,
    pauseGame,
    useFreezeSkill,
    useBombSkill
  } = useOceanFishStore();

  if (gameState !== 'PLAYING') return null;

  const cannon = CANNON_CONFIGS[cannonLevel];

  const handleFreeze = () => {
    useFreezeSkill();
  };

  const handleBomb = () => {
    const used = useBombSkill();
    if (used) {
      onTriggerBomb();
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px 20px',
        boxSizing: 'border-box',
        zIndex: 10
      }}
    >
      {/* --- TOP BAR --- */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          pointerEvents: 'auto'
        }}
      >
        {/* Left: Score & Coins */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {/* Coins Badge */}
          <div
            className="hud-badge"
            style={{
              padding: '8px 16px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '2px solid #facc15',
              boxShadow: '0 0 15px rgba(250, 204, 21, 0.3)',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}
          >
            <Coins style={{ width: 22, height: 22, color: '#facc15' }} />
            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#fef08a', letterSpacing: '1px' }}>
                VÀNG ĐẠI DƯƠNG
              </div>
              <div style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'monospace', color: '#ffffff' }}>
                {coins.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Score Badge */}
          <div
            className="hud-badge"
            style={{
              padding: '8px 16px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '2px solid #38bdf8',
              boxShadow: '0 0 15px rgba(56, 189, 248, 0.3)',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}
          >
            <Trophy style={{ width: 22, height: 22, color: '#38bdf8' }} />
            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#bae6fd', letterSpacing: '1px' }}>
                ĐIỂM SỐ
              </div>
              <div style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'monospace', color: '#ffffff' }}>
                {score.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Combo Badge (if active) */}
          {combo > 1 && (
            <div
              style={{
                padding: '6px 14px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #ef4444, #f97316)',
                color: '#ffffff',
                fontWeight: 900,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 0 15px rgba(239, 68, 68, 0.5)',
                animation: 'pulse 1s infinite'
              }}
            >
              <Zap style={{ width: 16, height: 16 }} />
              <span>COMBO x{combo} ({multiplier}x)</span>
            </div>
          )}
        </div>

        {/* Center: Timer Countdown */}
        <div
          style={{
            padding: '8px 20px',
            borderRadius: 9999,
            background: timeLeft <= 15 ? 'rgba(239, 68, 68, 0.9)' : 'rgba(15, 23, 42, 0.85)',
            border: `2px solid ${timeLeft <= 15 ? '#f87171' : '#38bdf8'}`,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
          }}
        >
          <Clock style={{ width: 18, height: 18, color: timeLeft <= 15 ? '#ffffff' : '#38bdf8' }} />
          <span
            style={{
              fontSize: '20px',
              fontWeight: 900,
              fontFamily: 'monospace',
              color: '#ffffff',
              letterSpacing: '1px'
            }}
          >
            {Math.floor(timeLeft / 60)}:{Math.floor(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>

        {/* Right: Sound & Pause Buttons */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onClick={toggleSound}
            className="hud-badge"
            style={{
              width: 44,
              height: 44,
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 12,
              cursor: 'pointer',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
          >
            {isMuted ? (
              <VolumeX style={{ width: 20, height: 20, color: '#f87171' }} />
            ) : (
              <Volume2 style={{ width: 20, height: 20, color: '#38bdf8' }} />
            )}
          </button>

          <button
            onClick={pauseGame}
            className="hud-badge"
            style={{
              width: 44,
              height: 44,
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 12,
              cursor: 'pointer',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
            title="Tạm dừng (ESC)"
          >
            <Pause style={{ width: 20, height: 20, color: '#ffffff' }} />
          </button>
        </div>
      </div>

      {/* --- RIGHT SIDE: SKILL BAR --- */}
      <div
        style={{
          position: 'absolute',
          right: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          pointerEvents: 'auto'
        }}
      >
        {/* Freeze Skill Button */}
        <button
          onClick={handleFreeze}
          disabled={freezeCooldown > 0 || freezeActive}
          style={{
            width: 60,
            height: 60,
            borderRadius: 16,
            background: freezeActive
              ? 'linear-gradient(135deg, #0284c7, #38bdf8)'
              : freezeCooldown > 0
              ? 'rgba(30, 41, 59, 0.8)'
              : 'rgba(15, 23, 42, 0.9)',
            border: `2px solid ${freezeActive ? '#ffffff' : freezeCooldown > 0 ? '#475569' : '#38bdf8'}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: freezeCooldown > 0 || freezeActive ? 'not-allowed' : 'pointer',
            boxShadow: freezeActive ? '0 0 20px rgba(56, 189, 248, 0.8)' : '0 4px 15px rgba(0,0,0,0.5)',
            position: 'relative'
          }}
          title="Đóng băng đại dương (6s)"
        >
          <Snowflake style={{ width: 26, height: 26, color: freezeActive ? '#ffffff' : '#38bdf8' }} />
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#e0f2fe', marginTop: 2 }}>
            {freezeCooldown > 0 ? `${Math.ceil(freezeCooldown)}s` : 'BĂNG'}
          </span>
        </button>

        {/* Triton Bomb Skill Button */}
        <button
          onClick={handleBomb}
          disabled={bombCharges <= 0}
          style={{
            width: 60,
            height: 60,
            borderRadius: 16,
            background: bombCharges > 0
              ? 'linear-gradient(135deg, #991b1b, #ef4444)'
              : 'rgba(30, 41, 59, 0.8)',
            border: `2px solid ${bombCharges > 0 ? '#fca5a5' : '#475569'}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: bombCharges <= 0 ? 'not-allowed' : 'pointer',
            boxShadow: bombCharges > 0 ? '0 0 20px rgba(239, 68, 68, 0.7)' : '0 4px 15px rgba(0,0,0,0.5)',
            position: 'relative'
          }}
          title="Bom Nổ Toàn Đại Dương"
        >
          <Bomb style={{ width: 26, height: 26, color: '#ffffff' }} />
          <span style={{ fontSize: '10px', fontWeight: 900, color: '#ffffff', marginTop: 2 }}>
            x{bombCharges}
          </span>
        </button>
      </div>

      {/* --- BOTTOM DOCK: CANNON CONTROLS --- */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 16,
          width: '100%',
          pointerEvents: 'auto',
          marginBottom: 6
        }}
      >
        {/* Cannon Level Selector Dock */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '8px 18px',
            borderRadius: 20,
            background: 'rgba(15, 23, 42, 0.9)',
            border: `2px solid ${cannon.color}`,
            boxShadow: `0 0 20px ${cannon.glowColor}`
          }}
        >
          {/* Decrease Level */}
          <button
            onClick={levelDownCannon}
            disabled={cannonLevel <= 1}
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: cannonLevel <= 1 ? 'not-allowed' : 'pointer',
              opacity: cannonLevel <= 1 ? 0.4 : 1
            }}
            title="Giảm cấp pháo (-)"
          >
            <Minus style={{ width: 18, height: 18 }} />
          </button>

          {/* Current Cannon Info */}
          <div style={{ textAlign: 'center', minWidth: 160 }}>
            <div style={{ fontSize: '14px', fontWeight: 900, color: cannon.color, letterSpacing: '0.5px' }}>
              LV.{cannon.level} {cannon.name}
            </div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#cbd5e1' }}>
              Tiêu hao: <span style={{ color: '#facc15', fontWeight: 900 }}>{cannon.cost} Vàng</span> / phát
            </div>
          </div>

          {/* Increase Level */}
          <button
            onClick={levelUpCannon}
            disabled={cannonLevel >= 5}
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: cannonLevel >= 5 ? 'not-allowed' : 'pointer',
              opacity: cannonLevel >= 5 ? 0.4 : 1
            }}
            title="Tăng cấp pháo (+)"
          >
            <Plus style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Auto Fire Switch */}
        <button
          onClick={toggleAutoFire}
          style={{
            padding: '10px 18px',
            borderRadius: 16,
            background: isAutoFiring
              ? 'linear-gradient(135deg, #16a34a, #22c55e)'
              : 'rgba(15, 23, 42, 0.85)',
            border: `2px solid ${isAutoFiring ? '#4ade80' : 'rgba(255,255,255,0.2)'}`,
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontWeight: 800,
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: isAutoFiring ? '0 0 15px rgba(34, 197, 94, 0.6)' : 'none'
          }}
          title="Tự động nhắm và bắn liên tục"
        >
          <Crosshair style={{ width: 18, height: 18, color: isAutoFiring ? '#ffffff' : '#38bdf8' }} />
          <span>{isAutoFiring ? 'ĐANG TỰ ĐỘNG BẮN' : 'TỰ ĐỘNG BẮN'}</span>
        </button>
      </div>
    </div>
  );
};
