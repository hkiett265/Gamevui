'use client';

import React from 'react';
import * as THREE from 'three';

export const RuralHouses: React.FC = () => {
  const wallMat = new THREE.MeshStandardMaterial({
    color: '#fef3c7', // Warm rural light yellow wall
    roughness: 0.8
  });

  const roofMat = new THREE.MeshStandardMaterial({
    color: '#0284c7', // Blue corrugated metal roof
    roughness: 0.5,
    metalness: 0.3
  });

  const redRoofMat = new THREE.MeshStandardMaterial({
    color: '#b91c1c',
    roughness: 0.5,
    metalness: 0.3
  });

  const woodPillarMat = new THREE.MeshStandardMaterial({
    color: '#78350f',
    roughness: 0.8
  });

  const hayStackMat = new THREE.MeshStandardMaterial({
    color: '#ca8a04', // Golden haystack (cây rơm)
    roughness: 0.95
  });

  return (
    <group>
      {/* --- PLAYER'S STARTING HOUSE AT (x=0, z=-4) --- */}
      <group position={[0, 0, -8]}>
        {/* Main house building */}
        <mesh position={[0, 1.6, 0]} material={wallMat} castShadow>
          <boxGeometry args={[8.5, 3.2, 6.5]} />
        </mesh>
        {/* Front veranda porch */}
        <mesh position={[0, 0.1, 4.2]} material={woodPillarMat}>
          <boxGeometry args={[8.5, 0.2, 2.4]} />
        </mesh>
        {/* Wooden veranda pillars */}
        <mesh position={[-3.8, 1.4, 5.2]} material={woodPillarMat}>
          <cylinderGeometry args={[0.09, 0.09, 2.8, 8]} />
        </mesh>
        <mesh position={[3.8, 1.4, 5.2]} material={woodPillarMat}>
          <cylinderGeometry args={[0.09, 0.09, 2.8, 8]} />
        </mesh>
        {/* Slanted blue corrugated tin roof */}
        <mesh position={[0, 3.4, 0.8]} rotation={[0.2, 0, 0]} material={roofMat} castShadow>
          <boxGeometry args={[9.8, 0.15, 8.8]} />
        </mesh>
        {/* Wooden front door */}
        <mesh position={[0, 1.2, 3.3]} material={woodPillarMat}>
          <boxGeometry args={[1.4, 2.4, 0.08]} />
        </mesh>

        {/* Golden rural haystack (Cây rơm vàng cạnh nhà) */}
        <group position={[-6.8, 0, 2]}>
          <mesh position={[0, 1.8, 0]} material={hayStackMat}>
            <coneGeometry args={[2.2, 3.6, 16]} />
          </mesh>
        </group>
      </group>

      {/* --- NEIGHBOR HOUSE 1 (x=-20, z=30) --- */}
      <group position={[-20, 0, 30]} rotation={[0, 0.35, 0]}>
        <mesh position={[0, 1.5, 0]} material={wallMat}>
          <boxGeometry args={[7.5, 3.0, 6.0]} />
        </mesh>
        <mesh position={[0, 3.1, 0.4]} rotation={[0.2, 0, 0]} material={redRoofMat}>
          <boxGeometry args={[8.8, 0.15, 7.8]} />
        </mesh>
      </group>

      {/* --- NEIGHBOR HOUSE 2 NEAR SHOP (x=85, z=110) --- */}
      <group position={[85, 0, 110]} rotation={[0, -0.4, 0]}>
        <mesh position={[0, 1.6, 0]} material={wallMat}>
          <boxGeometry args={[8.0, 3.2, 6.0]} />
        </mesh>
        <mesh position={[0, 3.3, 0.4]} rotation={[0.2, 0, 0]} material={roofMat}>
          <boxGeometry args={[9.2, 0.15, 7.8]} />
        </mesh>
      </group>
    </group>
  );
};
