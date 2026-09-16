'use client';

import React from 'react';

interface ChickenCoopProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export const ChickenCoop: React.FC<ChickenCoopProps> = ({
  position = [6, 0, -14],
  rotation = [0, -0.4, 0]
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* 4 Wooden Stilts */}
      {[-1.2, 1.2].map((x, xi) =>
        [-1.2, 1.2].map((z, zi) => (
          <mesh key={`${xi}-${zi}`} position={[x, 0.45, z]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.9, 6]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
        ))
      )}

      {/* Coop Wooden Shed */}
      <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 1.8, 2.8]} />
        <meshStandardMaterial color="#b45309" roughness={0.7} />
      </mesh>

      {/* Slanted Green Tin Roof */}
      <mesh position={[0, 2.85, 0]} rotation={[0.1, 0, 0]} castShadow>
        <boxGeometry args={[3.2, 0.15, 3.2]} />
        <meshStandardMaterial color="#15803d" roughness={0.4} />
      </mesh>

      {/* Chicken Entrance Door */}
      <mesh position={[0, 1.35, 1.41]}>
        <boxGeometry args={[0.7, 0.9, 0.05]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>

      {/* Chicken Walking Ramp */}
      <group position={[0, 0.45, 2.0]} rotation={[-0.45, 0, 0]}>
        {/* Main ramp plank */}
        <mesh castShadow>
          <boxGeometry args={[0.65, 0.06, 1.6]} />
          <meshStandardMaterial color="#92400e" />
        </mesh>
        {/* Horizontal foot steps / rungs */}
        {[-0.5, -0.2, 0.1, 0.4].map((z, i) => (
          <mesh key={i} position={[0, 0.04, z]}>
            <boxGeometry args={[0.6, 0.03, 0.06]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
        ))}
      </group>

      {/* Weather Vane (Rooster on top) */}
      <group position={[0, 3.2, 0]}>
        {/* Spindle */}
        <mesh>
          <cylinderGeometry args={[0.02, 0.02, 0.6, 6]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        {/* Rooster silhouette fin */}
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.02, 0.25, 0.4]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.7} />
        </mesh>
      </group>
    </group>
  );
};
