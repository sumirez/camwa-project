'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('course', {
      course_id: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      program_id: {
        type: Sequelize.STRING(20),
        allowNull: false,
        references: {
          model: 'program',
          key: 'program_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      curriculum_year: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });

    await queryInterface.addIndex('course', ['program_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('course');
  }
};
