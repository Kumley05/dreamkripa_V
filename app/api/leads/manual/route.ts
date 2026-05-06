import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthUser, requireAdmin } from '@/lib/auth';

// POST /api/leads/manual — Admin manually adds a single lead
export async function POST(request: NextRequest) {
  try {
    const authCheck = requireAdmin(request);
    if ('error' in authCheck) {
      return NextResponse.json({ success: false, error: authCheck.error }, { status: authCheck.status });
    }

    const body = await request.json();
    const {
      first_name, last_name, email, phone,
      education_level, program_category_id, program_of_interest_id,
      current_city, state, status, assigned_to_id, notes
    } = body;

    if (!first_name || !last_name || !email) {
      return NextResponse.json(
        { success: false, error: 'First name, last name and email are required' },
        { status: 400 }
      );
    }

    // Check duplicate
    const existing = await query('SELECT id FROM leads WHERE email = ?', [email.toLowerCase().trim()]) as any[];
    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, error: 'A lead with this email already exists' },
        { status: 409 }
      );
    }

    const result = await query(
      `INSERT INTO leads (
        first_name, last_name, email, phone,
        education_level, program_category_id, program_of_interest_id,
        current_city, state, status, assigned_to_id, assigned_at,
        source, notes, consent_email, consent_phone
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        first_name.trim(),
        last_name.trim(),
        email.toLowerCase().trim(),
        phone || null,
        education_level || null,
        program_category_id || null,
        program_of_interest_id || null,
        current_city || null,
        state || null,
        status || 'new',
        assigned_to_id || null,
        assigned_to_id ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null,
        'manual',
        notes || null,
        true,
        true,
      ]
    ) as any;

    return NextResponse.json({
      success: true,
      data: { id: result.insertId },
      message: `Lead ${first_name} ${last_name} added successfully`,
    });
  } catch (error) {
    console.error('Error adding manual lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add lead' },
      { status: 500 }
    );
  }
}