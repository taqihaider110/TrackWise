'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SavingsProgress', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      goalId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Goals',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      userId: {  // Add the userId column
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Assuming you have a Users table
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      savedAmount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SavingsProgress');
  }
};
