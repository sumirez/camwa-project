'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('student', null, {});
    return queryInterface.bulkInsert('student', [
      { student_id: "STU001", name: "Alice Johnson", map_location: "A1-101", program_id: "PROG001", intake: "2023", acc_id: "STU001" },
      { student_id: "STU002", name: "Bob Wilson", map_location: "B2-202", program_id: "PROG002", intake: "2023", acc_id: "STU002" },
      { student_id: "STU003", name: "Charlie Davis", map_location: "A1-103", program_id: "PROG001", intake: "2023", acc_id: "STU003" },
      { student_id: "STU004", name: "Diana Prince", map_location: "B2-204", program_id: "PROG002", intake: "2023", acc_id: "STU004" },
      { student_id: "STU005", name: "Ethan Hunt", map_location: "C3-305", program_id: "PROG001", intake: "2023", acc_id: "STU005" },
      { "student_id": "STU006", "name": "Fiona Gallagher", "map_location": "D4-406", "program_id": "PROG002", "intake": "2023", "acc_id": "STU006" },
      { "student_id": "STU007", "name": "George Miller", "map_location": "A1-107", "program_id": "PROG001", "intake": "2023", "acc_id": "STU007" },
      { "student_id": "STU008", "name": "Hannah Abbott", "map_location": "B2-208", "program_id": "PROG002", "intake": "2023", "acc_id": "STU008" },
      { "student_id": "STU009", "name": "Ian Wright", "map_location": "C3-309", "program_id": "PROG001", "intake": "2023", "acc_id": "STU009" },
      { "student_id": "STU010", "name": "Julia Roberts", "map_location": "D4-410", "program_id": "PROG002", "intake": "2023", "acc_id": "STU010" },
      { "student_id": "STU011", "name": "Kevin Hart", "map_location": "A1-111", "program_id": "PROG001", "intake": "2023", "acc_id": "STU011" },
      { "student_id": "STU012", "name": "Laura Palmer", "map_location": "B2-212", "program_id": "PROG002", "intake": "2023", "acc_id": "STU012" },
      { "student_id": "STU013", "name": "Michael Scott", "map_location": "C3-313", "program_id": "PROG001", "intake": "2023", "acc_id": "STU013" },
      { "student_id": "STU014", "name": "Nancy Drew", "map_location": "D4-414", "program_id": "PROG002", "intake": "2023", "acc_id": "STU014" },
      { "student_id": "STU015", "name": "Oscar Isaac", "map_location": "A1-115", "program_id": "PROG001", "intake": "2023", "acc_id": "STU015" },
      { "student_id": "STU016", "name": "Pam Beesly", "map_location": "B2-216", "program_id": "PROG002", "intake": "2023", "acc_id": "STU016" },
      { "student_id": "STU017", "name": "Quentin Tarantino", "map_location": "C3-317", "program_id": "PROG001", "intake": "2023", "acc_id": "STU017" },
      { "student_id": "STU018", "name": "Riley Reid", "map_location": "D4-418", "program_id": "PROG002", "intake": "2023", "acc_id": "STU018" },
      { "student_id": "STU019", "name": "Steven Strange", "map_location": "A1-119", "program_id": "PROG001", "intake": "2023", "acc_id": "STU019" },
      { "student_id": "STU020", "name": "Tina Fey", "map_location": "B2-220", "program_id": "PROG002", "intake": "2023", "acc_id": "STU020" },
      { "student_id": "STU021", "name": "Uma Thurman", "map_location": "C3-321", "program_id": "PROG001", "intake": "2023", "acc_id": "STU021" },
      { "student_id": "STU022", "name": "Victor Von Doom", "map_location": "D4-422", "program_id": "PROG002", "intake": "2023", "acc_id": "STU022" },
      { "student_id": "STU023", "name": "Wanda Maximoff", "map_location": "A1-123", "program_id": "PROG001", "intake": "2023", "acc_id": "STU023" },
      { "student_id": "STU024", "name": "Xavier Renegade", "map_location": "B2-224", "program_id": "PROG002", "intake": "2023", "acc_id": "STU024" },
      { "student_id": "STU025", "name": "Yara Greyjoy", "map_location": "C3-325", "program_id": "PROG001", "intake": "2023", "acc_id": "STU025" },
      { "student_id": "STU026", "name": "Zane Grey", "map_location": "D4-426", "program_id": "PROG002", "intake": "2023", "acc_id": "STU026" },
      { "student_id": "STU027", "name": "Arthur Morgan", "map_location": "A1-127", "program_id": "PROG001", "intake": "2023", "acc_id": "STU027" },
      { "student_id": "STU028", "name": "Billie Eilish", "map_location": "B2-228", "program_id": "PROG002", "intake": "2023", "acc_id": "STU028" },
      { "student_id": "STU029", "name": "Chris Pratt", "map_location": "C3-329", "program_id": "PROG001", "intake": "2023", "acc_id": "STU029" },
      { "student_id": "STU030", "name": "Daisy Ridley", "map_location": "D4-430", "program_id": "PROG002", "intake": "2023", "acc_id": "STU030" },
      { "student_id": "STU031", "name": "Elon Musk", "map_location": "A1-131", "program_id": "PROG001", "intake": "2023", "acc_id": "STU031" },
      { "student_id": "STU032", "name": "Frank Ocean", "map_location": "B2-232", "program_id": "PROG002", "intake": "2023", "acc_id": "STU032" },
      { "student_id": "STU033", "name": "Gwen Stacy", "map_location": "C3-333", "program_id": "PROG001", "intake": "2023", "acc_id": "STU033" },
      { "student_id": "STU034", "name": "Harry Potter", "map_location": "D4-434", "program_id": "PROG002", "intake": "2023", "acc_id": "STU034" },
      { "student_id": "STU035", "name": "Iris West", "map_location": "A1-135", "program_id": "PROG001", "intake": "2023", "acc_id": "STU035" },
      { "student_id": "STU036", "name": "Jack Sparrow", "map_location": "B2-236", "program_id": "PROG002", "intake": "2023", "acc_id": "STU036" },
      { "student_id": "STU037", "name": "Kate Bishop", "map_location": "C3-337", "program_id": "PROG001", "intake": "2023", "acc_id": "STU037" },
      { "student_id": "STU038", "name": "Luke Skywalker", "map_location": "D4-438", "program_id": "PROG002", "intake": "2023", "acc_id": "STU038" },
      { "student_id": "STU039", "name": "Mary Jane", "map_location": "A1-139", "program_id": "PROG001", "intake": "2023", "acc_id": "STU039" },
      { "student_id": "STU040", "name": "Ned Stark", "map_location": "B2-240", "program_id": "PROG002", "intake": "2023", "acc_id": "STU040" }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('student', null, {});
  }
};
