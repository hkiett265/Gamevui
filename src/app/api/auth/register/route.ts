import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, createSessionToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // 1. Validation
    if (!username || typeof username !== 'string' || username.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'Tên đăng nhập phải có ít nhất 3 ký tự' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email && typeof email === 'string' && email.trim() ? email.trim().toLowerCase() : null;

    // Simple email regex validation if provided
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: 'Email không đúng định dạng' },
        { status: 400 }
      );
    }

    // 2. Check for duplicate username
    const existingUsername = await prisma.user.findUnique({
      where: { username: cleanUsername }
    });
    if (existingUsername) {
      return NextResponse.json(
        { success: false, error: 'Tên đăng nhập này đã được sử dụng' },
        { status: 409 }
      );
    }

    // Check for duplicate email if provided
    if (cleanEmail) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: cleanEmail }
      });
      if (existingEmail) {
        return NextResponse.json(
          { success: false, error: 'Email này đã được liên kết với một tài khoản khác' },
          { status: 409 }
        );
      }
    }

    // 3. Hash password securely
    const passwordHash = await hashPassword(password);

    // 4. Default avatar based on username initial
    const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`;

    // 5. Create user in MySQL
    const user = await prisma.user.create({
      data: {
        username: cleanUsername,
        email: cleanEmail,
        passwordHash,
        avatar,
        role: 'USER'
      }
    });

    // 6. Create session token
    const token = createSessionToken({
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    // 7. Return response with HttpOnly cookie
    const response = NextResponse.json({
      success: true,
      message: 'Đăng ký tài khoản thành công!',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt
      }
    });

    response.cookies.set('gamevui_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Error in /api/auth/register:', error);
    return NextResponse.json(
      { success: false, error: 'Đã có lỗi xảy ra trong quá trình đăng ký' },
      { status: 500 }
    );
  }
}
