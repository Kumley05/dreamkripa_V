import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');
    const active = searchParams.get('active');

    let sql = 'SELECT * FROM program_categories WHERE 1=1';
    const params: any[] = [];

    if (slug) {
      sql += ' AND slug = ?';
      params.push(slug);
    }

    if (active === 'true') {
      sql += ' AND is_active = true';
    }

    sql += ' ORDER BY display_order ASC';

    const categories = await query(sql, params);

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
