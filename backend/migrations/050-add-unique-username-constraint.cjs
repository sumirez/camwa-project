'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add unique constraint to username field in iam table
    await queryInterface.addConstraint('iam', {
      fields: ['username'],
      type: 'unique',
      name: 'unique_username_constraint'
    });
  },
  
  down: async (queryInterface, Sequelize) => {
    // Remove the unique constraint
    await queryInterface.removeConstraint('iam', 'unique_username_constraint');
  }
};
