import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PROMO_BANNERS } from '@/data/promos';

export async function GET() {
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
