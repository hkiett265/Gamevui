'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// 1. Stylized Pine Tree with wind sway
export const PineTree: React.FC<{ position: [number, number, number]; scale?: number }> = ({
  position,
  scale = 1.0
}) => {
  const crownRef = useRef<THREE.Group>(null);
  const phase = position[0] + position[2];

  useFrame((state) => {
    if (crownRef.current) {
      const t = state.clock.getElapsedTime();
      crownRef.current.rotation.z = Math.sin(t * 1.5 + phase) * 0.04;
      crownRef.current.rotation.x = Math.cos(t * 1.2 + phase) * 0.03;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.32, 2.0, 6]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      {/* 3 Tiered Foliage Cones */}
      <group ref={crownRef} position={[0, 1.8, 0]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <coneGeometry args={[1.5, 1.6, 6]} />
          <meshStandardMaterial color="#15803d" roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.6, 0]} castShadow>
          <coneGeometry args={[1.2, 1.5, 6]} />
          <meshStandardMaterial color="#16a34a" roughness={0.7} />
        </mesh>
        <mesh position={[0, 2.5, 0]} castShadow>
          <coneGeometry args={[0.85, 1.3, 6]} />
          <meshStandardMaterial color="#22c55e" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
};

// 2. Stylized Oak Tree (Fluffy cluster canopy)
export const OakTree: React.FC<{ position: [number, number, number]; scale?: number }> = ({
  position,
  scale = 1.0
}) => {
  const canopyRef = useRef<THREE.Group>(null);
  const phase = position[0] * 1.3 + position[2];

  useFrame((state) => {
    if (canopyRef.current) {
      const t = state.clock.getElapsedTime();
      canopyRef.current.rotation.z = Math.sin(t * 1.4 + phase) * 0.03;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.4, 2.4, 6]} />
        <meshStandardMaterial color="#582a0d" roughness={0.9} />
      </mesh>
      {/* Fluffy Cluster Canopy */}
      <group ref={canopyRef} position={[0, 3.0, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[1.6, 7, 7]} />
          <meshStandardMaterial color="#16a34a" roughness={0.8} />
        </mesh>
        <mesh position={[-0.7, -0.4, 0.4]} castShadow>
          <sphereGeometry args={[1.1, 6, 6]} />
          <meshStandardMaterial color="#15803d" roughness={0.8} />
        </mesh>
        <mesh position={[0.7, -0.3, -0.3]} castShadow>
          <sphereGeometry args={[1.2, 6, 6]} />
          <meshStandardMaterial color="#22c55e" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.8, 0]} castShadow>
          <sphereGeometry args={[1.0, 6, 6]} />
          <meshStandardMaterial color="#4ade80" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
};

// 3. Cylindrical Hay Bale with twine strings
export const HayBale: React.FC<{ position: [number, number, number]; rotation?: [number, number, number] }> = ({
  position,
  rotation = [0, 0, 0]
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Hay cylinder */}
      <mesh position={[0, 0.6, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.6, 1.4, 12]} />
        <meshStandardMaterial color="#facc15" roughness={0.9} />
      </mesh>
      {/* Twine Bands */}
      {[-0.35, 0.35].map((x, i) => (
        <mesh key={i} position={[x, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.61, 0.02, 6, 12]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
      ))}
    </group>
  );
};

// 4. Wooden Fence Section
export const Fence: React.FC<{ position: [number, number, number]; rotation?: [number, number, number] }> = ({
  position,
  rotation = [0, 0, 0]
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Post 1 */}
      <mesh position={[-1.2, 0.6, 0]} castShadow>
        <boxGeometry args={[0.15, 1.2, 0.15]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>
      {/* Post 2 */}
      <mesh position={[1.2, 0.6, 0]} castShadow>
        <boxGeometry args={[0.15, 1.2, 0.15]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>
      {/* Top Rail */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[2.5, 0.1, 0.06]} />
        <meshStandardMaterial color="#92400e" roughness={0.7} />
      </mesh>
      {/* Bottom Rail */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[2.5, 0.1, 0.06]} />
        <meshStandardMaterial color="#92400e" roughness={0.7} />
      </mesh>
    </group>
  );
};

// 5. Wooden Crate
export const WoodenCrate: React.FC<{ position: [number, number, number]; rotation?: [number, number, number]; scale?: number }> = ({
  position,
  rotation = [0, 0, 0],
  scale = 1.0
}) => {
  return (
    <mesh position={position} rotation={rotation} scale={scale} castShadow receiveShadow>
      <boxGeometry args={[0.9, 0.9, 0.9]} />
      <meshStandardMaterial color="#a16207" roughness={0.7} />
    </mesh>
  );
};

// 6. Cartoon Sunflowers
export const Sunflower: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* Stem */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.04, 1.4, 6]} />
        <meshStandardMaterial color="#15803d" />
      </mesh>
      {/* Flower Head */}
      <group position={[0, 1.4, 0.1]} rotation={[0.3, 0, 0]}>
        {/* Yellow Petals Disk */}
        <mesh>
          <cylinderGeometry args={[0.32, 0.32, 0.04, 12]} />
          <meshStandardMaterial color="#eab308" />
        </mesh>
        {/* Dark Center */}
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.05, 12]} />
          <meshStandardMaterial color="#451a03" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
};
