'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add foreign key constraint from image_assets.username to iam.username
    await queryInterface.addConstraint('image_assets', {
      fields: ['username'],
      type: 'foreign key',
      name: 'fk_image_assets_username',
      references: {
        table: 'iam',
        field: 'username'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },
  
  down: async (queryInterface, Sequelize) => {
    // Remove the foreign key constraint
    await queryInterface.removeConstraint('image_assets', 'fk_image_assets_username');
  }
};
