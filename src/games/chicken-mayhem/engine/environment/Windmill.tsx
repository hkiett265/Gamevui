'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface WindmillProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export const Windmill: React.FC<WindmillProps> = ({
  position = [12, 0, -22],
  rotation = [0, -0.6, 0]
}) => {
  const sailsRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (sailsRef.current) {
      sailsRef.current.rotation.z += delta * 0.8;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* 1. Stone Foundation */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.4, 2.7, 0.8, 8]} />
        <meshStandardMaterial color="#64748b" roughness={0.9} />
      </mesh>

      {/* 2. Wooden Tapered Tower */}
      <mesh position={[0, 4.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 2.3, 7.0, 8]} />
        <meshStandardMaterial color="#b45309" roughness={0.7} />
      </mesh>

      {/* Wooden trim rings */}
      <mesh position={[0, 4.0, 0]}>
        <cylinderGeometry args={[1.95, 1.95, 0.2, 8]} />
        <meshStandardMaterial color="#78350f" roughness={0.6} />
      </mesh>

      {/* 3. Roof Cap */}
      <mesh position={[0, 8.4, 0]} castShadow>
        <coneGeometry args={[1.9, 1.8, 8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} />
      </mesh>

      {/* Door */}
      <mesh position={[0, 1.1, 2.35]} rotation={[0.07, 0, 0]}>
        <boxGeometry args={[0.9, 1.4, 0.15]} />
        <meshStandardMaterial color="#451a03" roughness={0.8} />
      </mesh>

      {/* Windows */}
      <mesh position={[0, 5.0, 1.7]} rotation={[0.07, 0, 0]}>
        <boxGeometry args={[0.5, 0.6, 0.1]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.3} />
      </mesh>

      {/* 4. Axle & Sails Rotor */}
      <group position={[0, 7.2, 1.7]}>
        {/* Axle pin */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.8, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>

        {/* 4 Rotating Sails */}
        <group ref={sailsRef} position={[0, 0, 0.4]}>
          {/* Central wooden hub */}
          <mesh>
            <cylinderGeometry args={[0.45, 0.45, 0.25, 8]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>

          {/* 4 Blades spaced at 90 deg */}
          {[0, 1, 2, 3].map((i) => (
            <group key={i} rotation={[0, 0, (i * Math.PI) / 2]}>
              {/* Spar beam */}
              <mesh position={[0, 2.2, 0]}>
                <boxGeometry args={[0.08, 4.4, 0.08]} />
                <meshStandardMaterial color="#451a03" />
              </mesh>
              {/* Canvas sail cloth */}
              <mesh position={[0.3, 2.5, 0.02]} castShadow>
                <boxGeometry args={[0.55, 3.2, 0.02]} />
                <meshStandardMaterial color="#f8fafc" roughness={0.8} />
              </mesh>
            </group>
          ))}
        </group>
      </group>
    </group>
  );
};
