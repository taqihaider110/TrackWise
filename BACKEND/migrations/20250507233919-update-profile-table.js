'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Profiles', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      full_name: { // Changed from 'name' to 'full_name'
        type: Sequelize.STRING,
        allowNull: false,
      },
      gender: {
        type: Sequelize.ENUM('Male', 'Female', 'Other'),
        allowNull: false,
      },
      dob: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      initialIncome: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      initialExpense: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Correct reference to the Users table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: false,  // Non-nullable as it's a critical field
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: false,  // Non-nullable as it's a critical field
      },
      phone_no: {
        type: Sequelize.STRING,
        allowNull: false,  // Non-nullable as it's a critical field
      },
      country: {
        type: Sequelize.STRING,
        allowNull: true,  // Nullable as it's optional
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true,  // Nullable as it's optional
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,  // Nullable as it's optional
      },
      full_address: {
        type: Sequelize.STRING,
        allowNull: true,  // Nullable as it's optional
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Profiles');
  }
};
