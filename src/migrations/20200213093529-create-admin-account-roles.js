const seed = require("../seeders/20200214021427-adminAccountRoles");

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable(
      "AdminAccountRoles",
      {
        adminAccountId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "AdminAccount",
            key: "id",
          },
        },

        roleId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "Roles",
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
    return queryInterface.dropTable("AdminAccountRoles");
  },
};
