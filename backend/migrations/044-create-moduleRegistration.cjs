'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.createTable('module_registration', {
      module_reg_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      student_id: {
        type: Sequelize.STRING(20),
        allowNull: false,
        references: {
          model: 'student',      
          key: 'student_id'      
        },
        onUpdate: 'CASCADE',     
        onDelete: 'CASCADE',     
      },
      module_id: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: 'module',      
          key: 'module_id'      
        },
        onUpdate: 'CASCADE',     
        onDelete: 'CASCADE',     
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
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('module_registration');
  }
};
