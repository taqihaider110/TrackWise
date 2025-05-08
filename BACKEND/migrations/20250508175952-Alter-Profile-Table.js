'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove columns
    await queryInterface.removeColumn('Profiles', 'gender');
    await queryInterface.removeColumn('Profiles', 'initialIncome');
    await queryInterface.removeColumn('Profiles', 'initialExpense');
    await queryInterface.removeColumn('Profiles', 'full_name');

    // Alter phone_no to be NOT NULL
    await queryInterface.changeColumn('Profiles', 'phone_no', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Add columns back
    await queryInterface.addColumn('Profiles', 'gender', {
      type: Sequelize.ENUM('Male', 'Female', 'Other'),
      allowNull: false,
    });

    await queryInterface.addColumn('Profiles', 'initialIncome', {
      type: Sequelize.FLOAT,
      allowNull: false,
    });

    await queryInterface.addColumn('Profiles', 'initialExpense', {
      type: Sequelize.FLOAT,
      allowNull: false,
    });

    await queryInterface.addColumn('Profiles', 'full_name', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Revert phone_no to allow null (if needed)
    await queryInterface.changeColumn('Profiles', 'phone_no', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
