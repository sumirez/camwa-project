'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('attendance', null, {});

    const days = [
      '2021-08-01', '2021-08-02', '2021-08-03',
      '2021-08-04', '2021-08-05', '2021-08-06', '2021-08-07'
    ];

    const csStudents = ['STU001', 'STU003', 'STU005', 'STU007', 'STU009', 'STU011', 'STU013', 'STU015', 'STU017', 'STU019'];
    const itStudents = ['STU002', 'STU004', 'STU006', 'STU008', 'STU010', 'STU012', 'STU014', 'STU016', 'STU018', 'STU020'];
    const isStudents = ['STU021', 'STU022', 'STU023', 'STU024', 'STU025', 'STU026', 'STU027', 'STU028'];

    const records = [];

    const csDayRatios = [80, 90, 70, 85, 60, 95, 75];
    const itDayRatios = [65, 80, 55, 70, 85, 50, 75];
    const isDayRatios = [70, 85, 60, 80, 55, 90, 65];

    const seededRandom = (seed) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    const addRecords = (students, intakeModuleId, dayRatios) => {
      days.forEach((day, dayIndex) => {
        const presentRatio = dayRatios[dayIndex];
        students.forEach((studentId, studentIndex) => {
          const seed = dayIndex * 1000 + studentIndex * 37 + studentId.charCodeAt(3) * 13 + studentId.charCodeAt(4) * 7;
          const rand = Math.floor(seededRandom(seed) * 100);
          let status;
          if (rand < presentRatio) {
            status = 'present';
          } else if (rand < presentRatio + 8) {
            status = 'late';
          } else if (rand < presentRatio + 15) {
            status = 'excused';
          } else {
            status = 'absent';
          }
          const hour = 8 + (dayIndex % 4);
          const minute = (studentIndex * 7 + dayIndex * 3) % 60;
          records.push({
            student_id: studentId,
            intake_module_id: intakeModuleId,
            attendance_status: status,
            created_at: new Date(`${day}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00.000Z`),
            updated_at: new Date(`${day}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00.000Z`)
          });
        });
      });
    };

    addRecords(csStudents, 'WD2023', csDayRatios);
    addRecords(itStudents, 'DB2023', itDayRatios);
    addRecords(isStudents, 'AP2023', isDayRatios);

    return queryInterface.bulkInsert('attendance', records);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('attendance', null, {});
  }
};