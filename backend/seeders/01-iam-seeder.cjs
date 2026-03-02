'use strict';
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    const hashedLecturerPassword = await bcrypt.hash('lecturer123', salt);
    const hashedStudentPassword = await bcrypt.hash('student123', salt);
    const hashedFacultyPassword = await bcrypt.hash('faculty123', salt);

    await queryInterface.bulkDelete('iam', null, {});
    return queryInterface.bulkInsert('iam', [
      {
        acc_id: 'ADMIN001',
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN'
      },
      {
        acc_id: 'LEC001',
        username: 'lecturer1',
        email: 'lecturer1@example.com',
        password: hashedLecturerPassword,
        role: 'LECTURER'
      },
      {
        acc_id: 'LEC002',
        username: 'lecturer2',
        email: 'lecturer2@example.com',
        password: hashedLecturerPassword,
        role: 'LECTURER'
      },
      {
        acc_id: 'STU001',
        username: 'student1',
        email: 'student1@example.com',
        password: hashedStudentPassword,
        role: 'STUDENT'
      },
      {
        acc_id: 'STU002',
        username: 'student2',
        email: 'student2@example.com',
        password: hashedStudentPassword,
        role: 'STUDENT'
      },
      {
        acc_id: 'FAC001',
        username: 'faculty1',
        email: 'faculty1@example.com',
        password: hashedFacultyPassword,
        role: 'FACULTY'
      },
      {
        acc_id: 'FAC002',
        username: 'faculty2',
        email: 'faculty2@example.com',
        password: hashedFacultyPassword,
        role: 'FACULTY'
      },
      { "acc_id": "STU003", "username": "student3", "email": "student3@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU004", "username": "student4", "email": "student4@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU005", "username": "student5", "email": "student5@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU006", "username": "student6", "email": "student6@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU007", "username": "student7", "email": "student7@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU008", "username": "student8", "email": "student8@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU009", "username": "student9", "email": "student9@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU010", "username": "student10", "email": "student10@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU011", "username": "student11", "email": "student11@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU012", "username": "student12", "email": "student12@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU013", "username": "student13", "email": "student13@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU014", "username": "student14", "email": "student14@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU015", "username": "student15", "email": "student15@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU016", "username": "student16", "email": "student16@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU017", "username": "student17", "email": "student17@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU018", "username": "student18", "email": "student18@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU019", "username": "student19", "email": "student19@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU020", "username": "student20", "email": "student20@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU021", "username": "student21", "email": "student21@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU022", "username": "student22", "email": "student22@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU023", "username": "student23", "email": "student23@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU024", "username": "student24", "email": "student24@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU025", "username": "student25", "email": "student25@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU026", "username": "student26", "email": "student26@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU027", "username": "student27", "email": "student27@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU028", "username": "student28", "email": "student28@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU029", "username": "student29", "email": "student29@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU030", "username": "student30", "email": "student30@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU031", "username": "student31", "email": "student31@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU032", "username": "student32", "email": "student32@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU033", "username": "student33", "email": "student33@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU034", "username": "student34", "email": "student34@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU035", "username": "student35", "email": "student35@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU036", "username": "student36", "email": "student36@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU037", "username": "student37", "email": "student37@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU038", "username": "student38", "email": "student38@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU039", "username": "student39", "email": "student39@example.com", "password": "hashedStudentPassword", "role": "STUDENT" },
      { "acc_id": "STU040", "username": "student40", "email": "student40@example.com", "password": "hashedStudentPassword", "role": "STUDENT" }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('iam', null, {});
  }
};
