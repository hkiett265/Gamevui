'use client';

import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useGameStore } from '@/games/chicken-mayhem/store';

const _tempGunOffset = new THREE.Vector3();

export const PlayerGun: React.FC = () => {
  const { camera } = useThree();
  const gunGroupRef = useRef<THREE.Group>(null);
  const flashMeshRef = useRef<THREE.Mesh>(null);
  const flashLightRef = useRef<THREE.PointLight>(null);
  const pumpRef = useRef<THREE.Mesh>(null);

  const { gunRecoil, isReloading, gameState } = useGameStore();

  // Internal visual recoil animation
  const recoilOffset = useRef(0);
  const recoilPitch = useRef(0);
  const [flashVisible, setFlashVisible] = useState(false);

  // Watch gunRecoil from store
  useEffect(() => {
    if (gunRecoil > 0.8) {
      recoilOffset.current = 0.28;
      recoilPitch.current = 0.35;
      setFlashVisible(true);
      const timer = setTimeout(() => setFlashVisible(false), 70);
      return () => clearTimeout(timer);
    }
  }, [gunRecoil]);

  // Frame animation for gun sway, idle breathing, recoil dampening, and reload motion
  useFrame((state, delta) => {
    if (!gunGroupRef.current) return;

    const t = state.clock.getElapsedTime();

    // 1. Recover from recoil
    recoilOffset.current = THREE.MathUtils.lerp(recoilOffset.current, 0, delta * 12);
    recoilPitch.current = THREE.MathUtils.lerp(recoilPitch.current, 0, delta * 14);

    // 2. Idle sway / breathing
    const idleY = Math.sin(t * 2.5) * 0.012;
    const idleX = Math.cos(t * 1.5) * 0.01;

    // 3. Reload animation (dips down, tilts, pump pumps, then snaps back up)
    let reloadY = 0;
    let reloadPitch = 0;
    let reloadRoll = 0;

    if (isReloading) {
      reloadY = -0.28;
      reloadPitch = -0.55;
      reloadRoll = 0.35;
      if (pumpRef.current) {
        pumpRef.current.position.z = -0.15 + Math.sin(t * 10) * 0.08;
      }
    } else {
      if (pumpRef.current) {
        pumpRef.current.position.z = THREE.MathUtils.lerp(pumpRef.current.position.z, -0.15, delta * 10);
      }
    }

    // Bind gun position directly to camera in 3D world space
    _tempGunOffset.set(
      0.35 + idleX,
      -0.30 + idleY + reloadY,
      -0.62 + recoilOffset.current
    );
    _tempGunOffset.applyQuaternion(camera.quaternion);

    gunGroupRef.current.position.copy(camera.position).add(_tempGunOffset);
    gunGroupRef.current.quaternion.copy(camera.quaternion);
    gunGroupRef.current.rotateX(recoilPitch.current + reloadPitch);
    gunGroupRef.current.rotateY(-0.05);
    gunGroupRef.current.rotateZ(reloadRoll);
  });

  // Only render gun when not in menu or during countdown
  if (gameState === 'MENU') return null;

  return (
    <group ref={gunGroupRef} position={[0.35, -0.3, -0.62]}>
      {/* --- CARTOON DOUBLE-BARREL SHOTGUN --- */}

      {/* 1. Barrels (Twin chunky cartoon steel cylinders) */}
      {/* Left Barrel */}
      <mesh position={[-0.032, 0.035, -0.42]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.026, 0.026, 0.55, 12]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.25} />
      </mesh>
      {/* Right Barrel */}
      <mesh position={[0.032, 0.035, -0.42]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.026, 0.026, 0.55, 12]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* Barrel Rib / Top Bridge */}
      <mesh position={[0, 0.058, -0.42]} castShadow>
        <boxGeometry args={[0.065, 0.015, 0.53]} />
        <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.2} />
      </mesh>

      {/* Brass Front Sight Bead */}
      <mesh position={[0, 0.072, -0.68]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* 2. Wooden Pump / Fore-end Grip */}
      <mesh ref={pumpRef} position={[0, 0.01, -0.32]} castShadow>
        <boxGeometry args={[0.09, 0.06, 0.22]} />
        <meshStandardMaterial color="#78350f" roughness={0.5} />
      </mesh>

      {/* 3. Gun Body / Metal Receiver */}
      <mesh position={[0, 0.02, -0.1]} castShadow>
        <boxGeometry args={[0.08, 0.09, 0.22]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Brass Accent Plate on Receiver */}
      <mesh position={[0.042, 0.02, -0.1]}>
        <boxGeometry args={[0.005, 0.06, 0.12]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* 4. Trigger Guard & Trigger */}
      <mesh position={[0, -0.04, -0.07]}>
        <torusGeometry args={[0.024, 0.005, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#475569" metalness={0.8} />
      </mesh>
      {/* Trigger Blade */}
      <mesh position={[0, -0.035, -0.06]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.006, 0.024, 0.008]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} />
      </mesh>

      {/* 5. Wooden Stock / Grip */}
      <group position={[0, -0.02, 0.06]}>
        {/* Pistol Grip */}
        <mesh position={[0, -0.07, 0.02]} rotation={[0.45, 0, 0]} castShadow>
          <boxGeometry args={[0.065, 0.12, 0.07]} />
          <meshStandardMaterial color="#78350f" roughness={0.55} />
        </mesh>
        {/* Rear Buttstock */}
        <mesh position={[0, -0.11, 0.16]} rotation={[0.15, 0, 0]} castShadow>
          <boxGeometry args={[0.068, 0.15, 0.24]} />
          <meshStandardMaterial color="#92400e" roughness={0.55} />
        </mesh>
        {/* Rubber Buttpad */}
        <mesh position={[0, -0.11, 0.285]}>
          <boxGeometry args={[0.07, 0.155, 0.02]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
      </group>

      {/* --- MUZZLE FLASH EFFECT --- */}
      {flashVisible && (
        <group position={[0, 0.035, -0.73]}>
          {/* Starburst Flash Mesh */}
          <mesh ref={flashMeshRef} rotation={[0, 0, Math.random() * Math.PI]}>
            <dodecahedronGeometry args={[0.16, 0]} />
            <meshBasicMaterial color="#ffea75" />
          </mesh>
          <mesh rotation={[0, 0, Math.random() * Math.PI]}>
            <octahedronGeometry args={[0.1, 0]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Punchy point light */}
          <pointLight
            ref={flashLightRef}
            color="#ffbb33"
            intensity={8}
            distance={4}
            decay={2}
          />
        </group>
      )}
    </group>
  );
};
