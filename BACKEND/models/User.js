const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {  // Add email field
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,  // Optionally ensure the email is unique
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Add other fields as needed
});

module.exports = User;
