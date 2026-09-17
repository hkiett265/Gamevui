'use client';

import React, { useEffect } from 'react';
import { Flame, Trophy, Play, Settings, X, Camera } from 'lucide-react';
import { useNitroRacerStore } from '@/games/racing/store';

export const RacingHUD: React.FC = () => {
  const store = useNitroRacerStore();
  
  if (store.gameStatus !== 'playing') return null;
  
  const speed = Math.floor(store.speed);
  const rpmPercent = (store.rpm / 9000) * 100;
  const isNitro = store.isNitroActive;

  // Handle keyboard inputs for nitro/drift UI feedback (mobile controls dispatch direct events, but here we just render state)
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 10, display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between', padding: '20px'
    }}>
      {/* Top Bar: Score & Timer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ 
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
          padding: '12px 24px', borderRadius: '12px', border: '1px solid rgba(0,255,255,0.3)',
          boxShadow: '0 0 15px rgba(0,255,255,0.2)'
        }}>
          <div style={{ fontSize: '0.9rem', color: '#00ffff', fontWeight: 600, letterSpacing: 2 }}>ĐIỂM SỐ</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', textShadow: '0 0 10px rgba(255,255,255,0.5)' }}>
              {Math.floor(store.score).toLocaleString()}
            </span>
            {store.multiplier > 1 && (
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ff00ff', textShadow: '0 0 10px #ff00ff' }}>
                x{store.multiplier}
              </span>
            )}
          </div>
        </div>

        <div style={{ 
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
          padding: '12px 24px', borderRadius: '12px', border: '1px solid rgba(255,0,255,0.3)',
          textAlign: 'right'
        }}>
          <div style={{ fontSize: '0.9rem', color: '#ff00ff', fontWeight: 600, letterSpacing: 2 }}>THỜI GIAN</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: store.checkpointTime < 10 ? '#ff0000' : '#fff' }}>
            {Math.max(0, Math.ceil(store.checkpointTime))}s
          </div>
        </div>
      </div>
      
      {/* Center Messages */}
      <div style={{ alignSelf: 'center', textAlign: 'center', marginTop: '10%' }}>
        {store.multiplier > 1 && (
          <div className="animate-bounce" style={{ 
            fontSize: '3rem', fontWeight: 900, color: '#00ffff', 
            textShadow: '0 0 20px #00ffff', letterSpacing: 2, marginBottom: 10 
          }}>
            CLOSE CALL!
          </div>
        )}
        {store.isDrifting && store.speed > 100 && (
          <div className="animate-pulse" style={{ 
            fontSize: '2rem', fontWeight: 800, color: '#ffcc00', 
            textShadow: '0 0 15px #ffcc00', letterSpacing: 1 
          }}>
            DRIFTING...
          </div>
        )}
      </div>

      {/* Bottom Dashboard */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        
        {/* Left: Mobile Steering (Visible on small screens, hidden on desktop usually, but we'll show just minimal UI) */}
        <div style={{ pointerEvents: 'auto', display: 'flex', gap: 10 }}>
          <button 
            onClick={() => {
              const modes: any[] = ['chase_close', 'chase_far', 'hood'];
              const next = modes[(modes.indexOf(store.cameraMode) + 1) % modes.length];
              store.setCameraMode(next);
            }}
            style={{ 
              background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', width: 50, height: 50, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
          >
            <Camera size={24} />
          </button>
        </div>

        {/* Right: Tachometer & Speedometer */}
        <div style={{ display: 'flex', gap: 30, alignItems: 'flex-end' }}>
          
          {/* Nitro Gauge */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ 
              width: 30, height: 150, background: 'rgba(0,0,0,0.6)', 
              borderRadius: 15, border: '2px solid #333', overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{ 
                position: 'absolute', bottom: 0, left: 0, width: '100%', 
                height: `${store.nitro}%`, 
                background: isNitro ? 'linear-gradient(to top, #ff00ff, #00ffff)' : 'linear-gradient(to top, #0066ff, #00ffff)',
                boxShadow: '0 0 15px #00ffff',
                transition: 'height 0.1s linear'
              }} />
            </div>
            <div style={{ color: isNitro ? '#ff00ff' : '#00ffff', fontWeight: 800 }}>
              <Flame fill={isNitro ? '#ff00ff' : 'none'} className={isNitro ? 'animate-pulse' : ''} />
            </div>
          </div>
          
          {/* Speedometer */}
          <div style={{ 
            width: 220, height: 110, background: 'rgba(0,0,0,0.7)',
            borderTopLeftRadius: 110, borderTopRightRadius: 110,
            border: '2px solid rgba(0,255,255,0.4)', borderBottom: 'none',
            position: 'relative', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 15,
            boxShadow: '0 0 30px rgba(0,255,255,0.1)'
          }}>
            {/* RPM Arc */}
            <svg style={{ position: 'absolute', top: 10, left: 10, width: 200, height: 100 }}>
              <path 
                d="M 10 90 A 90 90 0 0 1 190 90" 
                fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" strokeLinecap="round" 
              />
              <path 
                d="M 10 90 A 90 90 0 0 1 190 90" 
                fill="none" stroke={rpmPercent > 85 ? "#ff0055" : "#00ffff"} strokeWidth="8" strokeLinecap="round" 
                strokeDasharray="251" strokeDashoffset={251 - (251 * rpmPercent / 100)}
                style={{ transition: 'stroke-dashoffset 0.1s' }}
              />
            </svg>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: '3.5rem', fontWeight: 900, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
                {speed.toString().padStart(3, '0')}
              </span>
              <span style={{ fontSize: '1rem', color: '#00ffff', fontWeight: 600 }}>km/h</span>
            </div>
            
            <div style={{ display: 'flex', gap: 15, marginTop: 5 }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                {store.gear === 0 ? 'R' : store.gear} <span style={{ fontSize: '0.8rem', color: '#888' }}>GEAR</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
