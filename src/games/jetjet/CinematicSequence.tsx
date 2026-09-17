'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useJetJetStore } from '@/games/jetjet/store';
import { jetJetAudio } from './audio/jetJetAudio';

export const CinematicSequence: React.FC = () => {
  const { gameState, isDrinking, playerPosition, finishTransformation } = useJetJetStore();
  const [flash, setFlash] = useState(false);
  const ringRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const timerRef = useRef(0);

  useEffect(() => {
    if (!isDrinking) {
      timerRef.current = 0;
      return;
    }

    // Sequence timeline:
    // 1. Gulping sound starts
    jetJetAudio.playGulp();

    // 2. Second gulp at 0.8s
    const gulpTimer = setTimeout(() => {
      jetJetAudio.playGulp();
    }, 800);

    // 3. Transformation flash & blast at 1.8s
    const blastTimer = setTimeout(() => {
      setFlash(true);
      jetJetAudio.playTransformationBlast();
      setTimeout(() => setFlash(false), 220);
    }, 1800);

    // 4. Finish transformation at 3.2s
    const finishTimer = setTimeout(() => {
      finishTransformation();
    }, 3200);

    return () => {
      clearTimeout(gulpTimer);
      clearTimeout(blastTimer);
      clearTimeout(finishTimer);
    };
  }, [isDrinking, finishTransformation]);

  useFrame((_, delta) => {
    if (!isDrinking) return;
    timerRef.current += delta;

    // Expanding energy ring
    if (ringRef.current) {
      const scale = 1 + (timerRef.current * 3.5) % 6;
      ringRef.current.scale.set(scale, scale, scale);
      ringRef.current.rotation.z += delta * 4;
    }

    // Swirling energy particles
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 3;
    }
  });

  if (!isDrinking && gameState !== 'CINEMATIC_DRINK') return null;

  // Particle positions
  const particleCount = 45;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2;
    const r = 0.6 + Math.random() * 1.4;
    positions[i * 3] = Math.cos(angle) * r;
    positions[i * 3 + 1] = Math.random() * 2.2;
    positions[i * 3 + 2] = Math.sin(angle) * r;
  }

  return (
    <>
      {/* 3D ENERGY BURST FX AROUND PLAYER */}
      <group position={[playerPosition[0], playerPosition[1] + 1.1, playerPosition[2]]}>
        {/* Glowing pulsing energy ring */}
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 0.95, 32]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.7} side={THREE.DoubleSide} />
        </mesh>

        {/* Swirling energy sparks */}
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.12}
            color="#fbbf24"
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>

      {/* FULLSCREEN BLINDING WHITE FLASH */}
      {flash && (
        <mesh position={[playerPosition[0], playerPosition[1] + 1.2, playerPosition[2]]}>
          <sphereGeometry args={[18, 16, 16]} />
          <meshBasicMaterial color="#ffffff" side={THREE.BackSide} />
        </mesh>
      )}
    </>
  );
};
