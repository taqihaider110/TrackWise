const { Sequelize } = require('sequelize');
require('dotenv').config(); // Ensure that environment variables are loaded

// Initialize Sequelize instance using environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME,      // Database Name from .env file
  process.env.DB_USERNAME,  // User from .env file
  process.env.DB_PASSWORD,  // Password from .env file
  {
    host: process.env.DB_HOST,   // Host from .env file
    port: process.env.DB_PORT || 5432, // Port from .env file (default to 5432)
    dialect: 'postgres',     // Database dialect (postgres in your case)
    logging: false,          // Disable logging in production
  }
);

// Function to connect to the database
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Export the sequelize instance and connectDB function
module.exports = { sequelize, connectDB };
