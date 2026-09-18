'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useJetJetStore } from '@/games/jetjet/store';

export const ThirdPersonCamera: React.FC = () => {
  const { camera, gl } = useThree();

  // Spherical Orbit State
  const orbitYaw = useRef(0); // Horizontal angle in radians
  const orbitPitch = useRef(0.35); // Elevation angle in radians (~20 deg)
  const targetDist = useRef(3.8); // Target zoom distance
  const currentDist = useRef(3.8); // Smoothed zoom distance

  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });
  const userLookTimeout = useRef(0);

  const currentCamPos = useRef(new THREE.Vector3(0, 3, 6));
  const currentLookTarget = useRef(new THREE.Vector3(0, 1, 0));

  // Initialize mouse orbit and wheel zoom listeners
  useEffect(() => {
    const dom = gl.domElement;

    const onPointerDown = (e: PointerEvent) => {
      // Allow left click (0) or right click (2) drag
      if (e.button === 0 || e.button === 2) {
        isDragging.current = true;
        previousMouse.current = { x: e.clientX, y: e.clientY };
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      // Orbit when dragging or when pointer locked
      const isLocked = document.pointerLockElement === dom;
      if (isDragging.current || isLocked) {
        const dx = isLocked ? e.movementX : (e.clientX - previousMouse.current.x);
        const dy = isLocked ? e.movementY : (e.clientY - previousMouse.current.y);

        previousMouse.current = { x: e.clientX, y: e.clientY };

        const sensitivity = 0.0035;
        orbitYaw.current -= dx * sensitivity;
        orbitPitch.current = THREE.MathUtils.clamp(
          orbitPitch.current + dy * sensitivity,
          0.08, // min pitch (almost ground level)
          1.28  // max pitch (steep top-down)
        );

        userLookTimeout.current = Date.now() + 2500; // Keep free look active for 2.5s
      }
    };

    const onPointerUp = () => {
      isDragging.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Scroll up (negative delta) = zoom in, Scroll down = zoom out
      const zoomSpeed = 0.003;
      targetDist.current = THREE.MathUtils.clamp(
        targetDist.current + e.deltaY * zoomSpeed,
        1.8, // Closest zoom
        8.2  // Furthest zoom
      );
    };

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault(); // Prevent right-click context menu
    };

    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('contextmenu', onContextMenu);

    return () => {
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('contextmenu', onContextMenu);
    };
  }, [gl]);

  useFrame((_, delta) => {
    const {
      isRiding,
      playerPosition,
      bikePosition,
      bikeRotation,
      speedKmh,
      gameState,
      isDrinking
    } = useJetJetStore.getState();

    const perspCam = camera as THREE.PerspectiveCamera;

    // Smoothly interpolate zoom distance
    currentDist.current = THREE.MathUtils.lerp(currentDist.current, targetDist.current, delta * 8);

    // 1. CINEMATIC TRANSFORMATION ORBIT
    if (gameState === 'CINEMATIC_DRINK' || isDrinking) {
      const t = Date.now() * 0.0012;
      const target = new THREE.Vector3(playerPosition[0], playerPosition[1] + 1.2, playerPosition[2]);
      const radius = 2.8;

      const camX = target.x + Math.sin(t) * radius;
      const camZ = target.z + Math.cos(t) * radius;
      const camY = target.y + 0.4 + Math.sin(t * 2) * 0.15;

      camera.position.lerp(new THREE.Vector3(camX, camY, camZ), delta * 5);
      camera.lookAt(target);
      if (perspCam.fov) {
        perspCam.fov = THREE.MathUtils.lerp(perspCam.fov, 50, delta * 3);
        perspCam.updateProjectionMatrix();
      }
      return;
    }

    // 2. MOTORCYCLE VEHICLE CAMERA
    if (isRiding) {
      const absSpeed = Math.abs(speedKmh);
      const speedFactor = Math.min(absSpeed / 90, 1);

      // If user is not actively dragging the camera, smoothly align behind bike
      const isFreeLooking = Date.now() < userLookTimeout.current || isDragging.current;
      if (!isFreeLooking) {
        let diff = bikeRotation - orbitYaw.current;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        orbitYaw.current += diff * Math.min(delta * 4, 1);
        orbitPitch.current = THREE.MathUtils.lerp(orbitPitch.current, 0.28, delta * 3);
      }

      // Dynamic distance and height based on speed and user zoom
      const followDist = (currentDist.current + 1.0) + speedFactor * 1.5;
      const hDist = followDist * Math.cos(orbitPitch.current);
      const camHeight = followDist * Math.sin(orbitPitch.current);

      const targetCamX = bikePosition[0] - Math.sin(orbitYaw.current) * hDist;
      const targetCamZ = bikePosition[2] - Math.cos(orbitYaw.current) * hDist;
      const targetCamY = bikePosition[1] + 0.8 + camHeight;

      // Look slightly ahead of bike
      const lookAhead = 3.5 + speedFactor * 3.5;
      const lookX = bikePosition[0] + Math.sin(bikeRotation) * (isFreeLooking ? 0 : lookAhead);
      const lookZ = bikePosition[2] + Math.cos(bikeRotation) * (isFreeLooking ? 0 : lookAhead);
      const lookY = bikePosition[1] + 1.0;

      currentCamPos.current.lerp(new THREE.Vector3(targetCamX, targetCamY, targetCamZ), delta * 8);
      currentLookTarget.current.lerp(new THREE.Vector3(lookX, lookY, lookZ), delta * 9);

      camera.position.copy(currentCamPos.current);
      camera.lookAt(currentLookTarget.current);

      if (perspCam.fov) {
        const targetFov = 60 + speedFactor * 16;
        perspCam.fov = THREE.MathUtils.lerp(perspCam.fov, targetFov, delta * 4);
        perspCam.updateProjectionMatrix();
      }
      return;
    }

    // 3. ON-FOOT THIRD PERSON CAMERA (360° Mouse Orbit + Zoom)
    const target = new THREE.Vector3(playerPosition[0], playerPosition[1] + 1.2, playerPosition[2]);

    const hDist = currentDist.current * Math.cos(orbitPitch.current);
    const camHeight = currentDist.current * Math.sin(orbitPitch.current);

    const targetCamX = target.x + Math.sin(orbitYaw.current) * hDist;
    const targetCamZ = target.z + Math.cos(orbitYaw.current) * hDist;
    const targetCamY = target.y + camHeight;

    currentCamPos.current.lerp(new THREE.Vector3(targetCamX, targetCamY, targetCamZ), delta * 12);
    currentLookTarget.current.lerp(target, delta * 14);

    camera.position.copy(currentCamPos.current);
    camera.lookAt(currentLookTarget.current);

    if (perspCam.fov) {
      perspCam.fov = THREE.MathUtils.lerp(perspCam.fov, 60, delta * 3);
      perspCam.updateProjectionMatrix();
    }
  });

  return null;
};
