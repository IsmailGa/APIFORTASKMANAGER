'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Columns', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      color: {
        type: Sequelize.STRING,
        defaultValue: '#e2e8f0'
      },
      position: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      maxCards: {
        type: Sequelize.INTEGER
      },
      settings: {
        type: Sequelize.JSON
      },
      boardId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Boards',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Columns');
  }
}; 