'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.createTable('notification', {
      notification_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sender_id: {
        type: Sequelize.STRING(20),
        references: {
          model: 'iam',        
          key: 'acc_id'        
        },
        onUpdate: 'CASCADE',   
        onDelete: 'SET NULL',  
      },
      receiver_id: {
        type: Sequelize.STRING(20),
        references: {
          model: 'student',     
          key: 'student_id'     
        },
        onUpdate: 'CASCADE',   
        onDelete: 'SET NULL',  
      },
      notification_type: {
        type: Sequelize.STRING(50),
      },
      notification_text: {
        type: Sequelize.TEXT,
      },
      notification_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      status: {
        type: Sequelize.STRING(10),
        defaultValue: 'unread',
        validate: {
          isIn: [['unread', 'read']],
        },
      },
      module_id: {
        type: Sequelize.STRING(36),
        references: {
          model: 'intake_module',      
          key: 'intake_module_id'      
        },
        onUpdate: 'CASCADE',   
        onDelete: 'CASCADE',  
      },
      priority: {
        type: Sequelize.INTEGER,
        defaultValue: 0,      
      },
      is_critical: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      read_by_receiver: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    });

    // Create indexes
    await queryInterface.addIndex('notification', ['receiver_id']);
    await queryInterface.addIndex('notification', ['status']);
    await queryInterface.addIndex('notification', ['priority']);
    await queryInterface.addIndex('notification', ['is_critical']);
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('notification');
  }
};