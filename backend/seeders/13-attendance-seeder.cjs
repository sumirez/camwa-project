'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Delete Child records first (attendance)
    await queryInterface.bulkDelete('attendance', null, {});
    
    // 2. Now you can safely insert the 40 students
    return queryInterface.bulkInsert('attendance', [
      // STU001 - STU010
      { student_id: 'STU001', intake_module_id: 'WD2023', class_id: '7a34ee3d-3fe4-49d1-8e15-3a251ddf8e5f', class_date: '2023-09-15', attendance_status: 'present', is_deleted: false },
      { student_id: 'STU002', intake_module_id: 'DB2023', class_id: '24ee01f1-25b4-43fd-a8af-071bc705311e', class_date: '2023-09-16', attendance_status: 'absent', is_deleted: false },
      { student_id: 'STU003', intake_module_id: 'WD2023', class_id: '7a34ee3d-3fe4-49d1-8e15-3a251ddf8e5f', class_date: '2023-09-15', attendance_status: 'present', is_deleted: false },
      { student_id: 'STU004', intake_module_id: 'AP2023', class_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', class_date: '2023-09-18', attendance_status: 'present', is_deleted: false },
      { student_id: 'STU005', intake_module_id: 'DB2023', class_id: '24ee01f1-25b4-43fd-a8af-071bc705311e', class_date: '2023-09-16', attendance_status: 'late', is_deleted: false },
      { student_id: 'STU006', intake_module_id: 'SA2023', class_id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8', class_date: '2023-09-20', attendance_status: 'present', is_deleted: false },
      { student_id: 'STU007', intake_module_id: 'WD2023', class_id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', class_date: '2023-09-17', attendance_status: 'absent', is_deleted: false },
      { student_id: 'STU008', intake_module_id: 'AP2023', class_id: 'ad644917-09d6-4497-8d2a-e6270e599b82', class_date: '2023-09-21', attendance_status: 'present', is_deleted: false },
      { student_id: 'STU009', intake_module_id: 'DB2023', class_id: '550e8400-e29b-41d4-a716-446655440000', class_date: '2023-09-19', attendance_status: 'present', is_deleted: false },
      { student_id: 'STU010', intake_module_id: 'SA2023', class_id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8', class_date: '2023-09-20', attendance_status: 'late', is_deleted: false },
      
      // STU011 - STU020
      { student_id: 'STU011', intake_module_id: 'WD2023', class_id: '7a34ee3d-3fe4-49d1-8e15-3a251ddf8e5f', class_date: '2023-09-15', attendance_status: 'present', is_deleted: false },
      { student_id: 'STU012', intake_module_id: 'DB2023', class_id: '24ee01f1-25b4-43fd-a8af-071bc705311e', class_date: '2023-09-16', attendance_status: 'present', is_deleted: false },
      { student_id: 'STU013', intake_module_id: 'AP2023', class_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', class_date: '2023-09-18', attendance_status: 'absent', is_deleted: false },
      { student_id: 'STU014', intake_module_id: 'AP2023', class_id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8', class_date: '2023-09-20', attendance_status: 'present', is_deleted: false },
      { student_id: 'STU015', intake_module_id: 'WD2023', class_id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', class_date: '2023-09-17', attendance_status: 'present', is_deleted: false },
      { student_id: 'STU016', intake_module_id: 'DB2023', class_id: '550e8400-e29b-41d4-a716-446655440000', class_date: '2023-09-19', attendance_status: 'late', is_deleted: false },
      { student_id: 'STU017', intake_module_id: 'AP2023', class_id: 'ad644917-09d6-4497-8d2a-e6270e599b82', class_date: '2023-09-21', attendance_status: 'present', is_deleted: false },
      { student_id: 'STU018', intake_module_id: 'WD2023', class_id: '3e449231-318e-473d-82d8-4f16b2302364', class_date: '2023-09-22', attendance_status: 'present', is_deleted: false },
      { student_id: 'STU019', intake_module_id: 'SA2023', class_id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8', class_date: '2023-09-20', attendance_status: 'absent', is_deleted: false },
      { student_id: 'STU020', intake_module_id: 'DB2023', class_id: '24ee01f1-25b4-43fd-a8af-071bc705311e', class_date: '2023-09-16', attendance_status: 'present', is_deleted: false },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('attendance', null, {});
  }
};