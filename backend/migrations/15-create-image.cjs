'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('image_assets', {
      image_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: Sequelize.STRING(45),
        allowNull: false
        // Note: Foreign key constraint temporarily removed due to missing unique constraint on iam.username
        // references: {
        //   model: 'iam',
        //   key: 'username'
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE'
      },
      image_path: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add index on username for better query performance
    await queryInterface.addIndex('image_assets', ['username']);
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('image_assets');
  }
};
