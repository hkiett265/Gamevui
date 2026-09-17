'use client';

import React from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { MienTayWorld } from './environment/MienTayWorld';
import { ShopCoBa } from './environment/ShopCoBa';
import { Vegetation } from './environment/Vegetation';
import { RuralHouses } from './environment/RuralHouses';
import { Motorcycle } from './Motorcycle';
import { Character } from './Character';
import { MotorcycleController } from './MotorcycleController';
import { PlayerController } from './PlayerController';
import { ThirdPersonCamera } from './ThirdPersonCamera';
import { CinematicSequence } from './CinematicSequence';
import { DogNPC } from './DogNPC';
import { ChickenNPC } from './ChickenNPC';
import { ChaseSystem } from './ChaseSystem';
import { Mission02Controller } from './Mission02Controller';

export const JetJetCanvas: React.FC = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        overflow: 'hidden',
        background: 'linear-gradient(to bottom, #38bdf8 0%, #fed7aa 65%, #fde047 100%)'
      }}
    >
      <Canvas
        shadows
        dpr={[1, 1.2]}
        camera={{ position: [0, 3, 6], fov: 60, near: 0.1, far: 350 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.12
        }}
      >
        {/* --- GOLDEN HOUR MEKONG SUNSET LIGHTING (17:24) --- */}
        <directionalLight
          position={[55, 32, -35]}
          intensity={1.9}
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
          shadow-camera-near={1}
          shadow-camera-far={180}
          shadow-camera-left={-60}
          shadow-camera-right={60}
          shadow-camera-top={60}
          shadow-camera-bottom={-60}
          shadow-bias={-0.0003}
          color="#fef08a"
        />

        {/* Tropical Sky / Ground Fill */}
        <hemisphereLight
          color="#bae6fd"
          groundColor="#365314"
          intensity={0.65}
        />

        {/* Warm Ambient bounce */}
        <ambientLight intensity={0.4} color="#fed7aa" />

        {/* Atmospheric rural golden haze fog */}
        <fog attach="fog" args={['#fef3c7', 45, 260]} />

        {/* --- WORLD & ENVIRONMENT --- */}
        <MienTayWorld />
        <ShopCoBa />
        <Vegetation />
        <RuralHouses />

        {/* --- ANIMAL COMPANIONS --- */}
        <DogNPC />
        <ChickenNPC initialPosition={[2, 0, 8]} />
        <ChickenNPC initialPosition={[-4, 0, 16]} />
        <ChickenNPC initialPosition={[62, 0, 134]} />

        {/* --- PLAYER & VEHICLE --- */}
        <Motorcycle />
        <Character />

        {/* --- CHASE & MISSION SYSTEMS --- */}
        <ChaseSystem />
        <Mission02Controller />

        {/* --- CONTROLLERS & CAMERA --- */}
        <MotorcycleController />
        <PlayerController />
        <ThirdPersonCamera />
        <CinematicSequence />

        {/* --- POST-PROCESSING --- */}
        <EffectComposer multisampling={0}>
          <Bloom
            luminanceThreshold={0.82}
            luminanceSmoothing={0.35}
            intensity={0.38}
          />
          <Vignette eskil={false} offset={0.16} darkness={0.32} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
