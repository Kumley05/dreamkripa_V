import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

// PATCH /api/leads/[id] - Update lead (status, assignment, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, assigned_to_id } = body;

    const updates: string[] = [];
    const values: any[] = [];

    if (status) { updates.push('status = ?'); values.push(status); }
    if (assigned_to_id !== undefined) {
      updates.push('assigned_to_id = ?');
      values.push(assigned_to_id || null);
      // Set assigned_at timestamp when assigning
      if (assigned_to_id) {
        updates.push('assigned_at = NOW()');
      } else {
        updates.push('assigned_at = NULL');
      }
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    values.push(id);
    await query(`UPDATE leads SET ${updates.join(', ')} WHERE id = ?`, values);

    // Fetch updated lead with relations
    const leads = await query(
      `SELECT l.*, p.title as program_title, c.name as category_name,
        u.name as assigned_to_name
      FROM leads l
      LEFT JOIN programs p ON l.program_of_interest_id = p.id
      LEFT JOIN program_categories c ON l.program_category_id = c.id
      LEFT JOIN users u ON l.assigned_to_id = u.id
      WHERE l.id = ?`,
      [id]
    ) as any[];

    return NextResponse.json({ success: true, data: leads[0] });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}

// GET /api/leads/[id] - Get single lead detail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check auth — require authentication
    let authUser = getAuthUser(request);
    if (!authUser) {
      const token = request.cookies.get('auth_token')?.value;
      if (token) {
        const { verifyToken } = await import('@/lib/auth');
        authUser = verifyToken(token);
      }
    }
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    const isTelecaller = authUser.role === 'telecaller';

    let sql = `
      SELECT l.*, p.title as program_title, c.name as category_name,
        u.name as assigned_to_name
      FROM leads l
      LEFT JOIN programs p ON l.program_of_interest_id = p.id
      LEFT JOIN program_categories c ON l.program_category_id = c.id
      LEFT JOIN users u ON l.assigned_to_id = u.id
      WHERE l.id = ?
    `;
    const sqlParams: any[] = [id];

    if (isTelecaller) {
      sql += ' AND (l.assigned_to_id = ? OR l.assigned_to_id IS NULL)';
      sqlParams.push(authUser.id);
    }

    const leads = await query(sql, sqlParams) as any[];

    if (leads.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: leads[0] });
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lead' },
      { status: 500 }
    );
  }
}

// DELETE /api/leads/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await query('DELETE FROM lead_followups WHERE lead_id = ?', [id]);
    await query('DELETE FROM leads WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}