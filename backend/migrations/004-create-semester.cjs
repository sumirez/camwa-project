'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.createTable('semester', {
      sem_id: {
        type: Sequelize.STRING(36),
        primaryKey: true
      },
      sem_type: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_date: {
        type: Sequelize.DATE
      }
    });
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('semester');
  }
};
