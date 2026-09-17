import { create } from 'zustand';

export type GameState = 
  | 'MENU' 
  | 'PLAYING' 
  | 'CINEMATIC_DRINK' 
  | 'TRANSFORMED_CELEBRATE' 
  | 'MISSION_02_ALERT' 
  | 'CHASE' 
  | 'MISSION_PASSED' 
  | 'FREE_ROAM' 
  | 'PAUSED';

export type MissionStep = 
  | 0 // M01: Find & mount Exciter bike
  | 1 // M01: Ride to Tạp Hóa Cô Ba
  | 2 // M01: Dismount at shop
  | 3 // M01: Buy red drink
  | 4 // M01: Drink & transformation cinematic
  | 5 // M01: Jet Jet Mode Celebration
  | 6 // M02: Ride to neighborhood house (Phi Vụ Anh Hai)
  | 7 // M02: Walk into house yard
  | 8 // M02: Discovered! "Ê ANH HAI!"
  | 9 // M02: CHẠY ĐI ANH HAI! (Chase active)
  | 10; // Complete / Free Roam

export type SurfaceType = 'CONCRETE' | 'DIRT' | 'GRASS' | 'BRIDGE';

export interface PursuerData {
  id: string;
  name: string;
  x: number;
  z: number;
  speed: number;
  isBike: boolean;
  distanceToPlayer: number;
}

interface JetJetState {
  gameState: GameState;
  missionStep: MissionStep;
  missionTitle: string;
  missionDesc: string;
  
  // Player state
  playerPosition: [number, number, number];
  playerRotation: number;
  isRiding: boolean;
  isTransformed: boolean;
  hasBottle: boolean;
  isDrinking: boolean;
  isMoving: boolean;
  isRunning: boolean;
  footstepTrigger: number;

  // Vehicle state
  bikePosition: [number, number, number];
  bikeRotation: number;
  speedKmh: number;
  rpm: number;
  gear: number;
  leanAngle: number;
  steerAngle: number;
  isBoosting: boolean;
  isRevving: boolean;
  lastMountToggle: number;
  revTrigger: number;
  surfaceType: SurfaceType;

  // Chase system (Mission 02)
  chaseStars: number; // 0 - 3
  chaseEscapeTimer: number; // seconds outside radius
  chaseEscapeRequired: number; // target seconds (e.g. 6s)
  isEscaping: boolean;
  pursuers: PursuerData[];

  // Navigation & interactions
  waypointTarget: [number, number, number];
  waypointLabel: string;
  distanceToWaypoint: number;
  distanceToShop: number;
  distanceToBike: number;
  interactionPrompt: string | null;
  interactionKey: string | null;
  notification: string | null;
  subtitle: string | null;

  // Audio Settings & Volumes
  isMuted: boolean;
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  isSettingsOpen: boolean;

  // Score
  score: number;

  // Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;

  setAudioSettings: (master: number, music: number, sfx: number) => void;
  toggleMute: () => boolean;
  setSettingsOpen: (open: boolean) => void;

  setPlayerPosition: (pos: [number, number, number]) => void;
  setPlayerRotation: (rot: number) => void;
  setPlayerMoving: (moving: boolean, running: boolean) => void;
  triggerFootstep: () => void;

  setBikePosition: (pos: [number, number, number]) => void;
  setBikeRotation: (rot: number) => void;
  setBikeTelemetry: (
    speed: number, 
    rpm: number, 
    gear: number, 
    lean: number, 
    steer: number, 
    boosting: boolean,
    revving: boolean,
    surface: SurfaceType
  ) => void;
  triggerRev: () => void;

  mountBike: () => void;
  dismountBike: () => void;

  buyBottle: () => void;
  startDrinking: () => void;
  finishTransformation: () => void;

  startMission02: () => void;
  triggerNeighborDiscovery: () => void;
  startChase: () => void;
  updateChaseState: (delta: number, pursuerList: PursuerData[]) => void;
  finishChaseSuccess: () => void;

  setInteraction: (prompt: string | null, key?: string | null) => void;
  setDistances: (toShop: number, toBike: number, toWaypoint: number) => void;
  showNotification: (text: string) => void;
  clearNotification: () => void;
  showSubtitle: (text: string, durationMs?: number) => void;
}

const INITIAL_PLAYER_POS: [number, number, number] = [-2.5, 0, -2];
const INITIAL_BIKE_POS: [number, number, number] = [0, 0, -4];
const SHOP_POS: [number, number, number] = [65, 0, 140];
const NEIGHBOR_HOUSE_POS: [number, number, number] = [-22, 0, 32];
const ESCAPE_ZONE_POS: [number, number, number] = [45, 0, 175];

export const useJetJetStore = create<JetJetState>((set, get) => ({
  gameState: 'MENU',
  missionStep: 0,
  missionTitle: 'KHÁT QUÁ ANH HAI!',
  missionDesc: 'Tìm chiếc xe Exciter trước sân và bấm [F] để lên xe',

  playerPosition: INITIAL_PLAYER_POS,
  playerRotation: 0,
  isRiding: false,
  isTransformed: false,
  hasBottle: false,
  isDrinking: false,
  isMoving: false,
  isRunning: false,
  footstepTrigger: 0,

  bikePosition: INITIAL_BIKE_POS,
  bikeRotation: 0,
  speedKmh: 0,
  rpm: 1000,
  gear: 1,
  leanAngle: 0,
  steerAngle: 0,
  isBoosting: false,
  isRevving: false,
  lastMountToggle: 0,
  revTrigger: 0,
  surfaceType: 'CONCRETE',

  chaseStars: 0,
  chaseEscapeTimer: 0,
  chaseEscapeRequired: 6.0,
  isEscaping: false,
  pursuers: [],

  waypointTarget: SHOP_POS,
  waypointLabel: 'TẠP HÓA CÔ BA',
  distanceToWaypoint: 160,
  distanceToShop: 160,
  distanceToBike: 3,
  interactionPrompt: null,
  interactionKey: null,
  notification: null,
  subtitle: null,

  isMuted: false,
  masterVolume: 1.0,
  musicVolume: 0.8,
  sfxVolume: 0.9,
  isSettingsOpen: false,
  score: 0,

  startGame: () => {
    set({
      gameState: 'PLAYING',
      missionStep: 0,
      missionTitle: 'KHÁT QUÁ ANH HAI!',
      missionDesc: 'Tìm chiếc xe Exciter trước sân và bấm [F] để lên xe',
      waypointTarget: SHOP_POS,
      waypointLabel: 'TẠP HÓA CÔ BA',
      notification: 'Chào mừng về Miền Tây! Bấm [F] khi tới gần xe máy để lên xe.'
    });
  },

  pauseGame: () => set({ gameState: 'PAUSED' }),
  resumeGame: () => {
    const { missionStep } = get();
    let nextState: GameState = 'PLAYING';
    if (missionStep === 9) nextState = 'CHASE';
    else if (missionStep >= 10) nextState = 'FREE_ROAM';
    set({ gameState: nextState });
  },

  resetGame: () => {
    set({
      gameState: 'MENU',
      missionStep: 0,
      missionTitle: 'KHÁT QUÁ ANH HAI!',
      missionDesc: 'Tìm chiếc xe Exciter trước sân và bấm [F] để lên xe',
      playerPosition: INITIAL_PLAYER_POS,
      playerRotation: 0,
      isRiding: false,
      isTransformed: false,
      hasBottle: false,
      isDrinking: false,
      isMoving: false,
      isRunning: false,
      footstepTrigger: 0,
      bikePosition: INITIAL_BIKE_POS,
      bikeRotation: 0,
      speedKmh: 0,
      rpm: 1000,
      gear: 1,
      leanAngle: 0,
      steerAngle: 0,
      isBoosting: false,
      isRevving: false,
      revTrigger: 0,
      surfaceType: 'CONCRETE',
      chaseStars: 0,
      chaseEscapeTimer: 0,
      isEscaping: false,
      pursuers: [],
      waypointTarget: SHOP_POS,
      waypointLabel: 'TẠP HÓA CÔ BA',
      distanceToWaypoint: 160,
      distanceToShop: 160,
      distanceToBike: 3,
      interactionPrompt: null,
      interactionKey: null,
      notification: null,
      subtitle: null,
      score: 0
    });
  },

  setAudioSettings: (master, music, sfx) => set({ masterVolume: master, musicVolume: music, sfxVolume: sfx }),
  toggleMute: () => {
    const next = !get().isMuted;
    set({ isMuted: next });
    return next;
  },
  setSettingsOpen: (open) => set({ isSettingsOpen: open }),

  setPlayerPosition: (pos) => set({ playerPosition: pos }),
  setPlayerRotation: (rot) => set({ playerRotation: rot }),
  setPlayerMoving: (moving, running) => set({ isMoving: moving, isRunning: running }),
  triggerFootstep: () => set((s) => ({ footstepTrigger: s.footstepTrigger + 1 })),

  setBikePosition: (pos) => set({ bikePosition: pos }),
  setBikeRotation: (rot) => set({ bikeRotation: rot }),
  setBikeTelemetry: (speed, rpm, gear, lean, steer, boosting, revving, surface) => 
    set({ speedKmh: speed, rpm, gear, leanAngle: lean, steerAngle: steer, isBoosting: boosting, isRevving: revving, surfaceType: surface }),
  triggerRev: () => set((s) => ({ revTrigger: s.revTrigger + 1 })),

  mountBike: () => {
    const now = Date.now();
    if (now - get().lastMountToggle < 500) return;
    const { missionStep } = get();
    let nextStep = missionStep;
    let nextTitle = get().missionTitle;
    let nextDesc = get().missionDesc;

    if (missionStep === 0) {
      nextStep = 1;
      nextTitle = 'CHẠY TỚI TẠP HÓA CÔ BA';
      nextDesc = 'Chạy theo con đường làng qua cầu để kiếm nước uống';
    } else if (missionStep === 9) {
      nextTitle = 'CHẠY ĐI ANH HAI!';
      nextDesc = 'Nhấn hết ga chạy thoát khỏi tầm truy đuổi!';
    }

    set({
      isRiding: true,
      lastMountToggle: now,
      missionStep: nextStep,
      missionTitle: nextTitle,
      missionDesc: nextDesc,
      interactionPrompt: null
    });
  },

  dismountBike: () => {
    const { bikePosition, bikeRotation, missionStep, distanceToShop } = get();
    const cos = Math.cos(bikeRotation);
    const sin = Math.sin(bikeRotation);
    const sideX = bikePosition[0] - cos * 1.0;
    const sideZ = bikePosition[2] + sin * 1.0;

    let nextStep = missionStep;
    let nextTitle = get().missionTitle;
    let nextDesc = get().missionDesc;

    if (missionStep === 1 && distanceToShop < 25) {
      nextStep = 3;
      nextTitle = 'MUA NƯỚC TĂNG LỰC';
      nextDesc = 'Vào quầy tạp hóa và bấm [E] trước tủ nước ngọt';
    } else if (missionStep === 6) {
      const distToNeighbor = Math.hypot(bikePosition[0] - NEIGHBOR_HOUSE_POS[0], bikePosition[2] - NEIGHBOR_HOUSE_POS[2]);
      if (distToNeighbor < 20) {
        nextStep = 7;
        nextTitle = 'ĐI VÀO SÂN NHÀ';
        nextDesc = 'Tiến vào khoảng sân phía trước nhà hàng xóm';
      }
    }

    set({
      isRiding: false,
      speedKmh: 0,
      rpm: 1000,
      playerPosition: [sideX, 0, sideZ],
      playerRotation: bikeRotation,
      missionStep: nextStep,
      missionTitle: nextTitle,
      missionDesc: nextDesc,
      notification: 'Đã xuống xe.'
    });
  },

  buyBottle: () => {
    set({
      hasBottle: true,
      missionStep: 4,
      missionTitle: 'UỐNG NƯỚC TĂNG LỰC',
      missionDesc: 'Bấm [E] để mở nắp và uống chai nước giải khát!',
      notification: 'Đã lấy chai nước đỏ mát lạnh! Bấm [E] để uống.'
    });
  },

  startDrinking: () => {
    set({
      isDrinking: true,
      gameState: 'CINEMATIC_DRINK',
      notification: 'Năng lượng đang bùng nổ...'
    });
  },

  finishTransformation: () => {
    set({
      isDrinking: false,
      isTransformed: true,
      gameState: 'TRANSFORMED_CELEBRATE',
      missionStep: 5,
      missionTitle: 'JET JET MODE!',
      missionDesc: 'Biến hình thành công! Bạn sở hữu phong cách Denim Streetwear cực ngầu.',
      score: 1000,
      notification: '🔥 BIẾN HÌNH THÀNH CÔNG! BẮT ĐẦU NHIỆM VỤ 02!'
    });
  },

  startMission02: () => {
    set({
      gameState: 'PLAYING',
      missionStep: 6,
      missionTitle: 'PHI VỤ ANH HAI',
      missionDesc: 'Lên xe Exciter chạy sang khu nhà hàng xóm bên kia rạch',
      waypointTarget: NEIGHBOR_HOUSE_POS,
      waypointLabel: 'NHÀ HÀNG XÓM',
      notification: 'Lên xe và đi theo mốc Waypoint đến khu nhà bên kia rạch!'
    });
  },

  triggerNeighborDiscovery: () => {
    set({
      gameState: 'MISSION_02_ALERT',
      missionStep: 8,
      missionTitle: 'BỊ PHÁT HIỆN RỒI!',
      missionDesc: 'Chủ nhà phát hiện! Chó sủa inh ỏi!',
      notification: '⚠️ CHỦ NHÀ XUẤT HIỆN! CHẠY VỀ XE NGAY!'
    });
  },

  startChase: () => {
    set({
      gameState: 'CHASE',
      missionStep: 9,
      missionTitle: 'CHẠY ĐI ANH HAI!',
      missionDesc: 'Lên xe Exciter và tháo chạy qua cầu về vùng an toàn!',
      chaseStars: 3,
      chaseEscapeTimer: 0,
      waypointTarget: ESCAPE_ZONE_POS,
      waypointLabel: 'VÙNG AN TOÀN',
      notification: '🚨 TRUY ĐUỔI! RỒ GA THÁO CHẠY!'
    });
  },

  updateChaseState: (delta, pursuerList) => {
    const { gameState, chaseStars, chaseEscapeTimer, chaseEscapeRequired, finishChaseSuccess } = get();
    if (gameState !== 'CHASE') return;

    // Check closest pursuer
    let minDistance = 999;
    pursuerList.forEach((p) => {
      if (p.distanceToPlayer < minDistance) minDistance = p.distanceToPlayer;
    });

    // If player is beyond 45m from all pursuers, escape timer counts up
    let isEscaping = minDistance > 42;
    let nextTimer = chaseEscapeTimer;
    let nextStars = chaseStars;

    if (isEscaping) {
      nextTimer += delta;
      if (nextTimer > 2.5 && chaseStars === 3) nextStars = 2;
      if (nextTimer > 4.5 && chaseStars === 2) nextStars = 1;

      if (nextTimer >= chaseEscapeRequired) {
        finishChaseSuccess();
        return;
      }
    } else {
      // Reset escape timer if pursuer gets close (< 30m)
      if (minDistance < 30) {
        nextTimer = Math.max(0, nextTimer - delta * 2);
        nextStars = 3;
      }
    }

    set({
      pursuers: pursuerList,
      chaseEscapeTimer: nextTimer,
      chaseStars: nextStars,
      isEscaping
    });
  },

  finishChaseSuccess: () => {
    set({
      gameState: 'MISSION_PASSED',
      missionStep: 10,
      missionTitle: 'THOÁT THÀNH CÔNG!',
      missionDesc: 'Bạn đã cắt đuôi hoàn toàn các tay đua trong xóm!',
      chaseStars: 0,
      score: 2500,
      notification: '🏆 HOÀN THÀNH NHIỆM VỤ! MỞ KHÓA TỰ DO DẠO CHƠI (FREE ROAM)!'
    });
  },

  setInteraction: (prompt, key = 'E') => set({ interactionPrompt: prompt, interactionKey: key }),
  setDistances: (toShop, toBike, toWaypoint) => set({ distanceToShop: toShop, distanceToBike: toBike, distanceToWaypoint: toWaypoint }),
  showNotification: (text) => set({ notification: text }),
  clearNotification: () => set({ notification: null }),

  showSubtitle: (text, durationMs = 3000) => {
    set({ subtitle: text });
    setTimeout(() => {
      if (get().subtitle === text) set({ subtitle: null });
    }, durationMs);
  }
}));
