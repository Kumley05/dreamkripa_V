import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { contactFormSchema } from '@/lib/validations';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = contactFormSchema.parse(body);

    // Store contact message (you could create a separate table for this)
    // For now, we'll store it as a lead with a special source
    await query(
      `INSERT INTO leads (
        first_name, last_name, email, phone, message, source, status, consent_email, consent_phone
      ) VALUES (?, ?, ?, ?, ?, 'contact_form', 'new', true, false)`,
      [
        body.name.split(' ')[0] || 'Contact',
        body.name.split(' ').slice(1).join(' ') || 'Form',
        validatedData.email,
        validatedData.phone || null,
        `${validatedData.subject ? 'Subject: ' + validatedData.subject + '\n' : ''}${validatedData.message}`,
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);

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
      { success: false, error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
