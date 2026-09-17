'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useJetJetStore, SurfaceType } from '@/games/jetjet/store';
import { jetJetAudio } from './audio/jetJetAudio';

export const MotorcycleController: React.FC = () => {
  const keys = useRef<{
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    boost: boolean;
    space: boolean;
  }>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    boost: false,
    space: false
  });

  const speed = useRef(0);
  const heading = useRef(0);
  const pos = useRef(new THREE.Vector3(0, 0, -4));
  const currentLean = useRef(0);
  const currentSteer = useRef(0);
  const revTime = useRef(0);
  const lastSkidTime = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const { isRiding, dismountBike } = useJetJetStore.getState();

      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') keys.current.forward = true;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') keys.current.backward = true;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') keys.current.left = true;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') keys.current.right = true;
      if (e.key === 'Shift') keys.current.boost = true;

      // Rev engine / Space
      if (e.key === ' ') {
        keys.current.space = true;
        if (isRiding && Math.abs(speed.current) < 5) {
          jetJetAudio.playExhaustPop();
          useJetJetStore.getState().triggerRev();
        }
      }

      // Dismount vehicle (F)
      if ((e.key === 'f' || e.key === 'F') && isRiding) {
        if (Math.abs(speed.current) < 25) {
          jetJetAudio.stopEngine();
          jetJetAudio.playDismount();
          dismountBike();
        } else {
          useJetJetStore.getState().showNotification('Hãy phanh chậm lại trước khi xuống xe!');
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') keys.current.forward = false;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') keys.current.backward = false;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') keys.current.left = false;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') keys.current.right = false;
      if (e.key === 'Shift') keys.current.boost = false;
      if (e.key === ' ') keys.current.space = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    const {
      isRiding,
      isTransformed,
      waypointTarget,
      setBikePosition,
      setBikeRotation,
      setBikeTelemetry,
      setDistances
    } = useJetJetStore.getState();

    if (!isRiding) return;

    const clampedDelta = Math.min(delta, 0.05);

    // Bridge detection & smooth elevation
    // Bridge center is at (x=22, z=52)
    const distToBridge = Math.hypot(pos.current.x - 22, pos.current.z - 52);
    let surface: SurfaceType = 'CONCRETE';

    if (distToBridge < 12) {
      surface = 'BRIDGE';
      // Smooth arched bridge elevation
      pos.current.y = THREE.MathUtils.lerp(
        pos.current.y,
        0.58 * Math.cos((distToBridge / 12) * (Math.PI / 2)),
        clampedDelta * 12
      );
    } else {
      pos.current.y = THREE.MathUtils.lerp(pos.current.y, 0, clampedDelta * 12);

      // Dirt detection off-road
      if (Math.abs(pos.current.x) > 6 && Math.abs(pos.current.x - 44) > 8 && Math.abs(pos.current.x - 65) > 14) {
        surface = 'DIRT';
      }
    }

    // Revving / Nẹt pô handling
    const isRevving = keys.current.space && Math.abs(speed.current) < 5;
    if (isRevving) {
      revTime.current += clampedDelta;
      if (Math.random() > 0.75) {
        jetJetAudio.playExhaustPop();
      }
    } else {
      revTime.current = 0;
    }

    // Top Speed & Acceleration
    const maxSpeed = isTransformed
      ? (keys.current.boost ? 110 : 85)
      : 72;
    const accelRate = isTransformed ? 42 : 30;
    const brakeRate = 50;
    const friction = 14;

    const isAccelerating = keys.current.forward;

    if (keys.current.forward) {
      // Accelerate forward (speed increases positive)
      speed.current += accelRate * clampedDelta;
      if (speed.current > maxSpeed) speed.current = maxSpeed;
    } else if (keys.current.backward) {
      if (speed.current > 0.5) {
        // Hard brake
        if (speed.current > 35 && Date.now() - lastSkidTime.current > 800) {
          jetJetAudio.playBrakeSkid();
          lastSkidTime.current = Date.now();
        }
        speed.current -= brakeRate * clampedDelta;
      } else {
        // Reverse
        speed.current -= 12 * clampedDelta;
        if (speed.current < -14) speed.current = -14;
      }
    } else if (keys.current.space && Math.abs(speed.current) >= 5) {
      // Handbrake
      if (speed.current > 30 && Date.now() - lastSkidTime.current > 600) {
        jetJetAudio.playBrakeSkid();
        lastSkidTime.current = Date.now();
      }
      speed.current = Math.max(0, speed.current - brakeRate * 1.6 * clampedDelta);
    } else {
      // Rolling friction
      if (speed.current > 0) speed.current = Math.max(0, speed.current - friction * clampedDelta);
      else if (speed.current < 0) speed.current = Math.min(0, speed.current + friction * clampedDelta);
    }

    // Steering: A = steer left (-), D = steer right (+)
    let targetSteer = 0;
    if (keys.current.left) targetSteer = -0.38;
    if (keys.current.right) targetSteer = 0.38;

    currentSteer.current = THREE.MathUtils.lerp(currentSteer.current, targetSteer, clampedDelta * 12);

    if (Math.abs(speed.current) > 0.5) {
      // Dynamic steering sensitivity
      const speedFactor = Math.min(Math.abs(speed.current), 55) / 45;
      const turnSens = (speed.current >= 0 ? 1 : -1) * (1.6 - Math.min(Math.abs(speed.current) / 100, 0.45));
      heading.current += currentSteer.current * turnSens * clampedDelta * speedFactor;
    }

    // Lean angle (leaning left when steering left, right when steering right)
    const speedRatio = Math.min(Math.abs(speed.current) / 50, 1.25);
    const targetLean = currentSteer.current * 1.4 * speedRatio;
    currentLean.current = THREE.MathUtils.lerp(currentLean.current, targetLean, clampedDelta * 14);

    // Translation along heading (Motorcycle faces +Z at heading=0)
    // Forward (+Z) = +cos(heading)
    // Right (+X) = +sin(heading)
    const speedMs = (speed.current * 1000) / 3600;
    const moveX = Math.sin(heading.current) * speedMs * clampedDelta;
    const moveZ = Math.cos(heading.current) * speedMs * clampedDelta;

    pos.current.x += moveX;
    pos.current.z += moveZ;

    // Map boundaries
    pos.current.x = THREE.MathUtils.clamp(pos.current.x, -95, 95);
    pos.current.z = THREE.MathUtils.clamp(pos.current.z, -60, 195);

    // Gear & RPM simulation
    let gear = 1;
    let rpm = 1200;
    const absSpeed = Math.abs(speed.current);

    if (isRevving) {
      rpm = 7500 + Math.sin(revTime.current * 15) * 1200;
      gear = 0;
    } else if (absSpeed < 18) {
      gear = 1;
      rpm = 1200 + (absSpeed / 18) * 4500;
    } else if (absSpeed < 38) {
      gear = 2;
      rpm = 2500 + ((absSpeed - 18) / 20) * 5000;
    } else if (absSpeed < 58) {
      gear = 3;
      rpm = 3000 + ((absSpeed - 38) / 20) * 5200;
    } else if (absSpeed < 78) {
      gear = 4;
      rpm = 3500 + ((absSpeed - 58) / 20) * 5400;
    } else {
      gear = 5;
      rpm = 4000 + ((absSpeed - 78) / 35) * 5200;
    }

    // Engine Audio
    jetJetAudio.updateEngine(absSpeed, Math.round(rpm), isAccelerating, isRevving, surface);

    // Store sync
    setBikePosition([pos.current.x, pos.current.y, pos.current.z]);
    setBikeRotation(heading.current);
    setBikeTelemetry(
      speed.current,
      Math.round(rpm),
      gear,
      currentLean.current,
      currentSteer.current,
      keys.current.boost,
      isRevving,
      surface
    );

    const distToShop = Math.hypot(pos.current.x - 65, pos.current.z - 140);
    const distToWp = Math.hypot(pos.current.x - waypointTarget[0], pos.current.z - waypointTarget[2]);
    setDistances(Math.round(distToShop), 0, Math.round(distToWp));
  });

  return null;
};
