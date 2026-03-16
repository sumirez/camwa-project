'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.createTable('lecturer', {
      lecturer_id: {
        type: Sequelize.STRING(20),
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      program_id: {
        type: Sequelize.STRING(20),
        references: {
          model: 'program',
          key: 'program_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      iam_id: {
        type: Sequelize.STRING(20),
        allowNull: false,
        references: {
          model: 'iam',
          key: 'iam_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('lecturer');
  }
};