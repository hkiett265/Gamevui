export type GameBadge = 'HOT' | 'NEW' | 'TOP' | '3D';

export interface Game {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  instructions?: string;
  thumbnail: string;
  banner?: string;
  category: string;
  categoryId: string;
  tags: string[];
  badge?: GameBadge;
  isHot?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  available: boolean;
  gameUrl: string;
  rating: number;
  playCount: string;
  releaseDate?: string;
  developer?: string;
}

export interface HeroSlide {
  id: string;
  gameSlug: string;
  title: string;
  subtitle: string;
  tagline: string;
  description?: string;
  badge: string;
  image: string;
  ctaText: string;
  secondaryCtaText: string;
  woodenSignLines: string[];
}

export type PortalTab = 'home' | 'categories' | 'new' | 'hot' | 'favorites';
