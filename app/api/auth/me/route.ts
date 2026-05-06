import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, getUserFromDb } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      // Also check cookie
      const token = request.cookies.get('auth_token')?.value;
      if (!token) {
        return NextResponse.json(
          { success: false, error: 'Not authenticated' },
          { status: 401 }
        );
      }
      // Import verifyToken inline to handle cookie case
      const { verifyToken } = await import('@/lib/auth');
      const cookieUser = verifyToken(token);
      if (!cookieUser) {
        return NextResponse.json(
          { success: false, error: 'Not authenticated' },
          { status: 401 }
        );
      }
      const freshUser = await getUserFromDb(cookieUser.id);
      if (!freshUser) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 401 }
        );
      }
      return NextResponse.json({ success: true, data: freshUser });
    }

    const freshUser = await getUserFromDb(authUser.id);
    if (!freshUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, data: freshUser });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication check failed' },
      { status: 500 }
    );
  }
}