'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Create the 'Expenses' table
    await queryInterface.createTable('Expenses', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true, // Primary key for the table
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false, // 'category' cannot be null
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false, // 'amount' cannot be null
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false, // 'date' cannot be null
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true, // 'description' can be null
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false, // Linking expense to a user (assuming the user is authenticated)
        references: {
          model: 'Users', // This links the expense to the Users table
          key: 'id',
        },
        onDelete: 'CASCADE', // Delete all expenses associated with a user when the user is deleted
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
    // Drop the 'Expenses' table if rolling back the migration
    await queryInterface.dropTable('Expenses');
  }
};
