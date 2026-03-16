'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop the notification table if it exists
    await queryInterface.dropTable('notification');
  },

  down: async (queryInterface, Sequelize) => {
    // This would recreate the notification table, but since we're removing it completely,
    // we'll leave this empty or just return a promise
    return Promise.resolve();
  }
};
