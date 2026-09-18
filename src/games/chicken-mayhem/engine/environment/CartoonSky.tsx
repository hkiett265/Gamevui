'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// Single Low-poly Puffy Cloud
const PuffyCloud: React.FC<{ initialPos: [number, number, number]; speed: number; scale?: number }> = ({
  initialPos,
  speed,
  scale = 1.0
}) => {
  const cloudRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (cloudRef.current) {
      cloudRef.current.position.x += delta * speed;
      // Wrap around
      if (cloudRef.current.position.x > 55) {
        cloudRef.current.position.x = -55;
      }
    }
  });

  return (
    <group ref={cloudRef} position={initialPos} scale={scale}>
      {/* 5-6 Intersecting Low Poly Spheres to form a puffy cloud */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2.5, 7, 7]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      <mesh position={[-1.8, -0.4, 0.4]}>
        <sphereGeometry args={[1.8, 6, 6]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      <mesh position={[1.8, -0.3, -0.3]}>
        <sphereGeometry args={[1.9, 6, 6]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      <mesh position={[0.9, 1.0, 0.2]}>
        <sphereGeometry args={[1.6, 6, 6]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      <mesh position={[-0.9, 0.8, -0.2]}>
        <sphereGeometry args={[1.5, 6, 6]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
    </group>
  );
};

export const CartoonSky: React.FC = () => {
  return (
    <group>
      {/* Cartoon Sun */}
      <group position={[-25, 30, -45]}>
        <mesh>
          <sphereGeometry args={[4.5, 12, 12]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
        {/* Sun Corona / Glow */}
        <mesh>
          <sphereGeometry args={[5.5, 12, 12]} />
          <meshBasicMaterial color="#fde047" transparent opacity={0.3} />
        </mesh>
      </group>

      {/* Floating Low-Poly Clouds */}
      <PuffyCloud initialPos={[-35, 18, -35]} speed={0.8} scale={1.2} />
      <PuffyCloud initialPos={[-10, 24, -40]} speed={1.1} scale={1.5} />
      <PuffyCloud initialPos={[18, 20, -32]} speed={0.9} scale={1.3} />
      <PuffyCloud initialPos={[38, 26, -45]} speed={1.2} scale={1.6} />
      <PuffyCloud initialPos={[-22, 22, -25]} speed={0.7} scale={0.9} />
      <PuffyCloud initialPos={[5, 16, -20]} speed={0.85} scale={1.0} />

      {/* Distant Rolling Background Hills (Depth!) */}
      <mesh position={[-25, -2, -60]}>
        <sphereGeometry args={[35, 16, 12]} />
        <meshStandardMaterial color="#65a30d" roughness={0.9} />
      </mesh>
      <mesh position={[20, -4, -65]}>
        <sphereGeometry args={[40, 16, 12]} />
        <meshStandardMaterial color="#4d7c0f" roughness={0.9} />
      </mesh>
      <mesh position={[0, -5, -75]}>
        <sphereGeometry args={[50, 16, 12]} />
        <meshStandardMaterial color="#3f6212" roughness={0.9} />
      </mesh>
    </group>
  );
};
