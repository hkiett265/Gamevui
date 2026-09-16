'use client';

import React, { useEffect } from 'react';
import { Html } from '@react-three/drei';
import { useGameStore, FloatingText } from '@/stores/useGameStore';

const SingleScoreText: React.FC<{ item: FloatingText; onDone: () => void }> = ({ item, onDone }) => {
  useEffect(() => {
    const timer = setTimeout(onDone, 850);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <Html position={item.position} center distanceFactor={15} style={{ pointerEvents: 'none' }}>
      <div
        className="float-score-anim font-extrabold select-none whitespace-nowrap"
        style={{
          color: item.color,
          fontSize: `${2.2 * item.scale}rem`,
          textShadow: '0 3px 0 #000, 0 0 12px rgba(0,0,0,0.8)',
          filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))'
        }}
      >
        {item.text}
      </div>
    </Html>
  );
};

export const FloatingScores: React.FC = () => {
  const { floatingTexts, removeFloatingText } = useGameStore();

  return (
    <group>
      {floatingTexts.map((item) => (
        <SingleScoreText
          key={item.id}
          item={item}
          onDone={() => removeFloatingText(item.id)}
        />
      ))}
    </group>
  );
};
