'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useJetJetStore } from '@/games/jetjet/store';

interface MotorcycleProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export const Motorcycle: React.FC<MotorcycleProps> = ({
  position,
  rotation
}) => {
  const rootRef = useRef<THREE.Group>(null);
  const leanGroupRef = useRef<THREE.Group>(null);
  const steerForkRef = useRef<THREE.Group>(null);
  const frontWheelRef = useRef<THREE.Group>(null);
  const rearWheelRef = useRef<THREE.Group>(null);
  const puffRef = useRef<THREE.Mesh>(null);

  const wheelAngle = useRef(0);

  useFrame((_, delta) => {
    const { isRiding, bikePosition, bikeRotation, speedKmh, leanAngle, steerAngle, isRevving } = useJetJetStore.getState();

    // If controlled by player or standalone
    if (rootRef.current) {
      if (isRiding) {
        rootRef.current.position.set(bikePosition[0], bikePosition[1], bikePosition[2]);
        rootRef.current.rotation.y = bikeRotation;

        // Rev vibration
        if (isRevving) {
          rootRef.current.position.y += (Math.random() - 0.5) * 0.015;
        }
      } else if (position && rotation) {
        rootRef.current.position.set(position[0], position[1], position[2]);
        rootRef.current.rotation.set(rotation[0], rotation[1], rotation[2]);
      }
    }

    // Leaning effect (smooth interpolation around local Z)
    if (leanGroupRef.current) {
      const targetLean = isRiding ? -leanAngle : 0;
      leanGroupRef.current.rotation.z = THREE.MathUtils.lerp(leanGroupRef.current.rotation.z, targetLean, delta * 12);
    }

    // Front fork steering
    if (steerForkRef.current) {
      const targetSteer = isRiding ? steerAngle : 0;
      steerForkRef.current.rotation.y = THREE.MathUtils.lerp(steerForkRef.current.rotation.y, targetSteer, delta * 15);
    }

    // Wheel rolling rotation
    if (isRiding && Math.abs(speedKmh) > 0.1) {
      const speedMs = (speedKmh * 1000) / 3600;
      const wheelRadius = 0.32;
      wheelAngle.current += (speedMs / wheelRadius) * delta;

      if (frontWheelRef.current) frontWheelRef.current.rotation.x = wheelAngle.current;
      if (rearWheelRef.current) rearWheelRef.current.rotation.x = wheelAngle.current;
    }

    // Exhaust puff smoke
    if (puffRef.current) {
      const showPuff = isRevving || (isRiding && speedKmh > 40);
      puffRef.current.visible = showPuff;
      if (showPuff) {
        const s = 0.5 + Math.random() * 0.7;
        puffRef.current.scale.set(s, s, s);
      }
    }
  });

  // Materials
  const cyanBodyMat = new THREE.MeshStandardMaterial({
    color: '#06b6d4',
    roughness: 0.25,
    metalness: 0.65
  });

  const neonYellowMat = new THREE.MeshStandardMaterial({
    color: '#eab308',
    roughness: 0.3,
    metalness: 0.4
  });

  const darkPlasticsMat = new THREE.MeshStandardMaterial({
    color: '#18181b',
    roughness: 0.7,
    metalness: 0.2
  });

  const metalMat = new THREE.MeshStandardMaterial({
    color: '#a1a1aa',
    roughness: 0.35,
    metalness: 0.85
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: '#f4f4f5',
    roughness: 0.1,
    metalness: 0.95
  });

  const tireRubberMat = new THREE.MeshStandardMaterial({
    color: '#111111',
    roughness: 0.85,
    metalness: 0.1
  });

  const headlightMat = new THREE.MeshBasicMaterial({
    color: '#ffffff'
  });

  const tailLightMat = new THREE.MeshBasicMaterial({
    color: '#ef4444'
  });

  const goldShockMat = new THREE.MeshStandardMaterial({
    color: '#f59e0b',
    metalness: 0.8,
    roughness: 0.2
  });

  return (
    <group ref={rootRef} position={position || [0, 0, 0]}>
      {/* LEANING GROUP */}
      <group ref={leanGroupRef}>
        {/* --- MAIN UNDERBONE FRAME & CENTRAL BODY --- */}
        <mesh position={[0, 0.45, -0.05]} rotation={[0.45, 0, 0]} material={darkPlasticsMat}>
          <cylinderGeometry args={[0.065, 0.065, 0.9, 12]} />
        </mesh>

        {/* Engine crankcase & cylinder block */}
        <group position={[0, 0.32, -0.05]}>
          <mesh material={darkPlasticsMat}>
            <boxGeometry args={[0.26, 0.24, 0.35]} />
          </mesh>
          <mesh position={[0, 0.12, 0.14]} rotation={[-0.7, 0, 0]} material={metalMat}>
            <cylinderGeometry args={[0.08, 0.08, 0.25, 12]} />
          </mesh>
          <mesh position={[0.14, -0.02, -0.02]} rotation={[0, 0, Math.PI / 2]} material={chromeMat}>
            <cylinderGeometry args={[0.09, 0.09, 0.04, 16]} />
          </mesh>
          <mesh position={[0, -0.1, -0.1]} material={metalMat}>
            <boxGeometry args={[0.55, 0.04, 0.05]} />
          </mesh>
        </group>

        {/* --- FRONT COWLING & SHARK-NOSE FAIRING --- */}
        <group position={[0, 0.62, 0.35]}>
          <mesh position={[0, 0, 0]} rotation={[-0.35, 0, 0]} material={cyanBodyMat}>
            <coneGeometry args={[0.22, 0.65, 4]} />
          </mesh>
          <mesh position={[0.14, -0.05, -0.08]} rotation={[-0.2, 0.15, -0.2]} material={neonYellowMat}>
            <boxGeometry args={[0.04, 0.4, 0.28]} />
          </mesh>
          <mesh position={[-0.14, -0.05, -0.08]} rotation={[-0.2, -0.15, 0.2]} material={neonYellowMat}>
            <boxGeometry args={[0.04, 0.4, 0.28]} />
          </mesh>
          <mesh position={[0.08, 0.1, 0.16]} rotation={[0.4, 0.2, 0]} material={headlightMat}>
            <boxGeometry args={[0.07, 0.04, 0.02]} />
          </mesh>
          <mesh position={[-0.08, 0.1, 0.16]} rotation={[0.4, -0.2, 0]} material={headlightMat}>
            <boxGeometry args={[0.07, 0.04, 0.02]} />
          </mesh>
        </group>

        {/* Center underbone foot tunnel */}
        <mesh position={[0, 0.52, 0.05]} rotation={[-0.3, 0, 0]} material={darkPlasticsMat}>
          <boxGeometry args={[0.22, 0.16, 0.45]} />
        </mesh>

        {/* --- SEAT & TAIL SECTION --- */}
        <group position={[0, 0.76, -0.38]}>
          <mesh position={[0, -0.02, 0.18]} rotation={[0.1, 0, 0]} material={darkPlasticsMat}>
            <boxGeometry args={[0.24, 0.09, 0.38]} />
          </mesh>
          <mesh position={[0, 0.04, -0.15]} rotation={[-0.1, 0, 0]} material={darkPlasticsMat}>
            <boxGeometry args={[0.2, 0.09, 0.32]} />
          </mesh>
        </group>

        {/* Rear tail cowl */}
        <group position={[0, 0.72, -0.65]}>
          <mesh rotation={[0.2, 0, 0]} material={cyanBodyMat}>
            <coneGeometry args={[0.16, 0.5, 4]} />
          </mesh>
          <mesh position={[0, 0.05, -0.22]} material={tailLightMat}>
            <boxGeometry args={[0.12, 0.05, 0.03]} />
          </mesh>
          <mesh position={[0, -0.12, -0.24]} rotation={[0.5, 0, 0]} material={darkPlasticsMat}>
            <boxGeometry args={[0.18, 0.14, 0.02]} />
          </mesh>
        </group>

        {/* --- REAR SWINGARM, MONOSHOCK & EXHAUST --- */}
        <group position={[0, 0.32, -0.45]}>
          <mesh position={[0.1, 0, -0.2]} rotation={[0.15, 0, 0]} material={metalMat}>
            <boxGeometry args={[0.04, 0.06, 0.48]} />
          </mesh>
          <mesh position={[-0.1, 0, -0.2]} rotation={[0.15, 0, 0]} material={metalMat}>
            <boxGeometry args={[0.04, 0.06, 0.48]} />
          </mesh>
          <mesh position={[0, 0.18, 0.05]} rotation={[-0.6, 0, 0]} material={goldShockMat}>
            <cylinderGeometry args={[0.035, 0.035, 0.26, 12]} />
          </mesh>
        </group>

        {/* Sport Racing Exhaust pipe */}
        <group position={[0.18, 0.34, -0.3]}>
          <mesh position={[-0.04, -0.05, 0.35]} rotation={[0.8, 0, 0]} material={metalMat}>
            <cylinderGeometry args={[0.025, 0.025, 0.3, 10]} />
          </mesh>
          <mesh position={[0.02, 0.06, -0.2]} rotation={[0.45, 0.1, 0]} material={metalMat}>
            <cylinderGeometry args={[0.06, 0.05, 0.55, 16]} />
          </mesh>
          <mesh position={[0.05, 0.08, -0.16]} rotation={[0.45, 0.1, 0]} material={darkPlasticsMat}>
            <boxGeometry args={[0.02, 0.07, 0.38]} />
          </mesh>
          <mesh position={[0.02, 0.22, -0.45]} rotation={[0.45, 0.1, 0]} material={chromeMat}>
            <cylinderGeometry args={[0.035, 0.035, 0.08, 16]} />
          </mesh>
          {/* Exhaust puff smoke */}
          <mesh ref={puffRef} position={[0.02, 0.28, -0.58]} visible={false}>
            <sphereGeometry args={[0.14, 8, 8]} />
            <meshBasicMaterial color="#d1d5db" transparent opacity={0.4} />
          </mesh>
        </group>

        {/* --- REAR WHEEL ASSEMBLY --- */}
        <group position={[0, 0.32, -0.76]}>
          <group ref={rearWheelRef}>
            <mesh rotation={[0, 0, Math.PI / 2]} material={tireRubberMat} castShadow>
              <torusGeometry args={[0.3, 0.08, 16, 32]} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]} material={darkPlasticsMat}>
              <cylinderGeometry args={[0.22, 0.22, 0.09, 24]} />
            </mesh>
            {[0, 72, 144, 216, 288].map((deg, i) => (
              <mesh key={i} rotation={[0, 0, (deg * Math.PI) / 180]} material={neonYellowMat}>
                <boxGeometry args={[0.03, 0.36, 0.04]} />
              </mesh>
            ))}
            <mesh position={[-0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={metalMat}>
              <cylinderGeometry args={[0.13, 0.13, 0.015, 20]} />
            </mesh>
          </group>
        </group>

        {/* --- STEERABLE FRONT FORK & WHEEL ASSEMBLY --- */}
        <group ref={steerForkRef} position={[0, 0.5, 0.6]}>
          <mesh position={[0, 0.25, 0]} rotation={[0.35, 0, 0]} material={metalMat}>
            <cylinderGeometry args={[0.035, 0.035, 0.5, 12]} />
          </mesh>

          <group position={[0, 0.52, -0.08]} rotation={[0.2, 0, 0]}>
            <mesh material={metalMat}>
              <boxGeometry args={[0.66, 0.03, 0.03]} />
            </mesh>
            <mesh position={[0.3, 0, 0]} material={darkPlasticsMat}>
              <cylinderGeometry args={[0.024, 0.024, 0.12, 12]} />
            </mesh>
            <mesh position={[-0.3, 0, 0]} material={darkPlasticsMat}>
              <cylinderGeometry args={[0.024, 0.024, 0.12, 12]} />
            </mesh>
            <mesh position={[0, 0.03, 0.04]} rotation={[-0.5, 0, 0]} material={darkPlasticsMat}>
              <boxGeometry args={[0.14, 0.08, 0.03]} />
            </mesh>
            <mesh position={[0, 0.04, 0.04]} rotation={[-0.5, 0, 0]}>
              <planeGeometry args={[0.11, 0.05]} />
              <meshBasicMaterial color="#06b6d4" />
            </mesh>
            <group position={[0.28, 0.12, 0.05]} rotation={[-0.1, 0.3, 0]}>
              <mesh material={darkPlasticsMat}>
                <boxGeometry args={[0.12, 0.06, 0.02]} />
              </mesh>
            </group>
            <group position={[-0.28, 0.12, 0.05]} rotation={[-0.1, -0.3, 0]}>
              <mesh material={darkPlasticsMat}>
                <boxGeometry args={[0.12, 0.06, 0.02]} />
              </mesh>
            </group>
          </group>

          <group position={[0, 0.05, 0]} rotation={[0.35, 0, 0]}>
            <mesh position={[0.09, -0.15, 0]} material={chromeMat}>
              <cylinderGeometry args={[0.025, 0.025, 0.48, 12]} />
            </mesh>
            <mesh position={[-0.09, -0.15, 0]} material={chromeMat}>
              <cylinderGeometry args={[0.025, 0.025, 0.48, 12]} />
            </mesh>
            <mesh position={[0, 0.08, 0.02]} rotation={[-0.2, 0, 0]} material={cyanBodyMat}>
              <boxGeometry args={[0.18, 0.08, 0.42]} />
            </mesh>
          </group>

          <group position={[0, -0.18, 0.18]}>
            <group ref={frontWheelRef}>
              <mesh rotation={[0, 0, Math.PI / 2]} material={tireRubberMat} castShadow>
                <torusGeometry args={[0.3, 0.075, 16, 32]} />
              </mesh>
              <mesh rotation={[0, 0, Math.PI / 2]} material={darkPlasticsMat}>
                <cylinderGeometry args={[0.22, 0.22, 0.08, 24]} />
              </mesh>
              {[0, 72, 144, 216, 288].map((deg, i) => (
                <mesh key={i} rotation={[0, 0, (deg * Math.PI) / 180]} material={neonYellowMat}>
                  <boxGeometry args={[0.028, 0.36, 0.035]} />
                </mesh>
              ))}
              <mesh position={[0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={metalMat}>
                <cylinderGeometry args={[0.15, 0.15, 0.015, 24]} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};
