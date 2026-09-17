import { NextRequest, NextResponse } from 'next/server';
import { prisma, isDatabaseAvailable } from '@/lib/prisma';
import { verifySessionToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('gamevui_session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ success: false, user: null }, { status: 200 });
    }

    const payload = verifySessionToken(sessionCookie);
    if (!payload) {
      return NextResponse.json({ success: false, user: null }, { status: 200 });
    }

    const dbUp = await isDatabaseAvailable();
    if (!dbUp) {
      return NextResponse.json({
        success: true,
        user: {
          id: payload.userId,
          username: payload.username || 'Game thủ',
          email: payload.email || '',
          avatar: null,
          role: 'USER',
          createdAt: new Date().toISOString()
        }
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      return NextResponse.json({ success: false, user: null }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json({ success: false, user: null }, { status: 200 });
  }
}
