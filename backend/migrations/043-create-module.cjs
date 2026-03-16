'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.createTable('module', {
      module_id: {
        type: Sequelize.STRING(36),
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(50),
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
      program_id: {
        type: Sequelize.STRING(20),
        allowNull: false,
        references: {
          model: 'program',      
          key: 'program_id'      
        },
        onUpdate: 'CASCADE',     
        onDelete: 'CASCADE',     
      },
      intake: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'intake',       
          key: 'year'            
        },
        onUpdate: 'CASCADE',     
        onDelete: 'CASCADE',     
      },
      semester_id: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: 'semester',      
          key: 'sem_id'      
        },
        onUpdate: 'CASCADE',     
        onDelete: 'CASCADE',     
      },
      camera_path: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
    });
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('module');
  }
};
