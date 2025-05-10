'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('SavingsProgress', [
      {
        userId: 1, // Added userId for association
        month: '2025-04',  // Month field added
        totalIncome: 50000, // Example total income
        totalExpense: 20000, // Example total expense
        savings: 30000, // Example savings
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1, // Added userId for association
        month: '2025-04',  // Month field added
        totalIncome: 50000, // Example total income
        totalExpense: 20000, // Example total expense
        savings: 20000, // Example savings
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1, // Added userId for association
        month: '2025-03',  // Month field added
        totalIncome: 70000, // Example total income
        totalExpense: 20000, // Example total expense
        savings: 50000, // Example savings
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2, // Added userId for association
        month: '2025-03',  // Month field added
        totalIncome: 60000, // Example total income
        totalExpense: 35000, // Example total expense
        savings: 25000, // Example savings
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2, // Added userId for association
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
    await queryInterface.bulkDelete('SavingsProgress', null, {});
  }
};
