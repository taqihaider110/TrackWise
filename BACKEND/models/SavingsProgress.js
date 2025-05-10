const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const Goal = require("./Goal");

const SavingsProgress = sequelize.define("SavingsProgress", {
  goalId: {
    type: DataTypes.INTEGER,
    allowNull: true, // ✅ Now optional
    references: {
      model: "Goals",
      key: "id",
    },
  },
  userId: {
    type: DataTypes.INTEGER, // Add userId to track savings per user
    allowNull: false,
  },
  month: {
    type: DataTypes.STRING, // e.g., "2025-05"
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
});

// Relationships
Goal.hasMany(SavingsProgress, { foreignKey: "goalId" });
SavingsProgress.belongsTo(Goal, { foreignKey: "goalId" });

module.exports = SavingsProgress;
