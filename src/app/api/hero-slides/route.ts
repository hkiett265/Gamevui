import { NextResponse } from 'next/server';
import { prisma, isDatabaseAvailable } from '@/lib/prisma';
import { HERO_SLIDES } from '@/data/games';
import { HeroSlide } from '@/types/game';

export async function GET() {
  const dbUp = await isDatabaseAvailable();
  if (!dbUp) {
    return NextResponse.json({
      success: true,
      source: 'static_offline',
      slides: HERO_SLIDES
    });
  }

  try {
    const dbSlides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });

    if (dbSlides.length > 0) {
      const slides: HeroSlide[] = dbSlides.map((s) => {
        let woodenSignLines: string[] = [];
        try {
          woodenSignLines = JSON.parse(s.woodenSignLines);
        } catch {
          woodenSignLines = [];
        }

        return {
          id: s.id,
          gameSlug: s.gameSlug,
          title: s.title,
          subtitle: s.subtitle,
          tagline: s.tagline,
          badge: s.badge,
          image: s.image,
          ctaText: s.ctaText,
          secondaryCtaText: s.secondaryCtaText,
          woodenSignLines
        };
      });

      return NextResponse.json({
        success: true,
        source: 'mysql',
        slides
      });
    }

    return NextResponse.json({
      success: true,
      source: 'fallback',
      slides: HERO_SLIDES
    });
  } catch (error) {
    console.error('Database query error in /api/hero-slides:', error);
    return NextResponse.json({
      success: false,
      source: 'fallback_error',
      slides: HERO_SLIDES
    });
  }
}
