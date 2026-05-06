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
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Check auth — telecallers only see their assigned leads
    const authUser = getAuthUser(request);
    const isTelecaller = authUser && authUser.role === 'telecaller';

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

    // Telecaller: only see leads assigned to them (and unassigned leads)
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

export async function POST(request: NextRequest) {
  // Rate limiting
  const clientId = getClientIdentifier(request);
  const rateLimitResult = await rateLimit(clientId, { windowMs: 60000, maxRequests: 5 });

  if (!rateLimitResult.allowed) {
    return rateLimitResponse(rateLimitResult.resetTime!);
  }

  try {
    const body = await request.json();

    // Security checks
    if (detectSQLInjection(JSON.stringify(body)) || detectXSS(JSON.stringify(body))) {
      return NextResponse.json(
        { success: false, error: 'Invalid request detected' },
        { status: 400 }
      );
    }

    // Validate request body
    const validatedData = leadFormSchema.parse(body);

    // Check for duplicate email
    const existingLeads = await query(
      'SELECT id, status FROM leads WHERE email = ? AND status != ?',
      [validatedData.email, 'duplicate']
    ) as any[];

    if (existingLeads.length > 0) {
      // Update existing lead as duplicate
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

    // Get source and UTM parameters from headers or body
    const source = body.source || 'website';
    const utm_source = body.utm_source || request.headers.get('utm-source') || source;
    const utm_medium = body.utm_medium || request.headers.get('utm-medium') || '';
    const utm_campaign = body.utm_campaign || request.headers.get('utm-campaign') || '';

    // Get IP and user agent
    const ip_address = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                      request.headers.get('x-real-ip') ||
                      '';
    const user_agent = request.headers.get('user-agent') || '';

    // Insert new lead
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
        source,  // source column
        utm_source,  // utm_source column
        utm_medium,  // utm_medium column
        utm_campaign,  // utm_campaign column
        validatedData.consentEmail,
        validatedData.consentPhone,
        ip_address,
        user_agent,
      ]
    ) as any;

    const leadId = result.insertId;

    // Add activity log
    await query(
      `INSERT INTO lead_activities (lead_id, activity_type, description, performed_by)
       VALUES (?, 'form_submission', 'New lead submitted via website form', 'system')`,
      [leadId]
    );

    // Send email notifications (async, don't wait)
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

        // Get program title if program selected
        if (validatedData.programId) {
          const programs = await query('SELECT title FROM programs WHERE id = ?', [validatedData.programId]) as any[];
          if (programs.length > 0) {
            leadData.program_title = programs[0].title;
          }
        }

        // Send notifications
        await Promise.allSettled([
          sendNewLeadNotification(leadData),
          sendLeadConfirmationEmail(leadData),
        ]);
      } catch (error) {
        console.error('Error sending emails:', error);
      }
    });

    // Log the lead creation (with masked sensitive data)
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