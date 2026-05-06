import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { comparePassword, generateToken, hashPassword, getAuthUser, getUserFromDb, verifyToken } from '@/lib/auth';

// POST /api/auth/login
async function handleLogin(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const users = await query(
      'SELECT id, name, email, password, role, phone FROM users WHERE email = ? AND is_active = TRUE',
      [email.toLowerCase().trim()]
    ) as any[];

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = users[0];

    if (!comparePassword(password, user.password)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    });

    await query('UPDATE users SET updated_at = NOW() WHERE id = ?', [user.id]);

    const response = NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
      },
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}

// POST /api/auth/logout
function handleLogout() {
  const response = NextResponse.json({ success: true, message: 'Logged out' });
  response.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}

// POST /api/auth/forgot-password
async function handleForgotPassword(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, newPassword } = body;

    if (!email || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Email and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const users = await query(
      'SELECT id, name, email FROM users WHERE email = ? AND is_active = TRUE',
      [email.toLowerCase().trim()]
    ) as any[];

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No account found with this email address' },
        { status: 404 }
      );
    }

    const hashedPassword = hashPassword(newPassword);
    await query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email.toLowerCase().trim()]);

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset password. Please try again.' },
      { status: 500 }
    );
  }
}

// GET /api/auth/me
async function handleMe(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      const token = request.cookies.get('auth_token')?.value;
      if (!token) {
        return NextResponse.json(
          { success: false, error: 'Not authenticated' },
          { status: 401 }
        );
      }
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ action: string[] }> }
) {
  const { action } = await params;
  const path = action.join('/');

  switch (path) {
    case 'login':
      return handleLogin(request);
    case 'logout':
      return handleLogout();
    case 'forgot-password':
      return handleForgotPassword(request);
    default:
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ action: string[] }> }
) {
  const { action } = await params;
  const path = action.join('/');

  switch (path) {
    case 'me':
      return handleMe(request);
    default:
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }
}