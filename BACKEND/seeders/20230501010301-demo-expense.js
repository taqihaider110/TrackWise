'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Expenses', [
      {
        userId: 1, // Reference to your user
        amount: 2000,
        category: 'Food',
        description: 'Grocery shopping at Walmart',
        date: '2025-03-15',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1, // Reference to your user
        amount: 100,
        category: 'Transportation',
        description: 'Uber ride to work',
        date: '2025-03-18',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1, // Reference to your user
        amount: 500,
        category: 'Utilities',
        description: 'Electricity bill payment',
        date: '2025-03-20',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1, // Reference to your user
        amount: 150,
        category: 'Entertainment',
        description: 'Netflix subscription',
        date: '2025-03-25',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1, // Reference to your user
        amount: 250,
        category: 'Food',
        description: 'Dining out at a restaurant',
        date: '2025-04-01',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2, // Reference to the second user (John Doe)
        amount: 1000,
        category: 'Travel',
        description: 'Flight to New York',
        date: '2025-03-05',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2, // Reference to the second user (John Doe)
        amount: 200,
        category: 'Food',
        description: 'Lunch at a café',
        date: '2025-03-10',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2, // Reference to the second user (John Doe)
        amount: 700,
        category: 'Entertainment',
        description: 'Concert tickets',
        date: '2025-03-12',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2, // Reference to the second user (John Doe)
        amount: 350,
        category: 'Transportation',
        description: 'Public transit monthly pass',
        date: '2025-03-15',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2, // Reference to the second user (John Doe)
        amount: 600,
        category: 'Utilities',
        description: 'Water and gas bill',
        date: '2025-04-03',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Expenses', null, {});
  },
};
