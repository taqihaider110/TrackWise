const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./User");

const Profile = sequelize.define("Profile", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM("Male", "Female", "Other"),
    allowNull: false,
  },
  dob: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  initialIncome: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  initialExpense: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "User", // ✅ Correct table name
      key: "id",
    },
  },
}, {
  timestamps: true,
  tableName: "Profiles",
});

// ✅ Associations
User.hasOne(Profile, { foreignKey: "userId" });
Profile.belongsTo(User, { foreignKey: "userId" });

module.exports = Profile;
