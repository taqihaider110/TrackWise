'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Create the 'Users' table
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true, // Set the 'id' as the primary key
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false, // 'username' cannot be null
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false, // 'email' cannot be null
        unique: true, // Ensure email is unique
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false, // 'password' cannot be null
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
    // Drop the 'Users' table if rolling back the migration
    await queryInterface.dropTable('Users');
  }
};
