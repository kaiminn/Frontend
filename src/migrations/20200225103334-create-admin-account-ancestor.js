const seed = require("../seeders/20200225103544-admin-account-ancestor.js");

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable(
      "AdminAccountsancestors",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        adminAccountId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "AdminAccount",
            key: "id",
          },
        },
        ancestorId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "AdminAccount",
            key: "id",
          },
        },
      },
      {
        charset: "utf8mb4",
      }
    );

    await seed.up(queryInterface);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("AdminAccountsancestors");
  },
};
