import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { comparePassword, generateToken, getAuthUser, getUserFromDb, hashPassword, verifyToken } from '@/lib/auth';

// GET /api/auth?action=me — Get current user
export async function GET(request: NextRequest) {
  try {
    const action = request.nextUrl.searchParams.get('action');

    if (action === 'me') {
      return handleMe(request);
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action. Use ?action=me' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Auth GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication check failed' },
      { status: 500 }
    );
  }
}

// POST /api/auth?action=login|logout|forgot-password
export async function POST(request: NextRequest) {
  try {
    const action = request.nextUrl.searchParams.get('action');

    switch (action) {
      case 'login':
        return handleLogin(request);
      case 'logout':
        return handleLogout();
      case 'forgot-password':
        return handleForgotPassword(request);
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action. Use ?action=login|logout|forgot-password' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Auth POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Auth operation failed. Please try again.' },
      { status: 500 }
    );
  }
}

async function handleLogin(request: NextRequest) {
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
}

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

async function handleForgotPassword(request: NextRequest) {
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
}

async function handleMe(request: NextRequest) {
  const authUser = getAuthUser(request);
  if (authUser) {
    const freshUser = await getUserFromDb(authUser.id);
    if (!freshUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 401 }
      );
    }
    return NextResponse.json({ success: true, data: freshUser });
  }

  // Fallback to cookie
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