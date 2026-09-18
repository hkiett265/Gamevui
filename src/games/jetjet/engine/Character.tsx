'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useJetJetStore } from '@/games/jetjet/store';

export const Character: React.FC = () => {
  const charGroupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const bottleRef = useRef<THREE.Group>(null);

  const animPhase = useRef(0);

  useFrame((state, delta) => {
    const {
      isRiding,
      playerPosition,
      playerRotation,
      bikePosition,
      bikeRotation,
      isMoving,
      isRunning,
      hasBottle,
      isDrinking,
      isTransformed,
      speedKmh,
      leanAngle
    } = useJetJetStore.getState();

    if (!charGroupRef.current) return;

    if (isRiding) {
      // Mount character on bike saddle (saddle is at y ≈ 0.76, z ≈ -0.2)
      const cos = Math.cos(bikeRotation);
      const sin = Math.sin(bikeRotation);
      // Offset position to sit naturally on the bike
      charGroupRef.current.position.set(
        bikePosition[0] - sin * 0.18,
        bikePosition[1] + 0.58,
        bikePosition[2] - cos * 0.18
      );
      charGroupRef.current.rotation.y = bikeRotation;
      charGroupRef.current.rotation.z = -leanAngle;

      // Riding pose
      if (leftLegRef.current) {
        leftLegRef.current.rotation.set(1.2, 0.25, -0.3);
      }
      if (rightLegRef.current) {
        rightLegRef.current.rotation.set(1.2, -0.25, 0.3);
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.set(-0.85, 0.35, -0.2);
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.set(-0.85, -0.35, 0.2);
      }
      if (headRef.current) {
        headRef.current.rotation.set(0.1, 0, 0);
      }
    } else {
      // On foot
      charGroupRef.current.position.set(playerPosition[0], playerPosition[1], playerPosition[2]);
      charGroupRef.current.rotation.set(0, playerRotation, 0);

      // Locomotion animation
      if (isMoving) {
        const speedMultiplier = isRunning ? 16 : 9;
        animPhase.current += delta * speedMultiplier;
        const swing = Math.sin(animPhase.current);

        const legAmp = isRunning ? 0.85 : 0.55;
        const armAmp = isRunning ? 0.75 : 0.45;

        if (leftLegRef.current) leftLegRef.current.rotation.x = swing * legAmp;
        if (rightLegRef.current) rightLegRef.current.rotation.x = -swing * legAmp;

        if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * armAmp;
        if (rightArmRef.current && !hasBottle && !isDrinking) {
          rightArmRef.current.rotation.x = swing * armAmp;
        }

        // Slight torso bounce
        charGroupRef.current.position.y = playerPosition[1] + Math.abs(Math.sin(animPhase.current * 2)) * 0.06;
      } else {
        // Idle breathing
        const t = state.clock.getElapsedTime();
        const breath = Math.sin(t * 2.5) * 0.03;

        if (leftLegRef.current) leftLegRef.current.rotation.set(0, 0, 0);
        if (rightLegRef.current) rightLegRef.current.rotation.set(0, 0, 0);
        if (leftArmRef.current) leftArmRef.current.rotation.set(breath, 0, breath * 0.5);

        if (!hasBottle && !isDrinking && rightArmRef.current) {
          rightArmRef.current.rotation.set(-breath, 0, -breath * 0.5);
        }

        charGroupRef.current.position.y = playerPosition[1];
      }

      // Bottle holding & drinking gestures
      if (isDrinking) {
        if (rightArmRef.current) {
          rightArmRef.current.rotation.set(-2.2, -0.4, 0.3);
        }
        if (headRef.current) {
          headRef.current.rotation.set(-0.45, 0, 0);
        }
      } else if (hasBottle) {
        if (rightArmRef.current) {
          rightArmRef.current.rotation.set(-1.1, -0.2, 0.2);
        }
        if (headRef.current) {
          headRef.current.rotation.set(0, 0, 0);
        }
      }
    }
  });

  const { isTransformed, hasBottle, isDrinking } = useJetJetStore();

  // Materials
  const skinMat = new THREE.MeshStandardMaterial({
    color: '#f5d0b0',
    roughness: 0.65,
    metalness: 0.05
  });

  const hairMat = new THREE.MeshStandardMaterial({
    color: '#1a1818',
    roughness: 0.8
  });

  // Casual outfit before transformation
  const casualShirtMat = new THREE.MeshStandardMaterial({
    color: '#e2e8f0',
    roughness: 0.8
  });

  const casualPantsMat = new THREE.MeshStandardMaterial({
    color: '#334155',
    roughness: 0.85
  });

  // Premium Denim Streetwear after transformation (Evisu-style raw dark indigo)
  const denimJacketMat = new THREE.MeshStandardMaterial({
    color: '#1e293b', // Deep indigo blue
    roughness: 0.7,
    metalness: 0.15
  });

  const denimStitchMat = new THREE.MeshBasicMaterial({
    color: '#ffffff' // White contrast arcuate stitch
  });

  const denimPantsMat = new THREE.MeshStandardMaterial({
    color: '#1e293b',
    roughness: 0.75
  });

  const sneakerMat = new THREE.MeshStandardMaterial({
    color: '#f8fafc',
    roughness: 0.4
  });

  const neonStripeMat = new THREE.MeshBasicMaterial({
    color: '#84cc16' // Neon green accent on sneakers
  });

  const capMat = new THREE.MeshStandardMaterial({
    color: '#0f172a',
    roughness: 0.7
  });

  const goldChainMat = new THREE.MeshStandardMaterial({
    color: '#fbbf24',
    metalness: 0.9,
    roughness: 0.2
  });

  // Red Drink bottle materials
  const bottleGlassMat = new THREE.MeshPhysicalMaterial({
    color: '#ef4444',
    transmission: 0.8,
    opacity: 0.9,
    transparent: true,
    roughness: 0.1,
    ior: 1.45
  });

  const bottleCapMat = new THREE.MeshStandardMaterial({
    color: '#b91c1c',
    roughness: 0.4
  });

  const bottleLabelMat = new THREE.MeshBasicMaterial({
    color: '#fbbf24' // Gold lightning bolt
  });

  return (
    <group ref={charGroupRef}>
      {/* --- PELVIS & HIPS --- */}
      <group position={[0, 0.86, 0]}>
        <mesh material={isTransformed ? denimPantsMat : casualPantsMat}>
          <boxGeometry args={[0.3, 0.2, 0.22]} />
        </mesh>

        {/* --- LEGS --- */}
        {/* Left Leg */}
        <group ref={leftLegRef} position={[-0.1, -0.1, 0]}>
          {/* Thigh */}
          <mesh position={[0, -0.22, 0]} material={isTransformed ? denimPantsMat : casualPantsMat}>
            <boxGeometry args={[0.13, 0.38, 0.14]} />
          </mesh>
          {/* Calf / Shin */}
          <mesh position={[0, -0.56, 0]} material={isTransformed ? denimPantsMat : casualPantsMat}>
            <boxGeometry args={[0.12, 0.38, 0.13]} />
          </mesh>
          {/* Sneaker */}
          <group position={[0, -0.78, 0.05]}>
            <mesh material={sneakerMat}>
              <boxGeometry args={[0.13, 0.1, 0.24]} />
            </mesh>
            {isTransformed && (
              <mesh position={[0, -0.02, 0.04]} material={neonStripeMat}>
                <boxGeometry args={[0.135, 0.03, 0.14]} />
              </mesh>
            )}
          </group>
        </group>

        {/* Right Leg */}
        <group ref={rightLegRef} position={[0.1, -0.1, 0]}>
          {/* Thigh */}
          <mesh position={[0, -0.22, 0]} material={isTransformed ? denimPantsMat : casualPantsMat}>
            <boxGeometry args={[0.13, 0.38, 0.14]} />
          </mesh>
          {/* Calf / Shin */}
          <mesh position={[0, -0.56, 0]} material={isTransformed ? denimPantsMat : casualPantsMat}>
            <boxGeometry args={[0.12, 0.38, 0.13]} />
          </mesh>
          {/* Sneaker */}
          <group position={[0, -0.78, 0.05]}>
            <mesh material={sneakerMat}>
              <boxGeometry args={[0.13, 0.1, 0.24]} />
            </mesh>
            {isTransformed && (
              <mesh position={[0, -0.02, 0.04]} material={neonStripeMat}>
                <boxGeometry args={[0.135, 0.03, 0.14]} />
              </mesh>
            )}
          </group>
        </group>

        {/* --- TORSO & CHEST --- */}
        <group position={[0, 0.28, 0]}>
          {/* Main Upper Body */}
          <mesh material={isTransformed ? denimJacketMat : casualShirtMat}>
            <boxGeometry args={[0.34, 0.44, 0.22]} />
          </mesh>

          {/* DENIM CONTRAST SEAGULL STITCHING ON BACK */}
          {isTransformed && (
            <group position={[0, 0.02, -0.115]}>
              {/* Seagull arch left */}
              <mesh position={[-0.07, 0.02, 0]} rotation={[0, 0, 0.45]} material={denimStitchMat}>
                <boxGeometry args={[0.11, 0.02, 0.005]} />
              </mesh>
              <mesh position={[-0.03, -0.04, 0]} rotation={[0, 0, -0.55]} material={denimStitchMat}>
                <boxGeometry args={[0.09, 0.02, 0.005]} />
              </mesh>
              {/* Seagull arch right */}
              <mesh position={[0.07, 0.02, 0]} rotation={[0, 0, -0.45]} material={denimStitchMat}>
                <boxGeometry args={[0.11, 0.02, 0.005]} />
              </mesh>
              <mesh position={[0.03, -0.04, 0]} rotation={[0, 0, 0.55]} material={denimStitchMat}>
                <boxGeometry args={[0.09, 0.02, 0.005]} />
              </mesh>
              {/* Gold neck chain */}
              <mesh position={[0, 0.18, 0.225]} material={goldChainMat}>
                <torusGeometry args={[0.07, 0.012, 8, 16]} />
              </mesh>
            </group>
          )}

          {/* --- ARMS --- */}
          {/* Left Arm */}
          <group ref={leftArmRef} position={[-0.22, 0.16, 0]}>
            {/* Shoulder sleeve */}
            <mesh position={[0, -0.16, 0]} material={isTransformed ? denimJacketMat : casualShirtMat}>
              <boxGeometry args={[0.11, 0.32, 0.11]} />
            </mesh>
            {/* Forearm */}
            <mesh position={[0, -0.42, 0]} material={isTransformed ? denimJacketMat : skinMat}>
              <boxGeometry args={[0.09, 0.28, 0.09]} />
            </mesh>
            {/* Hand */}
            <mesh position={[0, -0.58, 0]} material={skinMat}>
              <boxGeometry args={[0.07, 0.09, 0.07]} />
            </mesh>
          </group>

          {/* Right Arm */}
          <group ref={rightArmRef} position={[0.22, 0.16, 0]}>
            {/* Shoulder sleeve */}
            <mesh position={[0, -0.16, 0]} material={isTransformed ? denimJacketMat : casualShirtMat}>
              <boxGeometry args={[0.11, 0.32, 0.11]} />
            </mesh>
            {/* Forearm */}
            <mesh position={[0, -0.42, 0]} material={isTransformed ? denimJacketMat : skinMat}>
              <boxGeometry args={[0.09, 0.28, 0.09]} />
            </mesh>
            {/* Hand */}
            <mesh position={[0, -0.58, 0]} material={skinMat}>
              <boxGeometry args={[0.07, 0.09, 0.07]} />
            </mesh>

            {/* BOTTLE IN HAND */}
            {(hasBottle || isDrinking) && (
              <group ref={bottleRef} position={[0, -0.62, 0.08]} rotation={[0.4, 0, 0]}>
                {/* Bottle body */}
                <mesh position={[0, 0.1, 0]} material={bottleGlassMat}>
                  <cylinderGeometry args={[0.035, 0.038, 0.2, 16]} />
                </mesh>
                {/* Yellow lightning bolt label */}
                <mesh position={[0, 0.1, 0.039]} material={bottleLabelMat}>
                  <planeGeometry args={[0.04, 0.08]} />
                </mesh>
                {/* Bottle neck & cap */}
                <mesh position={[0, 0.22, 0]} material={bottleCapMat}>
                  <cylinderGeometry args={[0.018, 0.022, 0.06, 12]} />
                </mesh>
              </group>
            )}
          </group>

          {/* --- NECK & HEAD --- */}
          <group ref={headRef} position={[0, 0.32, 0]}>
            {/* Neck */}
            <mesh position={[0, -0.04, 0]} material={skinMat}>
              <cylinderGeometry args={[0.05, 0.06, 0.08, 12]} />
            </mesh>
            {/* Head */}
            <mesh position={[0, 0.1, 0]} material={skinMat}>
              <boxGeometry args={[0.18, 0.2, 0.19]} />
            </mesh>
            {/* Hair */}
            <mesh position={[0, 0.2, -0.01]} material={hairMat}>
              <boxGeometry args={[0.19, 0.08, 0.2]} />
            </mesh>

            {/* Streetwear Snapback Cap (Backwards) after transformation */}
            {isTransformed && (
              <group position={[0, 0.18, 0]}>
                {/* Cap dome */}
                <mesh material={capMat}>
                  <sphereGeometry args={[0.115, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
                </mesh>
                {/* Brim pointing backward */}
                <mesh position={[0, 0, -0.13]} rotation={[-0.2, 0, 0]} material={capMat}>
                  <boxGeometry args={[0.14, 0.015, 0.08]} />
                </mesh>
              </group>
            )}
          </group>
        </group>
      </group>
    </group>
  );
};
