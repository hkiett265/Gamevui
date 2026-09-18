'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGameStore, FeatherBurst } from '@/games/chicken-mayhem/store';

interface ActiveParticle {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  rot: THREE.Euler;
  rotVel: THREE.Vector3;
  opacity: number;
  scale: number;
}

const SingleBurst: React.FC<{ burst: FeatherBurst; onComplete: () => void }> = ({
  burst,
  onComplete
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const { position, color, count } = burst;

  // Initialize particles for this burst
  const particles = useMemo<ActiveParticle[]>(() => {
    const list: ActiveParticle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 3.5;
      const upward = 2.0 + Math.random() * 3.5;
      list.push({
        pos: new THREE.Vector3(position[0], position[1] + 0.3, position[2]),
        vel: new THREE.Vector3(
          Math.cos(angle) * speed,
          upward,
          Math.sin(angle) * speed
        ),
        rot: new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, 0),
        rotVel: new THREE.Vector3(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 12
        ),
        opacity: 1.0,
        scale: 0.12 + Math.random() * 0.1
      });
    }
    return list;
  }, [burst, count, position]);

  const lifeRef = useRef(1.0); // 1.0 down to 0

  useFrame((_, delta) => {
    lifeRef.current -= delta * 1.1;
    if (lifeRef.current <= 0) {
      onComplete();
      return;
    }

    if (groupRef.current) {
      particles.forEach((p, idx) => {
        const mesh = groupRef.current?.children[idx] as THREE.Mesh;
        if (!mesh) return;

        // Apply physics
        p.vel.y -= delta * 6.5; // gravity
        p.pos.addScaledVector(p.vel, delta);
        p.rot.x += p.rotVel.x * delta;
        p.rot.y += p.rotVel.y * delta;
        p.rot.z += p.rotVel.z * delta;

        mesh.position.copy(p.pos);
        mesh.rotation.copy(p.rot);
        mesh.scale.setScalar(p.scale * Math.max(0.2, lifeRef.current));

        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat) {
          mat.opacity = Math.max(0, lifeRef.current);
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((_, i) => (
        <mesh key={i}>
          {/* Stylized diamond / feather geometry */}
          <coneGeometry args={[0.08, 0.28, 4]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={1.0}
            roughness={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

export const FeatherParticles: React.FC = () => {
  const { featherBursts, removeFeatherBurst } = useGameStore();

  return (
    <group>
      {featherBursts.map((burst) => (
        <SingleBurst
          key={burst.id}
          burst={burst}
          onComplete={() => removeFeatherBurst(burst.id)}
        />
      ))}
    </group>
  );
};
