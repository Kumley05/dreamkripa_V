import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Require authentication — also check cookie as fallback
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
    const telecallerId = authUser.id;

    // Build base WHERE clause for telecaller filtering
    const telecallerWhere = isTelecaller
      ? 'AND (assigned_to_id = ? OR assigned_to_id IS NULL)'
      : '';
    const telecallerParams = isTelecaller ? [telecallerId] : [];

    // Get total leads count
    const totalLeads = await query(
      `SELECT COUNT(*) as count FROM leads WHERE 1=1 ${telecallerWhere}`,
      telecallerParams
    ) as any[];

    // Get leads by status
    const leadsByStatus = await query(
      `SELECT status, COUNT(*) as count FROM leads WHERE 1=1 ${telecallerWhere} GROUP BY status`,
      telecallerParams
    ) as any[];

    // Get leads this week
    const leadsThisWeek = await query(
      `SELECT COUNT(*) as count FROM leads WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) ${telecallerWhere}`,
      telecallerParams
    ) as any[];

    // Get leads this month
    const leadsThisMonth = await query(
      `SELECT COUNT(*) as count FROM leads WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) ${telecallerWhere}`,
      telecallerParams
    ) as any[];

    // Unassigned leads count (admin only)
    let unassignedCount = 0;
    if (!isTelecaller) {
      const unassigned = await query(
        'SELECT COUNT(*) as count FROM leads WHERE assigned_to_id IS NULL'
      ) as any[];
      unassignedCount = unassigned[0].count;
    }

    // Get top programs
    const topPrograms = await query(`
      SELECT
        COALESCE(p.title, 'Not Specified') as program,
        COUNT(*) as count
      FROM leads l
      LEFT JOIN programs p ON l.program_of_interest_id = p.id
      WHERE 1=1 ${telecallerWhere}
      GROUP BY program
      ORDER BY count DESC
      LIMIT 10
    `, telecallerParams) as any[];

    // Get leads by education level
    const leadsByLevel = await query(`
      SELECT
        COALESCE(education_level, 'Not Specified') as level,
        COUNT(*) as count
      FROM leads
      WHERE 1=1 ${telecallerWhere}
      GROUP BY level
      ORDER BY count DESC
    `, telecallerParams) as any[];

    // Calculate conversion rate
    const convertedLeads = leadsByStatus.find((s: any) => s.status === 'converted')?.count || 0;
    const conversionRate = totalLeads[0].count > 0
      ? ((convertedLeads / totalLeads[0].count) * 100).toFixed(1)
      : '0.0';

    const stats = {
      totalLeads: totalLeads[0].count,
      newLeads: leadsByStatus.find((s: any) => s.status === 'new')?.count || 0,
      contactedLeads: leadsByStatus.find((s: any) => s.status === 'contacted')?.count || 0,
      qualifiedLeads: leadsByStatus.find((s: any) => s.status === 'qualified')?.count || 0,
      convertedLeads,
      conversionRate: parseFloat(conversionRate),
      leadsThisWeek: leadsThisWeek[0].count,
      leadsThisMonth: leadsThisMonth[0].count,
      unassignedLeads: unassignedCount,
      topPrograms,
      leadsByStatus,
      leadsByLevel,
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}