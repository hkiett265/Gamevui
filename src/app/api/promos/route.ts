import { NextResponse } from 'next/server';
import { prisma, isDatabaseAvailable } from '@/lib/prisma';
import { PROMO_BANNERS } from '@/data/promos';

export async function GET() {
  const dbUp = await isDatabaseAvailable();
  if (!dbUp) {
    return NextResponse.json({
      success: true,
      source: 'static_offline',
      promos: PROMO_BANNERS
    });
  }

  try {
    const dbPromos = await prisma.promoBanner.findMany({
      orderBy: { sortOrder: 'asc' }
    });

    if (dbPromos.length > 0) {
      return NextResponse.json({
        success: true,
        source: 'mysql',
        promos: dbPromos
      });
    }

    return NextResponse.json({
      success: true,
      source: 'fallback',
      promos: PROMO_BANNERS
    });
  } catch (error) {
    console.error('Database query error in /api/promos:', error);
    return NextResponse.json({
      success: false,
      source: 'fallback_error',
      promos: PROMO_BANNERS
    });
  }
}
