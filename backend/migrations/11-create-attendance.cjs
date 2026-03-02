'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.createTable('attendance', {
      attendance_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      student_id: {
        type: Sequelize.STRING(20),
        references: {
          model: 'student',  
          key: 'student_id'  
        },
        onUpdate: 'CASCADE', 
        onDelete: 'SET NULL', 
      },
      intake_module_id: {
        type: Sequelize.STRING(36),
        references: {
          model: 'intake_module',
          key: 'intake_module_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      class_id: {
        type: Sequelize.STRING(36),
        references: {
          model: 'class',
          key: 'class_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      class_date: {
        type: Sequelize.DATE,
      },
      attendance_status: {
        type: Sequelize.STRING(10),
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('attendance');
  }
};