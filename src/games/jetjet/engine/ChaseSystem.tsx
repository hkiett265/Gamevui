'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useJetJetStore, PursuerData } from '@/games/jetjet/store';
import { jetJetAudio } from './audio/jetJetAudio';

export const ChaseSystem: React.FC = () => {
  const {
    gameState,
    missionStep,
    bikePosition,
    playerPosition,
    isRiding,
    updateChaseState,
    showSubtitle,
    finishChaseSuccess
  } = useJetJetStore();

  const pursuersRef = useRef<PursuerData[]>([
    { id: 'p1', name: 'Anh Ba Hàng Xóm', x: -20, z: 28, speed: 65, isBike: true, distanceToPlayer: 90 },
    { id: 'p2', name: 'Thanh Niên Đầu Làng', x: -14, z: 22, speed: 68, isBike: true, distanceToPlayer: 95 },
    { id: 'p3', name: 'Bác Tư Chạy Bộ', x: -22, z: 32, speed: 18, isBike: false, distanceToPlayer: 85 }
  ]);

  const lastShoutTime = useRef(0);
  const lastEngineSoundTime = useRef(0);

  useFrame((_, delta) => {
    // Only active during Mission 02 Chase
    if (gameState !== 'CHASE' && missionStep !== 9) return;

    const playerPos = isRiding ? bikePosition : playerPosition;

    pursuersRef.current.forEach((p) => {
      // Calculate distance to player
      const dx = playerPos[0] - p.x;
      const dz = playerPos[2] - p.z;
      const dist = Math.hypot(dx, dz);
      p.distanceToPlayer = dist;

      // Pursuer movement logic towards player
      if (dist > 12) {
        const speedMs = (p.speed * 1000) / 3600;
        p.x += (dx / dist) * speedMs * delta * 0.92;
        p.z += (dz / dist) * speedMs * delta * 0.92;
      }
    });

    // Update store chase state
    updateChaseState(delta, [...pursuersRef.current]);

    // Comedic Shouting & Subtitles
    const now = Date.now();
    if (now - lastShoutTime.current > 4500) {
      lastShoutTime.current = now;
      const shouts: Array<{ type: any; text: string }> = [
        { type: 'EH_ANH_HAI', text: 'ANH BA: “Ê ANH HAI! ĐỨNG LẠI COI!”' },
        { type: 'CHAY_DI', text: 'BÁC TƯ: “CHẠY ĐÂU MÀ BÁN MẠNG VẬY ANH HAI!”' },
        { type: 'TROI_OI', text: 'THANH NIÊN XÓM: “XE GÌ MÀ CHẠY DỮ VẬY TRỜI!”' }
      ];
      const pick = shouts[Math.floor(Math.random() * shouts.length)];
      jetJetAudio.playNpcShout(pick.type);
      showSubtitle(pick.text, 2800);
    }

    // Spatial sound from closest pursuit bike
    const closestPursuer = pursuersRef.current[0];
    if (closestPursuer && closestPursuer.distanceToPlayer < 55 && now - lastEngineSoundTime.current > 120) {
      lastEngineSoundTime.current = now;
      const angle = Math.atan2(closestPursuer.x - playerPos[0], closestPursuer.z - playerPos[2]);
      jetJetAudio.playPursuerEngine(closestPursuer.distanceToPlayer, angle);
    }

    // Check if player reached Escape Zone ([45, 0, 175])
    const distToEscape = Math.hypot(playerPos[0] - 45, playerPos[2] - 175);
    if (distToEscape < 22) {
      jetJetAudio.playMissionPassed();
      finishChaseSuccess();
    }
  });

  if (gameState !== 'CHASE' && missionStep !== 9) return null;

  const bikeMat = new THREE.MeshStandardMaterial({ color: '#dc2626', roughness: 0.3 }); // Red pursuer bikes
  const riderMat = new THREE.MeshStandardMaterial({ color: '#1e293b' });

  return (
    <group>
      {/* Render 3D Pursuer Models */}
      {pursuersRef.current.map((p) => (
        <group key={p.id} position={[p.x, 0, p.z]}>
          {p.isBike ? (
            <group>
              {/* Bike frame */}
              <mesh position={[0, 0.45, 0]} material={bikeMat} castShadow>
                <boxGeometry args={[0.35, 0.5, 1.4]} />
              </mesh>
              {/* Wheels */}
              <mesh position={[0, 0.3, 0.6]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
                <meshBasicMaterial color="#111111" />
              </mesh>
              <mesh position={[0, 0.3, -0.6]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
                <meshBasicMaterial color="#111111" />
              </mesh>
              {/* Rider */}
              <mesh position={[0, 1.0, 0]} material={riderMat}>
                <boxGeometry args={[0.35, 0.7, 0.3]} />
              </mesh>
            </group>
          ) : (
            <mesh position={[0, 0.85, 0]} material={riderMat}>
              <boxGeometry args={[0.35, 1.5, 0.3]} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
};
