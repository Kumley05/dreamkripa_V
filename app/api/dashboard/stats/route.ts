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

    // Telecaller performance (admin only)
    let telecallerPerformance: any[] = [];
    if (!isTelecaller) {
      const tcPerf = await query(`
        SELECT
          u.id,
          u.name,
          u.email,
          u.phone,
          u.profile_picture,
          COUNT(l.id) as total_assigned,
          SUM(CASE WHEN l.status = 'new' THEN 1 ELSE 0 END) as new_count,
          SUM(CASE WHEN l.status = 'contacted' THEN 1 ELSE 0 END) as contacted_count,
          SUM(CASE WHEN l.status = 'qualified' THEN 1 ELSE 0 END) as qualified_count,
          SUM(CASE WHEN l.status = 'converted' THEN 1 ELSE 0 END) as converted_count,
          SUM(CASE WHEN l.status = 'lost' THEN 1 ELSE 0 END) as lost_count
        FROM users u
        LEFT JOIN leads l ON l.assigned_to_id = u.id
        WHERE u.role = 'telecaller' AND u.is_active = TRUE
        GROUP BY u.id, u.name, u.email, u.phone, u.profile_picture
        ORDER BY total_assigned DESC
      `) as any[];

      // Get follow-up counts per telecaller
      const followupCounts = await query(`
        SELECT
          lf.user_id,
          COUNT(lf.id) as total_followups,
          MAX(lf.created_at) as last_followup_at
        FROM lead_followups lf
        GROUP BY lf.user_id
      `) as any[];

      const followupMap = new Map(followupCounts.map((f: any) => [f.user_id, f]));

      telecallerPerformance = tcPerf.map((tc: any) => {
        const fu = followupMap.get(tc.id) || { total_followups: 0, last_followup_at: null };
        const convRate = tc.total_assigned > 0
          ? ((tc.converted_count / tc.total_assigned) * 100).toFixed(1)
          : '0.0';
        return {
          id: tc.id,
          name: tc.name,
          email: tc.email,
          phone: tc.phone,
          profile_picture: tc.profile_picture,
          total_assigned: tc.total_assigned,
          new_count: tc.new_count,
          contacted_count: tc.contacted_count,
          qualified_count: tc.qualified_count,
          converted_count: tc.converted_count,
          lost_count: tc.lost_count,
          total_followups: fu.total_followups,
          last_followup_at: fu.last_followup_at,
          conversion_rate: parseFloat(convRate),
        };
      });
    }

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
      telecallerPerformance,
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