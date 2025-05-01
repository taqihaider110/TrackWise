'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Incomes', [
      {
        source: 'Salary',
        amount: 50000,
        date: '2025-03-01',
        category: 'Job',
        userId: 1, // Reference to your user
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        source: 'Freelance',
        amount: 10000,
        date: '2025-03-05',
        category: 'Freelance',
        userId: 2, // Reference to John Doe's user
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        source: 'Salary',
        amount: 52000,
        date: '2025-03-15',
        category: 'Job',
        userId: 1, // Reference to your user
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        source: 'Freelance',
        amount: 8000,
        date: '2025-03-18',
        category: 'Freelance',
        userId: 2, // Reference to John Doe's user
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        source: 'Bonus',
        amount: 5000,
        date: '2025-03-22',
        category: 'Job',
        userId: 1, // Reference to your user
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        source: 'Salary',
        amount: 51000,
        date: '2025-04-01',
        category: 'Job',
        userId: 1, // Reference to your user
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        source: 'Freelance',
        amount: 12000,
        date: '2025-04-05',
        category: 'Freelance',
        userId: 2, // Reference to John Doe's user
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        source: 'Freelance',
        amount: 7500,
        date: '2025-04-10',
        category: 'Freelance',
        userId: 2, // Reference to John Doe's user
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        source: 'Salary',
        amount: 53000,
        date: '2025-04-15',
        category: 'Job',
        userId: 1, // Reference to your user
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        source: 'Freelance',
        amount: 9500,
        date: '2025-04-20',
        category: 'Freelance',
        userId: 2, // Reference to John Doe's user
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Incomes', null, {});
  },
};
