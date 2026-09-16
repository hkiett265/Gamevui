'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ChickenModel } from './ChickenModel';
import { useGameStore, ChickenType } from '@/stores/useGameStore';
import { BonusBalloon, TargetBoard } from './BonusTargets';

interface ChickenData {
  id: string;
  type: ChickenType;
  pos: THREE.Vector3;
  dir: THREE.Vector3;
  speed: number;
  rotation: number;
  scale: number;
  zigPhase: number;
  isDying: boolean;
}

// Individual Chicken with Generous Raycast Hitboxes & Smooth Position Updates
const IndividualChicken: React.FC<{
  data: ChickenData;
  onHit: (id: string, hitPos: [number, number, number], isHeadshot: boolean) => void;
  onRemove: (id: string) => void;
}> = ({ data, onHit, onRemove }) => {
  const groupRef = useRef<THREE.Group>(null);
  const posRef = useRef(data.pos.clone());
  const timeAlive = useRef(0);
  const dying = useRef(data.isDying);

  useFrame((_, delta) => {
    if (!groupRef.current || dying.current) return;

    timeAlive.current += delta;

    if (data.type === 'crazy') {
      const perpX = -data.dir.z;
      const perpZ = data.dir.x;
      // Gentle comical waddle, not supersonic teleporting
      const sway = Math.sin(timeAlive.current * 4.5 + data.zigPhase) * 1.6;
      posRef.current.x += (data.dir.x * data.speed + perpX * sway) * delta;
      posRef.current.z += (data.dir.z * data.speed + perpZ * sway) * delta;
    } else {
      posRef.current.x += data.dir.x * data.speed * delta;
      posRef.current.z += data.dir.z * data.speed * delta;
    }

    if (data.type === 'flying') {
      posRef.current.y = 5.2 + Math.sin(timeAlive.current * 3.2) * 0.45;
    }

    groupRef.current.position.set(posRef.current.x, posRef.current.y, posRef.current.z);

    // Bounds check
    if (
      Math.abs(posRef.current.x) > 32 ||
      posRef.current.z > 9 ||
      posRef.current.z < -36 ||
      timeAlive.current > 30
    ) {
      onRemove(data.id);
    }
  });

  const handleShotHit = (hitPoint: THREE.Vector3, hitObject: THREE.Object3D) => {
    if (dying.current) return;
    dying.current = true;

    // Check if head hitbox was struck
    const isHeadshot =
      hitObject.name === 'chicken-head-hitbox' ||
      Boolean(hitObject.userData?.isHead);

    onHit(
      data.id,
      [posRef.current.x, posRef.current.y + (isHeadshot ? 0.6 : 0.3), posRef.current.z],
      isHeadshot
    );
  };

  return (
    <group
      ref={groupRef}
      position={[data.pos.x, data.pos.y, data.pos.z]}
      rotation={[0, data.rotation, 0]}
      userData={{ isShootable: true, onHit: handleShotHit }}
    >
      {/* 1. Generous Body Hitbox Sphere (invisible, ensures 100% accurate hit detection) */}
      <mesh name="chicken-body-hitbox" position={[0, 0.45 * data.scale, 0]} visible={false}>
        <sphereGeometry args={[1.15 * data.scale, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* 2. Generous Head Hitbox Sphere (detects headshots for bonus score) */}
      <mesh
        name="chicken-head-hitbox"
        userData={{ isHead: true }}
        position={[0, 0.88 * data.scale, 0.28 * data.scale]}
        visible={false}
      >
        <sphereGeometry args={[0.55 * data.scale, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* 3. Visible 3D Cartoon Chicken Model */}
      <ChickenModel
        type={data.type}
        speed={data.speed}
        isDying={data.isDying}
        scale={data.scale}
      />
    </group>
  );
};

export const ChickenManager: React.FC = () => {
  const [chickens, setChickens] = useState<ChickenData[]>([]);
  const [balloons, setBalloons] = useState<{ id: string; pos: [number, number, number] }[]>([]);

  const { gameState, timeLeft, recordHit, activeEvent, triggerEvent } = useGameStore();

  const nextSpawnTime = useRef(0);
  const nextEventCheck = useRef(15);
  const nextBalloonCheck = useRef(8);

  // Clear chickens on restart / menu
  useEffect(() => {
    if (gameState === 'MENU' || gameState === 'COUNTDOWN') {
      setChickens([]);
      setBalloons([]);
    }
  }, [gameState]);

  const removeChicken = useCallback((id: string) => {
    setChickens((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const handleHit = useCallback(
    (id: string, hitPos: [number, number, number], isHeadshot: boolean) => {
      setChickens((prev) => {
        const target = prev.find((c) => c.id === id);
        if (!target || target.isDying) return prev;

        recordHit(target.type, hitPos, isHeadshot);

        // Trigger dying animation
        return prev.map((c) => (c.id === id ? { ...c, isDying: true } : c));
      });

      // Remove after death spin burst
      setTimeout(() => {
        setChickens((prev) => prev.filter((c) => c.id !== id));
      }, 240);
    },
    [recordHit]
  );

  // Spawner loop runs in useFrame (balanced pacing & enjoyable density)
  useFrame((state) => {
    if (gameState !== 'PLAYING') return;

    const t = state.clock.getElapsedTime();

    // 1. Random Special Event Triggering
    if (t > nextEventCheck.current && !activeEvent && timeLeft > 15) {
      nextEventCheck.current = t + 20 + Math.random() * 8;
      const roll = Math.random();
      if (roll < 0.35) {
        triggerEvent({
          type: 'RUSH',
          title: '🐔 CƠN BÃO GÀ!',
          subtitle: 'ĐÀN GÀ ĐANG LAO ĐẾN DỒN DẬP!',
          duration: 7
        });
      } else if (roll < 0.7) {
        triggerEvent({
          type: 'GOLDEN_TIME',
          title: '✨ GÀ VÀNG XUẤT HIỆN!',
          subtitle: 'SĂN GÀ VÀNG NHẬN ĐIỂM KHỦNG!',
          duration: 6
        });
      }
    }

    // 2. Bonus Balloons Spawner
    if (t > nextBalloonCheck.current && chickens.length < 12) {
      nextBalloonCheck.current = t + 14 + Math.random() * 8;
      const bX = (Math.random() - 0.5) * 20;
      const bZ = -10 - Math.random() * 8;
      setBalloons((prev) => [...prev, { id: Math.random().toString(), pos: [bX, -2, bZ] }]);
    }

    // 3. Chicken Spawning Intervals (comfortable pacing)
    const isRush = activeEvent?.type === 'RUSH';
    const spawnInterval = isRush ? 0.5 : 1.35;

    if (t > nextSpawnTime.current && chickens.length < 14) {
      nextSpawnTime.current = t + spawnInterval;

      let type: ChickenType = 'normal';
      const typeRoll = Math.random();

      if (activeEvent?.type === 'GOLDEN_TIME') {
        type = 'golden';
      } else if (typeRoll < 0.12) {
        type = 'golden';
      } else if (typeRoll < 0.35) {
        type = 'fast';
      } else if (typeRoll < 0.6) {
        type = 'flying';
      } else if (typeRoll < 0.8) {
        type = 'crazy';
      }

      spawnChicken(type);
    }
  });

  const spawnChicken = (type: ChickenType) => {
    const isFlying = type === 'flying';
    const routeRoll = Math.random();

    let startPos: THREE.Vector3;
    let targetPos: THREE.Vector3;

    // --- COMFORTABLE ARCADE SPEED TUNING ---
    // Slower, enjoyable pacing so the player has plenty of time to aim and shoot
    let speed = 2.2;
    if (type === 'fast') speed = 3.6;
    else if (type === 'golden') speed = 4.0;
    else if (type === 'crazy') speed = 2.7;
    else if (isFlying) speed = 2.5;

    if (isFlying) {
      if (routeRoll > 0.5) {
        startPos = new THREE.Vector3(-26, 5.2, -12 - Math.random() * 8);
        targetPos = new THREE.Vector3(26, 5.6, -12 - Math.random() * 8);
      } else {
        startPos = new THREE.Vector3(26, 5.2, -12 - Math.random() * 8);
        targetPos = new THREE.Vector3(-26, 5.6, -12 - Math.random() * 8);
      }
    } else {
      if (routeRoll < 0.4) {
        startPos = new THREE.Vector3(-22, 0, -6 - Math.random() * 8);
        targetPos = new THREE.Vector3(22, 0, -6 - Math.random() * 8);
      } else if (routeRoll < 0.75) {
        startPos = new THREE.Vector3(22, 0, -6 - Math.random() * 8);
        targetPos = new THREE.Vector3(-22, 0, -6 - Math.random() * 8);
      } else {
        startPos = new THREE.Vector3(7 + (Math.random() - 0.5) * 3, 0, -14);
        targetPos = new THREE.Vector3(-3 + (Math.random() - 0.5) * 6, 0, -4);
      }
    }

    const dir = new THREE.Vector3().subVectors(targetPos, startPos).normalize();
    const rotation = Math.atan2(dir.x, dir.z);

    const newChicken: ChickenData = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      pos: startPos,
      dir,
      speed: speed * (0.92 + Math.random() * 0.16),
      rotation,
      isDying: false,
      scale: type === 'fast' ? 0.85 : type === 'golden' ? 1.08 : 1.0,
      zigPhase: Math.random() * Math.PI * 2
    };

    setChickens((prev) => [...prev, newChicken]);
  };

  return (
    <group>
      {/* High Performance Chicken Instances with Generous Hitboxes */}
      {chickens.map((chk) => (
        <IndividualChicken
          key={chk.id}
          data={chk}
          onHit={handleHit}
          onRemove={removeChicken}
        />
      ))}

      {/* Bonus Targets: Balloons */}
      {balloons.map((b) => (
        <BonusBalloon key={b.id} id={b.id} startPos={b.pos} />
      ))}

      {/* Fixed Target Boards on Fences & Barn */}
      <TargetBoard position={[-6.2, 0.9, -8.1]} />
      <TargetBoard position={[5.2, 0.9, -8.4]} />
      <TargetBoard position={[-14, 2.5, -15.5]} rotation={[0, 0.35, 0]} />
    </group>
  );
};
