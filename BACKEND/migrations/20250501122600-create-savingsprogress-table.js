'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Create the 'SavingsProgresses' table
    await queryInterface.createTable('SavingsProgresses', {
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
      progress: {
        type: Sequelize.DECIMAL(5, 2), // Store percentage values
        allowNull: false,
        defaultValue: 0, // Default progress value
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
    // Drop the 'SavingsProgresses' table if rolling back the migration
    await queryInterface.dropTable('SavingsProgresses');
  }
};
