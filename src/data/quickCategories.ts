export interface QuickCategory {
  id: string;
  label: string;
  iconName: string;
  color: string;
  bgGlow: string;
  actionType: 'filter' | 'random' | 'tag';
  filterValue?: string;
}

export const QUICK_CATEGORIES: QuickCategory[] = [
  {
    id: 'hot',
    label: 'Game hot',
    iconName: 'Flame',
    color: '#ef4444',
    bgGlow: 'rgba(239, 68, 68, 0.2)',
    actionType: 'filter',
    filterValue: 'hot'
  },
  {
    id: 'new',
    label: 'Mới nhất',
    iconName: 'Sparkles',
    color: '#06b6d4',
    bgGlow: 'rgba(6, 182, 212, 0.2)',
    actionType: 'filter',
    filterValue: 'new'
  },
  {
    id: 'popular',
    label: 'Được yêu thích',
    iconName: 'Trophy',
    color: '#f59e0b',
    bgGlow: 'rgba(245, 158, 11, 0.2)',
    actionType: 'tag',
    filterValue: 'top'
  },
  {
    id: 'multiplayer',
    label: '2 người chơi',
    iconName: 'Users',
    color: '#a855f7',
    bgGlow: 'rgba(168, 85, 247, 0.2)',
    actionType: 'filter',
    filterValue: 'multiplayer'
  },
  {
    id: 'mobile',
    label: 'Chơi trên mobile',
    iconName: 'Smartphone',
    color: '#0ea5e9',
    bgGlow: 'rgba(14, 165, 233, 0.2)',
    actionType: 'tag',
    filterValue: 'mobile'
  },
  {
    id: '3d',
    label: 'Game 3D',
    iconName: 'Gem',
    color: '#3b82f6',
    bgGlow: 'rgba(59, 130, 246, 0.2)',
    actionType: 'tag',
    filterValue: '3d'
  },
  {
    id: 'vietnam',
    label: 'Game Việt',
    iconName: 'Star',
    color: '#eab308',
    bgGlow: 'rgba(234, 179, 8, 0.2)',
    actionType: 'tag',
    filterValue: 'vietnam'
  },
  {
    id: 'random',
    label: 'Game ngẫu nhiên',
    iconName: 'Dices',
    color: '#ec4899',
    bgGlow: 'rgba(236, 72, 153, 0.2)',
    actionType: 'random'
  }
];
