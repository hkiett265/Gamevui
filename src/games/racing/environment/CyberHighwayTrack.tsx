'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useNitroRacerStore } from '@/games/racing/store';

export const CyberHighwayTrack: React.FC = () => {
  const trackRef = useRef<THREE.Group>(null);
  
  // Track parameters
  const trackLength = 2000;
  const laneWidth = 4.5;
  const numLanes = 4;
  const totalWidth = laneWidth * numLanes;
  
  // Materials
  const asphaltMaterial = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: 0x111111,
    roughness: 0.8,
    metalness: 0.2
  }), []);
  
  const lineMaterial = useMemo(() => new THREE.MeshBasicMaterial({ 
    color: 0xffffff,
    transparent: true,
    opacity: 0.8
  }), []);
  
  const neonCyanMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: 0x00ffff
  }), []);
  
  const neonMagentaMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: 0xff00ff
  }), []);

  // Road lines geometry
  const lines = useMemo(() => {
    const arr = [];
    const numLines = 50; // Per segment
    for (let i = 0; i < numLanes - 1; i++) {
      const x = -totalWidth / 2 + (i + 1) * laneWidth;
      for (let j = 0; j < numLines; j++) {
        arr.push({
          position: [x, 0.02, -j * (trackLength / numLines)],
          scale: [0.15, 1, 4]
        });
      }
    }
    return arr;
  }, [totalWidth, laneWidth, numLanes, trackLength]);

  // Neon barriers
  const barriers = useMemo(() => {
    const arr = [];
    const numBarriers = 20;
    for (let i = 0; i < numBarriers; i++) {
      arr.push({ z: -i * (trackLength / numBarriers) });
    }
    return arr;
  }, [trackLength]);

  useFrame((state, delta) => {
    if (!trackRef.current) return;
    const speed = useNitroRacerStore.getState().speed;
    const speedMs = speed / 3.6;
    
    // Move track towards camera
    trackRef.current.position.z += speedMs * delta;
    
    // Loop track
    if (trackRef.current.position.z > trackLength / 2) {
      trackRef.current.position.z -= trackLength / 2;
    }
  });

  return (
    <group ref={trackRef}>
      {/* Segment 1 */}
      <group position={[0, 0, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[totalWidth + 4, trackLength]} />
          <primitive object={asphaltMaterial} />
        </mesh>
        
        {/* Lines */}
        {lines.map((l, i) => (
          <mesh key={`line1-${i}`} position={l.position as any} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[l.scale[0], l.scale[2]]} />
            <primitive object={lineMaterial} />
          </mesh>
        ))}
        
        {/* Barriers */}
        {barriers.map((b, i) => (
          <React.Fragment key={`barrier1-${i}`}>
            {/* Left */}
            <mesh position={[-totalWidth / 2 - 1, 0.5, b.z]}>
              <boxGeometry args={[0.5, 1, 20]} />
              <primitive object={neonCyanMaterial} />
            </mesh>
            {/* Right */}
            <mesh position={[totalWidth / 2 + 1, 0.5, b.z]}>
              <boxGeometry args={[0.5, 1, 20]} />
              <primitive object={neonMagentaMaterial} />
            </mesh>
          </React.Fragment>
        ))}
      </group>
      
      {/* Segment 2 (Looping) */}
      <group position={[0, 0, -trackLength]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[totalWidth + 4, trackLength]} />
          <primitive object={asphaltMaterial} />
        </mesh>
        
        {lines.map((l, i) => (
          <mesh key={`line2-${i}`} position={l.position as any} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[l.scale[0], l.scale[2]]} />
            <primitive object={lineMaterial} />
          </mesh>
        ))}
        
        {barriers.map((b, i) => (
          <React.Fragment key={`barrier2-${i}`}>
            <mesh position={[-totalWidth / 2 - 1, 0.5, b.z]}>
              <boxGeometry args={[0.5, 1, 20]} />
              <primitive object={neonCyanMaterial} />
            </mesh>
            <mesh position={[totalWidth / 2 + 1, 0.5, b.z]}>
              <boxGeometry args={[0.5, 1, 20]} />
              <primitive object={neonMagentaMaterial} />
            </mesh>
          </React.Fragment>
        ))}
      </group>
    </group>
  );
};
