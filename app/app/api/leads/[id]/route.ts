import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

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
    if (assigned_to_id !== undefined) { updates.push('assigned_to_id = ?'); values.push(assigned_to_id || null); }

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