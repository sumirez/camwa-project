import sequelize from '../common/sequelize/connect.sequelize.js';
import { QueryTypes } from 'sequelize';

const dashboardService = {
  // Get attendance analytics grouped by period (daily/weekly/monthly) and program (major)
  getAttendanceAnalytics: async (period = 'daily', year = 2021) => {
    // Map period to PostgreSQL DATE_TRUNC unit
    const truncMap = { daily: 'day', weekly: 'week', monthly: 'month' };
    const trunc = truncMap[period] ?? 'day';
    const selectedYear = Number(year) || new Date().getFullYear();

    const attendanceSql = `
      SELECT
        DATE_TRUNC('${trunc}', a.created_at) AS date,
        p.program_id,
        p.name AS major,
        COUNT(*) AS total,
        SUM(CASE WHEN a.attendance_status = 'present' THEN 1 ELSE 0 END) AS present,
        ROUND(
          SUM(CASE WHEN a.attendance_status = 'present' THEN 1 ELSE 0 END) * 100.0 / COUNT(*),
          2
        ) AS rate
      FROM attendance a
      JOIN student s ON a.student_id = s.student_id
      JOIN program p ON s.program_id = p.program_id
      WHERE EXTRACT(YEAR FROM a.created_at) = :year
      GROUP BY DATE_TRUNC('${trunc}', a.created_at), p.program_id, p.name
      ORDER BY date ASC;
    `;

    const passFailSql = `
      SELECT
        p.program_id,
        p.name AS major,
        COUNT(*) AS total_students,
        SUM(CASE WHEN sr.rate >= 75 THEN 1 ELSE 0 END) AS passing_students,
        SUM(CASE WHEN sr.rate < 75 THEN 1 ELSE 0 END) AS failing_students,
        ROUND(SUM(CASE WHEN sr.rate >= 75 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS pass_percentage,
        ROUND(SUM(CASE WHEN sr.rate < 75 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS fail_percentage
      FROM (
        SELECT
          a.student_id,
          s.program_id,
          ROUND(
            SUM(CASE WHEN a.attendance_status = 'present' THEN 1 ELSE 0 END) * 100.0 / COUNT(*),
            2
          ) AS rate
        FROM attendance a
        JOIN student s ON a.student_id = s.student_id
        WHERE EXTRACT(YEAR FROM a.created_at) = :year
        GROUP BY a.student_id, s.program_id
      ) AS sr
      JOIN program p ON sr.program_id = p.program_id
      GROUP BY p.program_id, p.name
      ORDER BY p.name ASC;
    `;

    const requestCountsSql = `
      SELECT
        COUNT(*) FILTER (WHERE request_status = 'approved') AS approved_count,
        COUNT(*) FILTER (WHERE request_status = 'pending') AS pending_count,
        COUNT(*) AS total_count
      FROM attendance_request;
    `;

    const [attendanceRates, passFailByMajor, requestCounts] = await Promise.all([
      sequelize.query(attendanceSql, { type: QueryTypes.SELECT, replacements: { year: selectedYear } }),
      sequelize.query(passFailSql, { type: QueryTypes.SELECT, replacements: { year: selectedYear } }),
      sequelize.query(requestCountsSql, { type: QueryTypes.SELECT })
    ]);

    return { attendanceRates, passFailByMajor, requestCounts: requestCounts[0], year: selectedYear };
  }
};

export default dashboardService;