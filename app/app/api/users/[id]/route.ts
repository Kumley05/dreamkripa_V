import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

// PATCH /api/users/[id] - Update user
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, phone, password, is_active, role } = body;

    const updates: string[] = [];
    const values: any[] = [];

    if (name) { updates.push('name = ?'); values.push(name.trim()); }
    if (email) { updates.push('email = ?'); values.push(email.toLowerCase().trim()); }
    if (phone !== undefined) { updates.push('phone = ?'); values.push(phone); }
    if (is_active !== undefined) { updates.push('is_active = ?'); values.push(is_active); }
    if (role) { updates.push('role = ?'); values.push(role === 'admin' ? 'admin' : 'telecaller'); }
    if (password) {
      updates.push('password = ?');
      values.push(hashPassword(password));
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    values.push(id);
    await query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);

    const users = await query(
      'SELECT id, name, email, role, phone, is_active, created_at, updated_at FROM users WHERE id = ?',
      [id]
    ) as any[];

    return NextResponse.json({ success: true, data: users[0] });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await query('DELETE FROM users WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}