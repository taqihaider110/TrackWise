'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword1 = await bcrypt.hash('Hallo123$', 10);
    const hashedPassword2 = await bcrypt.hash('Hallo123$', 10);

    await queryInterface.bulkInsert('Users', [
      {
        username: 'taqihaider',
        email: 'taqihaider@yopmail.com',
        password: hashedPassword1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'wajih-ur-rehman',
        email: 'wajih@example.com',
        password: hashedPassword2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
