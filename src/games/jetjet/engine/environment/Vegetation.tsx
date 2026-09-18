'use client';

import React from 'react';
import * as THREE from 'three';

export const Vegetation: React.FC = () => {
  const trunkMat = new THREE.MeshStandardMaterial({
    color: '#78350f',
    roughness: 0.9
  });

  const coconutLeavesMat = new THREE.MeshStandardMaterial({
    color: '#15803d',
    roughness: 0.65,
    side: THREE.DoubleSide
  });

  const coconutNutMat = new THREE.MeshStandardMaterial({
    color: '#84cc16',
    roughness: 0.5
  });

  const bananaLeafMat = new THREE.MeshStandardMaterial({
    color: '#22c55e',
    roughness: 0.6,
    side: THREE.DoubleSide
  });

  const bushMat = new THREE.MeshStandardMaterial({
    color: '#166534',
    roughness: 0.8
  });

  // Coconut tree positions along roads and canal
  const coconutTrees: [number, number, number, number][] = [
    [-12, 0, -8, 0.2],
    [-14, 0, 12, -0.15],
    [12, 0, -4, 0.1],
    [8, 0, 26, -0.25],
    [16, 0, 36, 0.3],
    [32, 0, 38, -0.35],
    [36, 0, 68, 0.15],
    [48, 0, 72, -0.2],
    [58, 0, 110, 0.25],
    [78, 0, 125, -0.1],
    [84, 0, 155, 0.3],
    [52, 0, 160, -0.25],
    [24, 0, 115, 0.15]
  ];

  // Banana grove clusters
  const bananaGroves: [number, number, number][] = [
    [-15, 0, 2],
    [-8, 0, 32],
    [4, 0, 52],
    [42, 0, 55],
    [55, 0, 95],
    [76, 0, 138],
    [45, 0, 145]
  ];

  // Bushes along road
  const bushes: [number, number, number, number][] = [
    [-3.2, 0, 8, 1.1],
    [3.1, 0, 22, 1.4],
    [-3.0, 0, 30, 0.9],
    [16, 0, 48, 1.2],
    [38, 0, 78, 1.3],
    [52, 0, 105, 1.0],
    [56, 0, 128, 1.5],
    [72, 0, 145, 1.2]
  ];

  return (
    <group>
      {/* --- COCONUT PALM TREES (CÂY DỪA XIÊM MIỀN TÂY) --- */}
      {coconutTrees.map((tree, idx) => (
        <group key={idx} position={[tree[0], tree[1], tree[2]]} rotation={[0, 0, tree[3]]}>
          {/* Curved segmented trunk */}
          <mesh position={[0, 4.5, 0]} material={trunkMat} castShadow>
            <cylinderGeometry args={[0.22, 0.35, 9, 10]} />
          </mesh>

          {/* Coconut bunch */}
          <group position={[0, 8.6, 0]}>
            {[0, 1.2, 2.4, 3.6, 4.8].map((angle, i) => (
              <mesh key={i} position={[Math.cos(angle) * 0.35, -0.2, Math.sin(angle) * 0.35]} material={coconutNutMat}>
                <sphereGeometry args={[0.18, 8, 8]} />
              </mesh>
            ))}
          </group>

          {/* Spreading tropical palm fronds */}
          <group position={[0, 8.9, 0]}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
              <mesh
                key={i}
                rotation={[0.65, (deg * Math.PI) / 180, 0]}
                position={[0, 0, 0]}
                material={coconutLeavesMat}
              >
                <coneGeometry args={[0.7, 4.5, 4]} />
              </mesh>
            ))}
          </group>
        </group>
      ))}

      {/* --- BANANA TREE GROVES (BỤI CHUỐI MIỀN TÂY) --- */}
      {bananaGroves.map((grove, idx) => (
        <group key={idx} position={[grove[0], grove[1], grove[2]]}>
          {/* Central soft trunk */}
          <mesh position={[0, 1.4, 0]} material={bananaLeafMat}>
            <cylinderGeometry args={[0.18, 0.26, 2.8, 8]} />
          </mesh>
          {/* Broad fan leaves */}
          {[0, 72, 144, 216, 288].map((deg, i) => (
            <group key={i} rotation={[0.4, (deg * Math.PI) / 180, 0]} position={[0, 2.6, 0]}>
              <mesh position={[0, 0.8, 1.1]} rotation={[-0.4, 0, 0]} material={bananaLeafMat}>
                <boxGeometry args={[0.65, 0.02, 2.4]} />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* --- ROADSIDE BUSHES --- */}
      {bushes.map((b, idx) => (
        <mesh key={idx} position={[b[0], b[3] * 0.45, b[2]]} material={bushMat}>
          <sphereGeometry args={[b[3] * 0.7, 10, 8]} />
        </mesh>
      ))}
    </group>
  );
};
