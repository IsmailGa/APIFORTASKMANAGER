'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add new columns to Users table
    await queryInterface.addColumn('Users', 'email', {
      type: Sequelize.STRING,
      unique: true
    });

    await queryInterface.addColumn('Users', 'avatar', {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn('Users', 'settings', {
      type: Sequelize.JSON,
      defaultValue: {}
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove added columns
    await queryInterface.removeColumn('Users', 'email');
    await queryInterface.removeColumn('Users', 'avatar');
    await queryInterface.removeColumn('Users', 'settings');
  }
}; 