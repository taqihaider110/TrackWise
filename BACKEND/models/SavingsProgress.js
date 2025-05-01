const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const Goal = require("./Goal");

const SavingsProgress = sequelize.define("SavingsProgress", {
  goalId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Goals",
      key: "id",
    },
  },
  savedAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
  tableName: "SavingsProgress",
});

Goal.hasMany(SavingsProgress, { foreignKey: "goalId" });
SavingsProgress.belongsTo(Goal, { foreignKey: "goalId" });

module.exports = SavingsProgress;
