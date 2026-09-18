'use client';

import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useNitroRacerStore } from '@/games/racing/store';
import { nitroAudio } from './audio/nitroAudio';

interface TrafficVehicle {
  id: number;
  lane: number;
  z: number;
  speed: number;
  type: 'sedan' | 'truck' | 'taxi';
  color: number;
  passed: boolean;
}

export const TrafficManager: React.FC<{ playerRef: React.RefObject<THREE.Group> }> = ({ playerRef }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [vehicles, setVehicles] = useState<TrafficVehicle[]>([]);
  
  const laneWidth = 4.5;
  const numLanes = 4;
  const getLaneX = (lane: number) => -((numLanes * laneWidth) / 2) + (laneWidth / 2) + lane * laneWidth;
  
  // Materials
  const mats = useMemo(() => ({
    sedan: new THREE.MeshStandardMaterial({ color: 0x334455, metalness: 0.8, roughness: 0.2 }),
    truck: new THREE.MeshStandardMaterial({ color: 0x882222, metalness: 0.3, roughness: 0.7 }),
    taxi: new THREE.MeshStandardMaterial({ color: 0xeebb00, metalness: 0.6, roughness: 0.3 }),
    glass: new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.1 }),
    taillight: new THREE.MeshBasicMaterial({ color: 0xff0000 })
  }), []);

  // Spawn initial vehicles
  useMemo(() => {
    const initial: TrafficVehicle[] = [];
    for (let i = 0; i < 15; i++) {
      initial.push({
        id: i,
        lane: Math.floor(Math.random() * numLanes),
        z: -50 - Math.random() * 400,
        speed: 80 + Math.random() * 60, // km/h
        type: Math.random() > 0.8 ? 'truck' : (Math.random() > 0.6 ? 'taxi' : 'sedan'),
        color: 0xffffff,
        passed: false
      });
    }
    setVehicles(initial);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current || !playerRef.current) return;
    
    const store = useNitroRacerStore.getState();
    if (store.gameStatus !== 'playing') return;
    
    const playerSpeed = store.speed;
    const playerSpeedMs = playerSpeed / 3.6;
    
    const playerPos = playerRef.current.position;
    
    let collision = false;
    let newVehicles = [...vehicles];
    
    newVehicles.forEach(v => {
      // Relative movement
      const vSpeedMs = v.speed / 3.6;
      v.z += (playerSpeedMs - vSpeedMs) * delta;
      
      const vX = getLaneX(v.lane);
      
      // Collision detection (AABB rough)
      const dx = Math.abs(playerPos.x - vX);
      const dz = Math.abs(playerPos.z - v.z);
      
      const hitRadiusX = v.type === 'truck' ? 1.5 : 1.2;
      const hitRadiusZ = v.type === 'truck' ? 4.5 : 2.5;
      
      if (dx < hitRadiusX && dz < hitRadiusZ) {
        // Collision!
        collision = true;
        // Bump car slightly
        playerRef.current!.position.x += (playerPos.x > vX ? 0.5 : -0.5);
      }
      
      // Close call detection
      if (!v.passed && dz < 3.0 && dx >= hitRadiusX && dx < hitRadiusX + 1.2 && playerSpeed > 150) {
        v.passed = true;
        useNitroRacerStore.getState().addCloseCall();
        nitroAudio.playCloseCall();
      }
      
      // Respawn if behind camera
      if (v.z > 20) {
        v.z = -200 - Math.random() * 300;
        v.lane = Math.floor(Math.random() * numLanes);
        v.passed = false;
        v.speed = 80 + Math.random() * 60;
        v.type = Math.random() > 0.8 ? 'truck' : (Math.random() > 0.6 ? 'taxi' : 'sedan');
      }
    });
    
    if (collision) {
      // Reduce speed heavily on crash
      useNitroRacerStore.getState().updateVehicleState({ 
        speed: Math.max(0, playerSpeed * 0.7),
        multiplier: 1,
        closeCallsCount: 0
      });
    }
    
    setVehicles(newVehicles);
  });

  return (
    <group ref={groupRef}>
      {vehicles.map(v => (
        <group key={v.id} position={[getLaneX(v.lane), 0, v.z]}>
          {v.type === 'truck' ? (
            <group>
              <mesh position={[0, 1.5, 0]} castShadow>
                <boxGeometry args={[2.5, 3, 8]} />
                <primitive object={mats.truck} />
              </mesh>
              <mesh position={[0, 0.5, 3.9]}>
                <boxGeometry args={[2.4, 0.5, 0.2]} />
                <primitive object={mats.taillight} />
              </mesh>
            </group>
          ) : (
            <group>
              <mesh position={[0, 0.7, 0]} castShadow>
                <boxGeometry args={[2, 1.2, 4.5]} />
                <primitive object={mats[v.type]} />
              </mesh>
              <mesh position={[0, 1.2, -0.5]}>
                <boxGeometry args={[1.8, 0.8, 2.5]} />
                <primitive object={mats.glass} />
              </mesh>
              <mesh position={[0, 0.6, 2.2]}>
                <boxGeometry args={[1.8, 0.2, 0.2]} />
                <primitive object={mats.taillight} />
              </mesh>
            </group>
          )}
        </group>
      ))}
    </group>
  );
};
