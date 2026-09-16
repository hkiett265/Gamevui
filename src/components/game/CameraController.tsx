'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useGameStore } from '@/stores/useGameStore';
import { soundSystem } from '@/audio/soundSystem';

export const CameraController: React.FC = () => {
  const { camera, gl } = useThree();
  const { gameState, shakeIntensity, gunRecoil, decayJuice, setIsPointerLocked } = useGameStore();

  // Mouse aim angles in radians
  const targetAim = useRef({ yaw: 0, pitch: 0 });
  const currentAim = useRef({ yaw: 0, pitch: 0 });
  const cameraRecoilPitch = useRef(0);

  // Player position & velocity in the farmyard (WASD movement with momentum)
  const playerPos = useRef(new THREE.Vector3(0, 2.2, 3.8));
  const velocity = useRef(new THREE.Vector2(0, 0)); // x, z velocity
  const walkCycle = useRef(0);
  const nextFootstepTime = useRef(0);

  // Movement keys state
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false
  });

  // Mouse Sensitivity
  const MOUSE_SENSITIVITY = 0.0024;

  useEffect(() => {
    const canvas = gl.domElement;

    // 1. Pointer Lock Event Handlers
    const handlePointerLockChange = () => {
      const isLocked = document.pointerLockElement === canvas;
      setIsPointerLocked(isLocked);
    };

    const handleCanvasClick = () => {
      if (useGameStore.getState().gameState === 'PLAYING') {
        if (document.pointerLockElement !== canvas) {
          canvas.requestPointerLock().catch(() => {});
        }
      }
    };

    // 2. Mouse Move Handler (Pointer Lock & Standard Aiming)
    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement === canvas) {
        // --- POINTER LOCK MODE (Professional 360° FPS Aiming) ---
        targetAim.current.yaw -= e.movementX * MOUSE_SENSITIVITY;
        targetAim.current.pitch -= e.movementY * MOUSE_SENSITIVITY;

        // Clamp vertical pitch (-55 deg to +55 deg)
        targetAim.current.pitch = THREE.MathUtils.clamp(
          targetAim.current.pitch,
          -0.85,
          0.85
        );
      } else {
        // --- STANDARD CASUAL MODE (Edge-panning & responsive cursor tracking) ---
        const normX = (e.clientX / window.innerWidth) * 2 - 1;
        const normY = -(e.clientY / window.innerHeight) * 2 + 1;

        // Comfortable wide sweeping angle
        targetAim.current.yaw = -normX * 1.1; // ~63 degrees
        targetAim.current.pitch = THREE.MathUtils.clamp(normY * 0.6, -0.65, 0.65);
      }
    };

    // 3. Keyboard Movement Handlers (WASD / Arrows)
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keys.current.right = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.current.sprint = true;
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keys.current.right = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.current.sprint = false;
          break;
      }
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    canvas.addEventListener('click', handleCanvasClick);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      canvas.removeEventListener('click', handleCanvasClick);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gl.domElement, setIsPointerLocked]);

  // Automatically exit pointer lock whenever not in active PLAYING state
  useEffect(() => {
    if (gameState !== 'PLAYING') {
      if (typeof document !== 'undefined' && document.pointerLockElement) {
        try {
          document.exitPointerLock();
        } catch {}
      }
      setIsPointerLocked(false);
    }
  }, [gameState, setIsPointerLocked]);

  // Reset player position when in MENU or starting countdown
  useEffect(() => {
    if (gameState === 'MENU' || gameState === 'COUNTDOWN') {
      playerPos.current.set(0, 2.2, 3.8);
      velocity.current.set(0, 0);
      walkCycle.current = 0;
      targetAim.current = { yaw: 0, pitch: 0 };
      currentAim.current = { yaw: 0, pitch: 0 };
    }
  }, [gameState]);

  // Recoil bump when gun is fired
  useEffect(() => {
    if (gunRecoil > 0.8) {
      cameraRecoilPitch.current = 0.055; // punchy kick up
    }
  }, [gunRecoil]);

  useFrame((state, delta) => {
    decayJuice(delta);
    const t = state.clock.getElapsedTime();

    // Recover camera recoil smoothly
    cameraRecoilPitch.current = THREE.MathUtils.damp(
      cameraRecoilPitch.current,
      0,
      14,
      delta
    );

    if (gameState === 'MENU') {
      // Cinematic Camera Pan in Menu
      const menuRadius = 16;
      const menuAngle = t * 0.08 + 1.2;
      const camX = Math.sin(menuAngle) * menuRadius * 0.7;
      const camZ = Math.cos(menuAngle) * menuRadius * 0.6 + 6;
      const camY = 5.5 + Math.sin(t * 0.2) * 1.2;

      camera.position.x = THREE.MathUtils.damp(camera.position.x, camX, 4, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, camY, 4, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, camZ, 4, delta);
      camera.lookAt(0, 2.5, -8);
      return;
    }

    // --- CAMERA-RELATIVE SMOOTH WASD MOVEMENT ---
    let isMoving = false;
    let targetVx = 0;
    let targetVz = 0;

    if (gameState === 'PLAYING') {
      // Camera orientation projected on horizontal ground plane
      const currentYaw = currentAim.current.yaw;
      const forwardX = -Math.sin(currentYaw);
      const forwardZ = -Math.cos(currentYaw);
      const rightX = -forwardZ;
      const rightZ = forwardX;

      let moveDirX = 0;
      let moveDirZ = 0;

      if (keys.current.forward) {
        moveDirX += forwardX;
        moveDirZ += forwardZ;
      }
      if (keys.current.backward) {
        moveDirX -= forwardX;
        moveDirZ -= forwardZ;
      }
      if (keys.current.left) {
        moveDirX -= rightX;
        moveDirZ -= rightZ;
      }
      if (keys.current.right) {
        moveDirX += rightX;
        moveDirZ += rightZ;
      }

      const moveLen = Math.sqrt(moveDirX * moveDirX + moveDirZ * moveDirZ);
      if (moveLen > 0.001) {
        isMoving = true;
        const normalizedDirX = moveDirX / moveLen;
        const normalizedDirZ = moveDirZ / moveLen;
        const targetSpeed = keys.current.sprint ? 9.5 : 6.2;

        targetVx = normalizedDirX * targetSpeed;
        targetVz = normalizedDirZ * targetSpeed;

        walkCycle.current += delta * (keys.current.sprint ? 16 : 11);

        // Footstep sound
        if (t > nextFootstepTime.current) {
          nextFootstepTime.current = t + (keys.current.sprint ? 0.26 : 0.36);
          soundSystem.playFootstep();
        }
      }
    }

    // Smooth momentum / damping (acceleration & deceleration friction)
    velocity.current.x = THREE.MathUtils.damp(velocity.current.x, targetVx, 14, delta);
    velocity.current.y = THREE.MathUtils.damp(velocity.current.y, targetVz, 14, delta);

    // Apply movement with boundary clamps
    playerPos.current.x += velocity.current.x * delta;
    playerPos.current.z += velocity.current.y * delta;

    // Farm boundary limits
    playerPos.current.x = THREE.MathUtils.clamp(playerPos.current.x, -16, 14);
    playerPos.current.z = THREE.MathUtils.clamp(playerPos.current.z, -5.5, 9.0);

    // Smooth subtle head bob while moving
    const speedMagnitude = velocity.current.length();
    const bobFactor = Math.min(speedMagnitude / 6.0, 1.0);
    const headBobY = isMoving ? Math.sin(walkCycle.current) * 0.045 * bobFactor : 0;
    const headBobX = isMoving ? Math.cos(walkCycle.current * 0.5) * 0.025 * bobFactor : 0;

    // Camera smoothly follows player with responsive damping
    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      playerPos.current.x + headBobX,
      18,
      delta
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      2.2 + headBobY,
      18,
      delta
    );
    camera.position.z = THREE.MathUtils.damp(
      camera.position.z,
      playerPos.current.z,
      18,
      delta
    );

    // --- ULTRA SMOOTH ROTATION DAMPING ---
    currentAim.current.yaw = THREE.MathUtils.damp(
      currentAim.current.yaw,
      targetAim.current.yaw,
      28,
      delta
    );
    currentAim.current.pitch = THREE.MathUtils.damp(
      currentAim.current.pitch,
      targetAim.current.pitch,
      28,
      delta
    );

    // Screen shake
    let shakeX = 0;
    let shakeY = 0;
    if (shakeIntensity > 0.01) {
      shakeX = (Math.random() - 0.5) * shakeIntensity * 0.12;
      shakeY = (Math.random() - 0.5) * shakeIntensity * 0.12;
    }

    // Apply rotation
    camera.rotation.order = 'YXZ';
    camera.rotation.y = currentAim.current.yaw + shakeX;
    camera.rotation.x = currentAim.current.pitch + cameraRecoilPitch.current + shakeY;
    camera.rotation.z = 0;
  });

  return null;
};
