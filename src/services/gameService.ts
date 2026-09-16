import { Game } from '@/types/game';
import { GAMES } from '@/data/games';

export class GameService {
  private static games: Game[] = GAMES;
  private static isInitialized = false;

  public static setGames(newGames: Game[]): void {
    if (Array.isArray(newGames) && newGames.length > 0) {
      this.games = newGames;
      this.isInitialized = true;
    }
  }

  public static async fetchGamesFromApi(): Promise<Game[]> {
    try {
      const res = await fetch('/api/games');
      const data = await res.json();
      if (data.success && Array.isArray(data.games)) {
        this.setGames(data.games);
        return this.games;
      }
    } catch (err) {
      console.warn('Could not fetch games from API, using cached data:', err);
    }
    return this.games;
  }

  public static getAllGames(): Game[] {
    return this.games;
  }

  public static getGameBySlug(slug: string): Game | undefined {
    return this.games.find((g) => g.slug === slug);
  }

  public static getFeaturedGames(): Game[] {
    // Return explicit 6 featured games matching reference mockup
    const prioritySlugs = [
      'ban-ga-3d',
      'dua-xe-sieu-toc',
      'stickman-dai-chien',
      'the-gioi-khoi-vuong',
      'zombies-survival',
      'football-strike'
    ];
    return prioritySlugs
      .map((slug) => this.games.find((g) => g.slug === slug))
      .filter((g): g is Game => Boolean(g));
  }

  public static getLatestGames(): Game[] {
    // Return explicit 6 latest games matching reference mockup
    const prioritySlugs = [
      'the-gioi-khoi-vuong',
      'nau-an-cung-kiet',
      'ban-ca-dai-duong',
      'xep-hinh-thong-minh',
      'thoi-trang-cong-chua',
      'dai-chien-tank'
    ];
    return prioritySlugs
      .map((slug) => this.games.find((g) => g.slug === slug))
      .filter((g): g is Game => Boolean(g));
  }

  public static getGamesByCategory(categoryId: string): Game[] {
    if (!categoryId || categoryId === 'all') {
      return this.games;
    }

    if (categoryId === 'hot') {
      return this.games.filter((g) => g.isHot);
    }

    if (categoryId === 'new') {
      return this.games.filter((g) => g.isNew);
    }

    if (categoryId === 'multiplayer') {
      return this.games.filter((g) => g.tags.includes('2 người chơi'));
    }

    const categoryTagMap: Record<string, string[]> = {
      action: ['Hành động'],
      shooter: ['Bắn súng'],
      adventure: ['Phiêu lưu'],
      racing: ['Đua xe'],
      sports: ['Thể thao'],
      puzzle: ['Giải đố', 'Giải trí', 'Trí tuệ'],
      strategy: ['Chiến thuật'],
      fashion: ['Thời trang']
    };

    const targetTags = categoryTagMap[categoryId] || [];

    return this.games.filter(
      (g) =>
        g.categoryId === categoryId ||
        targetTags.some((tag) => g.tags.includes(tag) || g.category.includes(tag))
    );
  }

  public static getFavoriteGames(favoriteIds: string[]): Game[] {
    return this.games.filter((g) => favoriteIds.includes(g.id));
  }

  public static getRelatedGames(currentGameId: string, limit = 6): Game[] {
    return this.games.filter((g) => g.id !== currentGameId).slice(0, limit);
  }

  public static searchGames(query: string): Game[] {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    return this.games.filter(
      (game) =>
        game.title.toLowerCase().includes(q) ||
        game.category.toLowerCase().includes(q) ||
        game.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  public static getRandomGame(): Game {
    const randomIndex = Math.floor(Math.random() * this.games.length);
    return this.games[randomIndex];
  }
}
