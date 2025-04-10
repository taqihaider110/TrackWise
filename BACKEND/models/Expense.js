const { sequelize } = require("../config/db"); // Import sequelize from config
const { DataTypes } = require("sequelize");
const User = require("./User"); // Assuming you have a User model

const Expense = sequelize.define("Expense", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Assuming "User" is the related model
      key: "id", // Foreign key references the "id" field in the User model
    },
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true, // Sequelize will automatically handle createdAt and updatedAt fields
});

// Association: One User has many Expenses
User.hasMany(Expense, { foreignKey: "userId" });
Expense.belongsTo(User, { foreignKey: "userId" });

module.exports = Expense;
