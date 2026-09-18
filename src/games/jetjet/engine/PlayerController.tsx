'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useJetJetStore } from '@/games/jetjet/store';
import { jetJetAudio } from './audio/jetJetAudio';

export const PlayerController: React.FC = () => {
  const keys = useRef<{
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    shift: boolean;
  }>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    shift: false
  });

  const pos = useRef(new THREE.Vector3(-2.5, 0, -2));
  const yaw = useRef(0);
  const wasRiding = useRef(false);
  const footstepTimer = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const {
        isRiding,
        hasBottle,
        isDrinking,
        distanceToBike,
        distanceToShop,
        mountBike,
        buyBottle,
        startDrinking
      } = useJetJetStore.getState();

      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') keys.current.forward = true;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') keys.current.backward = true;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') keys.current.left = true;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') keys.current.right = true;
      if (e.key === 'Shift') keys.current.shift = true;

      // Mount vehicle (F)
      if ((e.key === 'f' || e.key === 'F') && !isRiding && distanceToBike < 3.2) {
        jetJetAudio.playMount();
        jetJetAudio.startEngine();
        mountBike();
      }

      // Interact with shop & drink (E)
      if (e.key === 'e' || e.key === 'E') {
        if (!isRiding && !isDrinking) {
          if (distanceToShop < 10.0) {
            if (!hasBottle) {
              jetJetAudio.playBottleOpen();
              buyBottle();
              setTimeout(() => {
                jetJetAudio.playGulp();
                startDrinking();
              }, 200);
            } else {
              jetJetAudio.playGulp();
              startDrinking();
            }
          } else if (hasBottle) {
            jetJetAudio.playGulp();
            startDrinking();
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') keys.current.forward = false;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') keys.current.backward = false;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') keys.current.left = false;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') keys.current.right = false;
      if (e.key === 'Shift') keys.current.shift = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    const {
      isRiding,
      playerPosition,
      playerRotation,
      bikePosition,
      hasBottle,
      isDrinking,
      missionStep,
      waypointTarget,
      setPlayerPosition,
      setPlayerRotation,
      setPlayerMoving,
      setInteraction,
      setDistances
    } = useJetJetStore.getState();

    // Sync position when transitioning from mounted to dismounted (TEST 9)
    if (wasRiding.current && !isRiding) {
      pos.current.set(playerPosition[0], playerPosition[1], playerPosition[2]);
      yaw.current = playerRotation;
    }
    wasRiding.current = isRiding;

    // While riding, PlayerController is disabled (TEST 8)
    if (isRiding) return;

    // Input directions
    let inputForward = 0;
    let inputRight = 0;

    if (keys.current.forward) inputForward += 1;  // W or ArrowUp: Forward relative to camera
    if (keys.current.backward) inputForward -= 1; // S or ArrowDown: Backward relative to camera
    if (keys.current.right) inputRight += 1;      // D or ArrowRight: Right relative to camera
    if (keys.current.left) inputRight -= 1;       // A or ArrowLeft: Left relative to camera

    const hasInput = inputForward !== 0 || inputRight !== 0;
    const isRunning = keys.current.shift;
    const moveSpeed = isRunning ? 6.5 : 3.6;

    if (hasInput && !isDrinking) {
      // Calculate Camera-relative forward and right vectors projected onto ground (XZ)
      const cam = state.camera;
      const camForward = new THREE.Vector3();
      cam.getWorldDirection(camForward);
      camForward.y = 0; // Flatten to ground plane
      if (camForward.lengthSq() > 0.0001) {
        camForward.normalize();
      } else {
        camForward.set(0, 0, -1);
      }

      // Camera right vector (cross product forward with world UP)
      const camRight = new THREE.Vector3();
      camRight.crossVectors(camForward, new THREE.Vector3(0, 1, 0)).normalize();

      // Combine input with camera vectors
      const moveDir = new THREE.Vector3();
      moveDir.addScaledVector(camForward, inputForward);
      moveDir.addScaledVector(camRight, inputRight);

      if (moveDir.lengthSq() > 0.0001) {
        moveDir.normalize();

        // Translate character position
        pos.current.x += moveDir.x * moveSpeed * delta;
        pos.current.z += moveDir.z * moveSpeed * delta;

        // Smoothly rotate character to face moveDir
        const targetYaw = Math.atan2(moveDir.x, moveDir.z);

        // Shortest arc rotation
        let diff = targetYaw - yaw.current;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        yaw.current += diff * Math.min(delta * 14, 1);

        // Footstep cadence
        footstepTimer.current += delta * (isRunning ? 12 : 7.5);
        if (footstepTimer.current > Math.PI) {
          footstepTimer.current = 0;
          jetJetAudio.playFootstep('CONCRETE', isRunning);
        }
      }
    }

    // Bridge elevation for pedestrian
    const distToBridge = Math.hypot(pos.current.x - 22, pos.current.z - 52);
    if (distToBridge < 12) {
      pos.current.y = THREE.MathUtils.lerp(pos.current.y, 0.58 * Math.cos((distToBridge / 12) * (Math.PI / 2)), delta * 12);
    } else {
      pos.current.y = THREE.MathUtils.lerp(pos.current.y, 0, delta * 12);
    }

    pos.current.x = THREE.MathUtils.clamp(pos.current.x, -90, 90);
    pos.current.z = THREE.MathUtils.clamp(pos.current.z, -55, 185);

    setPlayerPosition([pos.current.x, pos.current.y, pos.current.z]);
    setPlayerRotation(yaw.current);
    setPlayerMoving(hasInput && !isDrinking, isRunning);

    // Update distances
    const distToBike = Math.hypot(pos.current.x - bikePosition[0], pos.current.z - bikePosition[2]);
    const distToShop = Math.hypot(pos.current.x - 65, pos.current.z - 142);
    const distToWp = Math.hypot(pos.current.x - waypointTarget[0], pos.current.z - waypointTarget[2]);
    setDistances(Math.round(distToShop), Math.round(distToBike), Math.round(distToWp));

    // Interaction prompts
    if (distToBike < 3.2) {
      setInteraction('Lên xe Exciter', 'F');
    } else if (distToShop < 10.0) {
      if (!hasBottle && missionStep <= 3) {
        setInteraction('Lấy & Uống Nước Tăng Lực', 'E');
      } else if (hasBottle && !isDrinking) {
        setInteraction('Uống Nước Tăng Lực', 'E');
      } else {
        setInteraction(null);
      }
    } else if (hasBottle && !isDrinking) {
      setInteraction('Uống Nước Tăng Lực', 'E');
    } else {
      setInteraction(null);
    }
  });

  return null;
};
