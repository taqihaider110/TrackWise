const { sequelize } = require("../config/db"); // Import sequelize from config
const { DataTypes } = require("sequelize");
const User = require("./User"); // Assuming you have a User model

const Income = sequelize.define("Incomes", { // Keep 'Income' for the model name
  source: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: { // Foreign key to User model
    type: DataTypes.INTEGER,
    references: {
      model: "Users", // The table name of the 'User' model
      key: "id", // The field in the 'Users' table that is being referenced
    },
    allowNull: false,
  },
}, {
  timestamps: true, // Automatically add 'createdAt' and 'updatedAt' columns
  tableName: "Incomes", // The table name will be 'incomes' in your PostgreSQL database (lowercase)
});

// Define association: One User has many Incomes
User.hasMany(Income, { foreignKey: "userId" });
Income.belongsTo(User, { foreignKey: "userId" });

module.exports = Income;