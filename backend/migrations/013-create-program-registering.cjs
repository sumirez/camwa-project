'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('program_registering', {
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
      program_id: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        references: {
          model: 'program',
          key: 'program_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      intake: {
        type: Sequelize.INTEGER,
        references: {
          model: 'intake',
          key: 'year'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('program_registering');
  }
};
