import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const featured = searchParams.get('featured');
    const slug = searchParams.get('slug');
    const limit = parseInt(searchParams.get('limit') || '100');

    let sql = `
      SELECT
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        c.icon as category_icon
      FROM programs p
      LEFT JOIN program_categories c ON p.category_id = c.id
      WHERE p.is_active = true
    `;

    const params: any[] = [];

    if (category) {
      sql += ' AND c.slug = ?';
      params.push(category);
    }

    if (level) {
      sql += ' AND p.level = ?';
      params.push(level);
    }

    if (featured === 'true') {
      sql += ' AND p.featured = true';
    }

    if (slug) {
      sql += ' AND p.slug = ?';
      params.push(slug);
    }

    sql += ' ORDER BY p.display_order ASC, p.created_at DESC LIMIT ?';
    params.push(limit);

    const programs = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: programs,
    });
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}
