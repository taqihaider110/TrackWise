'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop the existing SavingsProgress table
    await queryInterface.dropTable('SavingsProgress');

    // Create the new SavingsProgress table
    await queryInterface.createTable('SavingsProgress', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      goalId: {
        type: Sequelize.INTEGER,
        allowNull: true,  // Now optional
        references: {
          model: 'Goals',
          key: 'id',
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',  // Reference to Users table
          key: 'id',
        },
      },
      month: {
        type: Sequelize.STRING,  // e.g., "2025-05"
        allowNull: false,
      },
      totalIncome: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      totalExpense: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      savings: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
    
    // Adding a unique constraint to userId and month
    await queryInterface.addConstraint('SavingsProgress', {
      fields: ['userId', 'month'],
      type: 'unique',
      name: 'unique_user_month_constraint'
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop the newly created SavingsProgress table
    await queryInterface.dropTable('SavingsProgress');
  }
};
