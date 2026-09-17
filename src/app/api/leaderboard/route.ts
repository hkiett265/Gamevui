import { NextRequest, NextResponse } from 'next/server';
import { prisma, isDatabaseAvailable } from '@/lib/prisma';

const DEFAULT_LEADERBOARD = [
  { id: '1', gameSlug: 'ban-ga-3d', playerName: 'Gà Con Pro', score: 2850, combo: 24, createdAt: new Date().toISOString() },
  { id: '2', gameSlug: 'ban-ga-3d', playerName: 'Thợ Săn Gà', score: 2320, combo: 18, createdAt: new Date().toISOString() },
  { id: '3', gameSlug: 'ban-ga-3d', playerName: 'Xạ Thủ Farm', score: 1890, combo: 15, createdAt: new Date().toISOString() }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const gameSlug = searchParams.get('slug') || 'ban-ga-3d';
  const limit = Math.min(Number(searchParams.get('limit')) || 10, 50);

  const dbUp = await isDatabaseAvailable();
  if (!dbUp) {
    return NextResponse.json({
      success: true,
      gameSlug,
      entries: DEFAULT_LEADERBOARD.slice(0, limit),
      source: 'static_offline'
    });
  }

  try {
    const entries = await prisma.leaderboardEntry.findMany({
      where: { gameSlug },
      orderBy: { score: 'desc' },
      take: limit
    });

    return NextResponse.json({
      success: true,
      gameSlug,
      entries: entries.length > 0 ? entries : DEFAULT_LEADERBOARD.slice(0, limit)
    });
  } catch (error) {
    console.error('Database query error in /api/leaderboard GET:', error);
    return NextResponse.json({
      success: true,
      gameSlug,
      entries: DEFAULT_LEADERBOARD.slice(0, limit),
      fallback: true
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameSlug, playerName, score, combo } = body;

    if (!gameSlug || typeof score !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Thiếu thông tin gameSlug hoặc score hợp lệ' },
        { status: 400 }
      );
    }

    const cleanPlayerName = (playerName && String(playerName).trim()) || 'Người chơi ẩn danh';

    const dbUp = await isDatabaseAvailable();
    if (!dbUp) {
      return NextResponse.json({
        success: true,
        message: 'Lưu điểm offline thành công!',
        savedEntry: {
          id: String(Date.now()),
          gameSlug,
          playerName: cleanPlayerName,
          score: Math.floor(score),
          combo: Math.floor(combo || 0),
          createdAt: new Date().toISOString()
        }
      });
    }

    const newEntry = await prisma.leaderboardEntry.create({
      data: {
        gameSlug,
        playerName: cleanPlayerName.substring(0, 50),
        score: Math.max(0, Math.floor(score)),
        combo: Math.max(0, Math.floor(combo || 0))
      }
    });

    const topEntries = await prisma.leaderboardEntry.findMany({
      where: { gameSlug },
      orderBy: { score: 'desc' },
      take: 10
    });

    return NextResponse.json({
      success: true,
      message: 'Lưu điểm thành công vào MySQL!',
      savedEntry: newEntry,
      topEntries
    });
  } catch (error) {
    console.error('Database error in /api/leaderboard POST:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể lưu điểm vào database' },
      { status: 500 }
    );
  }
}
