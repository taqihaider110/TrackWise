const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./User");

const Profile = sequelize.define("Profile", {
  dob: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "User",
      key: "id",
    },
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone_no: {
    type: DataTypes.STRING,
    allowNull: false, // Changed to non-nullable
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  full_address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: "Profiles",
});

// Associations
User.hasOne(Profile, { foreignKey: "userId" });
Profile.belongsTo(User, { foreignKey: "userId" });

module.exports = Profile;
