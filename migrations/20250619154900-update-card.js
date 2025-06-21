'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add new columns to Cards table
    await queryInterface.addColumn('Cards', 'priority', {
      type: Sequelize.ENUM('low', 'medium', 'high', 'urgent'),
      defaultValue: 'medium'
    });

    await queryInterface.addColumn('Cards', 'position', {
      type: Sequelize.INTEGER,
      defaultValue: 1
    });

    await queryInterface.addColumn('Cards', 'labels', {
      type: Sequelize.JSON,
      defaultValue: []
    });

    await queryInterface.addColumn('Cards', 'assignees', {
      type: Sequelize.JSON,
      defaultValue: []
    });

    await queryInterface.addColumn('Cards', 'attachments', {
      type: Sequelize.JSON,
      defaultValue: []
    });

    await queryInterface.addColumn('Cards', 'boardId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Boards',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addColumn('Cards', 'columnId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Columns',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Change caption field type from STRING to TEXT
    await queryInterface.changeColumn('Cards', 'caption', {
      type: Sequelize.TEXT
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove added columns
    await queryInterface.removeColumn('Cards', 'priority');
    await queryInterface.removeColumn('Cards', 'position');
    await queryInterface.removeColumn('Cards', 'labels');
    await queryInterface.removeColumn('Cards', 'assignees');
    await queryInterface.removeColumn('Cards', 'attachments');
    await queryInterface.removeColumn('Cards', 'boardId');
    await queryInterface.removeColumn('Cards', 'columnId');

    // Revert caption field type back to STRING
    await queryInterface.changeColumn('Cards', 'caption', {
      type: Sequelize.STRING
    });
  }
}; 