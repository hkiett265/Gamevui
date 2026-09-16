'use client';

import React from 'react';
import { Farmhouse } from './Farmhouse';
import { Windmill } from './Windmill';
import { ChickenCoop } from './ChickenCoop';
import { Tractor } from './Tractor';
import { PineTree, OakTree, HayBale, Fence, WoodenCrate, Sunflower } from './Vegetation';
import { CartoonSky } from './CartoonSky';

export const FarmEnvironment: React.FC = () => {
  return (
    <group>
      {/* 1. Sky and Clouds */}
      <CartoonSky />

      {/* 2. Main Ground Field */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, -15]} receiveShadow>
        <planeGeometry args={[120, 90]} />
        <meshStandardMaterial color="#4ade80" roughness={0.8} />
      </mesh>

      {/* Dirt Pathway (Winding farm path) */}
      <mesh rotation={[-Math.PI / 2, 0, 0.15]} position={[-2, -0.02, -12]} receiveShadow>
        <planeGeometry args={[4.5, 36]} />
        <meshStandardMaterial color="#d97706" roughness={0.9} />
      </mesh>

      {/* 3. Farm Pond */}
      <group position={[14, 0, -10]}>
        {/* Water Pool */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <circleGeometry args={[4.2, 16]} />
          <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.1} />
        </mesh>
        {/* Pond bank border / stones */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const angle = (i * Math.PI) / 4;
          const px = Math.cos(angle) * 4.3;
          const pz = Math.sin(angle) * 4.3;
          return (
            <mesh key={i} position={[px, 0.1, pz]} castShadow>
              <sphereGeometry args={[0.35 + (i % 2) * 0.15, 6, 6]} />
              <meshStandardMaterial color="#94a3b8" roughness={0.9} />
            </mesh>
          );
        })}
        {/* Lilypads */}
        <mesh position={[-1.2, 0.04, 0.8]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.5, 8]} />
          <meshStandardMaterial color="#15803d" />
        </mesh>
        <mesh position={[1.5, 0.04, -0.9]} rotation={[-Math.PI / 2, 0, 0.5]}>
          <circleGeometry args={[0.4, 8]} />
          <meshStandardMaterial color="#15803d" />
        </mesh>
      </group>

      {/* 4. Farm Buildings */}
      <Farmhouse position={[-14, 0, -22]} rotation={[0, 0.35, 0]} />
      <Windmill position={[13, 0, -26]} rotation={[0, -0.4, 0]} />
      <ChickenCoop position={[7, 0, -15]} rotation={[0, -0.25, 0]} />
      <Tractor position={[-6, 0, -12]} rotation={[0, 0.45, 0]} />

      {/* 5. Fences across Middleground */}
      <Fence position={[-10, 0, -8]} rotation={[0, 0.1, 0]} />
      <Fence position={[-7.5, 0, -8]} rotation={[0, 0.1, 0]} />
      <Fence position={[-5, 0, -8.2]} rotation={[0, 0.15, 0]} />

      <Fence position={[4, 0, -8.5]} rotation={[0, -0.1, 0]} />
      <Fence position={[6.5, 0, -8.3]} rotation={[0, -0.05, 0]} />
      <Fence position={[9, 0, -8.1]} rotation={[0, 0, 0]} />

      {/* 6. Hay Bales */}
      <HayBale position={[-3, 0, -6.5]} rotation={[0, 0.3, 0]} />
      <HayBale position={[-1.5, 0, -7.0]} rotation={[0, -0.2, 0]} />
      <HayBale position={[-2.2, 1.1, -6.7]} rotation={[0, 0.1, 0]} />
      <HayBale position={[4.5, 0, -6.5]} rotation={[0, -0.4, 0]} />
      <HayBale position={[10, 0, -14]} rotation={[0, 0.5, 0]} />

      {/* 7. Wooden Crates */}
      <WoodenCrate position={[-4.5, 0.45, -5.5]} rotation={[0, 0.2, 0]} />
      <WoodenCrate position={[-5.3, 0.45, -5.7]} rotation={[0, -0.1, 0]} />
      <WoodenCrate position={[-4.9, 1.3, -5.6]} rotation={[0, 0.4, 0]} scale={0.8} />

      {/* 8. Trees (Pine & Oak) */}
      <PineTree position={[-20, 0, -14]} scale={1.3} />
      <PineTree position={[-17, 0, -8]} scale={1.1} />
      <PineTree position={[-22, 0, -25]} scale={1.5} />
      <OakTree position={[-1, 0, -28]} scale={1.4} />
      <OakTree position={[18, 0, -18]} scale={1.3} />
      <PineTree position={[20, 0, -10]} scale={1.2} />
      <PineTree position={[17, 0, -28]} scale={1.6} />

      {/* 9. Sunflower Patches */}
      {[-8, -7.2, -6.5].map((x, i) => (
        <Sunflower key={`sf-left-${i}`} position={[x, 0, -4.8 + (i % 2) * 0.4]} />
      ))}
      {[3.2, 4.0, 4.8].map((x, i) => (
        <Sunflower key={`sf-right-${i}`} position={[x, 0, -5.2 + (i % 2) * 0.3]} />
      ))}
    </group>
  );
};
