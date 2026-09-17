import { create } from 'zustand';
import { oceanSoundSystem } from '@/games/ocean-fish/oceanSoundSystem';

export type OceanGameState = 'MENU' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export interface CannonConfig {
  level: number;
  name: string;
  cost: number;
  damage: number;
  netRadius: number;
  bulletSpeed: number;
  color: string;
  glowColor: string;
}

export const CANNON_CONFIGS: Record<number, CannonConfig> = {
  1: {
    level: 1,
    name: 'Pháo Đơn Nước',
    cost: 10,
    damage: 1,
    netRadius: 45,
    bulletSpeed: 14,
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.6)'
  },
  2: {
    level: 2,
    name: 'Pháo Đôi Sóng Âm',
    cost: 25,
    damage: 2,
    netRadius: 60,
    bulletSpeed: 16,
    color: '#4ade80',
    glowColor: 'rgba(74, 222, 128, 0.6)'
  },
  3: {
    level: 3,
    name: 'Pháo Ba Tia Lôi Điện',
    cost: 50,
    damage: 4,
    netRadius: 75,
    bulletSpeed: 18,
    color: '#facc15',
    glowColor: 'rgba(250, 204, 21, 0.6)'
  },
  4: {
    level: 4,
    name: 'Pháo Laser Plasma',
    cost: 100,
    damage: 8,
    netRadius: 95,
    bulletSpeed: 21,
    color: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.6)'
  },
  5: {
    level: 5,
    name: 'Đại Bác Thần Long',
    cost: 200,
    damage: 15,
    netRadius: 120,
    bulletSpeed: 24,
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.7)'
  }
};

interface OceanFishState {
  // Game lifecycle
  gameState: OceanGameState;
  score: number;
  highScore: number;
  coins: number;
  timeLeft: number;
  totalTime: number;

  // Cannon & Shooting
  cannonLevel: number;
  cannonAngle: number; // in radians
  isAutoFiring: boolean;
  shotsFired: number;
  fishCaught: number;
  bossesDefeated: number;

  // Combos & Multipliers
  combo: number;
  maxCombo: number;
  multiplier: number;
  comboTimer: number;

  // Skills
  freezeActive: boolean;
  freezeDuration: number;
  freezeCooldown: number;
  bombCharges: number;

  // Audio settings
  isMuted: boolean;

  // Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  tickTimer: (deltaSeconds: number) => void;

  setCannonAngle: (angle: number) => void;
  levelUpCannon: () => void;
  levelDownCannon: () => void;
  setCannonLevel: (level: number) => void;
  toggleAutoFire: () => void;

  deductBulletCost: () => boolean;
  recordFishCatch: (coinValue: number, isBoss?: boolean) => void;
  useFreezeSkill: () => boolean;
  useBombSkill: () => boolean;
  addBonusCoins: (amount: number) => void;
  toggleSound: () => void;
}

const INITIAL_COINS = 800;
const ROUND_DURATION = 90; // 90 seconds per match

export const useOceanFishStore = create<OceanFishState>((set, get) => {
  // Load highscore from localStorage if available
  let savedHighScore = 0;
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('ocean_fishing_high_score');
      if (stored) savedHighScore = parseInt(stored, 10) || 0;
    } catch {}
  }

  return {
    gameState: 'MENU',
    score: 0,
    highScore: savedHighScore,
    coins: INITIAL_COINS,
    timeLeft: ROUND_DURATION,
    totalTime: ROUND_DURATION,

    cannonLevel: 1,
    cannonAngle: -Math.PI / 2, // pointing straight up
    isAutoFiring: false,
    shotsFired: 0,
    fishCaught: 0,
    bossesDefeated: 0,

    combo: 0,
    maxCombo: 0,
    multiplier: 1,
    comboTimer: 0,

    freezeActive: false,
    freezeDuration: 0,
    freezeCooldown: 0,
    bombCharges: 2,

    isMuted: false,

    startGame: () => {
      oceanSoundSystem.init();
      oceanSoundSystem.playUiClick();
      set({
        gameState: 'PLAYING',
        score: 0,
        coins: INITIAL_COINS,
        timeLeft: ROUND_DURATION,
        shotsFired: 0,
        fishCaught: 0,
        bossesDefeated: 0,
        combo: 0,
        maxCombo: 0,
        multiplier: 1,
        comboTimer: 0,
        freezeActive: false,
        freezeDuration: 0,
        freezeCooldown: 0,
        bombCharges: 2,
        isAutoFiring: false
      });
    },

    pauseGame: () => {
      if (get().gameState === 'PLAYING') {
        if (typeof document !== 'undefined' && document.pointerLockElement) {
          try { document.exitPointerLock(); } catch {}
        }
        set({ gameState: 'PAUSED' });
      }
    },

    resumeGame: () => {
      if (get().gameState === 'PAUSED') {
        set({ gameState: 'PLAYING' });
      }
    },

    endGame: () => {
      const { score, highScore } = get();
      const newHigh = Math.max(score, highScore);
      if (typeof window !== 'undefined' && score > highScore) {
        try {
          localStorage.setItem('ocean_fishing_high_score', newHigh.toString());
        } catch {}
      }
      oceanSoundSystem.playGameOver();
      if (typeof document !== 'undefined' && document.pointerLockElement) {
        try { document.exitPointerLock(); } catch {}
      }
      set({
        gameState: 'GAME_OVER',
        highScore: newHigh,
        isAutoFiring: false
      });
    },

    resetGame: () => {
      if (typeof document !== 'undefined' && document.pointerLockElement) {
        try { document.exitPointerLock(); } catch {}
      }
      set({
        gameState: 'MENU',
        isAutoFiring: false
      });
    },

    tickTimer: (deltaSeconds: number) => {
      const state = get();
      if (state.gameState !== 'PLAYING') return;

      // Update game timer
      const newTime = Math.max(0, state.timeLeft - deltaSeconds);
      if (newTime <= 0) {
        get().endGame();
        return;
      }

      // Update Freeze duration & cooldown
      let newFreezeActive = state.freezeActive;
      let newFreezeDuration = Math.max(0, state.freezeDuration - deltaSeconds);
      if (newFreezeDuration <= 0 && state.freezeActive) {
        newFreezeActive = false;
      }
      const newFreezeCooldown = Math.max(0, state.freezeCooldown - deltaSeconds);

      // Update Combo decay timer
      let newCombo = state.combo;
      let newMultiplier = state.multiplier;
      let newComboTimer = Math.max(0, state.comboTimer - deltaSeconds);
      if (newComboTimer <= 0 && state.combo > 0) {
        newCombo = 0;
        newMultiplier = 1;
      }

      set({
        timeLeft: newTime,
        freezeActive: newFreezeActive,
        freezeDuration: newFreezeDuration,
        freezeCooldown: newFreezeCooldown,
        combo: newCombo,
        multiplier: newMultiplier,
        comboTimer: newComboTimer
      });
    },

    setCannonAngle: (angle: number) => {
      set({ cannonAngle: angle });
    },

    levelUpCannon: () => {
      const current = get().cannonLevel;
      if (current < 5) {
        oceanSoundSystem.playUiClick();
        set({ cannonLevel: current + 1 });
      }
    },

    levelDownCannon: () => {
      const current = get().cannonLevel;
      if (current > 1) {
        oceanSoundSystem.playUiClick();
        set({ cannonLevel: current - 1 });
      }
    },

    setCannonLevel: (level: number) => {
      if (level >= 1 && level <= 5) {
        set({ cannonLevel: level });
      }
    },

    toggleAutoFire: () => {
      oceanSoundSystem.playUiClick();
      set((prev) => ({ isAutoFiring: !prev.isAutoFiring }));
    },

    deductBulletCost: () => {
      const { coins, cannonLevel } = get();
      const config = CANNON_CONFIGS[cannonLevel];
      if (coins < config.cost) {
        // Emergency treasure drop if player runs completely dry!
        if (coins <= 0) {
          get().addBonusCoins(100);
        }
        return false;
      }
      set((prev) => ({
        coins: prev.coins - config.cost,
        shotsFired: prev.shotsFired + 1
      }));
      return true;
    },

    recordFishCatch: (coinValue: number, isBoss = false) => {
      const state = get();
      const newCombo = state.combo + 1;
      const newMaxCombo = Math.max(newCombo, state.maxCombo);

      // Multiplier steps: x1 -> x1.5 (combo 5) -> x2 (combo 10) -> x3 (combo 20) -> x5 (combo 30)
      let newMultiplier = 1;
      if (newCombo >= 30) newMultiplier = 5;
      else if (newCombo >= 20) newMultiplier = 3;
      else if (newCombo >= 10) newMultiplier = 2;
      else if (newCombo >= 5) newMultiplier = 1.5;

      const gainedCoins = Math.round(coinValue * newMultiplier);
      const gainedScore = Math.round(coinValue * 10 * newMultiplier);

      oceanSoundSystem.playFishCatch(gainedCoins, isBoss);

      set((prev) => ({
        coins: prev.coins + gainedCoins,
        score: prev.score + gainedScore,
        fishCaught: prev.fishCaught + 1,
        bossesDefeated: isBoss ? prev.bossesDefeated + 1 : prev.bossesDefeated,
        combo: newCombo,
        maxCombo: newMaxCombo,
        multiplier: newMultiplier,
        comboTimer: 3.5 // 3.5 seconds to chain next catch
      }));
    },

    useFreezeSkill: () => {
      const state = get();
      if (state.freezeCooldown > 0 || state.freezeActive) return false;
      oceanSoundSystem.playFreezeSkill();
      set({
        freezeActive: true,
        freezeDuration: 6.0, // 6 seconds freeze
        freezeCooldown: 18.0 // 18 seconds cooldown
      });
      return true;
    },

    useBombSkill: () => {
      const state = get();
      if (state.bombCharges <= 0) return false;
      oceanSoundSystem.playBombSkill();
      set((prev) => ({
        bombCharges: prev.bombCharges - 1
      }));
      return true;
    },

    addBonusCoins: (amount: number) => {
      set((prev) => ({ coins: prev.coins + amount }));
    },

    toggleSound: () => {
      const isMuted = oceanSoundSystem.toggleMute();
      set({ isMuted });
    }
  };
});
