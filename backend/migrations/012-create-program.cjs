'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.createTable('program', {
      program_id: {
        type: Sequelize.STRING(20),
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(50),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('program');
  }
};