import { create } from 'zustand';

export type CameraMode = 'chase_close' | 'chase_far' | 'hood';
export type GameStatus = 'menu' | 'playing' | 'paused' | 'gameover' | 'victory';

interface NitroRacerState {
  // Game Status
  gameStatus: GameStatus;
  playerName: string;
  
  // Vehicle State
  speed: number; // km/h
  gear: number; // 1-6, 0 for R
  rpm: number; // 1000 - 9000
  nitro: number; // 0 - 100
  isNitroActive: boolean;
  isDrifting: boolean;
  driftScore: number;
  
  // Progression & Score
  distance: number; // meters
  score: number;
  multiplier: number; // x1, x2, x3, x5
  closeCallsCount: number;
  checkpointTime: number; // seconds remaining
  
  // Settings
  cameraMode: CameraMode;
  audioEnabled: boolean;
  
  // Actions
  setGameStatus: (status: GameStatus) => void;
  setPlayerName: (name: string) => void;
  updateVehicleState: (state: Partial<Pick<NitroRacerState, 'speed' | 'gear' | 'rpm' | 'nitro' | 'isNitroActive' | 'isDrifting' | 'driftScore'>>) => void;
  addScore: (points: number, reason?: string) => void;
  addCloseCall: () => void;
  addDistance: (dist: number) => void;
  addTime: (seconds: number) => void;
  setCameraMode: (mode: CameraMode) => void;
  toggleAudio: () => void;
  resetGame: () => void;
  tickTime: (deltaSeconds: number) => void;
}

const INITIAL_STATE = {
  gameStatus: 'menu' as GameStatus,
  playerName: '',
  speed: 0,
  gear: 1,
  rpm: 1000,
  nitro: 100, // Start with full nitro for fun
  isNitroActive: false,
  isDrifting: false,
  driftScore: 0,
  distance: 0,
  score: 0,
  multiplier: 1,
  closeCallsCount: 0,
  checkpointTime: 60, // 60 seconds initial
  cameraMode: 'chase_close' as CameraMode,
  audioEnabled: true,
};

export const useNitroRacerStore = create<NitroRacerState>((set, get) => ({
  ...INITIAL_STATE,
  
  setGameStatus: (status) => set({ gameStatus: status }),
  setPlayerName: (name) => set({ playerName: name }),
  
  updateVehicleState: (state) => set((prev) => ({ ...prev, ...state })),
  
  addScore: (points, reason) => set((state) => {
    // Only add score if playing
    if (state.gameStatus !== 'playing') return state;
    return { score: state.score + (points * state.multiplier) };
  }),
  
  addCloseCall: () => set((state) => {
    if (state.gameStatus !== 'playing') return state;
    const newCount = state.closeCallsCount + 1;
    // Increase multiplier based on close calls
    let newMult = 1;
    if (newCount > 15) newMult = 5;
    else if (newCount > 8) newMult = 3;
    else if (newCount > 3) newMult = 2;
    
    // Add nitro on close call
    const newNitro = Math.min(100, state.nitro + 15);
    
    return { 
      closeCallsCount: newCount,
      multiplier: newMult,
      nitro: newNitro,
      score: state.score + (500 * state.multiplier)
    };
  }),
  
  addDistance: (dist) => set((state) => {
    if (state.gameStatus !== 'playing') return state;
    return { distance: state.distance + dist };
  }),
  
  addTime: (seconds) => set((state) => ({
    checkpointTime: Math.min(99, state.checkpointTime + seconds)
  })),
  
  setCameraMode: (mode) => set({ cameraMode: mode }),
  toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),
  
  resetGame: () => set({
    ...INITIAL_STATE,
    playerName: get().playerName, // keep name
    audioEnabled: get().audioEnabled // keep audio setting
  }),
  
  tickTime: (deltaSeconds) => set((state) => {
    if (state.gameStatus !== 'playing') return state;
    const newTime = state.checkpointTime - deltaSeconds;
    if (newTime <= 0) {
      return { checkpointTime: 0, gameStatus: 'gameover' };
    }
    return { checkpointTime: newTime };
  })
}));
