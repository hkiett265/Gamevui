'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useJetJetStore } from '@/games/jetjet/store';
import { jetJetAudio } from './audio/jetJetAudio';

export const DogNPC: React.FC = () => {
  const dogRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Group>(null);
  const lastBarkTime = useRef(0);

  const homePos = new THREE.Vector3(-22, 0, 32);

  useFrame((state, delta) => {
    if (!dogRef.current) return;
    const { playerPosition, isRiding, bikePosition, isRevving, missionStep } = useJetJetStore.getState();

    const targetPos = isRiding ? bikePosition : playerPosition;
    const distToPlayer = Math.hypot(dogRef.current.position.x - targetPos[0], dogRef.current.position.z - targetPos[2]);

    // Tail wagging
    if (tailRef.current) {
      tailRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 14) * 0.45;
    }

    // Look at player if within 25m
    if (distToPlayer < 25 && headRef.current) {
      const angle = Math.atan2(targetPos[0] - dogRef.current.position.x, targetPos[2] - dogRef.current.position.z);
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, angle, delta * 5);
    }

    // Barking logic
    const now = Date.now();
    if (distToPlayer < 24 && now - lastBarkTime.current > (isRevving ? 1200 : 3800)) {
      lastBarkTime.current = now;
      const isLeft = targetPos[0] < dogRef.current.position.x;
      jetJetAudio.playDogBark(distToPlayer, isLeft);
    }

    // When chase starts (missionStep >= 8), dog retreats safely onto the porch
    if (missionStep >= 8) {
      dogRef.current.position.lerp(new THREE.Vector3(-24, 0, 35), delta * 4);
    } else {
      dogRef.current.position.lerp(homePos, delta * 3);
    }
  });

  const furMat = new THREE.MeshStandardMaterial({
    color: '#d97706', // Golden brown dog fur
    roughness: 0.8
  });

  const snoutMat = new THREE.MeshStandardMaterial({
    color: '#1c1917',
    roughness: 0.6
  });

  return (
    <group ref={dogRef} position={[-22, 0, 32]}>
      {/* Torso / Body */}
      <mesh position={[0, 0.38, 0]} material={furMat} castShadow>
        <boxGeometry args={[0.32, 0.35, 0.65]} />
      </mesh>

      {/* Four legs */}
      <mesh position={[-0.12, 0.16, 0.22]} material={furMat}>
        <cylinderGeometry args={[0.04, 0.04, 0.32, 8]} />
      </mesh>
      <mesh position={[0.12, 0.16, 0.22]} material={furMat}>
        <cylinderGeometry args={[0.04, 0.04, 0.32, 8]} />
      </mesh>
      <mesh position={[-0.12, 0.16, -0.22]} material={furMat}>
        <cylinderGeometry args={[0.04, 0.04, 0.32, 8]} />
      </mesh>
      <mesh position={[0.12, 0.16, -0.22]} material={furMat}>
        <cylinderGeometry args={[0.04, 0.04, 0.32, 8]} />
      </mesh>

      {/* Head & Snout */}
      <group ref={headRef} position={[0, 0.55, 0.32]}>
        <mesh material={furMat}>
          <boxGeometry args={[0.22, 0.22, 0.24]} />
        </mesh>
        {/* Snout */}
        <mesh position={[0, -0.04, 0.16]} material={snoutMat}>
          <boxGeometry args={[0.12, 0.1, 0.15]} />
        </mesh>
        {/* Floppy ears */}
        <mesh position={[-0.12, 0.06, -0.02]} rotation={[0, 0, -0.4]} material={snoutMat}>
          <boxGeometry args={[0.06, 0.14, 0.08]} />
        </mesh>
        <mesh position={[0.12, 0.06, -0.02]} rotation={[0, 0, 0.4]} material={snoutMat}>
          <boxGeometry args={[0.06, 0.14, 0.08]} />
        </mesh>
      </group>

      {/* Wagging tail */}
      <mesh ref={tailRef} position={[0, 0.48, -0.32]} rotation={[0.6, 0, 0]} material={furMat}>
        <cylinderGeometry args={[0.03, 0.015, 0.3, 6]} />
      </mesh>
    </group>
  );
};
