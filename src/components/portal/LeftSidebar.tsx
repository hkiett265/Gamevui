'use client';

import React from 'react';
import {
  Gamepad2,
  Swords,
  Crosshair,
  Compass,
  Car,
  Trophy,
  Puzzle,
  Shield,
  Sparkles,
  Users,
  Flame,
  Sparkle
} from 'lucide-react';
import { CATEGORIES } from '@/data/categories';

interface LeftSidebarProps {
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Gamepad2: <Gamepad2 size={18} color="#ffffff" />,
  Swords: <Swords size={18} color="#f97316" />,
  Crosshair: <Crosshair size={18} color="#00f0ff" />,
  Compass: <Compass size={18} color="#a855f7" />,
  Car: <Car size={18} color="#38bdf8" />,
  Trophy: <Trophy size={18} color="#facc15" />,
  Puzzle: <Puzzle size={18} color="#ec4899" />,
  Shield: <Shield size={18} color="#fbbf24" />,
  Sparkles: <Sparkles size={18} color="#f472b6" />,
  Users: <Users size={18} color="#60a5fa" />,
  Flame: <Flame size={18} color="#ef4444" />,
  Sparkle: <Sparkle size={18} color="#22c55e" />
};

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  selectedCategoryId,
  onSelectCategory
}) => {
  const [categories, setCategories] = React.useState(CATEGORIES);

  React.useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
          setCategories(data.categories);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <aside className="portal-left-sidebar">
      <ul className="sidebar-category-list">
        {categories.map((cat) => {
          const isActive = selectedCategoryId === cat.id;
          return (
            <li key={cat.id}>
              <button
                className={`sidebar-category-btn ${isActive ? 'active' : ''}`}
                onClick={() => onSelectCategory(cat.id)}
              >
                <span className="sidebar-cat-icon">
                  {isActive ? (
                    <Gamepad2 size={18} color="#ffffff" />
                  ) : (
                    ICON_MAP[cat.iconName] || <Gamepad2 size={18} color="#94a3b8" />
                  )}
                </span>
                <span>{cat.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};
