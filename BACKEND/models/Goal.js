const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./User");

const Goal = sequelize.define("Goal", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  targetAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: true,
  tableName: "Goals",
});

User.hasMany(Goal, { foreignKey: "userId" });
Goal.belongsTo(User, { foreignKey: "userId" });

module.exports = Goal;
