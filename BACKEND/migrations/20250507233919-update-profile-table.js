module.exports = {
  async up(queryInterface, Sequelize) {
    // Modify columns in the existing Profiles table
    await queryInterface.renameColumn('Profiles', 'name', 'full_name');
    await queryInterface.addColumn('Profiles', 'firstname', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('Profiles', 'lastname', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('Profiles', 'phone_no', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('Profiles', 'country', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Profiles', 'state', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Profiles', 'city', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Profiles', 'full_address', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert changes
    await queryInterface.removeColumn('Profiles', 'firstname');
    await queryInterface.removeColumn('Profiles', 'lastname');
    await queryInterface.removeColumn('Profiles', 'phone_no');
    await queryInterface.removeColumn('Profiles', 'country');
    await queryInterface.removeColumn('Profiles', 'state');
    await queryInterface.removeColumn('Profiles', 'city');
    await queryInterface.removeColumn('Profiles', 'full_address');
    await queryInterface.renameColumn('Profiles', 'full_name', 'name');
  }
};
