'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Create the 'Goals' table
    await queryInterface.createTable('Goals', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true, // Set the 'id' as the primary key
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Assuming you have a Users table
          key: 'id',
        },
        onDelete: 'CASCADE', // Cascade delete when a user is deleted
      },
      target: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false, // The 'target' value cannot be null
      },
      deadline: {
        type: Sequelize.DATE,
        allowNull: true, // Deadline can be null if not provided
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Automatically set to current time
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Automatically set to current time
      },
    });
  },

  async down (queryInterface, Sequelize) {
    // Drop the 'Goals' table if rolling back the migration
    await queryInterface.dropTable('Goals');
  }
};
