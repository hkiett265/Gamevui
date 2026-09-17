'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useJetJetStore } from '@/games/jetjet/store';
import { jetJetAudio } from './audio/jetJetAudio';

export const Mission02Controller: React.FC = () => {
  const {
    missionStep,
    isRiding,
    playerPosition,
    triggerNeighborDiscovery,
    startChase,
    showSubtitle
  } = useJetJetStore();

  const discoveryHandled = useRef(false);

  useFrame(() => {
    // Neighbor house is at x=-22, z=32
    if (missionStep === 7 && !isRiding && !discoveryHandled.current) {
      const distToNeighbor = Math.hypot(playerPosition[0] - (-22), playerPosition[2] - 32);
      if (distToNeighbor < 15) {
        discoveryHandled.current = true;

        // Trigger discovery sequence
        triggerNeighborDiscovery();
        jetJetAudio.playNpcShout('EH_ANH_HAI');
        jetJetAudio.playDogBark(12, true);
        showSubtitle('ANH BA HÀNG XÓM: “Ê ANH HAI! ĐỨNG LẠI COI!”', 2500);

        // Music drops for dramatic comedy beat
        jetJetAudio.setMusicState('NONE');

        // Start chase after 1.2s delay
        setTimeout(() => {
          jetJetAudio.setMusicState('CHASE');
          startChase();
        }, 1200);
      }
    }
  });

  return null;
};
