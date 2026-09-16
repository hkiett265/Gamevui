import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const gameSlug = searchParams.get('slug') || 'ban-ga-3d';
  const limit = Math.min(Number(searchParams.get('limit')) || 10, 50);

  try {
    const entries = await prisma.leaderboardEntry.findMany({
      where: { gameSlug },
      orderBy: { score: 'desc' },
      take: limit
    });

    return NextResponse.json({
      success: true,
      gameSlug,
      entries
    });
  } catch (error) {
    console.error('Database query error in /api/leaderboard GET:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Database query failed'
      },
      { status: 500 }
    );
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

    const newEntry = await prisma.leaderboardEntry.create({
      data: {
        gameSlug,
        playerName: cleanPlayerName.substring(0, 50),
        score: Math.max(0, Math.floor(score)),
        combo: Math.max(0, Math.floor(combo || 0))
      }
    });

    // Fetch top 10 updated
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
