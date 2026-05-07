import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthUser, hashPassword, comparePassword } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// GET /api/users/[id] — Get single user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const users = await query(
      'SELECT id, name, email, role, phone, profile_picture, is_active, created_at, updated_at FROM users WHERE id = ?',
      [id]
    ) as any[];

    if (users.length === 0) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: users[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PATCH /api/users/[id]?action=change-password — or default (update user fields)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const action = request.nextUrl.searchParams.get('action');

  switch (action) {
    case 'change-password':
      return handleChangePassword(request, id);
    default:
      return handleUpdateUser(request, id);
  }
}

// DELETE /api/users/[id]?action=profile-picture — or default (delete user)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const action = request.nextUrl.searchParams.get('action');

  switch (action) {
    case 'profile-picture':
      return handleRemoveProfilePicture(request, id);
    default:
      return handleDeleteUser(id);
  }
}

// POST /api/users/[id]?action=profile-picture — Upload profile picture
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const action = request.nextUrl.searchParams.get('action');

  switch (action) {
    case 'profile-picture':
      return handleUploadProfilePicture(request, id);
    default:
      return NextResponse.json(
        { success: false, error: 'Invalid action. Use ?action=profile-picture' },
        { status: 400 }
      );
  }
}

// --- Handlers ---

async function handleUpdateUser(request: NextRequest, id: string) {
  try {
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
      'SELECT id, name, email, role, phone, profile_picture, is_active, created_at, updated_at FROM users WHERE id = ?',
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

async function handleChangePassword(request: NextRequest, id: string) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

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

async function handleUploadProfilePicture(request: NextRequest, id: string) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    if (authUser.role !== 'admin' && authUser.id !== parseInt(id)) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('profile_picture') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Only JPEG, PNG, GIF, and WebP images are allowed' },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size must be under 5MB' },
        { status: 400 }
      );
    }

    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `user-${id}-${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profiles');
    const filepath = path.join(uploadDir, filename);

    await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    const pictureUrl = `/uploads/profiles/${filename}`;
    await query('UPDATE users SET profile_picture = ? WHERE id = ?', [pictureUrl, id]);

    return NextResponse.json({
      success: true,
      data: { profile_picture: pictureUrl },
      message: 'Profile picture updated',
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload profile picture' },
      { status: 500 }
    );
  }
}

async function handleRemoveProfilePicture(request: NextRequest, id: string) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    if (authUser.role !== 'admin' && authUser.id !== parseInt(id)) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    await query('UPDATE users SET profile_picture = NULL WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Profile picture removed' });
  } catch (error) {
    console.error('Error removing profile picture:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove profile picture' },
      { status: 500 }
    );
  }
}

async function handleDeleteUser(id: string) {
  try {
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