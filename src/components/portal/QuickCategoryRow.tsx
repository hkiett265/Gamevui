'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Flame,
  Sparkles,
  Trophy,
  Users,
  Smartphone,
  Gem,
  Star,
  Dices
} from 'lucide-react';
import { QUICK_CATEGORIES } from '@/data/quickCategories';
import { GAMES } from '@/data/games';

interface QuickCategoryRowProps {
  onSelectQuickFilter?: (filterId: string) => void;
}

const QUICK_ICON_MAP: Record<string, (color: string) => React.ReactNode> = {
  Flame: (color) => <Flame size={24} color={color} />,
  Sparkles: (color) => <Sparkles size={24} color={color} />,
  Trophy: (color) => <Trophy size={24} color={color} />,
  Users: (color) => <Users size={24} color={color} />,
  Smartphone: (color) => <Smartphone size={24} color={color} />,
  Gem: (color) => <Gem size={24} color={color} />,
  Star: (color) => <Star size={24} color={color} fill={color} />,
  Dices: (color) => <Dices size={24} color={color} />
};

export const QuickCategoryRow: React.FC<QuickCategoryRowProps> = ({
  onSelectQuickFilter
}) => {
  const router = useRouter();
  const [items, setItems] = React.useState(QUICK_CATEGORIES);

  React.useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.quickCategories) && data.quickCategories.length > 0) {
          setItems(data.quickCategories);
        }
      })
      .catch(() => {});
  }, []);

  const handleCardClick = (item: (typeof QUICK_CATEGORIES)[0]) => {
    if (item.actionType === 'random') {
      // Pick a random game and open it!
      const randomIndex = Math.floor(Math.random() * GAMES.length);
      const randomGame = GAMES[randomIndex];
      router.push(`/game/${randomGame.slug}`);
      return;
    }

    if (onSelectQuickFilter) {
      onSelectQuickFilter(item.id);
    }
  };

  return (
    <div className="quick-categories-row">
      {items.map((item) => (
        <button
          key={item.id}
          className="quick-cat-card"
          onClick={() => handleCardClick(item)}
          style={{
            borderBottom: `2px solid ${item.color}33`
          }}
        >
          <div
            className="quick-cat-icon-wrapper"
            style={{
              backgroundColor: item.bgGlow
            }}
          >
            {QUICK_ICON_MAP[item.iconName]?.(item.color) || (
              <Flame size={24} color={item.color} />
            )}
          </div>
          <span className="quick-cat-label">{item.label}</span>
        </button>
      ))}
    </div>
  );
};
