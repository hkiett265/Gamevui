'use client';

import React from 'react';
import * as THREE from 'three';

export const MienTayWorld: React.FC = () => {
  const groundMat = new THREE.MeshStandardMaterial({
    color: '#3f6212', // Lush Mekong grass
    roughness: 0.9,
    metalness: 0.05
  });

  const concreteRoadMat = new THREE.MeshStandardMaterial({
    color: '#94a3b8', // Smooth rural concrete slab road
    roughness: 0.8,
    metalness: 0.1
  });

  const roadEdgeMat = new THREE.MeshStandardMaterial({
    color: '#cbd5e1', // White painted road edge boundary
    roughness: 0.6
  });

  const dirtRoadMat = new THREE.MeshStandardMaterial({
    color: '#78350f', // Alluvial dirt shoulders
    roughness: 0.95
  });

  const canalWaterMat = new THREE.MeshStandardMaterial({
    color: '#0d9488', // Mekong alluvial canal water
    roughness: 0.1,
    metalness: 0.35,
    transparent: true,
    opacity: 0.92
  });

  const bridgeConcreteMat = new THREE.MeshStandardMaterial({
    color: '#cbd5e1',
    roughness: 0.65
  });

  const railingRedWhiteMat = new THREE.MeshStandardMaterial({
    color: '#ef4444',
    roughness: 0.4
  });

  const poleMat = new THREE.MeshStandardMaterial({
    color: '#64748b',
    roughness: 0.8
  });

  const wireMat = new THREE.MeshBasicMaterial({
    color: '#09090b'
  });

  const signBoardMat = new THREE.MeshStandardMaterial({
    color: '#f59e0b',
    roughness: 0.4
  });

  const poles = [
    [-4.5, 0, -10],
    [-4.5, 0, 15],
    [6, 0, 38],
    [32, 0, 68],
    [48, 0, 96],
    [60, 0, 124],
    [75, 0, 154]
  ];

  return (
    <group>
      {/* --- VAST BASE TERRAIN --- */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 60]} receiveShadow material={groundMat}>
        <planeGeometry args={[260, 320]} />
      </mesh>

      {/* --- ALLUVIAL CANAL (KÊNH NƯỚC RỘNG 14M) --- */}
      <group position={[25, -0.28, 52]} rotation={[0, -0.75, 0]}>
        {/* Canal Water surface */}
        <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0, 0]} material={canalWaterMat}>
          <planeGeometry args={[260, 14]} />
        </mesh>
        {/* Canal Embankment banks */}
        <mesh position={[0, 0.08, -8]} material={dirtRoadMat}>
          <boxGeometry args={[260, 0.45, 3]} />
        </mesh>
        <mesh position={[0, 0.08, 8]} material={dirtRoadMat}>
          <boxGeometry args={[260, 0.45, 3]} />
        </mesh>
      </group>

      {/* --- SEAMLESS CONCRETE ROAD SYSTEM --- */}
      {/* SEGMENT 1: Straight lane from House (z=-12) to turn (z=32) */}
      <group position={[0, 0.02, 10]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={concreteRoadMat}>
          <planeGeometry args={[4.4, 46]} />
        </mesh>
        {/* Road white borders */}
        <mesh position={[-2.2, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} material={roadEdgeMat}>
          <planeGeometry args={[0.15, 46]} />
        </mesh>
        <mesh position={[2.2, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} material={roadEdgeMat}>
          <planeGeometry args={[0.15, 46]} />
        </mesh>
        {/* Dirt shoulder */}
        <mesh position={[-2.8, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} material={dirtRoadMat}>
          <planeGeometry args={[1.1, 46]} />
        </mesh>
        <mesh position={[2.8, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} material={dirtRoadMat}>
          <planeGeometry args={[1.1, 46]} />
        </mesh>
      </group>

      {/* SEGMENT 2: Smooth Curve entering the Bridge */}
      <group position={[6.5, 0.02, 38]} rotation={[-Math.PI / 2, 0, -0.6]}>
        <mesh receiveShadow material={concreteRoadMat}>
          <planeGeometry args={[4.4, 18]} />
        </mesh>
        <mesh position={[-2.2, 0.005, 0]} material={roadEdgeMat}>
          <planeGeometry args={[0.15, 18]} />
        </mesh>
        <mesh position={[2.2, 0.005, 0]} material={roadEdgeMat}>
          <planeGeometry args={[0.15, 18]} />
        </mesh>
      </group>

      {/* --- ARCHED CONCRETE BRIDGE OVER CANAL WITH SMOOTH ENTRY/EXIT RAMPS --- */}
      <group position={[22, 0, 52]} rotation={[0, -0.75, 0]}>
        {/* Central Arch Deck (y = 0.58) */}
        <mesh position={[0, 0.45, 0]} material={bridgeConcreteMat}>
          <boxGeometry args={[4.6, 0.28, 10]} />
        </mesh>

        {/* Smooth Entry Ramp (Rising from y=0 to y=0.58) */}
        <mesh position={[0, 0.24, -8]} rotation={[0.07, 0, 0]} material={bridgeConcreteMat}>
          <boxGeometry args={[4.6, 0.24, 6.2]} />
        </mesh>

        {/* Smooth Exit Ramp (Descending from y=0.58 to y=0) */}
        <mesh position={[0, 0.24, 8]} rotation={[-0.07, 0, 0]} material={bridgeConcreteMat}>
          <boxGeometry args={[4.6, 0.24, 6.2]} />
        </mesh>

        {/* Left Bridge Railing (Red & White Safety Pillars) */}
        <mesh position={[-2.2, 0.85, 0]} material={railingRedWhiteMat}>
          <boxGeometry args={[0.18, 0.6, 22]} />
        </mesh>
        {/* Right Bridge Railing */}
        <mesh position={[2.2, 0.85, 0]} material={railingRedWhiteMat}>
          <boxGeometry args={[0.18, 0.6, 22]} />
        </mesh>

        {/* Bridge Support Pillars deep into canal */}
        <mesh position={[-1.8, -0.8, 0]} material={bridgeConcreteMat}>
          <cylinderGeometry args={[0.35, 0.4, 2.8, 12]} />
        </mesh>
        <mesh position={[1.8, -0.8, 0]} material={bridgeConcreteMat}>
          <cylinderGeometry args={[0.35, 0.4, 2.8, 12]} />
        </mesh>
      </group>

      {/* SEGMENT 3: Road from Bridge Exit to Midpoint */}
      <group position={[38, 0.02, 76]} rotation={[-Math.PI / 2, 0, -0.45]}>
        <mesh receiveShadow material={concreteRoadMat}>
          <planeGeometry args={[4.4, 38]} />
        </mesh>
        <mesh position={[-2.2, 0.005, 0]} material={roadEdgeMat}>
          <planeGeometry args={[0.15, 38]} />
        </mesh>
        <mesh position={[2.2, 0.005, 0]} material={roadEdgeMat}>
          <planeGeometry args={[0.15, 38]} />
        </mesh>
      </group>

      {/* SEGMENT 4: Road entering Tạp Hóa Cô Ba */}
      <group position={[54, 0.02, 114]} rotation={[-Math.PI / 2, 0, -0.2]}>
        <mesh receiveShadow material={concreteRoadMat}>
          <planeGeometry args={[4.4, 46]} />
        </mesh>
        <mesh position={[-2.2, 0.005, 0]} material={roadEdgeMat}>
          <planeGeometry args={[0.15, 46]} />
        </mesh>
        <mesh position={[2.2, 0.005, 0]} material={roadEdgeMat}>
          <planeGeometry args={[0.15, 46]} />
        </mesh>
      </group>

      {/* Shop Front Paved Parking Courtyard (x=65, z=140) */}
      <mesh position={[65, 0.015, 140]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={concreteRoadMat}>
        <planeGeometry args={[26, 22]} />
      </mesh>

      {/* --- POWER POLES & ELECTRIC WIRES --- */}
      {poles.map((p, idx) => (
        <group key={idx} position={[p[0], p[1], p[2]]}>
          <mesh position={[0, 4, 0]} material={poleMat} castShadow>
            <cylinderGeometry args={[0.14, 0.22, 8, 12]} />
          </mesh>
          <mesh position={[0, 7.6, 0]} material={poleMat}>
            <boxGeometry args={[1.4, 0.12, 0.12]} />
          </mesh>
          <mesh position={[-0.55, 7.8, 0]} material={bridgeConcreteMat}>
            <cylinderGeometry args={[0.06, 0.06, 0.2, 8]} />
          </mesh>
          <mesh position={[0.55, 7.8, 0]} material={bridgeConcreteMat}>
            <cylinderGeometry args={[0.06, 0.06, 0.2, 8]} />
          </mesh>
        </group>
      ))}

      {/* Wires connecting poles */}
      {poles.slice(0, -1).map((p, idx) => {
        const next = poles[idx + 1];
        const midX = (p[0] + next[0]) / 2;
        const midZ = (p[2] + next[2]) / 2;
        const dist = Math.hypot(next[0] - p[0], next[2] - p[2]);
        const angle = Math.atan2(next[0] - p[0], next[2] - p[2]);

        return (
          <group key={idx} position={[midX, 7.2, midZ]} rotation={[0, angle, 0]}>
            <mesh position={[0, -0.25, 0]} material={wireMat}>
              <cylinderGeometry args={[0.012, 0.012, dist, 6]} />
            </mesh>
          </group>
        );
      })}

      {/* --- ROAD SIGN: CHẠY CHẬM THÔI ANH HAI --- */}
      <group position={[3.2, 0, 4]} rotation={[0, -0.2, 0]}>
        <mesh position={[0, 1.2, 0]} material={poleMat}>
          <cylinderGeometry args={[0.04, 0.04, 2.4, 8]} />
        </mesh>
        <mesh position={[0, 2.1, 0.02]} material={signBoardMat}>
          <boxGeometry args={[1.6, 0.6, 0.05]} />
        </mesh>
        <mesh position={[0, 2.1, 0.05]}>
          <planeGeometry args={[1.4, 0.45]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  );
};
