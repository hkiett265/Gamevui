'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useJetJetStore } from '@/games/jetjet/store';
import { jetJetAudio } from './audio/jetJetAudio';

interface ChickenProps {
  initialPosition: [number, number, number];
}

export const ChickenNPC: React.FC<ChickenProps> = ({ initialPosition }) => {
  const rootRef = useRef<THREE.Group>(null);
  const wingLeftRef = useRef<THREE.Mesh>(null);
  const wingRightRef = useRef<THREE.Mesh>(null);
  const lastScatterTime = useRef(0);
  const currentPos = useRef(new THREE.Vector3(initialPosition[0], initialPosition[1], initialPosition[2]));

  useFrame((state, delta) => {
    if (!rootRef.current) return;
    const { playerPosition, isRiding, bikePosition } = useJetJetStore.getState();

    const targetPos = isRiding ? bikePosition : playerPosition;
    const dist = Math.hypot(currentPos.current.x - targetPos[0], currentPos.current.z - targetPos[2]);

    // Pecking ground bob
    const t = state.clock.getElapsedTime();
    rootRef.current.position.y = currentPos.current.y + Math.abs(Math.sin(t * 4)) * 0.03;

    // Scatter if bike or player gets within 4.5m
    if (dist < 4.5) {
      const scatterDirX = (currentPos.current.x - targetPos[0]) / (dist || 1);
      const scatterDirZ = (currentPos.current.z - targetPos[2]) / (dist || 1);

      currentPos.current.x += scatterDirX * delta * 5.5;
      currentPos.current.z += scatterDirZ * delta * 5.5;

      // Flap wings fast
      if (wingLeftRef.current) wingLeftRef.current.rotation.z = Math.sin(t * 30) * 0.8;
      if (wingRightRef.current) wingRightRef.current.rotation.z = -Math.sin(t * 30) * 0.8;

      const now = Date.now();
      if (now - lastScatterTime.current > 2400) {
        lastScatterTime.current = now;
        jetJetAudio.playChickenScatter(dist);
      }
    } else {
      if (wingLeftRef.current) wingLeftRef.current.rotation.z = 0.15;
      if (wingRightRef.current) wingRightRef.current.rotation.z = -0.15;
    }

    rootRef.current.position.x = currentPos.current.x;
    rootRef.current.position.z = currentPos.current.z;
  });

  const featherMat = new THREE.MeshStandardMaterial({
    color: '#fef08a', // Yellow-white rural chicken
    roughness: 0.7
  });

  const combMat = new THREE.MeshStandardMaterial({
    color: '#ef4444', // Red comb
    roughness: 0.5
  });

  const beakMat = new THREE.MeshStandardMaterial({
    color: '#f97316',
    roughness: 0.5
  });

  return (
    <group ref={rootRef} position={initialPosition}>
      {/* Body */}
      <mesh position={[0, 0.22, 0]} material={featherMat} castShadow>
        <sphereGeometry args={[0.18, 12, 10]} />
      </mesh>
      {/* Red comb */}
      <mesh position={[0, 0.38, 0.08]} material={combMat}>
        <boxGeometry args={[0.04, 0.1, 0.12]} />
      </mesh>
      {/* Beak */}
      <mesh position={[0, 0.28, 0.18]} rotation={[Math.PI / 2, 0, 0]} material={beakMat}>
        <coneGeometry args={[0.04, 0.1, 6]} />
      </mesh>
      {/* Left Wing */}
      <mesh ref={wingLeftRef} position={[-0.16, 0.24, 0]} material={featherMat}>
        <boxGeometry args={[0.03, 0.14, 0.18]} />
      </mesh>
      {/* Right Wing */}
      <mesh ref={wingRightRef} position={[0.16, 0.24, 0]} material={featherMat}>
        <boxGeometry args={[0.03, 0.14, 0.18]} />
      </mesh>
      {/* Tail feathers */}
      <mesh position={[0, 0.3, -0.16]} rotation={[-0.6, 0, 0]} material={featherMat}>
        <boxGeometry args={[0.08, 0.18, 0.03]} />
      </mesh>
    </group>
  );
};
