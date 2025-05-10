const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const Goal = require("./Goal");
const User = require("./User"); // Import User model

const SavingsProgress = sequelize.define("SavingsProgress", {
  goalId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "Goals",
      key: "id",
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  month: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalIncome: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  totalExpense: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  savings: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  timestamps: true,
  tableName: "SavingsProgress",
  indexes: [
    {
      unique: true,
      fields: ["userId", "month"]
    }
  ]
});

// Relationships
Goal.hasMany(SavingsProgress, { foreignKey: "goalId" });
SavingsProgress.belongsTo(Goal, { foreignKey: "goalId" });
User.hasMany(SavingsProgress, { foreignKey: "userId" }); // Add this relationship
SavingsProgress.belongsTo(User, { foreignKey: "userId" }); // Add this relationship

module.exports = SavingsProgress;
