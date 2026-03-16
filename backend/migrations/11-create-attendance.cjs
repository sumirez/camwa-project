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
      module_id: {
        type: Sequelize.STRING(36),
        references: {
          model: 'module',
          key: 'module_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      attendance_status: {
        type: Sequelize.ENUM('present', 'absent', 'late', 'excused'),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });

    // Add indexes for performance
    await queryInterface.addIndex('attendance', ['student_id']);
    await queryInterface.addIndex('attendance', ['module_id']);
  }, down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('attendance');
  }
};