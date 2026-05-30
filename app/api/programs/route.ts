import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { programs as staticPrograms, categories as staticCategories } from '@/lib/program-data';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const level = searchParams.get('level');
    const featured = searchParams.get('featured');
    const slug = searchParams.get('slug');
    const limit = parseInt(searchParams.get('limit') || '100');

    try {
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
    } catch (dbError) {
      console.error('Database query failed, using static fallback:', dbError);

      // Fallback to static data when database is unavailable
      let results = staticPrograms.map(p => {
        const cat = staticCategories.find(c => c.slug === p.category_slug);
        return {
          id: p.id,
          title: p.title,
          slug: p.slug,
          description: p.description,
          level: p.level,
          duration: p.duration,
          eligibility_criteria: p.eligibility_criteria,
          fee_range: p.fee_range,
          featured: p.featured ? 1 : 0,
          display_order: p.display_order,
          is_active: 1,
          category_id: cat?.id || null,
          category_name: p.category_name,
          category_slug: p.category_slug,
          category_icon: p.category_icon,
        };
      });

      if (category) {
        results = results.filter(p => p.category_slug === category);
      }

      if (level) {
        results = results.filter(p => p.level === level);
      }

      if (featured === 'true') {
        results = results.filter(p => p.featured === 1);
      }

      if (slug) {
        results = results.filter(p => p.slug === slug);
      }

      results = results.slice(0, limit);

      return NextResponse.json({
        success: true,
        data: results,
      });
    }
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}
