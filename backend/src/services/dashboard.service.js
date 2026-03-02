import sequelize from '../common/sequelize/connect.sequelize.js';
import { QueryTypes } from 'sequelize';

const dashboardService = {
  // Get attendance analytics grouped by date and program (major)
  getAttendanceAnalytics: async () => {
    const attendanceSql = `
      SELECT
        a.class_date AS date,
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
      WHERE a.is_deleted = false
      GROUP BY a.class_date, p.program_id, p.name
      ORDER BY a.class_date ASC;
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
        WHERE a.is_deleted = false
        GROUP BY a.student_id, s.program_id
      ) AS sr
      JOIN program p ON sr.program_id = p.program_id
      GROUP BY p.program_id, p.name
      ORDER BY p.name ASC;
    `;

    const [attendanceRates, passFailByMajor] = await Promise.all([
      sequelize.query(attendanceSql, { type: QueryTypes.SELECT }),
      sequelize.query(passFailSql, { type: QueryTypes.SELECT })
    ]);

    return { attendanceRates, passFailByMajor };
  }
};

export default dashboardService;