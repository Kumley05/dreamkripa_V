import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// POST /api/users/[id]/profile-picture — Upload profile picture
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    // User can upload their own picture, admin can upload for anyone
    if (authUser.role !== 'admin' && authUser.id !== parseInt(id)) {
      return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('profile_picture') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Only JPEG, PNG, GIF, and WebP images are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size must be under 5MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `user-${id}-${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profiles');
    const filepath = path.join(uploadDir, filename);

    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });

    // Write file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Save path to database
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

// DELETE /api/users/[id]/profile-picture — Remove profile picture
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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