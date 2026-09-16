'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { CameraController } from './CameraController';
import { PlayerGun } from './PlayerGun';
import { FarmEnvironment } from './environment/FarmEnvironment';
import { ChickenManager } from './chicken/ChickenManager';
import { FeatherParticles } from './FeatherParticles';
import { FloatingScores } from './FloatingScores';
import { useGameStore } from '@/stores/useGameStore';

// Game loop updater inside Canvas
const GameLoopUpdater: React.FC = () => {
  const { decrementTimer } = useGameStore();

  useFrame((_, delta) => {
    decrementTimer(delta);
  });

  return null;
};

// Unified High-Precision Shooting Raycaster
// Casts ray directly through crosshair NDC coordinates with generous hitbox testing
const ShootingRaycaster: React.FC = () => {
  const { camera, scene, gl } = useThree();
  const { shoot, recordMiss } = useGameStore();
  const raycasterRef = useRef(new THREE.Raycaster());
  const pointerVec = useRef(new THREE.Vector2());

  useEffect(() => {
    const canvas = gl.domElement;

    const handlePointerDown = (e: PointerEvent) => {
      // Primary left-click only
      if (e.button !== 0) return;
      if (useGameStore.getState().gameState !== 'PLAYING') return;

      const shotFired = shoot();
      if (!shotFired) return;

      const isLocked = document.pointerLockElement === canvas;
      if (isLocked) {
        // Crosshair is locked dead center in 3D viewport
        pointerVec.current.set(0, 0);
      } else {
        const rect = canvas.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const normY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        pointerVec.current.set(normX, normY);
      }

      raycasterRef.current.setFromCamera(pointerVec.current, camera);

      // Intersect with all objects in scene
      const intersects = raycasterRef.current.intersectObjects(scene.children, true);

      let targetHit = false;
      for (const hit of intersects) {
        let curr: THREE.Object3D | null = hit.object;
        let shootableData: any = null;

        while (curr && curr !== scene) {
          if (curr.userData && curr.userData.isShootable) {
            shootableData = curr.userData;
            break;
          }
          curr = curr.parent;
        }

        if (shootableData && typeof shootableData.onHit === 'function') {
          shootableData.onHit(hit.point, hit.object);
          targetHit = true;
          break;
        }
      }

      if (!targetHit) {
        recordMiss();
      }
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [camera, scene, gl.domElement, shoot, recordMiss]);

  return null;
};

export const GameCanvas: React.FC = () => {
  const { gameState } = useGameStore();

  return (
    <div
      className="canvas-wrapper"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        overflow: 'hidden',
        cursor: gameState === 'PLAYING' ? 'none' : 'default'
      }}
    >

      <Canvas
        shadows
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        camera={{ position: [0, 5, 12], fov: 60, near: 0.1, far: 150 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15
        }}
      >
        {/* --- LIGHTING --- */}
        {/* Directional Light with Optimized Soft Shadows */}
        <directionalLight
          position={[20, 32, 18]}
          intensity={1.6}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={1}
          shadow-camera-far={80}
          shadow-camera-left={-25}
          shadow-camera-right={25}
          shadow-camera-top={25}
          shadow-camera-bottom={-25}
          shadow-bias={-0.0003}
          color="#fffbeb"
        />

        {/* Sky / Ground Hemisphere Light */}
        <hemisphereLight
          color="#bae6fd"
          groundColor="#15803d"
          intensity={0.7}
        />

        {/* Ambient Fill */}
        <ambientLight intensity={0.4} color="#ffffff" />

        {/* --- CORE GAME SYSTEMS --- */}
        <GameLoopUpdater />
        <CameraController />
        <ShootingRaycaster />

        {/* --- 3D ENVIRONMENT & ASSETS --- */}
        <FarmEnvironment />
        <ChickenManager />
        <FeatherParticles />
        <FloatingScores />

        {/* --- 3D FIRST PERSON GUN --- */}
        <PlayerGun />

        {/* --- LIGHTWEIGHT POST PROCESSING --- */}
        <EffectComposer multisampling={0}>
          {/* Subtle Bloom for Golden Chicken & Muzzle flash */}
          <Bloom
            luminanceThreshold={0.8}
            luminanceSmoothing={0.3}
            intensity={0.35}
          />
          {/* Gentle Cartoon Vignette */}
          <Vignette eskil={false} offset={0.15} darkness={0.32} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
