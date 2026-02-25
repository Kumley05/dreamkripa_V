import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { leadUpdateSchema } from '@/lib/validations';
import { z } from 'zod';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const leadId = parseInt(id);
    if (isNaN(leadId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid lead ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = leadUpdateSchema.parse(body);

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];

    if (validatedData.status) {
      updates.push('status = ?');
      values.push(validatedData.status);
    }
    if (validatedData.assignedTo !== undefined) {
      updates.push('assigned_to = ?');
      values.push(validatedData.assignedTo);
    }
    if (validatedData.notes !== undefined) {
      updates.push('notes = ?');
      values.push(validatedData.notes);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    values.push(leadId);

    await query(
      `UPDATE leads SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Log activity
    if (validatedData.status) {
      await query(
        `INSERT INTO lead_activities (lead_id, activity_type, description, performed_by)
         VALUES (?, 'status_changed', ?, 'admin')`,
        [leadId, `Status changed to ${validatedData.status}`]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Lead updated successfully',
    });
  } catch (error) {
    console.error('Error updating lead:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const leadId = parseInt(id);
    if (isNaN(leadId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid lead ID' },
        { status: 400 }
      );
    }

    await query('DELETE FROM leads WHERE id = ?', [leadId]);

    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}
