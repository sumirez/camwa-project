'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('exam', {
      exam_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      module_id: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: 'module',
          key: 'module_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      student_id: {
        type: Sequelize.STRING(20),
        allowNull: false,
        references: {
          model: 'student',
          key: 'student_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      attendance_rate: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        validate: {
          min: 0,
          max: 100
        }
      },
      is_eligible: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    });    try {
      // Note: Removed automatic trigger since exam eligibility will now only be
      // calculated on-demand via admin API endpoints
      
      // Add indexes individually to better handle errors
      await queryInterface.addIndex('exam', {
        fields: ['student_id'], 
        name: 'exam_student_id_idx'
      });
      
      await queryInterface.addIndex('exam', {
        fields: ['module_id'], 
        name: 'exam_module_id_idx'
      });
      
      await queryInterface.addIndex('exam', {
        fields: ['is_eligible'],
        name: 'exam_is_eligible_idx'
      });
    } catch (error) {
      console.error('Error in migration:', error);
      // Continue the migration even if the index creation fails
      // This will allow us to fix it later
    }
  },  async down(queryInterface, Sequelize) {
    try {
      // Triggers and functions have been removed from the up method
      // No need to drop them here
      
      // Drop the indexes
      await queryInterface.removeIndex('exam', 'exam_student_id_idx');
      await queryInterface.removeIndex('exam', 'exam_module_id_idx');
      await queryInterface.removeIndex('exam', 'exam_is_eligible_idx');
    } catch (error) {
      console.error('Error removing indexes or triggers:', error);
      // Continue even if there are errors
    }
    
    // Then drop the table
    await queryInterface.dropTable('exam');
  }
};
