'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ChickenType } from '@/games/chicken-mayhem/store';

interface ChickenModelProps {
  type: ChickenType;
  speed: number;
  isDying?: boolean;
  scale?: number;
}

export const ChickenModel: React.FC<ChickenModelProps> = ({
  type,
  speed,
  isDying = false,
  scale = 1.0
}) => {
  const rootRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftWingRef = useRef<THREE.Group>(null);
  const rightWingRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);

  // Materials & Colors based on type
  const { bodyColor, combColor, isGolden, isShiny } = useMemo(() => {
    switch (type) {
      case 'golden':
        return {
          bodyColor: '#ffd700',
          combColor: '#ff4500',
          isGolden: true,
          isShiny: true
        };
      case 'fast':
        return {
          bodyColor: '#d97706', // warm caramel/brown
          combColor: '#dc2626',
          isGolden: false,
          isShiny: false
        };
      case 'flying':
        return {
          bodyColor: '#e0f2fe', // sky white/blue tint
          combColor: '#ef4444',
          isGolden: false,
          isShiny: false
        };
      case 'crazy':
        return {
          bodyColor: '#a855f7', // funky purple
          combColor: '#e11d48',
          isGolden: false,
          isShiny: false
        };
      case 'normal':
      default:
        return {
          bodyColor: '#ffffff', // crisp cartoon white
          combColor: '#ef4444',
          isGolden: false,
          isShiny: false
        };
    }
  }, [type]);

  // Procedural Animation Loop
  useFrame((state, delta) => {
    if (isDying) {
      if (rootRef.current) {
        rootRef.current.rotation.x += delta * 15;
        rootRef.current.rotation.y += delta * 12;
        rootRef.current.position.y += delta * 2;
        rootRef.current.scale.multiplyScalar(Math.max(0.01, 1 - delta * 4));
      }
      return;
    }

    const t = state.clock.getElapsedTime();
    const animSpeed = type === 'crazy' ? 22 : type === 'fast' ? 18 : type === 'flying' ? 14 : 10;
    const cycle = t * animSpeed;

    // 1. Body Bobbing
    if (bodyRef.current) {
      bodyRef.current.position.y = Math.sin(cycle * 2) * 0.06;
      bodyRef.current.rotation.z = Math.sin(cycle) * 0.04;
    }

    // 2. Head Movement
    if (headRef.current) {
      headRef.current.position.y = 0.55 + Math.sin(cycle * 2 + 0.5) * 0.03;
      headRef.current.rotation.x = Math.sin(cycle) * 0.1;
      if (type === 'crazy') {
        headRef.current.rotation.y = Math.sin(t * 8) * 0.4;
      }
    }

    // 3. Wings Flapping
    if (leftWingRef.current && rightWingRef.current) {
      if (type === 'flying') {
        // Fast, broad wing flap
        const flap = Math.sin(t * 26) * 0.75;
        leftWingRef.current.rotation.z = 0.4 + flap;
        rightWingRef.current.rotation.z = -0.4 - flap;
      } else {
        // Gentle runner wing flap
        const flap = Math.sin(cycle * 1.5) * 0.25;
        leftWingRef.current.rotation.z = 0.2 + flap;
        rightWingRef.current.rotation.z = -0.2 - flap;
      }
    }

    // 4. Legs Animation
    if (leftLegRef.current && rightLegRef.current) {
      if (type === 'flying') {
        // Tucked backwards when flying
        leftLegRef.current.rotation.x = -0.8;
        rightLegRef.current.rotation.x = -0.8;
      } else {
        // Alternating run cycles
        const legSwing = Math.sin(cycle) * 0.65;
        leftLegRef.current.rotation.x = legSwing;
        rightLegRef.current.rotation.x = -legSwing;
      }
    }

    // 5. Tail Twitch
    if (tailRef.current) {
      tailRef.current.rotation.y = Math.sin(cycle * 1.2) * 0.15;
      tailRef.current.rotation.x = -0.3 + Math.cos(cycle) * 0.08;
    }
  });

  return (
    <group ref={rootRef} scale={scale} dispose={null}>
      {/* Chicken Body & Parts */}
      <group ref={bodyRef}>
        {/* --- MAIN BODY (Egg/Oval shape) --- */}
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.38, 16, 16]} />
          <meshStandardMaterial
            color={bodyColor}
            roughness={isShiny ? 0.2 : 0.6}
            metalness={isGolden ? 0.75 : 0.05}
            emissive={isGolden ? '#ffd700' : '#000000'}
            emissiveIntensity={isGolden ? 0.35 : 0.0}
          />
        </mesh>

        {/* --- HEAD GROUP (Hitbox for Headshot!) --- */}
        <group ref={headRef} position={[0, 0.58, 0.2]}>
          {/* Head Sphere */}
          <mesh name="chicken-head" castShadow>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial
              color={bodyColor}
              roughness={isShiny ? 0.2 : 0.6}
              metalness={isGolden ? 0.75 : 0.05}
              emissive={isGolden ? '#ffd700' : '#000000'}
              emissiveIntensity={isGolden ? 0.35 : 0.0}
            />
          </mesh>

          {/* Comb (Red crest on head) */}
          <group position={[0, 0.22, -0.02]}>
            {/* 3 Red crest bumps */}
            <mesh position={[0, 0, -0.08]} castShadow>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshStandardMaterial color={combColor} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.04, 0]} castShadow>
              <sphereGeometry args={[0.09, 8, 8]} />
              <meshStandardMaterial color={combColor} roughness={0.4} />
            </mesh>
            <mesh position={[0, 0, 0.08]} castShadow>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshStandardMaterial color={combColor} roughness={0.4} />
            </mesh>
          </group>

          {/* Orange Beak */}
          <mesh position={[0, 0.0, 0.22]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <coneGeometry args={[0.09, 0.18, 8]} />
            <meshStandardMaterial color="#f97316" roughness={0.4} />
          </mesh>

          {/* Red Wattle (under beak) */}
          <group position={[0, -0.12, 0.16]}>
            <mesh position={[-0.03, 0, 0]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial color={combColor} roughness={0.4} />
            </mesh>
            <mesh position={[0.03, 0, 0]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial color={combColor} roughness={0.4} />
            </mesh>
          </group>

          {/* Eyes (Left & Right) */}
          {/* Left Eye */}
          <group position={[-0.14, 0.06, 0.12]} rotation={[0, -0.4, 0]}>
            {/* White Sclera */}
            <mesh>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshStandardMaterial color="#ffffff" roughness={0.1} />
            </mesh>
            {/* Black Pupil */}
            <mesh position={[0, 0, 0.05]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshStandardMaterial color="#0f172a" roughness={0.1} />
            </mesh>
            {/* Eye shine highlight */}
            <mesh position={[-0.015, 0.015, 0.07]}>
              <sphereGeometry args={[0.012, 6, 6]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>

          {/* Right Eye */}
          <group position={[0.14, 0.06, 0.12]} rotation={[0, 0.4, 0]}>
            <mesh>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshStandardMaterial color="#ffffff" roughness={0.1} />
            </mesh>
            <mesh position={[0, 0, 0.05]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshStandardMaterial color="#0f172a" roughness={0.1} />
            </mesh>
            <mesh position={[0.015, 0.015, 0.07]}>
              <sphereGeometry args={[0.012, 6, 6]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        </group>

        {/* --- WINGS (Left & Right with Pivot Groups) --- */}
        {/* Left Wing */}
        <group ref={leftWingRef} position={[-0.34, 0.38, 0]}>
          <mesh position={[-0.08, -0.06, 0]} rotation={[0, 0, 0.2]} castShadow>
            <boxGeometry args={[0.08, 0.22, 0.32]} />
            <meshStandardMaterial
              color={bodyColor}
              roughness={0.5}
              metalness={isGolden ? 0.75 : 0.05}
            />
          </mesh>
        </group>

        {/* Right Wing */}
        <group ref={rightWingRef} position={[0.34, 0.38, 0]}>
          <mesh position={[0.08, -0.06, 0]} rotation={[0, 0, -0.2]} castShadow>
            <boxGeometry args={[0.08, 0.22, 0.32]} />
            <meshStandardMaterial
              color={bodyColor}
              roughness={0.5}
              metalness={isGolden ? 0.75 : 0.05}
            />
          </mesh>
        </group>

        {/* --- TAIL FEATHERS --- */}
        <group ref={tailRef} position={[0, 0.45, -0.32]}>
          <mesh position={[0, 0.1, -0.08]} rotation={[-0.6, 0, 0]} castShadow>
            <coneGeometry args={[0.16, 0.36, 6]} />
            <meshStandardMaterial color={isGolden ? '#ffd700' : combColor} roughness={0.5} />
          </mesh>
          <mesh position={[-0.08, 0.06, -0.06]} rotation={[-0.5, -0.2, -0.2]} castShadow>
            <coneGeometry args={[0.11, 0.28, 6]} />
            <meshStandardMaterial color={bodyColor} roughness={0.5} />
          </mesh>
          <mesh position={[0.08, 0.06, -0.06]} rotation={[-0.5, 0.2, 0.2]} castShadow>
            <coneGeometry args={[0.11, 0.28, 6]} />
            <meshStandardMaterial color={bodyColor} roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* --- LEGS & CLAWS --- */}
      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.14, 0.18, 0]}>
        {/* Thigh / Upper Leg */}
        <mesh position={[0, -0.08, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.18, 6]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.5} />
        </mesh>
        {/* Foot & 3 Claws */}
        <group position={[0, -0.17, 0.04]}>
          <mesh position={[0, 0, 0.02]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.025, 0.02, 0.12]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
          <mesh position={[-0.04, 0, 0.01]} rotation={[0.2, 0.4, 0]}>
            <boxGeometry args={[0.02, 0.02, 0.1]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
          <mesh position={[0.04, 0, 0.01]} rotation={[0.2, -0.4, 0]}>
            <boxGeometry args={[0.02, 0.02, 0.1]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
        </group>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.14, 0.18, 0]}>
        <mesh position={[0, -0.08, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.18, 6]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.5} />
        </mesh>
        <group position={[0, -0.17, 0.04]}>
          <mesh position={[0, 0, 0.02]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.025, 0.02, 0.12]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
          <mesh position={[-0.04, 0, 0.01]} rotation={[0.2, 0.4, 0]}>
            <boxGeometry args={[0.02, 0.02, 0.1]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
          <mesh position={[0.04, 0, 0.01]} rotation={[0.2, -0.4, 0]}>
            <boxGeometry args={[0.02, 0.02, 0.1]} />
            <meshStandardMaterial color="#f59e0b" />
          </mesh>
        </group>
      </group>

      {/* Golden Sparkle Halo (for Golden Chicken only) */}
      {isGolden && (
        <pointLight color="#ffd700" intensity={2.5} distance={3} />
      )}
    </group>
  );
};
