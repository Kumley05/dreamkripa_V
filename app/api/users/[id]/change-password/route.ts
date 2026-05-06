import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthUser, hashPassword, comparePassword } from '@/lib/auth';

// PATCH /api/users/[id]/change-password — Change password
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    // User can change their own password, admin can change anyone's
    if (authUser.role !== 'admin' && authUser.id !== parseInt(id)) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    const body = await request.json();
    const { current_password, new_password } = body;

    if (!new_password || new_password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // If changing own password, verify current password
    if (authUser.id === parseInt(id)) {
      if (!current_password) {
        return NextResponse.json(
          { success: false, error: 'Current password is required' },
          { status: 400 }
        );
      }

      const users = await query('SELECT password FROM users WHERE id = ?', [id]) as any[];
      if (users.length === 0) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }

      if (!comparePassword(current_password, users[0].password)) {
        return NextResponse.json(
          { success: false, error: 'Current password is incorrect' },
          { status: 401 }
        );
      }
    }

    // Hash and save new password
    const hashedPassword = hashPassword(new_password);
    await query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);

    return NextResponse.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to change password' },
      { status: 500 }
    );
  }
}