import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthUser, verifyToken } from '@/lib/auth';

// Helper to get current user from request
async function getCurrentUser(request: NextRequest) {
  const authUser = getAuthUser(request);
  if (authUser) return authUser;
  const token = request.cookies.get('auth_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

// GET /api/followups?leadId=X - Get follow-ups for a lead
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const leadId = searchParams.get('leadId');

    if (!leadId) {
      return NextResponse.json(
        { success: false, error: 'leadId is required' },
        { status: 400 }
      );
    }

    const followups = await query(
      `SELECT f.*, u.name as user_name, u.role as user_role
       FROM lead_followups f
       LEFT JOIN users u ON f.user_id = u.id
       WHERE f.lead_id = ?
       ORDER BY f.created_at DESC`,
      [leadId]
    ) as any[];

    return NextResponse.json({ success: true, data: followups });
  } catch (error) {
    console.error('Error fetching followups:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch follow-ups' },
      { status: 500 }
    );
  }
}

// POST /api/followups - Create a follow-up entry
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { lead_id, status, remarks, next_followup_at } = body;

    if (!lead_id) {
      return NextResponse.json(
        { success: false, error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    // Create follow-up record
    const result = await query(
      `INSERT INTO lead_followups (lead_id, user_id, status, remarks, next_followup_at)
       VALUES (?, ?, ?, ?, ?)`,
      [
        lead_id,
        user.id,
        status || 'contacted',
        remarks || null,
        next_followup_at || null,
      ]
    ) as any;

    // Also update the lead status
    if (status) {
      await query('UPDATE leads SET status = ? WHERE id = ?', [status, lead_id]);
    }

    // Fetch the created follow-up with user info
    const followups = await query(
      `SELECT f.*, u.name as user_name, u.role as user_role
       FROM lead_followups f
       LEFT JOIN users u ON f.user_id = u.id
       WHERE f.id = ?`,
      [result.insertId]
    ) as any[];

    return NextResponse.json({ success: true, data: followups[0] });
  } catch (error) {
    console.error('Error creating followup:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create follow-up' },
      { status: 500 }
    );
  }
}