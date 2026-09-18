'use client';

import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '@/games/chicken-mayhem/store';

export const BonusBalloon: React.FC<{ id: string; startPos: [number, number, number] }> = ({
  id,
  startPos
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [alive, setAlive] = useState(true);
  const { recordHit } = useGameStore();

  useFrame((state, delta) => {
    if (!alive || !groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Float upwards and sway gently
    groupRef.current.position.y += delta * 0.75;
    groupRef.current.position.x += Math.sin(t * 1.5) * delta * 0.6;

    if (groupRef.current.position.y > 18) {
      setAlive(false);
    }
  });

  const onHit = (hitPoint: THREE.Vector3) => {
    if (!alive) return;
    setAlive(false);
    recordHit('balloon', [hitPoint.x, hitPoint.y, hitPoint.z]);
  };

  if (!alive) return null;

  return (
    <group
      ref={groupRef}
      position={startPos}
      userData={{ isShootable: true, onHit }}
    >
      {/* Generous Invisible Hitbox Sphere */}
      <mesh visible={false}>
        <sphereGeometry args={[0.85, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Red/Yellow striped Cartoon Balloon */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.55, 12, 12]} />
        <meshStandardMaterial color="#ef4444" roughness={0.3} />
      </mesh>
      {/* Balloon Knot */}
      <mesh position={[0, -0.58, 0]}>
        <coneGeometry args={[0.08, 0.12, 6]} />
        <meshStandardMaterial color="#b91c1c" />
      </mesh>
      {/* String */}
      <mesh position={[0, -0.95, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.7, 4]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

// Target Board placed on fences / hay bales
export const TargetBoard: React.FC<{ position: [number, number, number]; rotation?: [number, number, number] }> = ({
  position,
  rotation = [0, 0, 0]
}) => {
  const [hit, setHit] = useState(false);
  const { recordHit } = useGameStore();

  const onHit = (hitPoint: THREE.Vector3) => {
    if (hit) return;
    setHit(true);
    recordHit('target', [hitPoint.x, hitPoint.y, hitPoint.z]);
    // Respawn target board after 8s
    setTimeout(() => setHit(false), 8000);
  };

  if (hit) return null;

  return (
    <group
      position={position}
      rotation={rotation}
      userData={{ isShootable: true, onHit }}
    >
      {/* Generous Target Board Hitbox */}
      <mesh visible={false}>
        <cylinderGeometry args={[0.65, 0.65, 0.15, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Outer White Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.06, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.5} />
      </mesh>
      {/* Middle Red Ring */}
      <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.06, 16]} />
        <meshStandardMaterial color="#ef4444" roughness={0.5} />
      </mesh>
      {/* Bullseye Gold Center */}
      <mesh position={[0, 0, 0.07]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.06, 16]} />
        <meshStandardMaterial color="#eab308" roughness={0.3} />
      </mesh>
    </group>
  );
};
