'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface FarmhouseProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export const Farmhouse: React.FC<FarmhouseProps> = ({
  position = [-14, 0, -20],
  rotation = [0, 0.5, 0]
}) => {
  const chimneySmokeRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (chimneySmokeRef.current) {
      chimneySmokeRef.current.children.forEach((puff, idx) => {
        puff.position.y += delta * 0.8;
        puff.scale.addScalar(delta * 0.2);
        if (puff.position.y > 2.5) {
          puff.position.y = 0;
          puff.scale.set(1, 1, 1);
        }
      });
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* 1. Main Barn Body (Red wooden boards) */}
      <mesh position={[0, 3, 0]} castShadow receiveShadow>
        <boxGeometry args={[7, 6, 9]} />
        <meshStandardMaterial color="#dc2626" roughness={0.65} />
      </mesh>

      {/* 2. White Corner Trim Columns */}
      {[-3.52, 3.52].map((x, xi) =>
        [-4.52, 4.52].map((z, zi) => (
          <mesh key={`${xi}-${zi}`} position={[x, 3, z]}>
            <boxGeometry args={[0.25, 6.05, 0.25]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.4} />
          </mesh>
        ))
      )}

      {/* 3. Gambrel / Slanted Roof */}
      <group position={[0, 6, 0]}>
        {/* Main slanted roof structure */}
        <mesh position={[0, 1.8, 0]} rotation={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.2, 4.8, 9.4, 4, 1, false, Math.PI / 4]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
        {/* Roof trim fascia */}
        <mesh position={[0, 1.8, 4.75]}>
          <boxGeometry args={[5.2, 0.2, 0.2]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <mesh position={[0, 1.8, -4.75]}>
          <boxGeometry args={[5.2, 0.2, 0.2]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
      </group>

      {/* 4. Large White Barn Doors */}
      <group position={[0, 2, 4.55]}>
        <mesh position={[-1.2, 0, 0]} castShadow>
          <boxGeometry args={[2.2, 4, 0.1]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} />
        </mesh>
        {/* X-Brace on Left Door */}
        <mesh position={[-1.2, 0, 0.06]} rotation={[0, 0, 0.5]}>
          <boxGeometry args={[0.25, 4.2, 0.04]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        <mesh position={[-1.2, 0, 0.06]} rotation={[0, 0, -0.5]}>
          <boxGeometry args={[0.25, 4.2, 0.04]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>

        <mesh position={[1.2, 0, 0]} castShadow>
          <boxGeometry args={[2.2, 4, 0.1]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} />
        </mesh>
        {/* X-Brace on Right Door */}
        <mesh position={[1.2, 0, 0.06]} rotation={[0, 0, 0.5]}>
          <boxGeometry args={[0.25, 4.2, 0.04]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
        <mesh position={[1.2, 0, 0.06]} rotation={[0, 0, -0.5]}>
          <boxGeometry args={[0.25, 4.2, 0.04]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </group>

      {/* 5. Upper Hayloft Door */}
      <mesh position={[0, 6.2, 4.55]}>
        <boxGeometry args={[1.6, 1.6, 0.1]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>

      {/* 6. Stone Chimney with Smoke */}
      <group position={[2.5, 6.8, -2]}>
        <mesh castShadow>
          <boxGeometry args={[0.9, 2.5, 0.9]} />
          <meshStandardMaterial color="#78716c" roughness={0.9} />
        </mesh>
        {/* Chimney top rim */}
        <mesh position={[0, 1.3, 0]}>
          <boxGeometry args={[1.05, 0.2, 1.05]} />
          <meshStandardMaterial color="#44403c" roughness={0.8} />
        </mesh>

        {/* Animated Smoke Puffs */}
        <group ref={chimneySmokeRef} position={[0, 1.5, 0]}>
          <mesh position={[0.05, 0.2, 0]}>
            <sphereGeometry args={[0.25, 6, 6]} />
            <meshStandardMaterial color="#e2e8f0" transparent opacity={0.6} />
          </mesh>
          <mesh position={[-0.1, 0.9, 0.05]}>
            <sphereGeometry args={[0.35, 6, 6]} />
            <meshStandardMaterial color="#cbd5e1" transparent opacity={0.5} />
          </mesh>
          <mesh position={[0.1, 1.7, -0.05]}>
            <sphereGeometry args={[0.45, 6, 6]} />
            <meshStandardMaterial color="#cbd5e1" transparent opacity={0.35} />
          </mesh>
        </group>
      </group>

      {/* Warm Side Windows */}
      {[-2, 2].map((z, zi) => (
        <mesh key={zi} position={[-3.55, 3.2, z]} rotation={[0, -Math.PI / 2, 0]}>
          <boxGeometry args={[1.2, 1.4, 0.1]} />
          <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.4} />
        </mesh>
      ))}
    </group>
  );
};
