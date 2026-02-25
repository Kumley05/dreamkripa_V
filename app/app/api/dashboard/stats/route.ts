import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get total leads count
    const totalLeads = await query('SELECT COUNT(*) as count FROM leads') as any[];

    // Get leads by status
    const leadsByStatus = await query(`
      SELECT status, COUNT(*) as count
      FROM leads
      GROUP BY status
    `) as any[];

    // Get leads this week
    const leadsThisWeek = await query(`
      SELECT COUNT(*) as count
      FROM leads
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `) as any[];

    // Get leads this month
    const leadsThisMonth = await query(`
      SELECT COUNT(*) as count
      FROM leads
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `) as any[];

    // Get top programs
    const topPrograms = await query(`
      SELECT
        COALESCE(p.title, 'Not Specified') as program,
        COUNT(*) as count
      FROM leads l
      LEFT JOIN programs p ON l.program_of_interest_id = p.id
      GROUP BY program
      ORDER BY count DESC
      LIMIT 10
    `) as any[];

    // Get leads by education level
    const leadsByLevel = await query(`
      SELECT
        COALESCE(education_level, 'Not Specified') as level,
        COUNT(*) as count
      FROM leads
      GROUP BY level
      ORDER BY count DESC
    `) as any[];

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
