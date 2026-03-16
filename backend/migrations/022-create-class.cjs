'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('class', {
      class_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      intake_module_id: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: 'intake_module',
          key: 'intake_module_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      class_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      class_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      start_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      end_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      lecturer_id: {
        type: Sequelize.STRING(20),
        allowNull: false,
        references: {
          model: 'lecturer',
          key: 'lecturer_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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

    await queryInterface.addIndex('class', ['intake_module_id']);
    await queryInterface.addIndex('class', ['lecturer_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('class');
  }
};
