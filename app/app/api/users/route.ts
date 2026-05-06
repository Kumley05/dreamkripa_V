import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin, getAuthUser } from '@/lib/auth';
import { hashPassword } from '@/lib/auth';

// GET /api/users - List all users (admin only) or telecallers
export async function GET(request: NextRequest) {
  try {
    const authResult = requireAdmin(request);
    if ('error' in authResult) {
      // Also check cookie for page loads
      const token = request.cookies.get('auth_token')?.value;
      if (!token) {
        return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
      }
      const { verifyToken, getUserFromDb } = await import('@/lib/auth');
      const cookieUser = verifyToken(token);
      if (!cookieUser || cookieUser.role !== 'admin') {
        return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
      }
    }

    const users = await query(
      'SELECT id, name, email, role, phone, is_active, created_at, updated_at FROM users ORDER BY created_at DESC'
    ) as any[];

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new telecaller (admin only)
export async function POST(request: NextRequest) {
  try {
    const authResult = requireAdmin(request);
    if ('error' in authResult) {
      const token = request.cookies.get('auth_token')?.value;
      if (!token) {
        return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
      }
      const { verifyToken } = await import('@/lib/auth');
      const cookieUser = verifyToken(token);
      if (!cookieUser || cookieUser.role !== 'admin') {
        return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.status });
      }
    }

    const body = await request.json();
    const { name, email, password, phone, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await query('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]) as any[];
    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = hashPassword(password);
    const userRole = role === 'admin' ? 'admin' : 'telecaller';

    const result = await query(
      'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), email.toLowerCase().trim(), hashedPassword, userRole, phone || null]
    ) as any;

    return NextResponse.json({
      success: true,
      data: {
        id: result.insertId,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        role: userRole,
        phone: phone || null,
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}