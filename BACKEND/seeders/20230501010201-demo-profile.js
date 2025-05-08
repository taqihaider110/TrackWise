'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Profiles', [
      {
        dob: '2003-03-08',
        userId: 1,
        firstname: 'Taqi',
        lastname: 'Haider',
        phone_no: '1234567890',
        country: 'Pakistan',
        state: 'Sindh',
        city: 'Karachi',
        full_address: '123 Main St, Karachi, Sindh, Pakistan',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        dob: '2002-02-08',
        userId: 2,
        firstname: 'Wajih-ur',
        lastname: 'Rehman',
        phone_no: '9876543210',
        country: 'Pakistan',
        state: 'Punjab',
        city: 'Lahore',
        full_address: '456 Another St, Lahore, Punjab, Pakistan',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Profiles', null, {});
  },
};
