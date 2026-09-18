'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useNitroRacerStore } from '@/games/racing/store';

export const SupercarModel: React.FC = () => {
  const carGroup = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Group[]>([]);
  const nitroJetsRef = useRef<THREE.Group>(null);
  
  // Materials
  const mats = useMemo(() => ({
    body: new THREE.MeshStandardMaterial({ 
      color: 0x050505, // Sleek black
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    }),
    glass: new THREE.MeshStandardMaterial({
      color: 0x111111,
      metalness: 1.0,
      roughness: 0.0,
      transparent: true,
      opacity: 0.8
    }),
    trim: new THREE.MeshStandardMaterial({ color: 0xff3300, metalness: 0.5, roughness: 0.5 }), // Red trim
    wheel: new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.2 }),
    rim: new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.2 }),
    headlight: new THREE.MeshBasicMaterial({ color: 0xffffff }),
    taillight: new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    neon: new THREE.MeshBasicMaterial({ color: 0x00ffff })
  }), []);

  useFrame((state, delta) => {
    if (!carGroup.current) return;
    
    const store = useNitroRacerStore.getState();
    const speedMs = store.speed / 3.6;
    
    // Spin wheels
    wheelsRef.current.forEach(wheel => {
      if (wheel) wheel.rotation.x -= speedMs * delta * 2;
    });
    
    // Neon color based on Nitro
    mats.neon.color.setHex(store.isNitroActive ? 0xff00ff : 0x00ffff);
    
    // Animate Nitro Jets
    if (nitroJetsRef.current) {
      nitroJetsRef.current.visible = store.isNitroActive;
      if (store.isNitroActive) {
        nitroJetsRef.current.scale.set(
          1 + Math.random() * 0.2,
          1 + Math.random() * 0.2,
          1 + Math.random() * 0.5
        );
      }
    }
    
    // Tilt car when drifting
    if (store.isDrifting) {
      const targetRoll = store.driftAngle * 0.1;
      carGroup.current.rotation.z = THREE.MathUtils.lerp(carGroup.current.rotation.z, targetRoll, delta * 5);
    } else {
      carGroup.current.rotation.z = THREE.MathUtils.lerp(carGroup.current.rotation.z, 0, delta * 5);
    }
  });

  return (
    <group ref={carGroup}>
      {/* Car Body (Low-poly stylized) */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 0.6, 4.2]} />
        <primitive object={mats.body} />
      </mesh>
      
      {/* Cabin/Glass */}
      <mesh position={[0, 0.8, -0.2]} castShadow>
        <boxGeometry args={[1.5, 0.5, 2.0]} />
        <primitive object={mats.glass} />
      </mesh>
      
      {/* Spoiler */}
      <mesh position={[0, 0.9, 1.8]} castShadow>
        <boxGeometry args={[1.8, 0.1, 0.4]} />
        <primitive object={mats.body} />
      </mesh>
      <mesh position={[-0.8, 0.75, 1.8]} castShadow>
        <boxGeometry args={[0.1, 0.3, 0.3]} />
        <primitive object={mats.body} />
      </mesh>
      <mesh position={[0.8, 0.75, 1.8]} castShadow>
        <boxGeometry args={[0.1, 0.3, 0.3]} />
        <primitive object={mats.body} />
      </mesh>
      
      {/* Headlights */}
      <mesh position={[-0.7, 0.5, -2.1]}>
        <boxGeometry args={[0.4, 0.1, 0.1]} />
        <primitive object={mats.headlight} />
      </mesh>
      <mesh position={[0.7, 0.5, -2.1]}>
        <boxGeometry args={[0.4, 0.1, 0.1]} />
        <primitive object={mats.headlight} />
      </mesh>
      
      {/* Taillights */}
      <mesh position={[-0.7, 0.6, 2.1]}>
        <boxGeometry args={[0.5, 0.1, 0.1]} />
        <primitive object={mats.taillight} />
      </mesh>
      <mesh position={[0.7, 0.6, 2.1]}>
        <boxGeometry args={[0.5, 0.1, 0.1]} />
        <primitive object={mats.taillight} />
      </mesh>
      
      {/* Underglow Neon */}
      <mesh position={[0, 0.1, 0]}>
        <planeGeometry args={[1.8, 4.0]} />
        <meshBasicMaterial color={0x00ffff} transparent opacity={0.5} />
      </mesh>
      
      {/* Wheels */}
      {[
        [-0.9, 0.3, -1.4], [0.9, 0.3, -1.4], // Front
        [-0.9, 0.3, 1.4], [0.9, 0.3, 1.4]    // Rear
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]} ref={(el) => { if (el) wheelsRef.current[i] = el; }}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
            <primitive object={mats.wheel} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[(i % 2 === 0 ? -0.11 : 0.11), 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.05, 8]} />
            <primitive object={mats.rim} />
          </mesh>
        </group>
      ))}
      
      {/* Nitro Jets */}
      <group ref={nitroJetsRef} position={[0, 0.3, 2.2]} visible={false}>
        <mesh position={[-0.4, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.2, 1.0, 8]} />
          <meshBasicMaterial color={0x00ffff} transparent opacity={0.8} />
        </mesh>
        <mesh position={[0.4, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.2, 1.0, 8]} />
          <meshBasicMaterial color={0xff00ff} transparent opacity={0.8} />
        </mesh>
        
        {/* Flame core */}
        <mesh position={[-0.4, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.1, 0.5, 8]} />
          <meshBasicMaterial color={0xffffff} />
        </mesh>
        <mesh position={[0.4, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.1, 0.5, 8]} />
          <meshBasicMaterial color={0xffffff} />
        </mesh>
      </group>
    </group>
  );
};
