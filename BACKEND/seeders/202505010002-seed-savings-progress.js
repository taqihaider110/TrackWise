'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('SavingsProgress', [
      {
        goalId: 1,
        userId: 1, // Added userId for association
        savedAmount: 30000,
        date: '2025-04-01',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        goalId: 1,
        userId: 1, // Added userId for association
        savedAmount: 20000,
        date: '2025-04-15',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        goalId: 2,
        userId: 1, // Added userId for association
        savedAmount: 50000,
        date: '2025-03-25',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        goalId: 3,
        userId: 2, // Added userId for association
        savedAmount: 25000,
        date: '2025-03-30',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        goalId: 3,
        userId: 2, // Added userId for association
        savedAmount: 15000,
        date: '2025-04-10',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('SavingsProgress', null, {});
  }
};
