'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('student', null, {});
    return queryInterface.bulkInsert('student', [
      { student_id: "STU001", name: "Alice Johnson", map_location: "A1-101", program_id: "CS001", intake: "2023", acc_id: "STU001" },
      { student_id: 'STU002', name: 'Bob Wilson', map_location: "B2-202", program_id: "IT001", intake: "2023", acc_id: "STU002" },
      { student_id: 'STU003', name: 'Charlie Davis', map_location: "A1-103", program_id: "CS001", intake: "2023", acc_id: "STU003" },
      { student_id: 'STU004', name: 'Diana Prince', map_location: "B2-204", program_id: "IT001", intake: "2023", acc_id: "STU004" },
      { student_id: 'STU005', name: 'Ethan Hunt', map_location: "C3-305", program_id: "CS001", intake: "2023", acc_id: "STU005" },
      { student_id: 'STU006', name: 'Fiona Gallagher', map_location: "D4-406", program_id: "IT001", intake: "2023", acc_id: "STU006" },
      { student_id: 'STU007', name: 'George Miller', map_location: "A1-107", program_id: "CS001", intake: "2023", acc_id: "STU007" },
      { student_id: 'STU008', name: 'Hannah Abbott', map_location: "B2-208", program_id: "IT001", intake: "2023", acc_id: "STU008" },
      { student_id: 'STU009', name: 'Ian Wright', map_location: "C3-309", program_id: "CS001", intake: "2023", acc_id: "STU009" },
      { student_id: 'STU010', name: 'Julia Roberts', map_location: "D4-410", program_id: "IT001", intake: "2023", acc_id: "STU010" },
      { student_id: 'STU011', name: 'Kevin Hart', map_location: "A1-111", program_id: "CS001", intake: "2022", acc_id: "STU011" },
      { student_id: 'STU012', name: 'Laura Palmer', map_location: "B2-212", program_id: "IT001", intake: "2022", acc_id: "STU012" },
      { student_id: 'STU013', name: 'Michael Scott', map_location: "C3-313", program_id: "CS001", intake: "2022", acc_id: "STU013" },
      { student_id: 'STU014', name: 'Nancy Drew', map_location: "D4-414", program_id: "IT001", intake: "2022", acc_id: "STU014" },
      { student_id: 'STU015', name: 'Oscar Isaac', map_location: "A1-115", program_id: "CS001", intake: "2022", acc_id: "STU015" },
      { student_id: 'STU016', name: 'Pam Beesly', map_location: "B2-216", program_id: "IT001", intake: "2022", acc_id: "STU016" },
      { student_id: 'STU017', name: 'Quinn Fabray', map_location: "C3-317", program_id: "CS001", intake: "2022", acc_id: "STU017" },
      { student_id: 'STU018', name: 'Rachel Green', map_location: "D4-418", program_id: "IT001", intake: "2022", acc_id: "STU018" },
      { student_id: 'STU019', name: 'Sasha Gilmore', map_location: "A1-119", program_id: "CS001", intake: "2022", acc_id: "STU019" },
      { student_id: 'STU020', name: 'Toby Flenderson', map_location: "B2-220", program_id: "IT001", intake: "2022", acc_id: "STU020" }, 
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('student', null, {});
  }
};
