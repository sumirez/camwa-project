'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('iam', {
      acc_id: {
        type: Sequelize.STRING(100),
        primaryKey: true,
      },
      username: {
        type: Sequelize.STRING(45),
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      role: {
        type: Sequelize.STRING(45),
        allowNull: false,
      },
      refresh_token: {
        type: Sequelize.TEXT,
        allowNull: true
      }
    });
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('iam');
  }
};
