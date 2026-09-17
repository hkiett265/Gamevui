'use client';

import React from 'react';
import * as THREE from 'three';
import { useJetJetStore } from '@/games/jetjet/store';

export const ShopCoBa: React.FC = () => {
  const { hasBottle, isDrinking } = useJetJetStore();

  const woodMat = new THREE.MeshStandardMaterial({
    color: '#854d0e',
    roughness: 0.8
  });

  const tinRoofMat = new THREE.MeshStandardMaterial({
    color: '#dc2626', // Red corrugated tin roof
    roughness: 0.5,
    metalness: 0.4
  });

  const awningBlueMat = new THREE.MeshStandardMaterial({
    color: '#2563eb', // Striped blue awning
    roughness: 0.8
  });

  const awningWhiteMat = new THREE.MeshStandardMaterial({
    color: '#f8fafc',
    roughness: 0.8
  });

  const signBgMat = new THREE.MeshStandardMaterial({
    color: '#fef08a', // Yellow painted wooden sign
    roughness: 0.5
  });

  const redPlasticMat = new THREE.MeshStandardMaterial({
    color: '#ef4444', // Iconic Vietnamese Song Long red plastic chair
    roughness: 0.35,
    metalness: 0.05
  });

  const greenCrateMat = new THREE.MeshStandardMaterial({
    color: '#15803d',
    roughness: 0.5
  });

  const redCrateMat = new THREE.MeshStandardMaterial({
    color: '#b91c1c',
    roughness: 0.5
  });

  const glassFridgeMat = new THREE.MeshStandardMaterial({
    color: '#e0f2fe',
    roughness: 0.1,
    metalness: 0.3,
    transparent: true,
    opacity: 0.65
  });

  const fridgeFrameMat = new THREE.MeshStandardMaterial({
    color: '#0284c7',
    roughness: 0.4
  });

  const redDrinkMat = new THREE.MeshPhysicalMaterial({
    color: '#ef4444',
    transmission: 0.8,
    transparent: true,
    roughness: 0.1
  });

  return (
    <group position={[65, 0, 140]}>
      {/* --- MAIN GROCERY STRUCTURE (TẠP HÓA CÔ BA) --- */}
      {/* Floor foundation */}
      <mesh position={[0, 0.1, 0]} material={woodMat}>
        <boxGeometry args={[9, 0.2, 7]} />
      </mesh>

      {/* Back and side wooden planks */}
      <mesh position={[0, 1.8, -3.4]} material={woodMat}>
        <boxGeometry args={[9, 3.4, 0.2]} />
      </mesh>
      <mesh position={[-4.4, 1.8, 0]} material={woodMat}>
        <boxGeometry args={[0.2, 3.4, 6.8]} />
      </mesh>
      <mesh position={[4.4, 1.8, 0]} material={woodMat}>
        <boxGeometry args={[0.2, 3.4, 6.8]} />
      </mesh>

      {/* Front Pillars */}
      <mesh position={[-4.1, 1.6, 3.2]} material={woodMat}>
        <cylinderGeometry args={[0.1, 0.1, 3.2, 8]} />
      </mesh>
      <mesh position={[4.1, 1.6, 3.2]} material={woodMat}>
        <cylinderGeometry args={[0.1, 0.1, 3.2, 8]} />
      </mesh>

      {/* Red Corrugated Tin Roof (Mái tôn đỏ) */}
      <mesh position={[0, 3.6, 0.2]} rotation={[0.25, 0, 0]} material={tinRoofMat}>
        <boxGeometry args={[10.2, 0.12, 8.4]} />
      </mesh>

      {/* Striped Sunshade Awning (Mái bạt di động sọc xanh trắng) */}
      <group position={[0, 2.7, 4.4]} rotation={[0.45, 0, 0]}>
        {[-3.6, -1.8, 0, 1.8, 3.6].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} material={i % 2 === 0 ? awningBlueMat : awningWhiteMat}>
            <boxGeometry args={[1.8, 0.05, 2.6]} />
          </mesh>
        ))}
      </group>

      {/* --- HAND-PAINTED SIGNBOARD: TẠP HÓA CÔ BA --- */}
      <group position={[0, 3.1, 3.4]} rotation={[0.05, 0, 0]}>
        <mesh material={signBgMat}>
          <boxGeometry args={[6.8, 0.8, 0.08]} />
        </mesh>
        {/* Sign border */}
        <mesh position={[0, 0, 0.045]} material={redPlasticMat}>
          <boxGeometry args={[6.6, 0.65, 0.02]} />
        </mesh>
        <mesh position={[0, 0, 0.06]} material={signBgMat}>
          <boxGeometry args={[6.4, 0.5, 0.02]} />
        </mesh>
      </group>

      {/* --- DRINK COOLER DISPLAY FRIDGE (TỦ MÁT NƯỚC NGỌT) --- */}
      <group position={[-2.2, 1.2, 1.2]}>
        {/* Outer body frame */}
        <mesh material={fridgeFrameMat}>
          <boxGeometry args={[1.4, 2.2, 1.1]} />
        </mesh>
        {/* Front glass door */}
        <mesh position={[0, 0, 0.56]} material={glassFridgeMat}>
          <boxGeometry args={[1.2, 1.9, 0.05]} />
        </mesh>
        {/* Inner shelves filled with drinks */}
        {[-0.6, -0.1, 0.4, 0.8].map((y, i) => (
          <group key={i} position={[0, y, 0]}>
            {[-0.4, -0.15, 0.1, 0.35].map((x, j) => (
              <mesh key={j} position={[x, 0.12, 0.2]} material={redDrinkMat}>
                <cylinderGeometry args={[0.04, 0.045, 0.22, 10]} />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* --- FRONT SERVING COUNTER TABLE --- */}
      <group position={[1.4, 0.6, 1.8]}>
        <mesh material={woodMat}>
          <boxGeometry args={[3.2, 1.1, 1.2]} />
        </mesh>

        {/* PROMINENT INTERACTION RED STING BOTTLE ON COUNTER */}
        {!hasBottle && !isDrinking && (
          <group position={[0, 0.72, 0]}>
            {/* Glowing aura halo */}
            <mesh>
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshBasicMaterial color="#ef4444" transparent opacity={0.35} />
            </mesh>
            {/* Bottle */}
            <mesh material={redDrinkMat}>
              <cylinderGeometry args={[0.05, 0.055, 0.3, 16]} />
            </mesh>
            <mesh position={[0, 0.18, 0]} material={redPlasticMat}>
              <cylinderGeometry args={[0.025, 0.025, 0.08, 12]} />
            </mesh>
          </group>
        )}
      </group>

      {/* --- STACKS OF BEVERAGE CRATES (KÉT NƯỚC NGỌT XANH / ĐỎ) --- */}
      <group position={[3.2, 0.4, 0.5]}>
        <mesh position={[0, 0, 0]} material={redCrateMat}>
          <boxGeometry args={[0.7, 0.35, 0.9]} />
        </mesh>
        <mesh position={[0, 0.36, 0]} material={greenCrateMat}>
          <boxGeometry args={[0.7, 0.35, 0.9]} />
        </mesh>
        <mesh position={[0, 0.72, 0]} material={redCrateMat}>
          <boxGeometry args={[0.7, 0.35, 0.9]} />
        </mesh>
      </group>

      {/* --- ICONIC RED PLASTIC CHAIRS & TABLE (GHẾ NHỰA SONG LONG) --- */}
      {/* Red Plastic Round Table */}
      <group position={[-1.2, 0.45, 4.8]}>
        <mesh material={redPlasticMat}>
          <cylinderGeometry args={[0.65, 0.65, 0.04, 20]} />
        </mesh>
        <mesh position={[0, -0.4, 0]} material={redPlasticMat}>
          <cylinderGeometry args={[0.06, 0.06, 0.8, 8]} />
        </mesh>
      </group>

      {/* Red Plastic Stools surrounding table */}
      {[
        [-1.2, 0.22, 3.8],
        [-1.2, 0.22, 5.8],
        [-0.3, 0.22, 4.8],
        [-2.1, 0.22, 4.8]
      ].map((p, i) => (
        <group key={i} position={[p[0], p[1], p[2]]}>
          {/* Seat */}
          <mesh material={redPlasticMat}>
            <boxGeometry args={[0.36, 0.04, 0.36]} />
          </mesh>
          {/* Legs */}
          <mesh position={[-0.14, -0.2, -0.14]} material={redPlasticMat}>
            <cylinderGeometry args={[0.02, 0.02, 0.4, 6]} />
          </mesh>
          <mesh position={[0.14, -0.2, -0.14]} material={redPlasticMat}>
            <cylinderGeometry args={[0.02, 0.02, 0.4, 6]} />
          </mesh>
          <mesh position={[-0.14, -0.2, 0.14]} material={redPlasticMat}>
            <cylinderGeometry args={[0.02, 0.02, 0.4, 6]} />
          </mesh>
          <mesh position={[0.14, -0.2, 0.14]} material={redPlasticMat}>
            <cylinderGeometry args={[0.02, 0.02, 0.4, 6]} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
