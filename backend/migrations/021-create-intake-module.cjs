'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('intake_module', {
      intake_module_id: {
        type: Sequelize.STRING(36),
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      capacity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      ects: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
      course_id: {
        type: Sequelize.STRING(20),
        allowNull: false,
        references: {
          model: 'course',
          key: 'course_id'
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

    await queryInterface.addIndex('intake_module', ['lecturer_id']);
    await queryInterface.addIndex('intake_module', ['program_id']);
    await queryInterface.addIndex('intake_module', ['course_id']);
    await queryInterface.addIndex('intake_module', ['semester_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('intake_module');
  }
};
