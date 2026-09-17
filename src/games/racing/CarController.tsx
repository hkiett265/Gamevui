'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useNitroRacerStore } from '@/games/racing/store';
import { nitroAudio } from './audio/nitroAudio';
import { TrafficManager } from './TrafficManager';

export const CarController: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const playerRef = useRef<THREE.Group>(null);
  const keys = useRef<{ [key: string]: boolean }>({});
  
  const laneWidth = 4.5;
  const numLanes = 4;
  const maxBoundary = (numLanes * laneWidth) / 2 - 1.5;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { keys.current[e.code] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.code] = false; };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!playerRef.current) return;
    
    const store = useNitroRacerStore.getState();
    if (store.gameStatus !== 'playing') {
      nitroAudio.updateEngine(1000, false);
      nitroAudio.setNitro(false);
      return;
    }
    
    const isW = keys.current['KeyW'] || keys.current['ArrowUp'];
    const isS = keys.current['KeyS'] || keys.current['ArrowDown'];
    const isA = keys.current['KeyA'] || keys.current['ArrowLeft'];
    const isD = keys.current['KeyD'] || keys.current['ArrowRight'];
    const isDrift = keys.current['Space'];
    const isNitro = (keys.current['ShiftLeft'] || keys.current['ShiftRight'] || keys.current['KeyN']) && store.nitro > 0;
    
    let currentSpeed = store.speed;
    const maxSpeed = isNitro ? 380 : 240;
    const accel = isNitro ? 120 : 60;
    
    // Throttle / Brake
    if (isW) {
      currentSpeed += accel * delta;
    } else if (isS) {
      currentSpeed -= 100 * delta;
    } else {
      // Natural deceleration (air drag)
      currentSpeed -= 20 * delta;
    }
    
    currentSpeed = Math.max(0, Math.min(currentSpeed, maxSpeed));
    
    // Nitro drain
    if (isNitro && currentSpeed > 100) {
      store.updateVehicleState({ nitro: Math.max(0, store.nitro - 20 * delta) });
    }
    
    // Steering
    let steerAmount = 0;
    if (isA) steerAmount = -1;
    if (isD) steerAmount = 1;
    
    const steerSpeed = isDrift ? 25 : 15;
    if (steerAmount !== 0 && currentSpeed > 20) {
      playerRef.current.position.x += steerAmount * steerSpeed * delta;
      playerRef.current.position.x = Math.max(-maxBoundary, Math.min(maxBoundary, playerRef.current.position.x));
    }
    
    // Visual steering / drifting
    const targetRotY = (isDrift ? steerAmount * 0.4 : steerAmount * 0.1);
    playerRef.current.rotation.y = THREE.MathUtils.lerp(playerRef.current.rotation.y, targetRotY, delta * 10);
    
    // Calculate RPM and Gear (simplified)
    const gear = Math.max(1, Math.ceil((currentSpeed / maxSpeed) * 6));
    const gearSpeedRange = maxSpeed / 6;
    const rpm = 2000 + ((currentSpeed % gearSpeedRange) / gearSpeedRange) * 7000;
    
    // Handle drift score
    if (isDrift && steerAmount !== 0 && currentSpeed > 100) {
      store.addScore(10 * delta, 'DRIFT');
      store.updateVehicleState({ nitro: Math.min(100, store.nitro + 10 * delta) });
    }

    store.updateVehicleState({
      speed: currentSpeed,
      gear: currentSpeed < 1 ? 1 : gear,
      rpm: currentSpeed < 1 ? 1000 : rpm,
      isNitroActive: isNitro && currentSpeed > 100,
      isDrifting: isDrift && steerAmount !== 0,
      driftAngle: steerAmount
    });
    
    // Update Audio
    nitroAudio.updateEngine(rpm, isW);
    nitroAudio.setNitro(isNitro && currentSpeed > 100);
    nitroAudio.setDrift(isDrift && steerAmount !== 0, currentSpeed / 200);
    
    // Add Distance
    store.addDistance((currentSpeed / 3.6) * delta);
  });

  return (
    <group>
      <group ref={playerRef}>
        {children}
      </group>
      
      {/* Pass player ref to TrafficManager for collision detection */}
      <TrafficManager playerRef={playerRef} />
    </group>
  );
};
