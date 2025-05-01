'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Profiles', [
      {
        name: 'Taqi Haider',
        gender: 'Male',
        dob: '2003-03-08', // Replace with a realistic date of birth
        initialIncome: 50000, // Example initial income
        initialExpense: 20000, // Example initial expense
        userId: 1, // Assuming this corresponds to the first user created
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Wajih-ur-Rehman',
        gender: 'Male',
        dob: '2002-02-08',
        initialIncome: 60000,
        initialExpense: 25000,
        userId: 2, // Corresponding to the second user
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Profiles', null, {});
  },
};
