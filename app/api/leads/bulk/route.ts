import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

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

  // Parse header — normalize to lowercase, trim
  const header = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));

  // Required columns
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

    // Simple CSV parse (handles quoted fields)
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

// POST /api/leads/bulk — Admin bulk uploads leads via CSV
export async function POST(request: NextRequest) {
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
        // Check duplicate
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