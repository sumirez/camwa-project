'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('academic_coordinator', {
      ac_id: {
        type: Sequelize.STRING(20),
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(50),
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
        onDelete: 'SET NULL',
      },
      current_role: {
        type: Sequelize.ENUM('LECTURER', 'AC'),
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('academic_coordinator');
  }
};
