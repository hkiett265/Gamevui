import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CATEGORIES } from '@/data/categories';
import { QUICK_CATEGORIES } from '@/data/quickCategories';

export async function GET() {
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
    // Graceful fallback to static data if database is unavailable
    return NextResponse.json({
      success: false,
      fallback: true,
      categories: CATEGORIES,
      quickCategories: QUICK_CATEGORIES
    });
  }
}
