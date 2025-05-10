'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('SavingsProgress', [
      {
        userId: 1, // Assumes userId 1 already exists in the Users table
        month: '2025-04',  // Month field added
        totalIncome: 50000, // Example total income
        totalExpense: 20000, // Example total expense
        savings: 30000, // Example savings
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1, // Assumes userId 1 already exists in the Users table
        month: '2025-04',  // Month field added
        totalIncome: 50000, // Example total income
        totalExpense: 20000, // Example total expense
        savings: 20000, // Example savings
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1, // Assumes userId 1 already exists in the Users table
        month: '2025-03',  // Month field added
        totalIncome: 70000, // Example total income
        totalExpense: 20000, // Example total expense
        savings: 50000, // Example savings
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2, // Assumes userId 2 already exists in the Users table
        month: '2025-03',  // Month field added
        totalIncome: 60000, // Example total income
        totalExpense: 35000, // Example total expense
        savings: 25000, // Example savings
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2, // Assumes userId 2 already exists in the Users table
        month: '2025-04',  // Month field added
        totalIncome: 60000, // Example total income
        totalExpense: 45000, // Example total expense
        savings: 15000, // Example savings
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Deletes all the data from SavingsProgress table
    await queryInterface.bulkDelete('SavingsProgress', null, {});
  }
};
