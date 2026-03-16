'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('student_intake_module', {
      student_id: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        references: {
          model: 'student',
          key: 'student_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      intake_module_id: {
        type: Sequelize.STRING(36),
        primaryKey: true,
        references: {
          model: 'intake_module',
          key: 'intake_module_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      enrollment_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('student_intake_module');
  }
};
