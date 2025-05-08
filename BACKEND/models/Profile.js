const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./User");

const Profile = sequelize.define("Profile", {
  full_name: {
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
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,  // Non-nullable as it's a critical field
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,  // Non-nullable as it's a critical field
  },
  phone_no: {
    type: DataTypes.STRING,
    allowNull: true,  // Nullable as it's optional
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,  // Nullable as it's optional
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,  // Nullable as it's optional
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,  // Nullable as it's optional
  },
  full_address: {
    type: DataTypes.STRING,
    allowNull: true,  // Nullable as it's optional
  },
}, {
  timestamps: true,
  tableName: "Profiles",
});

// ✅ Associations
User.hasOne(Profile, { foreignKey: "userId" });
Profile.belongsTo(User, { foreignKey: "userId" });

module.exports = Profile;
