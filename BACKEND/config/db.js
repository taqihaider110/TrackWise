const { Sequelize } = require('sequelize');
const config = require('./config'); // Importing config for environments
require('dotenv').config(); // Ensure that environment variables are loaded

// Determine the current environment (production or development)
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env]; // Get configuration based on environment

// Initialize Sequelize instance using environment variables
const sequelize = new Sequelize(
  dbConfig.database,      // Database Name from .env file
  dbConfig.username,      // User from .env file
  dbConfig.password,      // Password from .env file
  {
    host: dbConfig.host,   // Host from config
    port: dbConfig.port || 5432, // Port from config (default to 5432)
    dialect: dbConfig.dialect,     // Database dialect (postgres in your case)
    logging: false,          // Disable logging in production
    dialectOptions: dbConfig.dialectOptions || {},
  }
);

// Function to connect to the database
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

// Export the sequelize instance and connectDB function
module.exports = { sequelize, connectDB };
