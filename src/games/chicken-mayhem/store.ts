import { create } from 'zustand';
import { soundSystem } from '@/games/chicken-mayhem/audio/soundSystem';

export type GameState = 'MENU' | 'COUNTDOWN' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export type ChickenType = 'normal' | 'fast' | 'flying' | 'golden' | 'crazy' | 'balloon' | 'target' | 'egg';

export interface FloatingText {
  id: string;
  text: string;
  position: [number, number, number];
  color: string;
  scale: number;
}

export interface FeatherBurst {
  id: string;
  position: [number, number, number];
  color: string;
  count: number;
}

export interface SpecialEvent {
  type: 'RUSH' | 'GOLDEN_TIME' | 'DOUBLE_SCORE' | 'LAST_SECONDS';
  title: string;
  subtitle: string;
  duration: number; // seconds remaining
}

interface GameStore {
  gameState: GameState;
  score: number;
  highScore: number;
  combo: number;
  maxCombo: number;
  multiplier: number;
  ammo: number;
  maxAmmo: number;
  isReloading: boolean;
  timeLeft: number;
  shotsFired: number;
  chickensHit: number;
  goldenChickensHit: number;
  headshots: number;
  activeEvent: SpecialEvent | null;
  floatingTexts: FloatingText[];
  featherBursts: FeatherBurst[];
  hitMarkerActive: boolean;
  hitMarkerKey: number;
  shakeIntensity: number;
  gunRecoil: number; // 0 to 1
  isMuted: boolean;
  isPointerLocked: boolean;

  // Actions
  initHighScore: () => void;
  setIsPointerLocked: (locked: boolean) => void;
  setGameState: (state: GameState) => void;
  startCountdown: () => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  shoot: () => boolean; // returns true if shot fired
  reload: () => void;
  finishReload: () => void;
  recordHit: (type: ChickenType, position: [number, number, number], isHeadshot?: boolean) => void;
  recordMiss: () => void;
  decrementTimer: (delta: number) => void;
  triggerEvent: (event: SpecialEvent) => void;
  clearEvent: () => void;
  addFloatingText: (text: string, position: [number, number, number], color?: string, scale?: number) => void;
  removeFloatingText: (id: string) => void;
  addFeatherBurst: (position: [number, number, number], color?: string, count?: number) => void;
  removeFeatherBurst: (id: string) => void;
  clearHitMarker: () => void;
  decayJuice: (delta: number) => void;
  toggleSound: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: 'MENU',
  score: 0,
  highScore: 0,
  combo: 0,
  maxCombo: 0,
  multiplier: 1,
  ammo: 6,
  maxAmmo: 6,
  isReloading: false,
  timeLeft: 60,
  shotsFired: 0,
  chickensHit: 0,
  goldenChickensHit: 0,
  headshots: 0,
  activeEvent: null,
  floatingTexts: [],
  featherBursts: [],
  hitMarkerActive: false,
  hitMarkerKey: 0,
  shakeIntensity: 0,
  gunRecoil: 0,
  isMuted: false,
  isPointerLocked: false,

  setIsPointerLocked: (locked) => set({ isPointerLocked: locked }),

  initHighScore: () => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('chicken_mayhem_high_score');
        if (saved) set({ highScore: parseInt(saved, 10) || 0 });
      } catch (e) {
        console.warn('LocalStorage not available', e);
      }
    }
  },

  setGameState: (state) => set({ gameState: state }),

  startCountdown: () => {
    set({
      gameState: 'COUNTDOWN',
      score: 0,
      combo: 0,
      multiplier: 1,
      ammo: 6,
      isReloading: false,
      timeLeft: 60,
      shotsFired: 0,
      chickensHit: 0,
      goldenChickensHit: 0,
      headshots: 0,
      activeEvent: null,
      floatingTexts: [],
      featherBursts: []
    });
    soundSystem.startMusic();
  },

  startGame: () => {
    set({ gameState: 'PLAYING' });
  },

  pauseGame: () => {
    if (get().gameState === 'PLAYING') {
      if (typeof document !== 'undefined' && document.pointerLockElement) {
        try { document.exitPointerLock(); } catch {}
      }
      set({ gameState: 'PAUSED', isPointerLocked: false });
    }
  },

  resumeGame: () => {
    if (get().gameState === 'PAUSED') {
      set({ gameState: 'PLAYING' });
    }
  },

  endGame: () => {
    const { score, highScore } = get();
    let newHigh = highScore;
    if (score > highScore) {
      newHigh = score;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('chicken_mayhem_high_score', score.toString());
        } catch (e) {
          console.warn('LocalStorage error', e);
        }
      }
    }
    soundSystem.playGameOver?.();
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      try { document.exitPointerLock(); } catch {}
    }
    set({ gameState: 'GAME_OVER', highScore: newHigh, isPointerLocked: false });
  },

  resetGame: () => {
    if (typeof document !== 'undefined' && document.pointerLockElement) {
      try { document.exitPointerLock(); } catch {}
    }
    try { soundSystem.stopMusic(); } catch {}
    set({
      gameState: 'MENU',
      isPointerLocked: false,
      score: 0,
      combo: 0,
      multiplier: 1,
      ammo: 6,
      isReloading: false,
      timeLeft: 60,
      shotsFired: 0,
      chickensHit: 0,
      goldenChickensHit: 0,
      headshots: 0,
      activeEvent: null,
      floatingTexts: [],
      featherBursts: []
    });
  },

  shoot: () => {
    const { ammo, isReloading, gameState } = get();
    if (gameState !== 'PLAYING') return false;

    if (isReloading) {
      soundSystem.playEmptyClick();
      return false;
    }

    if (ammo <= 0) {
      soundSystem.playEmptyClick();
      get().reload();
      return false;
    }

    // Fire!
    soundSystem.playGunshot();
    set((state) => ({
      ammo: state.ammo - 1,
      shotsFired: state.shotsFired + 1,
      gunRecoil: 1.0,
      shakeIntensity: Math.min(state.shakeIntensity + 0.15, 0.4)
    }));

    // Auto-reload on last empty shot after tiny delay
    if (ammo - 1 === 0) {
      setTimeout(() => {
        if (get().gameState === 'PLAYING') {
          get().reload();
        }
      }, 400);
    }

    return true;
  },

  reload: () => {
    const { isReloading, ammo, maxAmmo, gameState } = get();
    if (isReloading || ammo === maxAmmo || gameState !== 'PLAYING') return;

    set({ isReloading: true });
    soundSystem.playReloadStep(1);

    setTimeout(() => {
      if (get().gameState === 'PLAYING') soundSystem.playReloadStep(2);
    }, 400);

    setTimeout(() => {
      if (get().gameState === 'PLAYING') soundSystem.playReloadStep(3);
    }, 850);

    setTimeout(() => {
      get().finishReload();
    }, 1100);
  },

  finishReload: () => {
    set({
      ammo: 6,
      isReloading: false
    });
  },

  recordHit: (type, position, isHeadshot = false) => {
    const { combo, multiplier, activeEvent } = get();
    const newCombo = combo + 1;
    const newMaxCombo = Math.max(get().maxCombo, newCombo);

    // Calculate Multiplier
    let newMultiplier = 1;
    if (newCombo >= 15) newMultiplier = 5;
    else if (newCombo >= 10) newMultiplier = 4;
    else if (newCombo >= 5) newMultiplier = 3;
    else if (newCombo >= 2) newMultiplier = 2;

    // Base point values
    const pointMap: Record<ChickenType, number> = {
      normal: 10,
      fast: 25,
      flying: 30,
      golden: 100,
      crazy: 40,
      balloon: 20,
      target: 50,
      egg: 75
    };

    let basePoints = pointMap[type] || 10;
    if (isHeadshot) {
      basePoints += 20; // Headshot bonus
    }

    // Event bonus (Double score)
    const eventMultiplier = activeEvent?.type === 'DOUBLE_SCORE' ? 2 : 1;
    const totalAward = basePoints * newMultiplier * eventMultiplier;

    // Colors
    let color = '#fef08a';
    let label = `+${totalAward}`;
    if (type === 'golden') {
      color = '#facc15';
      label = `+${totalAward} GOLDEN!`;
      soundSystem.playGoldenChime();
    } else if (isHeadshot) {
      color = '#ef4444';
      label = `HEADSHOT! +${totalAward}`;
      soundSystem.playChickenHit(true);
    } else {
      soundSystem.playChickenHit(false);
      soundSystem.playChickenCluck(1 + Math.random() * 0.4);
    }

    // Poof SFX & Combo sound
    soundSystem.playFeatherPoof();
    if (newCombo % 2 === 0 || newCombo >= 5) {
      soundSystem.playCombo(newCombo);
    }

    // Feather burst color
    const featherColor = type === 'golden' ? '#ffd700' : type === 'fast' ? '#d97706' : '#ffffff';

    get().addFloatingText(label, position, color, isHeadshot ? 1.4 : 1.0);
    get().addFeatherBurst(position, featherColor, type === 'golden' ? 18 : 12);

    set((state) => ({
      score: state.score + totalAward,
      combo: newCombo,
      maxCombo: newMaxCombo,
      multiplier: newMultiplier,
      chickensHit: state.chickensHit + 1,
      goldenChickensHit: type === 'golden' ? state.goldenChickensHit + 1 : state.goldenChickensHit,
      headshots: isHeadshot ? state.headshots + 1 : state.headshots,
      hitMarkerActive: true,
      hitMarkerKey: state.hitMarkerKey + 1,
      shakeIntensity: Math.min(state.shakeIntensity + 0.1, 0.5)
    }));
  },

  recordMiss: () => {
    set({
      combo: 0,
      multiplier: 1
    });
  },

  decrementTimer: (delta) => {
    const { timeLeft, gameState, activeEvent } = get();
    if (gameState !== 'PLAYING') return;

    const newTime = Math.max(0, timeLeft - delta);

    // Update active event timer
    if (activeEvent) {
      const remainingDuration = activeEvent.duration - delta;
      if (remainingDuration <= 0) {
        set({ activeEvent: null });
      } else {
        set({ activeEvent: { ...activeEvent, duration: remainingDuration } });
      }
    }

    // 10s warning trigger
    if (timeLeft > 10 && newTime <= 10) {
      soundSystem.playEventAlert();
      get().triggerEvent({
        type: 'LAST_SECONDS',
        title: '⚠️ 10 SECONDS LEFT!',
        subtitle: 'CHICKEN FRENZY TIME!',
        duration: 10
      });
    }

    if (newTime <= 0) {
      set({ timeLeft: 0 });
      get().endGame();
    } else {
      set({ timeLeft: newTime });
    }
  },

  triggerEvent: (event) => {
    soundSystem.playEventAlert();
    set({ activeEvent: event });
  },

  clearEvent: () => {
    set({ activeEvent: null });
  },

  addFloatingText: (text, position, color = '#ffffff', scale = 1.0) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      floatingTexts: [...state.floatingTexts, { id, text, position, color, scale }]
    }));
  },

  removeFloatingText: (id) => {
    set((state) => ({
      floatingTexts: state.floatingTexts.filter((t) => t.id !== id)
    }));
  },

  addFeatherBurst: (position, color = '#ffffff', count = 12) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      featherBursts: [...state.featherBursts, { id, position, color, count }]
    }));
  },

  removeFeatherBurst: (id) => {
    set((state) => ({
      featherBursts: state.featherBursts.filter((f) => f.id !== id)
    }));
  },

  clearHitMarker: () => set({ hitMarkerActive: false }),

  decayJuice: (delta) => {
    set((state) => ({
      shakeIntensity: Math.max(0, state.shakeIntensity - delta * 2.5),
      gunRecoil: Math.max(0, state.gunRecoil - delta * 4.0)
    }));
  },

  toggleSound: () => {
    const muted = soundSystem.toggleMute();
    set({ isMuted: muted });
  }
}));
