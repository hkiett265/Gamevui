import { NextRequest, NextResponse } from 'next/server';
import { prisma, isDatabaseAvailable } from '@/lib/prisma';
import { GAMES } from '@/data/games';
import { Game } from '@/types/game';

function mapDbGameToGame(dbGame: any): Game {
  let tags: string[] = [];
  try {
    tags = typeof dbGame.tags === 'string' ? JSON.parse(dbGame.tags) : dbGame.tags;
  } catch {
    tags = [dbGame.categoryName || 'Game'];
  }

  return {
    id: dbGame.id,
    slug: dbGame.slug,
    title: dbGame.title,
    subtitle: dbGame.subtitle || undefined,
    description: dbGame.description,
    instructions: dbGame.instructions || undefined,
    thumbnail: dbGame.thumbnail,
    banner: dbGame.banner || undefined,
    category: dbGame.categoryName || dbGame.category?.name || 'Hành động',
    categoryId: dbGame.categoryId,
    tags: Array.isArray(tags) ? tags : [],
    badge: dbGame.badge || undefined,
    isHot: Boolean(dbGame.isHot),
    isNew: Boolean(dbGame.isNew),
    isFeatured: Boolean(dbGame.isFeatured),
    available: Boolean(dbGame.available),
    gameUrl: dbGame.gameUrl,
    rating: Number(dbGame.rating),
    playCount: String(dbGame.playCount),
    releaseDate: dbGame.releaseDate || undefined,
    developer: dbGame.developer || undefined
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const categoryId = searchParams.get('category');
  const search = searchParams.get('search');
  const featured = searchParams.get('featured');

  // Fast check: If MySQL is offline, return fallback instantly without 4.5s timeout
  const dbUp = await isDatabaseAvailable();
  if (!dbUp) {
    if (slug) {
      const fallbackGame = GAMES.find((g) => g.slug === slug);
      return NextResponse.json({
        success: Boolean(fallbackGame),
        game: fallbackGame || null,
        source: 'static_offline'
      });
    }

    let filtered = GAMES;
    if (categoryId && categoryId !== 'all') {
      if (categoryId === 'hot') filtered = filtered.filter((g) => g.isHot);
      else if (categoryId === 'new') filtered = filtered.filter((g) => g.isNew);
      else filtered = filtered.filter((g) => g.categoryId === categoryId);
    }
    if (featured === 'true') {
      filtered = filtered.filter((g) => g.isFeatured);
    }
    if (search) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          g.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({
      success: true,
      source: 'static_offline',
      count: filtered.length,
      games: filtered
    });
  }

  try {
    if (slug) {
      const dbGame = await prisma.game.findUnique({
        where: { slug },
        include: { category: true }
      });

      if (dbGame) {
        return NextResponse.json({
          success: true,
          game: mapDbGameToGame(dbGame)
        });
      }

      // Fallback
      const fallbackGame = GAMES.find((g) => g.slug === slug);
      return NextResponse.json({
        success: Boolean(fallbackGame),
        game: fallbackGame || null
      });
    }

    const where: any = {};
    if (categoryId && categoryId !== 'all') {
      if (categoryId === 'hot') {
        where.isHot = true;
      } else if (categoryId === 'new') {
        where.isNew = true;
      } else {
        where.categoryId = categoryId;
      }
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    const dbGames = await prisma.game.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'asc' }
    });

    if (dbGames.length > 0) {
      let result = dbGames.map(mapDbGameToGame);

      if (search) {
        const q = search.toLowerCase().trim();
        result = result.filter(
          (g) =>
            g.title.toLowerCase().includes(q) ||
            g.category.toLowerCase().includes(q) ||
            g.tags.some((t) => t.toLowerCase().includes(q))
        );
      }

      return NextResponse.json({
        success: true,
        source: 'mysql',
        count: result.length,
        games: result
      });
    }

    // Fallback to static data
    return NextResponse.json({
      success: true,
      source: 'fallback',
      count: GAMES.length,
      games: GAMES
    });
  } catch (error) {
    console.error('Database query error in /api/games:', error);
    return NextResponse.json({
      success: false,
      source: 'fallback_error',
      count: GAMES.length,
      games: GAMES
    });
  }
}
