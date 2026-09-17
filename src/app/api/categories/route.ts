import { NextResponse } from 'next/server';
import { prisma, isDatabaseAvailable } from '@/lib/prisma';
import { CATEGORIES } from '@/data/categories';
import { QUICK_CATEGORIES } from '@/data/quickCategories';

export async function GET() {
  const dbUp = await isDatabaseAvailable();
  if (!dbUp) {
    return NextResponse.json({
      success: true,
      source: 'static_offline',
      categories: CATEGORIES,
      quickCategories: QUICK_CATEGORIES
    });
  }

  try {
    const [categories, quickCategories] = await Promise.all([
      prisma.category.findMany({
        orderBy: { sortOrder: 'asc' }
      }),
      prisma.quickCategory.findMany({
        orderBy: { sortOrder: 'asc' }
      })
    ]);

    return NextResponse.json({
      success: true,
      categories: categories.length > 0 ? categories : CATEGORIES,
      quickCategories: quickCategories.length > 0 ? quickCategories : QUICK_CATEGORIES
    });
  } catch (error) {
    console.error('Database query error in /api/categories:', error);
    return NextResponse.json({
      success: false,
      fallback: true,
      categories: CATEGORIES,
      quickCategories: QUICK_CATEGORIES
    });
  }
}
