'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useNitroRacerStore } from '@/games/racing/store';

export const RacingCamera: React.FC<{ playerRef?: React.RefObject<THREE.Group> }> = ({ playerRef }) => {
  const cameraGroup = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!cameraGroup.current) return;
    
    const store = useNitroRacerStore.getState();
    const isNitro = store.isNitroActive;
    
    let targetPos = new THREE.Vector3();
    let targetLook = new THREE.Vector3(0, 1, -10); // Look ahead
    let targetFov = isNitro ? 85 : 65;
    
    // We attach camera relative to origin because the road moves, the car stays mostly at z=0
    // But car moves left/right (x)
    const carX = playerRef?.current?.position.x || 0;

    switch (store.cameraMode) {
      case 'chase_close':
        targetPos.set(carX * 0.5, isNitro ? 1.5 : 2.5, 6);
        targetLook.set(carX, 1, -10);
        break;
      case 'chase_far':
        targetPos.set(carX * 0.3, 4.0, 9);
        targetLook.set(carX, 1, -20);
        break;
      case 'hood':
        targetPos.set(carX, 1.2, 0);
        targetLook.set(carX, 1.0, -20);
        targetFov = isNitro ? 90 : 75;
        break;
    }
    
    // Camera shake when nitro
    if (isNitro && store.speed > 250) {
      targetPos.x += (Math.random() - 0.5) * 0.1;
      targetPos.y += (Math.random() - 0.5) * 0.1;
    }
    
    // Smooth interpolation
    cameraGroup.current.position.lerp(targetPos, delta * 10);
    
    // Update actual camera FOV
    const camera = state.camera as THREE.PerspectiveCamera;
    if (camera.fov !== targetFov) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, delta * 5);
      camera.updateProjectionMatrix();
    }
    
    // Smooth lookAt
    const lookAtQuat = new THREE.Quaternion().setFromRotationMatrix(
      new THREE.Matrix4().lookAt(cameraGroup.current.position, targetLook, new THREE.Vector3(0, 1, 0))
    );
    cameraGroup.current.quaternion.slerp(lookAtQuat, delta * 10);
  });

  return (
    <group ref={cameraGroup}>
      {/* The main scene camera will automatically sync to this group's transform via useFrame if we want, or we can just use a PerspectiveCamera component */}
      <perspectiveCamera makeDefault fov={65} near={0.1} far={500} />
    </group>
  );
};
