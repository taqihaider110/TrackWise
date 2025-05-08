'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Profiles', [
      {
        full_name: 'Taqi Haider',
        gender: 'Male',
        dob: '2003-03-08', // Replace with a realistic date of birth
        initialIncome: 50000, // Example initial income
        initialExpense: 20000, // Example initial expense
        userId: 1, // Assuming this corresponds to the first user created
        firstname: 'Taqi',
        lastname: 'Haider',
        phone_no: '1234567890', // Example phone number
        country: 'Pakistan', // Example country
        state: 'Sindh', // Example state
        city: 'Karachi', // Example city
        full_address: '123 Main St, Karachi, Sindh, Pakistan', // Example address
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        full_name: 'Wajih-ur-Rehman',
        gender: 'Male',
        dob: '2002-02-08',
        initialIncome: 60000,
        initialExpense: 25000,
        userId: 2, // Corresponding to the second user
        firstname: 'Wajih-ur',
        lastname: 'Rehman',
        phone_no: '9876543210', // Example phone number
        country: 'Pakistan', // Example country
        state: 'Punjab', // Example state
        city: 'Lahore', // Example city
        full_address: '456 Another St, Lahore, Punjab, Pakistan', // Example address
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Profiles', null, {});
  },
};
