'use client';

import React from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { CyberHighwayTrack } from './environment/CyberHighwayTrack';
import { SupercarModel } from './SupercarModel';
import { CarController } from './CarController';
import { RacingCamera } from './RacingCamera';
import { useNitroRacerStore } from '@/games/racing/store';

export const NitroCanvas: React.FC = () => {
  const isNitro = useNitroRacerStore(state => state.isNitroActive);

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      zIndex: 1, overflow: 'hidden', background: '#050510'
    }}>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{
          antialias: false, // Turn off MSAA for better postprocessing performance
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
      >
        {/* Environment Lighting */}
        <ambientLight intensity={0.2} />
        <directionalLight position={[0, 100, -100]} intensity={0.5} color={0x00aaff} />
        <hemisphereLight groundColor={0x000000} color={0xff00ff} intensity={0.3} />
        
        <fog attach="fog" args={['#050510', 50, 400]} />

        {/* Game Logic & Models */}
        <CarController>
          <SupercarModel />
          <RacingCamera />
        </CarController>
        
        <CyberHighwayTrack />

        {/* Post-Processing */}
        <EffectComposer disableNormalPass multisampling={4}>
          <Bloom 
            luminanceThreshold={0.5} 
            luminanceSmoothing={0.9} 
            intensity={2.5} 
            mipmapBlur 
          />
          {isNitro && (
            <ChromaticAberration 
              blendFunction={BlendFunction.NORMAL} 
              offset={new THREE.Vector2(0.005, 0.005)} 
            />
          )}
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
