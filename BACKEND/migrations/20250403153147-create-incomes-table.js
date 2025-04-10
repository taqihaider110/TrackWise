module.exports = {
  async up (queryInterface, Sequelize) {
    // Create the 'incomes' table (lowercase)
    await queryInterface.createTable('Incomes', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true, // Primary key for the table
      },
      source: {
        type: Sequelize.STRING,
        allowNull: false, // 'source' cannot be null
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false, // 'amount' cannot be null
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false, // 'date' cannot be null
      },
      category: {
        type: Sequelize.STRING,
        allowNull: true, // 'category' is optional
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false, // Linking income to a user (assuming user is authenticated)
        references: {
          model: 'Users', // This links the income to the Users table
          key: 'id',
        },
        onDelete: 'CASCADE', // Delete all incomes associated with a user when the user is deleted
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Automatically set to current time
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW, // Automatically set to current time
      },
    });
  },

  async down (queryInterface, Sequelize) {
    // Drop the 'incomes' table (lowercase)
    await queryInterface.dropTable('incomes');
  }
};
