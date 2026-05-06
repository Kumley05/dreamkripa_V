import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { leadFormSchema } from '@/lib/validations';
import { z } from 'zod';
import {
  rateLimit,
  getClientIdentifier,
  rateLimitResponse,
  setSecurityHeaders,
  detectSQLInjection,
  detectXSS,
  maskSensitiveData,
} from '@/lib/security';
import { sendNewLeadNotification, sendLeadConfirmationEmail, initEmailService } from '@/lib/email';
import { getAuthUser, requireAdmin } from '@/lib/auth';

// ─── GET /api/leads — List leads ───
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

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
      SELECT
        l.*,
        p.title as program_title,
        c.name as category_name,
        u.name as assigned_to_name
      FROM leads l
      LEFT JOIN programs p ON l.program_of_interest_id = p.id
      LEFT JOIN program_categories c ON l.program_category_id = c.id
      LEFT JOIN users u ON l.assigned_to_id = u.id
    `;

    const params: any[] = [];
    const conditions: string[] = [];

    if (status) {
      conditions.push('l.status = ?');
      params.push(status);
    }

    if (isTelecaller) {
      conditions.push('(l.assigned_to_id = ? OR l.assigned_to_id IS NULL)');
      params.push(authUser.id);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY l.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const leads = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: leads,
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

// ─── POST /api/leads — Create lead (website form), manual, or bulk ───
// Uses ?action=manual or ?action=bulk to dispatch; default = website form
export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');

  if (action === 'manual') {
    return handleManualLead(request);
  }
  if (action === 'bulk') {
    return handleBulkUpload(request);
  }
  return handleWebsiteLead(request);
}

// ─── Website lead form ───
async function handleWebsiteLead(request: NextRequest) {
  const clientId = getClientIdentifier(request);
  const rateLimitResult = await rateLimit(clientId, { windowMs: 60000, maxRequests: 5 });

  if (!rateLimitResult.allowed) {
    return rateLimitResponse(rateLimitResult.resetTime!);
  }

  try {
    const body = await request.json();

    if (detectSQLInjection(JSON.stringify(body)) || detectXSS(JSON.stringify(body))) {
      return NextResponse.json(
        { success: false, error: 'Invalid request detected' },
        { status: 400 }
      );
    }

    const validatedData = leadFormSchema.parse(body);

    const existingLeads = await query(
      'SELECT id, status FROM leads WHERE email = ? AND status != ?',
      [validatedData.email, 'duplicate']
    ) as any[];

    if (existingLeads.length > 0) {
      await query(
        'UPDATE leads SET status = ?, notes = CONCAT(IFNULL(notes, ""), ?) WHERE id = ?',
        ['duplicate', `\n[Duplicate submission on ${new Date().toISOString()}]`, existingLeads[0].id]
      );

      return NextResponse.json({
        success: true,
        message: 'Thank you! We have already received your inquiry. Our team will contact you soon.',
        duplicate: true,
      });
    }

    const source = body.source || 'website';
    const utm_source = body.utm_source || request.headers.get('utm-source') || source;
    const utm_medium = body.utm_medium || request.headers.get('utm-medium') || '';
    const utm_campaign = body.utm_campaign || request.headers.get('utm-campaign') || '';

    const ip_address = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                      request.headers.get('x-real-ip') ||
                      '';
    const user_agent = request.headers.get('user-agent') || '';

    const result = await query(
      `INSERT INTO leads (
        first_name, last_name, email, phone,
        program_of_interest_id, program_category_id,
        education_level, current_city, state,
        preferred_intake, message, source,
        utm_source, utm_medium, utm_campaign,
        consent_email, consent_phone, ip_address, user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        validatedData.firstName,
        validatedData.lastName,
        validatedData.email,
        validatedData.phone || null,
        validatedData.programId || null,
        validatedData.programCategoryId || null,
        validatedData.educationLevel || null,
        validatedData.city || null,
        validatedData.state || null,
        validatedData.preferredIntake || null,
        validatedData.message || null,
        source,
        utm_source,
        utm_medium,
        utm_campaign,
        validatedData.consentEmail,
        validatedData.consentPhone,
        ip_address,
        user_agent,
      ]
    ) as any;

    const leadId = result.insertId;

    await query(
      `INSERT INTO lead_activities (lead_id, activity_type, description, performed_by)
       VALUES (?, 'form_submission', 'New lead submitted via website form', 'system')`,
      [leadId]
    );

    initEmailService().then(async () => {
      try {
        const leadData = {
          first_name: validatedData.firstName,
          last_name: validatedData.lastName,
          email: validatedData.email,
          phone: validatedData.phone,
          program_title: undefined as string | undefined,
          education_level: validatedData.educationLevel,
          city: validatedData.city,
          state: validatedData.state,
          message: validatedData.message,
        };

        if (validatedData.programId) {
          const programs = await query('SELECT title FROM programs WHERE id = ?', [validatedData.programId]) as any[];
          if (programs.length > 0) {
            leadData.program_title = programs[0].title;
          }
        }

        await Promise.allSettled([
          sendNewLeadNotification(leadData),
          sendLeadConfirmationEmail(leadData),
        ]);
      } catch (error) {
        console.error('Error sending emails:', error);
      }
    });

    console.log('New lead created:', maskSensitiveData({
      id: leadId,
      email: validatedData.email,
      phone: validatedData.phone,
      program: validatedData.programId,
    }));

    const response = NextResponse.json({
      success: true,
      message: 'Thank you for your inquiry! Our counselor will contact you within 24 hours.',
      data: { id: leadId },
    });

    return setSecurityHeaders(response);
  } catch (error) {
    console.error('Error creating lead:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to submit inquiry. Please try again.' },
      { status: 500 }
    );
  }
}

// ─── Manual lead (admin) ───
async function handleManualLead(request: NextRequest) {
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

// ─── Bulk CSV upload (admin) ───
interface CSVRow {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  education_level?: string;
  current_city?: string;
  state?: string;
  status?: string;
  notes?: string;
}

function parseCSV(csvText: string): { rows: CSVRow[]; errors: string[] } {
  const lines = csvText.trim().split('\n');
  const errors: string[] = [];

  if (lines.length < 2) {
    return { rows: [], errors: ['CSV file is empty or has no data rows'] };
  }

  const header = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));

  const requiredCols = ['first_name', 'last_name', 'email'];
  for (const col of requiredCols) {
    if (!header.includes(col)) {
      errors.push(`Missing required column: ${col}`);
    }
  }
  if (errors.length > 0) return { rows: [], errors };

  const rows: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    for (const ch of line) {
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    values.push(current.trim());

    const row: any = {};
    header.forEach((col, idx) => {
      row[col] = values[idx] || '';
    });

    if (row.first_name && row.last_name && row.email) {
      rows.push({
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email,
        phone: row.phone || undefined,
        education_level: row.education_level || undefined,
        current_city: row.current_city || undefined,
        state: row.state || undefined,
        status: row.status || undefined,
        notes: row.notes || undefined,
      });
    } else {
      errors.push(`Row ${i + 1}: missing required fields (first_name, last_name, email)`);
    }
  }

  return { rows, errors };
}

async function handleBulkUpload(request: NextRequest) {
  try {
    const authCheck = requireAdmin(request);
    if ('error' in authCheck) {
      return NextResponse.json({ success: false, error: authCheck.error }, { status: authCheck.status });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No CSV file provided' },
        { status: 400 }
      );
    }

    if (!file.name.endsWith('.csv')) {
      return NextResponse.json(
        { success: false, error: 'Only CSV files are accepted' },
        { status: 400 }
      );
    }

    const csvText = await file.text();
    const { rows, errors: parseErrors } = parseCSV(csvText);

    if (parseErrors.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'CSV parsing errors',
        details: parseErrors,
      }, { status: 400 });
    }

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid rows found in CSV' },
        { status: 400 }
      );
    }

    if (rows.length > 500) {
      return NextResponse.json(
        { success: false, error: 'Maximum 500 rows per upload. Please split your file.' },
        { status: 400 }
      );
    }

    let inserted = 0;
    let duplicates = 0;
    let failed = 0;
    const failedRows: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const existing = await query('SELECT id FROM leads WHERE email = ?', [row.email.toLowerCase().trim()]) as any[];
        if (existing.length > 0) {
          duplicates++;
          continue;
        }

        const validStatuses = ['new', 'contacted', 'qualified', 'converted', 'lost'];
        const status = validStatuses.includes(row.status || '') ? row.status : 'new';

        await query(
          `INSERT INTO leads (
            first_name, last_name, email, phone,
            education_level, current_city, state,
            status, source, notes, consent_email, consent_phone
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            row.first_name.trim(),
            row.last_name.trim(),
            row.email.toLowerCase().trim(),
            row.phone || null,
            row.education_level || null,
            row.current_city || null,
            row.state || null,
            status,
            'bulk_upload',
            row.notes || null,
            true,
            true,
          ]
        );
        inserted++;
      } catch (err) {
        failed++;
        failedRows.push(`Row ${i + 2}: ${row.email} — ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        total: rows.length,
        inserted,
        duplicates,
        failed,
        failedRows: failedRows.length > 0 ? failedRows.slice(0, 20) : undefined,
      },
      message: `Uploaded ${inserted} leads (${duplicates} duplicates skipped, ${failed} failed)`,
    });
  } catch (error) {
    console.error('Error bulk uploading leads:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process bulk upload' },
      { status: 500 }
    );
  }
}