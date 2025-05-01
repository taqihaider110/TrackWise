'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Goals', [
      {
        userId: 1,
        title: 'Buy a New Laptop',
        targetAmount: 150000,
        deadline: '2025-07-01',
        description: 'Saving to purchase a high-performance laptop for development.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        title: 'Vacation in Turkey',
        targetAmount: 250000,
        deadline: '2025-12-15',
        description: 'Trip with family during winter holidays.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        title: 'Emergency Fund',
        targetAmount: 100000,
        deadline: '2025-08-31',
        description: 'For unexpected medical or job-related expenses.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Goals', null, {});
  }
};
