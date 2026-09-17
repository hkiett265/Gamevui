'use client';

import React from 'react';

interface TractorProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export const Tractor: React.FC<TractorProps> = ({
  position = [-5, 0, -11],
  rotation = [0, 0.4, 0]
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* 1. Large Rear Wheels (Left & Right) */}
      <mesh position={[-0.95, 0.75, -0.6]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.75, 0.75, 0.35, 12]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      {/* Rear Wheel Rim */}
      <mesh position={[-0.95, 0.75, -0.6]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.45, 0.45, 0.36, 12]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.4} />
      </mesh>

      <mesh position={[0.95, 0.75, -0.6]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.75, 0.75, 0.35, 12]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      <mesh position={[0.95, 0.75, -0.6]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.45, 0.45, 0.36, 12]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.4} />
      </mesh>

      {/* 2. Smaller Front Wheels */}
      <mesh position={[-0.8, 0.45, 1.3]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.45, 0.45, 0.25, 12]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      <mesh position={[-0.8, 0.45, 1.3]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.25, 0.26, 12]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.4} />
      </mesh>

      <mesh position={[0.8, 0.45, 1.3]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.45, 0.45, 0.25, 12]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      <mesh position={[0.8, 0.45, 1.3]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.25, 0.26, 12]} />
        <meshStandardMaterial color="#fbbf24" roughness={0.4} />
      </mesh>

      {/* 3. Green Chassis / Engine Bonnet */}
      <mesh position={[0, 0.85, 0.6]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.8, 1.8]} />
        <meshStandardMaterial color="#16a34a" roughness={0.4} />
      </mesh>

      {/* Front Radiator Grille */}
      <mesh position={[0, 0.85, 1.51]}>
        <boxGeometry args={[0.9, 0.65, 0.05]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* 2 Cartoon Headlights */}
      {[-0.35, 0.35].map((x, i) => (
        <mesh key={i} position={[x, 1.1, 1.52]}>
          <cylinderGeometry args={[0.12, 0.12, 0.08, 8]} />
          <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.5} />
        </mesh>
      ))}

      {/* 4. Driver Cabin / Open Seat */}
      <mesh position={[0, 1.05, -0.6]} castShadow>
        <boxGeometry args={[1.3, 0.6, 1.0]} />
        <meshStandardMaterial color="#15803d" roughness={0.5} />
      </mesh>

      {/* Tractor Seat */}
      <mesh position={[0, 1.45, -0.7]}>
        <boxGeometry args={[0.6, 0.1, 0.5]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* Seat Backrest */}
      <mesh position={[0, 1.75, -0.9]}>
        <boxGeometry args={[0.6, 0.5, 0.1]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Steering Wheel */}
      <group position={[0, 1.55, -0.3]} rotation={[0.6, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.03, 0.03, 0.4, 6]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.18, 0.025, 6, 12]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>

      {/* 5. Exhaust Chimney Pipe */}
      <group position={[0.4, 1.5, 1.0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.9, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.7} />
        </mesh>
        {/* Curved rain cap */}
        <mesh position={[0, 0.48, 0.05]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.1, 0.02, 0.14]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>
    </group>
  );
};
